#!/usr/bin/env npx ts-node
/**
 * ─── i18n Key Validator ───
 * Ensures every language file has ALL keys from en.ts.
 * Run: npx ts-node scripts/validate-i18n.ts
 *
 * Exit 0 = all good, Exit 1 = missing keys found.
 */

import * as fs from 'fs';
import * as path from 'path';

const STRINGS_DIR = path.resolve(__dirname, '../src/lib/i18n/strings');

function extractKeys(content: string): string[] {
  const keys: string[] = [];
  const regex = /^\s*'([^']+)'\s*:/gm;
  let match;
  while ((match = regex.exec(content)) !== null) {
    keys.push(match[1]);
  }
  return keys;
}

function main() {
  // Read English master keys
  const enContent = fs.readFileSync(path.join(STRINGS_DIR, 'en.ts'), 'utf8');
  const enKeys = extractKeys(enContent);
  const enSet = new Set(enKeys);

  console.log(`\n\ud83d\udccb English master: ${enKeys.length} keys\n`);

  // Find all language files
  const files = fs.readdirSync(STRINGS_DIR).filter(f => f.endsWith('.ts') && f !== 'en.ts');
  let hasErrors = false;

  for (const file of files) {
    const lang = file.replace('.ts', '');
    const content = fs.readFileSync(path.join(STRINGS_DIR, file), 'utf8');
    const langKeys = extractKeys(content);
    const langSet = new Set(langKeys);

    const missing = enKeys.filter(k => !langSet.has(k));
    const extra = langKeys.filter(k => !enSet.has(k));

    if (missing.length === 0 && extra.length === 0) {
      console.log(`\u2705 ${lang}: ${langKeys.length}/${enKeys.length} keys \u2014 complete`);
    } else {
      hasErrors = true;
      console.log(`\u274c ${lang}: ${langKeys.length}/${enKeys.length} keys`);
      if (missing.length > 0) {
        console.log(`   MISSING (${missing.length}):`);
        missing.forEach(k => console.log(`     - ${k}`));
      }
      if (extra.length > 0) {
        console.log(`   EXTRA (${extra.length}):`);
        extra.forEach(k => console.log(`     + ${k}`));
      }
    }
  }

  console.log('');
  if (hasErrors) {
    console.error('\u274c Validation FAILED \u2014 fix missing keys above.');
    process.exit(1);
  } else {
    console.log('\u2705 All language files are complete!');
    process.exit(0);
  }
}

main();
