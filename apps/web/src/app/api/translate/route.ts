import { NextRequest, NextResponse } from 'next/server';
import { exec } from 'child_process';
import { promisify } from 'util';
import path from 'path';
import fs from 'fs';

const execAsync = promisify(exec);
const PROJECT_DIR = '/data/projects/saubh-gig';
const STRINGS_DIR = path.join(PROJECT_DIR, 'src', 'lib', 'i18n', 'strings');
const SCRIPT_PATH = path.join(PROJECT_DIR, 'scripts', 'auto-translate.py');

const ALL_LANGUAGES: Record<string, { name: string; engine: string }> = {
  hi: { name: 'Hindi', engine: 'indictrans2' },
  bn: { name: 'Bengali', engine: 'indictrans2' },
  ta: { name: 'Tamil', engine: 'indictrans2' },
  te: { name: 'Telugu', engine: 'indictrans2' },
  mr: { name: 'Marathi', engine: 'indictrans2' },
  gu: { name: 'Gujarati', engine: 'indictrans2' },
  kn: { name: 'Kannada', engine: 'indictrans2' },
  ml: { name: 'Malayalam', engine: 'indictrans2' },
  pa: { name: 'Punjabi', engine: 'indictrans2' },
  or: { name: 'Odia', engine: 'indictrans2' },
  as: { name: 'Assamese', engine: 'indictrans2' },
  ur: { name: 'Urdu', engine: 'indictrans2' },
  ne: { name: 'Nepali', engine: 'indictrans2' },
  sa: { name: 'Sanskrit', engine: 'indictrans2' },
  mai: { name: 'Maithili', engine: 'indictrans2' },
  kok: { name: 'Konkani', engine: 'indictrans2' },
  doi: { name: 'Dogri', engine: 'indictrans2' },
  sd: { name: 'Sindhi', engine: 'indictrans2' },
  ks: { name: 'Kashmiri', engine: 'indictrans2' },
  brx: { name: 'Bodo', engine: 'indictrans2' },
  sat: { name: 'Santali', engine: 'indictrans2' },
  mni: { name: 'Manipuri', engine: 'indictrans2' },
  ar: { name: 'Arabic', engine: 'nllb' },
  zh: { name: 'Chinese', engine: 'nllb' },
  fr: { name: 'French', engine: 'nllb' },
  de: { name: 'German', engine: 'nllb' },
  ja: { name: 'Japanese', engine: 'nllb' },
  ko: { name: 'Korean', engine: 'nllb' },
  pt: { name: 'Portuguese', engine: 'nllb' },
  ru: { name: 'Russian', engine: 'nllb' },
  es: { name: 'Spanish', engine: 'nllb' },
  th: { name: 'Thai', engine: 'nllb' },
  vi: { name: 'Vietnamese', engine: 'nllb' },
  id: { name: 'Indonesian', engine: 'nllb' },
  ms: { name: 'Malay', engine: 'nllb' },
  tr: { name: 'Turkish', engine: 'nllb' },
};

function countKeys(filePath: string): number {
  try {
    const content = fs.readFileSync(filePath, 'utf-8');
    const matches = content.match(/['"][a-zA-Z0-9_.]+['"]\s*:/g);
    return matches ? matches.length : 0;
  } catch {
    return 0;
  }
}

function getActiveLoaders(): Set<string> {
  try {
    const providerPath = path.join(PROJECT_DIR, 'src', 'lib', 'i18n', 'TranslationProvider.tsx');
    const content = fs.readFileSync(providerPath, 'utf-8');
    const active = new Set<string>();
    const pattern = /^\s+(\w+):\s*\(\)\s*=>\s*import\('\.\//gm;
    let match;
    while ((match = pattern.exec(content)) !== null) {
      active.add(match[1]);
    }
    return active;
  } catch {
    return new Set();
  }
}

// GET: Return translation status
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const action = searchParams.get('action');

  if (action === 'status') {
    const enPath = path.join(STRINGS_DIR, 'en.ts');
    const totalKeys = countKeys(enPath);
    const activeLoaders = getActiveLoaders();

    const languages = Object.entries(ALL_LANGUAGES).map(([code, info]) => {
      const filePath = path.join(STRINGS_DIR, `${code}.ts`);
      const exists = fs.existsSync(filePath);
      const keys = exists ? countKeys(filePath) : 0;
      const isActive = activeLoaders.has(code);

      return {
        code,
        name: info.name,
        native: '',
        engine: info.engine,
        status: isActive && keys >= totalKeys ? 'live' : 'pending',
        keys,
        total: totalKeys,
      };
    });

    return NextResponse.json({ languages, totalKeys });
  }

  return NextResponse.json({ error: 'Unknown action' }, { status: 400 });
}

// POST: Trigger translation
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { langs } = body;

    if (!langs || !Array.isArray(langs) || langs.length === 0) {
      return NextResponse.json({ error: 'No languages specified' }, { status: 400 });
    }

    const validLangs = langs.filter((l: string) => l in ALL_LANGUAGES);
    if (validLangs.length === 0) {
      return NextResponse.json({ error: 'No valid language codes' }, { status: 400 });
    }

    // Limit to 10 per request to avoid timeout
    const batch = validLangs.slice(0, 10);
    const langStr = batch.join(',');

    const log: string[] = [];
    log.push(`Translating ${batch.length} languages: ${langStr}`);

    try {
      const { stdout, stderr } = await execAsync(
        `python3 ${SCRIPT_PATH} --lang ${langStr} --log 2>&1`,
        {
          cwd: PROJECT_DIR,
          timeout: 1800000, // 30 minutes
          env: {
            ...process.env,
            PATH: '/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin:/home/admin1/.local/bin:/home/admin1/.npm-global/bin',
            HOME: '/home/admin1',
          },
        }
      );

      const output = stdout + (stderr || '');
      const lines = output.split('\n').filter((l: string) => l.trim());
      log.push(...lines.slice(-20));

      const translated: string[] = [];
      const failed: string[] = [];

      for (const code of batch) {
        const filePath = path.join(STRINGS_DIR, `${code}.ts`);
        if (fs.existsSync(filePath) && countKeys(filePath) > 200) {
          translated.push(code);
        } else {
          failed.push(code);
        }
      }

      log.push(`Result: ${translated.length} translated, ${failed.length} failed`);

      return NextResponse.json({
        success: true,
        translated,
        failed,
        log,
        remaining: validLangs.length > 10 ? validLangs.slice(10) : [],
      });

    } catch (execError: unknown) {
      const errorMsg = execError instanceof Error ? execError.message : String(execError);
      log.push(`Script error: ${errorMsg}`);
      return NextResponse.json({
        success: false,
        error: errorMsg,
        log,
        translated: [],
        failed: batch,
      });
    }

  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ error: errorMsg }, { status: 500 });
  }
}
