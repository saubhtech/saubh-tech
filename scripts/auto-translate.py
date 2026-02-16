#!/usr/bin/env python3
"""
auto-translate.py — Automated i18n Translation Engine for Saubh.Tech

Detects missing translation files and keys, translates via saubh-lang
(IndicTrans2/NLLB) with Google Translate fallback, generates TypeScript
files, updates LANG_LOADERS, builds, and deploys.

Usage:
  python3 auto-translate.py                    # Translate all pending languages
  python3 auto-translate.py --lang hi,bn       # Specific languages only
  python3 auto-translate.py --dry-run          # Preview without writing files
  python3 auto-translate.py --fill-missing     # Only fill missing keys in existing files
  python3 auto-translate.py --status           # Show translation coverage

Cron (every 6 hours):
  0 */6 * * * cd /data/projects/saubh-gig && python3 scripts/auto-translate.py --log >> /var/log/saubh-i18n.log 2>&1
"""

import os
import re
import sys
import json
import time
import logging
import argparse
import subprocess
from pathlib import Path
from datetime import datetime
from typing import Dict, List, Optional, Tuple, Set

# ─── Configuration ───────────────────────────────────────────────────────────

PROJECT_DIR = Path("/data/projects/saubh-gig")
STRINGS_DIR = PROJECT_DIR / "src" / "lib" / "i18n" / "strings"
PROVIDER_FILE = PROJECT_DIR / "src" / "lib" / "i18n" / "TranslationProvider.tsx"
EN_FILE = STRINGS_DIR / "en.ts"
LOCK_FILE = PROJECT_DIR / ".auto-translate.lock"
LOG_FILE = Path("/var/log/saubh-i18n.log")

# saubh-lang API (primary)
SAUBH_LANG_URL = "http://localhost:3100"
SAUBH_LANG_API_KEY = os.environ.get("SAUBH_LANG_KEY", "sk_lang_dev_key")

# Translation batch size (keys per API call)
BATCH_SIZE = 20

# All 37 languages with their codes
ALL_LANGUAGES = {
    # Indian languages (IndicTrans2)
    "hi": "Hindi", "bn": "Bengali", "ta": "Tamil", "te": "Telugu",
    "mr": "Marathi", "gu": "Gujarati", "kn": "Kannada", "ml": "Malayalam",
    "pa": "Punjabi", "or": "Odia", "as": "Assamese", "ur": "Urdu",
    "ne": "Nepali", "sa": "Sanskrit", "mai": "Maithili", "kok": "Konkani",
    "doi": "Dogri", "sd": "Sindhi", "ks": "Kashmiri", "brx": "Bodo",
    "sat": "Santali", "mni": "Manipuri",
    # International languages (NLLB)
    "ar": "Arabic", "zh": "Chinese", "fr": "French", "de": "German",
    "ja": "Japanese", "ko": "Korean", "pt": "Portuguese", "ru": "Russian",
    "es": "Spanish", "th": "Thai", "vi": "Vietnamese", "id": "Indonesian",
    "ms": "Malay", "tr": "Turkish",
}

# RTL languages
RTL_LANGS = {"ur", "ar", "sd", "ks"}

# ─── Logging ─────────────────────────────────────────────────────────────────

logger = logging.getLogger("auto-translate")


def setup_logging(log_to_file: bool = False):
    fmt = "%(asctime)s [%(levelname)s] %(message)s"
    handlers = [logging.StreamHandler()]
    if log_to_file:
        LOG_FILE.parent.mkdir(parents=True, exist_ok=True)
        handlers.append(logging.FileHandler(str(LOG_FILE), encoding="utf-8"))
    logging.basicConfig(level=logging.INFO, format=fmt, handlers=handlers)


# ─── Lock file (prevent concurrent runs) ────────────────────────────────────

def acquire_lock() -> bool:
    if LOCK_FILE.exists():
        age = time.time() - LOCK_FILE.stat().st_mtime
        if age > 7200:
            logger.warning(f"Stale lock found ({age:.0f}s old), removing")
            LOCK_FILE.unlink()
        else:
            logger.error(f"Another instance is running (lock age: {age:.0f}s)")
            return False
    LOCK_FILE.write_text(str(os.getpid()))
    return True


def release_lock():
    if LOCK_FILE.exists():
        LOCK_FILE.unlink()


# ─── Parse en.ts to extract all keys and values ─────────────────────────────

def parse_en_ts() -> Dict[str, str]:
    """Parse en.ts and extract all translation keys and their English values."""
    content = EN_FILE.read_text(encoding="utf-8")

    keys = {}
    pattern = re.compile(
        r"""['"]([a-zA-Z0-9_.]+)['"]\s*:\s*(['"])((?:(?!\2|(?<!\\)\n).|\\.)*)\2""",
        re.DOTALL
    )
    for m in pattern.finditer(content):
        key = m.group(1)
        value = m.group(3)
        value = value.replace("\\'", "'").replace('\\"', '"')
        keys[key] = value

    logger.info(f"Parsed en.ts: {len(keys)} keys found")
    return keys


# ─── Parse existing translation file ────────────────────────────────────────

def parse_lang_ts(lang_code: str) -> Dict[str, str]:
    """Parse an existing language .ts file and extract its keys."""
    filepath = STRINGS_DIR / f"{lang_code}.ts"
    if not filepath.exists():
        return {}

    content = filepath.read_text(encoding="utf-8")
    keys = {}
    pattern = re.compile(
        r"""['"]([a-zA-Z0-9_.]+)['"]\s*:\s*(['"])((?:(?!\2|(?<!\\)\n).|\\.)*)\2""",
        re.DOTALL
    )
    for m in pattern.finditer(content):
        key = m.group(1)
        value = m.group(3)
        value = value.replace("\\'", "'").replace('\\"', '"')
        keys[key] = value

    return keys


# ─── Translation Backends ───────────────────────────────────────────────────

def translate_via_saubh_lang(texts: List[str], target: str) -> Optional[List[str]]:
    """Try translating via saubh-lang microservice."""
    try:
        import urllib.request
        import urllib.error

        url = f"{SAUBH_LANG_URL}/api/lang/batch"
        payload = json.dumps({
            "texts": texts,
            "source": "en",
            "target": target
        }).encode("utf-8")

        req = urllib.request.Request(url, data=payload, headers={
            "Content-Type": "application/json",
            "X-API-Key": SAUBH_LANG_API_KEY
        })

        with urllib.request.urlopen(req, timeout=30) as resp:
            data = json.loads(resp.read().decode("utf-8"))
            translations = data.get("translations", [])

            # Check if it's a stub (returns same text = not actually translating)
            if translations and translations[0] == texts[0] and target != "en":
                logger.warning("saubh-lang returned stub (same text), falling back")
                return None

            if len(translations) == len(texts):
                return translations

    except Exception as e:
        logger.debug(f"saubh-lang unavailable: {e}")

    return None


def translate_via_google(texts: List[str], target: str) -> Optional[List[str]]:
    """Translate via deep-translator (Google Translate free)."""
    try:
        from deep_translator import GoogleTranslator
    except ImportError:
        logger.info("Installing deep-translator...")
        subprocess.run(
            [sys.executable, "-m", "pip", "install", "deep-translator",
             "--break-system-packages", "-q"],
            check=True, capture_output=True
        )
        from deep_translator import GoogleTranslator

    # Map special language codes to Google Translate codes
    google_code_map = {
        "mai": "hi",     # Maithili -> Hindi (closest)
        "kok": "hi",     # Konkani -> Hindi (closest)
        "doi": "hi",     # Dogri -> Hindi (closest)
        "brx": "hi",     # Bodo -> Hindi (closest)
        "sat": "hi",     # Santali -> Hindi (closest)
        "mni": "bn",     # Manipuri -> Bengali (closest)
        "sa": "hi",      # Sanskrit -> Hindi (closest)
        "ks": "ur",      # Kashmiri -> Urdu (closest)
        "zh": "zh-CN",   # Chinese simplified
    }
    g_code = google_code_map.get(target, target)

    results = []
    translator = GoogleTranslator(source="en", target=g_code)

    for text in texts:
        try:
            if not text.strip():
                results.append(text)
                continue
            translated = translator.translate(text)
            results.append(translated if translated else text)
            time.sleep(0.3)  # Rate limit
        except Exception as e:
            logger.warning(f"Google translate error for '{text[:30]}...': {e}")
            results.append(text)  # Keep English as fallback

    return results


def translate_batch(texts: List[str], target: str) -> List[str]:
    """Translate a batch of texts, trying saubh-lang first, then Google."""
    result = translate_via_saubh_lang(texts, target)
    if result:
        logger.debug(f"  Translated {len(texts)} texts via saubh-lang")
        return result

    result = translate_via_google(texts, target)
    if result:
        logger.debug(f"  Translated {len(texts)} texts via Google Translate")
        return result

    logger.warning(f"  All backends failed for {target}, keeping English")
    return texts


# ─── Safe TypeScript String Escaping ─────────────────────────────────────────

def escape_ts_string(value: str) -> Tuple[str, str]:
    """
    Escape a translated string for safe TypeScript embedding.
    Returns (escaped_value, quote_char).

    CRITICAL: Avoids the bugs we hit in as.ts/kn.ts:
    - No double-escaped Unicode (\\\\u2019 -> \\u2019)
    - No smart/curly quotes
    - Proper handling of apostrophes
    """
    # Replace smart quotes with straight quotes
    value = value.replace('\u2018', "'")   # left single quote
    value = value.replace('\u2019', "'")   # right single quote
    value = value.replace('\u201C', '"')   # left double quote
    value = value.replace('\u201D', '"')   # right double quote

    # Determine quote character
    has_single = "'" in value
    has_double = '"' in value

    if has_single and has_double:
        value = value.replace("'", "\\'")
        return value, "'"
    elif has_single:
        return value, '"'
    else:
        return value, "'"


def build_ts_content(lang_code: str, translations: Dict[str, str], en_keys: Dict[str, str]) -> str:
    """Generate a complete TypeScript translation file."""
    lang_name = ALL_LANGUAGES.get(lang_code, lang_code)

    lines = []
    lines.append(f"// ─── {lang_name} ({lang_code}) Translation Strings ───")
    lines.append(f"// Auto-generated by auto-translate.py on {datetime.now().strftime('%Y-%m-%d %H:%M')}")
    lines.append(f"// Source: en.ts ({len(en_keys)} keys)")
    lines.append("// ⚠️  Do not edit manually — changes will be overwritten on next auto-translate run.")
    lines.append("")
    lines.append("import type { TranslationStrings } from './en';")
    lines.append("")
    lines.append(f"const {lang_code}: TranslationStrings = {{")
    lines.append("")

    current_section = None
    for key in en_keys:
        section = key.split(".")[0]
        if section != current_section:
            if current_section is not None:
                lines.append("")
            lines.append(f"  // ─── {section.capitalize()} ───")
            current_section = section

        value = translations.get(key, en_keys[key])
        escaped_value, quote = escape_ts_string(value)
        lines.append(f"  '{key}': {quote}{escaped_value}{quote},")

    lines.append("};")
    lines.append("")
    lines.append(f"export default {lang_code};")
    lines.append("")

    return "\n".join(lines)


# ─── LANG_LOADERS management ────────────────────────────────────────────────

def get_active_loaders() -> Set[str]:
    """Parse TranslationProvider.tsx and return set of active language codes."""
    content = PROVIDER_FILE.read_text(encoding="utf-8")
    active = set()
    pattern = re.compile(r"^\s+(\w+):\s*\(\)\s*=>\s*import\('./strings/\w+'\)", re.MULTILINE)
    for m in pattern.finditer(content):
        active.add(m.group(1))
    return active


def update_lang_loaders(new_langs: List[str]) -> bool:
    """Uncomment or add LANG_LOADERS entries for new languages."""
    if not new_langs:
        return False

    content = PROVIDER_FILE.read_text(encoding="utf-8")
    modified = False

    for lang in new_langs:
        commented_pattern = re.compile(
            rf"(\s+)//\s*{re.escape(lang)}:\s*\(\)\s*=>\s*import\('./strings/{re.escape(lang)}'\),?"
        )
        match = commented_pattern.search(content)
        if match:
            indent = match.group(1)
            replacement = f"{indent}{lang}: () => import('./strings/{lang}'),"
            content = content[:match.start()] + replacement + content[match.end():]
            logger.info(f"  Uncommented LANG_LOADER for '{lang}'")
            modified = True
        else:
            active_pattern = re.compile(
                rf"^\s+{re.escape(lang)}:\s*\(\)\s*=>\s*import\('./strings/{re.escape(lang)}'\),?",
                re.MULTILINE
            )
            if active_pattern.search(content):
                logger.debug(f"  LANG_LOADER for '{lang}' already active")
                continue

            insert_pattern = re.compile(r"(\s+// ─── Pending Languages.*?\n)")
            insert_match = insert_pattern.search(content)
            if insert_match:
                insert_pos = insert_match.start()
                new_line = f"  {lang}: () => import('./strings/{lang}'),\n"
                content = content[:insert_pos] + new_line + content[insert_pos:]
                logger.info(f"  Added new LANG_LOADER for '{lang}'")
                modified = True
            else:
                logger.warning(f"  Could not find insertion point for '{lang}' loader")

    if modified:
        PROVIDER_FILE.write_text(content, encoding="utf-8")

    return modified


# ─── Build & Deploy ──────────────────────────────────────────────────────────

def run_build() -> bool:
    """Run pnpm build and return True if successful."""
    logger.info("Running pnpm build...")
    result = subprocess.run(
        ["pnpm", "build"],
        cwd=str(PROJECT_DIR),
        capture_output=True,
        text=True,
        timeout=120
    )
    if result.returncode == 0:
        logger.info("Build successful")
        return True
    else:
        logger.error(f"Build failed:\n{result.stderr[-500:]}")
        return False


def git_commit_and_push(langs: List[str]) -> bool:
    """Commit and push changes."""
    try:
        lang_str = ", ".join(langs[:5])
        if len(langs) > 5:
            lang_str += f" +{len(langs)-5} more"

        subprocess.run(["git", "add", "-A"], cwd=str(PROJECT_DIR), check=True, capture_output=True)

        result = subprocess.run(
            ["git", "diff", "--cached", "--quiet"],
            cwd=str(PROJECT_DIR), capture_output=True
        )
        if result.returncode == 0:
            logger.info("No changes to commit")
            return True

        subprocess.run(
            ["git", "commit", "-m", f"feat(i18n): auto-translate {lang_str}"],
            cwd=str(PROJECT_DIR), check=True, capture_output=True
        )
        subprocess.run(
            ["git", "push", "origin", "main"],
            cwd=str(PROJECT_DIR), check=True, capture_output=True,
            timeout=30
        )
        logger.info(f"Pushed to GitHub: {lang_str}")
        return True
    except subprocess.CalledProcessError as e:
        logger.error(f"Git error: {e.stderr.decode() if e.stderr else str(e)}")
        return False
    except subprocess.TimeoutExpired:
        logger.error("Git push timed out")
        return False


def restart_pm2():
    """Restart PM2 process."""
    try:
        subprocess.run(
            ["pm2", "restart", "saubh-gig"],
            cwd=str(PROJECT_DIR), check=True, capture_output=True, timeout=15
        )
        logger.info("PM2 restarted")
    except Exception as e:
        logger.error(f"PM2 restart failed: {e}")


def rollback_changes():
    """Rollback all uncommitted changes on build failure."""
    logger.warning("Rolling back changes...")
    try:
        subprocess.run(
            ["git", "checkout", "--", "."],
            cwd=str(PROJECT_DIR), check=True, capture_output=True
        )
        subprocess.run(
            ["git", "clean", "-fd", "src/lib/i18n/strings/"],
            cwd=str(PROJECT_DIR), check=True, capture_output=True
        )
        logger.info("Rollback complete")
    except Exception as e:
        logger.error(f"Rollback failed: {e}")


# ─── Status Report ───────────────────────────────────────────────────────────

def print_status(en_keys: Dict[str, str]):
    """Print translation coverage report."""
    total = len(en_keys)
    active_loaders = get_active_loaders()

    print(f"\n{'='*60}")
    print(f"  Saubh.Tech i18n Translation Status")
    print(f"  Master keys: {total} | Active loaders: {len(active_loaders)}")
    print(f"{'='*60}")
    print(f"{'Code':<6} {'Language':<15} {'Keys':<8} {'Coverage':<10} {'Loader':<8} {'Status'}")
    print(f"{'-'*60}")

    for code, name in sorted(ALL_LANGUAGES.items(), key=lambda x: x[1]):
        filepath = STRINGS_DIR / f"{code}.ts"
        if filepath.exists():
            lang_keys = parse_lang_ts(code)
            key_count = len(lang_keys)
            coverage = f"{key_count/total*100:.0f}%"
            loader = "Y" if code in active_loaders else "N"
            status = "Live" if code in active_loaders else "File only"
        else:
            key_count = 0
            coverage = "0%"
            loader = "-"
            status = "Pending"

        print(f"{code:<6} {name:<15} {key_count:<8} {coverage:<10} {loader:<8} {status}")

    print(f"{'='*60}")
    print(f"  Pending: {sum(1 for c in ALL_LANGUAGES if not (STRINGS_DIR / f'{c}.ts').exists())} languages")
    print()


# ─── Main Translation Logic ─────────────────────────────────────────────────

def translate_language(
    lang_code: str,
    en_keys: Dict[str, str],
    fill_missing_only: bool = False,
    dry_run: bool = False
) -> Optional[str]:
    """
    Translate all or missing keys for a language.
    Returns the language code if changes were made, None otherwise.
    """
    lang_name = ALL_LANGUAGES.get(lang_code, lang_code)
    filepath = STRINGS_DIR / f"{lang_code}.ts"

    existing = parse_lang_ts(lang_code) if filepath.exists() else {}

    if fill_missing_only and existing:
        missing_keys = [k for k in en_keys if k not in existing]
        if not missing_keys:
            logger.info(f"  [{lang_code}] {lang_name}: All {len(en_keys)} keys present")
            return None
        keys_to_translate = {k: en_keys[k] for k in missing_keys}
        logger.info(f"  [{lang_code}] {lang_name}: {len(missing_keys)} missing keys to translate")
    elif existing and len(existing) == len(en_keys):
        logger.info(f"  [{lang_code}] {lang_name}: Complete ({len(existing)} keys)")
        return None
    else:
        keys_to_translate = {k: en_keys[k] for k in en_keys if k not in existing}
        if not keys_to_translate:
            return None
        logger.info(f"  [{lang_code}] {lang_name}: Translating {len(keys_to_translate)} keys...")

    if dry_run:
        logger.info(f"  [{lang_code}] DRY RUN — would translate {len(keys_to_translate)} keys")
        return None

    # Translate in batches
    keys_list = list(keys_to_translate.keys())
    texts_list = list(keys_to_translate.values())
    translated = {}

    for i in range(0, len(texts_list), BATCH_SIZE):
        batch_keys = keys_list[i:i + BATCH_SIZE]
        batch_texts = texts_list[i:i + BATCH_SIZE]

        batch_num = i // BATCH_SIZE + 1
        total_batches = (len(texts_list) + BATCH_SIZE - 1) // BATCH_SIZE
        logger.info(f"    Batch {batch_num}/{total_batches} ({len(batch_texts)} texts)...")

        batch_results = translate_batch(batch_texts, lang_code)

        for key, translation in zip(batch_keys, batch_results):
            translated[key] = translation

        if i + BATCH_SIZE < len(texts_list):
            time.sleep(1)

    # Merge: existing + newly translated
    all_translations = {**existing, **translated}

    # Generate TypeScript file
    ts_content = build_ts_content(lang_code, all_translations, en_keys)

    # Validate
    if f"const {lang_code}: TranslationStrings" not in ts_content:
        logger.error(f"  [{lang_code}] Generated content validation failed!")
        return None

    # Write file
    filepath.write_text(ts_content, encoding="utf-8")
    logger.info(f"  [{lang_code}] Written {len(all_translations)} keys to {filepath.name}")

    return lang_code


def main():
    parser = argparse.ArgumentParser(description="Saubh.Tech Auto-Translator")
    parser.add_argument("--lang", help="Comma-separated language codes (default: all pending)")
    parser.add_argument("--dry-run", action="store_true", help="Preview without writing")
    parser.add_argument("--fill-missing", action="store_true", help="Only fill missing keys in existing files")
    parser.add_argument("--status", action="store_true", help="Show coverage report")
    parser.add_argument("--log", action="store_true", help="Also log to /var/log/saubh-i18n.log")
    parser.add_argument("--no-build", action="store_true", help="Skip build step")
    parser.add_argument("--no-push", action="store_true", help="Skip git push")
    parser.add_argument("--no-restart", action="store_true", help="Skip PM2 restart")
    parser.add_argument("--batch-size", type=int, default=BATCH_SIZE, help="Texts per translation batch")
    args = parser.parse_args()

    setup_logging(log_to_file=args.log)

    if not EN_FILE.exists():
        logger.error(f"en.ts not found at {EN_FILE}")
        sys.exit(1)

    en_keys = parse_en_ts()
    if not en_keys:
        logger.error("Failed to parse en.ts — no keys found")
        sys.exit(1)

    if args.status:
        print_status(en_keys)
        sys.exit(0)

    if args.lang:
        target_langs = [l.strip() for l in args.lang.split(",")]
        invalid = [l for l in target_langs if l not in ALL_LANGUAGES]
        if invalid:
            logger.error(f"Unknown language codes: {', '.join(invalid)}")
            sys.exit(1)
    elif args.fill_missing:
        target_langs = [
            f.stem for f in STRINGS_DIR.glob("*.ts")
            if f.stem != "en" and f.stem in ALL_LANGUAGES
        ]
    else:
        target_langs = []
        for code in ALL_LANGUAGES:
            filepath = STRINGS_DIR / f"{code}.ts"
            if not filepath.exists():
                target_langs.append(code)
            else:
                existing = parse_lang_ts(code)
                if len(existing) < len(en_keys):
                    target_langs.append(code)

    if not target_langs:
        logger.info("All languages are complete! Nothing to do.")
        sys.exit(0)

    logger.info(f"Target languages ({len(target_langs)}): {', '.join(target_langs)}")

    if args.dry_run:
        logger.info("DRY RUN mode — no files will be written")
        for lang in target_langs:
            translate_language(lang, en_keys, args.fill_missing, dry_run=True)
        sys.exit(0)

    if not acquire_lock():
        sys.exit(1)

    try:
        global BATCH_SIZE
        BATCH_SIZE = args.batch_size

        changed_langs = []
        for lang in target_langs:
            result = translate_language(lang, en_keys, args.fill_missing)
            if result:
                changed_langs.append(result)

        if not changed_langs:
            logger.info("No translations needed")
            return

        active_loaders = get_active_loaders()
        new_loaders = [l for l in changed_langs if l not in active_loaders]
        if new_loaders:
            logger.info(f"Updating LANG_LOADERS: {', '.join(new_loaders)}")
            update_lang_loaders(new_loaders)

        if not args.no_build:
            if not run_build():
                rollback_changes()
                logger.error("Build failed! Changes rolled back.")
                sys.exit(1)

        if not args.no_push:
            git_commit_and_push(changed_langs)

        if not args.no_restart:
            restart_pm2()

        logger.info(f"Done! Translated {len(changed_langs)} languages: {', '.join(changed_langs)}")

    finally:
        release_lock()


if __name__ == "__main__":
    main()
