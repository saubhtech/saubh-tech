#!/bin/bash
# ─── install-auto-translate.sh ───
# Sets up the auto-translation system on the Saubh.Tech server
# Run as root or with sudo

set -euo pipefail

PROJECT_DIR="/data/projects/saubh-gig"
SCRIPT_DIR="$PROJECT_DIR/scripts"

echo "══════════════════════════════════════════="
echo "  Saubh.Tech Auto-Translation Installer"
echo "══════════════════════════════════════════="

# 1. Install Python dependencies
echo ""
echo "▶ Installing Python dependencies..."
pip3 install deep-translator --break-system-packages -q 2>/dev/null || \
  python3 -m pip install deep-translator --break-system-packages -q
echo "  ✅ deep-translator installed"

# 2. Make script executable
echo ""
echo "▶ Setting up auto-translate.py..."
chmod +x "$SCRIPT_DIR/auto-translate.py"
echo "  ✅ Script ready at $SCRIPT_DIR/auto-translate.py"

# 3. Create log directory
echo ""
echo "▶ Setting up logging..."
mkdir -p /var/log
touch /var/log/saubh-i18n.log
chown admin1:admin1 /var/log/saubh-i18n.log 2>/dev/null || true
echo "  ✅ Log file: /var/log/saubh-i18n.log"

# 4. Install systemd service + timer
echo ""
echo "▶ Installing systemd service & timer..."
cat > /etc/systemd/system/saubh-i18n.service << 'SVCEOF'
[Unit]
Description=Saubh.Tech Auto Translation Engine
After=network.target docker.service
Wants=docker.service

[Service]
Type=oneshot
User=admin1
WorkingDirectory=/data/projects/saubh-gig
ExecStart=/usr/bin/python3 /data/projects/saubh-gig/scripts/auto-translate.py --log
TimeoutStartSec=1800
Environment=PATH=/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin:/home/admin1/.local/bin:/home/admin1/.npm-global/bin
Environment=HOME=/home/admin1

[Install]
WantedBy=multi-user.target
SVCEOF

cat > /etc/systemd/system/saubh-i18n.timer << 'TMREOF'
[Unit]
Description=Run Saubh.Tech Auto Translation every 6 hours

[Timer]
OnBootSec=10min
OnUnitActiveSec=6h
Persistent=true
RandomizedDelaySec=300

[Install]
WantedBy=timers.target
TMREOF

systemctl daemon-reload
systemctl enable saubh-i18n.timer
systemctl start saubh-i18n.timer
echo "  ✅ Timer active (every 6 hours)"

# 5. Create convenience alias
echo ""
echo "▶ Creating CLI shortcuts..."
cat > /usr/local/bin/saubh-translate << 'BINEOF'
#!/bin/bash
# Saubh.Tech Translation CLI
# Usage:
#   saubh-translate                  # Translate all pending
#   saubh-translate --status         # Show coverage
#   saubh-translate --lang hi,bn     # Specific languages
#   saubh-translate --fill-missing   # Fill gaps in existing files
#   saubh-translate --dry-run        # Preview mode
cd /data/projects/saubh-gig
python3 scripts/auto-translate.py "$@"
BINEOF
chmod +x /usr/local/bin/saubh-translate
echo "  ✅ CLI: saubh-translate"

# 6. Summary
echo ""
echo "══════════════════════════════════════════="
echo "  ✅ Installation Complete!"
echo "══════════════════════════════════════════="
echo ""
echo "  Commands:"
echo "    saubh-translate              # Run now (all pending)"
echo "    saubh-translate --status     # Coverage report"
echo "    saubh-translate --lang fr,de # Specific languages"
echo "    saubh-translate --dry-run    # Preview only"
echo "    saubh-translate --fill-missing  # Fix incomplete files"
echo ""
echo "  Automated:"
echo "    Timer:  every 6 hours (systemd)"
echo "    Log:    /var/log/saubh-i18n.log"
echo "    Status: systemctl status saubh-i18n.timer"
echo ""
echo "  Monitor:"
echo "    tail -f /var/log/saubh-i18n.log"
echo "    systemctl list-timers saubh-i18n.timer"
echo ""
