# SAUBH.TECH — I18N TRANSLATION POLICY
# NON-NEGOTIABLE — VIOLATE NONE
# Last updated: Feb 25, 2026

## RULE: EVERY PAGE MUST BE TRANSLATED IN ALL 37 LANGUAGES

### What This Means
1. Every user-facing string must use t('key') — hardcoded English is FORBIDDEN
2. Every key in en.ts must be translated into all 36 other language files
3. No page ships without translations
4. Auto-translation engine handles everything automatically

### Architecture
```
en.ts (source of truth)
  -> i18n-page-watcher detects new/changed keys (polls every 30s)
  -> auto-translate.mjs translates via :5050 (IndicTrans2 + NLLB)
  -> Updates all 36 language files
  -> Records status in translation-status.json
  -> audit-translations.mjs verifies completeness
  -> Git pre-commit hook blocks incomplete translations
```

### Key Files
| File | Purpose |
|------|---------|
| /data/scripts/i18n/auto-translate.mjs | Main translation engine |
| /data/scripts/i18n/i18n-page-watcher.mjs | Watches for new keys (systemd daemon) |
| /data/scripts/i18n/audit-translations.mjs | Audit script |
| /data/scripts/i18n/translation-status.json | Status tracker |
| /data/scripts/i18n/run-translation.sh | One-shot translation run |
| .git/hooks/pre-commit | Git hook enforcement |

### Translation Status States
| State | Meaning |
|-------|---------|
| translated | Translated by engine |
| manual | Manually translated (won't be overwritten) |
| pending | Queued for translation |
| verified | Translated and QA-verified |

### Commands
```bash
/data/scripts/i18n/run-translation.sh          # Translate all missing
node /data/scripts/i18n/audit-translations.mjs  # Full audit
node /data/scripts/i18n/auto-translate.mjs --lang hi --force  # Force re-translate Hindi
sudo systemctl status i18n-auto-translate       # Watcher status
tail -f /data/logs/i18n/watcher.log             # Watcher logs
```

### Developer Checklist — Adding a New Page
1. Create page under apps/web/src/app/[locale]/
2. Use TranslationProvider + useTranslation() hook
3. All strings as t('key') calls
4. Add English keys to en.ts
5. Run /data/scripts/i18n/run-translation.sh
6. Commit — pre-commit hook verifies

### FORBIDDEN
- Hardcoded English: <h1>Welcome</h1> — VIOLATION
- Adding keys without running translation — VIOLATION
- Bypassing pre-commit without approval — VIOLATION

### CORRECT
- <h1>{t('mypage.title')}</h1> — CORRECT
- All 37 files have the key with native translations
