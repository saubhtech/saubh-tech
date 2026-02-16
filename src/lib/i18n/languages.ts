// ─── 37 Language Definitions ───
// Each language has: code, native name, English name, script direction,
// engine (indictrans2 or nllb), and geo-mapping info.

export interface LangDef {
  code: string;
  name: string;         // native name
  english: string;      // English name
  dir: 'ltr' | 'rtl';
  engine: 'indictrans2' | 'nllb' | 'direct';
  /** ISO 3166 country codes that map to this language */
  geoCountries: string[];
  /** Indian state codes (for sub-country mapping) */
  geoStates?: string[];
  /** Browser Accept-Language prefixes that map to this language */
  browserCodes: string[];
}

export const LANGUAGES: LangDef[] = [
  // ─── Direct ───
  { code: 'en', name: 'English', english: 'English', dir: 'ltr', engine: 'direct', geoCountries: ['US', 'GB', 'AU', 'CA', 'NZ', 'IE', 'ZA', 'SG'], browserCodes: ['en'] },

  // ─── 22 Indian Languages (IndicTrans2) ───
  { code: 'hi', name: 'हिन्दी', english: 'Hindi', dir: 'ltr', engine: 'indictrans2', geoCountries: ['IN'], geoStates: ['UP', 'MP', 'RJ', 'BR', 'JH', 'CG', 'HR', 'DL', 'UK'], browserCodes: ['hi'] },
  { code: 'bn', name: 'বাংলা', english: 'Bengali', dir: 'ltr', engine: 'indictrans2', geoCountries: ['BD'], geoStates: ['WB', 'TR'], browserCodes: ['bn'] },
  { code: 'ta', name: 'தமிழ்', english: 'Tamil', dir: 'ltr', engine: 'indictrans2', geoCountries: ['LK'], geoStates: ['TN', 'PY'], browserCodes: ['ta'] },
  { code: 'te', name: 'తెలుగు', english: 'Telugu', dir: 'ltr', engine: 'indictrans2', geoCountries: [], geoStates: ['TG', 'AP'], browserCodes: ['te'] },
  { code: 'mr', name: 'मराठी', english: 'Marathi', dir: 'ltr', engine: 'indictrans2', geoCountries: [], geoStates: ['MH', 'GA'], browserCodes: ['mr'] },
  { code: 'gu', name: 'ગુજરાતી', english: 'Gujarati', dir: 'ltr', engine: 'indictrans2', geoCountries: [], geoStates: ['GJ', 'DD', 'DN'], browserCodes: ['gu'] },
  { code: 'kn', name: 'ಕನ್ನಡ', english: 'Kannada', dir: 'ltr', engine: 'indictrans2', geoCountries: [], geoStates: ['KA'], browserCodes: ['kn'] },
  { code: 'ml', name: 'മലയാളം', english: 'Malayalam', dir: 'ltr', engine: 'indictrans2', geoCountries: [], geoStates: ['KL', 'LD'], browserCodes: ['ml'] },
  { code: 'pa', name: 'ਪੰਜਾਬੀ', english: 'Punjabi', dir: 'ltr', engine: 'indictrans2', geoCountries: ['PK'], geoStates: ['PB', 'CH'], browserCodes: ['pa'] },
  { code: 'or', name: 'ଓଡ଼ିଆ', english: 'Odia', dir: 'ltr', engine: 'indictrans2', geoCountries: [], geoStates: ['OD'], browserCodes: ['or'] },
  { code: 'as', name: 'অসমীয়া', english: 'Assamese', dir: 'ltr', engine: 'indictrans2', geoCountries: [], geoStates: ['AS'], browserCodes: ['as'] },
  { code: 'ur', name: 'اردو', english: 'Urdu', dir: 'rtl', engine: 'indictrans2', geoCountries: ['PK'], geoStates: [], browserCodes: ['ur'] },
  { code: 'ne', name: 'नेपाली', english: 'Nepali', dir: 'ltr', engine: 'indictrans2', geoCountries: ['NP'], geoStates: ['SK'], browserCodes: ['ne'] },
  { code: 'sa', name: 'संस्कृतम्', english: 'Sanskrit', dir: 'ltr', engine: 'indictrans2', geoCountries: [], geoStates: [], browserCodes: ['sa'] },
  { code: 'mai', name: 'मैथिली', english: 'Maithili', dir: 'ltr', engine: 'indictrans2', geoCountries: [], geoStates: ['BR'], browserCodes: ['mai'] },
  { code: 'kok', name: 'कोंकणी', english: 'Konkani', dir: 'ltr', engine: 'indictrans2', geoCountries: [], geoStates: ['GA'], browserCodes: ['kok'] },
  { code: 'doi', name: 'डोगरी', english: 'Dogri', dir: 'ltr', engine: 'indictrans2', geoCountries: [], geoStates: ['JK'], browserCodes: ['doi'] },
  { code: 'sd', name: 'سنڌي', english: 'Sindhi', dir: 'rtl', engine: 'indictrans2', geoCountries: [], geoStates: [], browserCodes: ['sd'] },
  { code: 'ks', name: 'कॉशुर', english: 'Kashmiri', dir: 'rtl', engine: 'indictrans2', geoCountries: [], geoStates: ['JK'], browserCodes: ['ks'] },
  { code: 'brx', name: 'बड़ो', english: 'Bodo', dir: 'ltr', engine: 'indictrans2', geoCountries: [], geoStates: ['AS'], browserCodes: ['brx'] },
  { code: 'sat', name: 'ᱥᱟᱱᱛᱟᱲᱤ', english: 'Santali', dir: 'ltr', engine: 'indictrans2', geoCountries: [], geoStates: ['JH', 'OD'], browserCodes: ['sat'] },
  { code: 'mni', name: 'মৈতৈলোন্', english: 'Manipuri', dir: 'ltr', engine: 'indictrans2', geoCountries: [], geoStates: ['MN'], browserCodes: ['mni'] },

  // ─── 14 International Languages (NLLB) ───
  { code: 'ar', name: 'العربية', english: 'Arabic', dir: 'rtl', engine: 'nllb', geoCountries: ['SA', 'AE', 'EG', 'IQ', 'JO', 'KW', 'LB', 'OM', 'QA', 'BH', 'YE', 'SY', 'LY', 'MA', 'TN', 'DZ'], browserCodes: ['ar'] },
  { code: 'zh', name: '中文', english: 'Chinese', dir: 'ltr', engine: 'nllb', geoCountries: ['CN', 'TW', 'HK', 'MO'], browserCodes: ['zh'] },
  { code: 'fr', name: 'Français', english: 'French', dir: 'ltr', engine: 'nllb', geoCountries: ['FR', 'BE', 'CH', 'MC', 'LU', 'SN', 'CI', 'ML', 'CM'], browserCodes: ['fr'] },
  { code: 'de', name: 'Deutsch', english: 'German', dir: 'ltr', engine: 'nllb', geoCountries: ['DE', 'AT', 'CH', 'LI'], browserCodes: ['de'] },
  { code: 'ja', name: '日本語', english: 'Japanese', dir: 'ltr', engine: 'nllb', geoCountries: ['JP'], browserCodes: ['ja'] },
  { code: 'ko', name: '한국어', english: 'Korean', dir: 'ltr', engine: 'nllb', geoCountries: ['KR', 'KP'], browserCodes: ['ko'] },
  { code: 'pt', name: 'Português', english: 'Portuguese', dir: 'ltr', engine: 'nllb', geoCountries: ['BR', 'PT', 'AO', 'MZ'], browserCodes: ['pt'] },
  { code: 'ru', name: 'Русский', english: 'Russian', dir: 'ltr', engine: 'nllb', geoCountries: ['RU', 'BY', 'KZ', 'KG'], browserCodes: ['ru'] },
  { code: 'es', name: 'Español', english: 'Spanish', dir: 'ltr', engine: 'nllb', geoCountries: ['ES', 'MX', 'AR', 'CO', 'PE', 'CL', 'VE', 'EC', 'GT', 'CU', 'DO', 'HN', 'PA', 'CR', 'UY', 'PY', 'SV', 'NI', 'BO'], browserCodes: ['es'] },
  { code: 'th', name: 'ไทย', english: 'Thai', dir: 'ltr', engine: 'nllb', geoCountries: ['TH'], browserCodes: ['th'] },
  { code: 'vi', name: 'Tiếng Việt', english: 'Vietnamese', dir: 'ltr', engine: 'nllb', geoCountries: ['VN'], browserCodes: ['vi'] },
  { code: 'id', name: 'Bahasa Indonesia', english: 'Indonesian', dir: 'ltr', engine: 'nllb', geoCountries: ['ID'], browserCodes: ['id'] },
  { code: 'ms', name: 'Bahasa Melayu', english: 'Malay', dir: 'ltr', engine: 'nllb', geoCountries: ['MY', 'BN'], browserCodes: ['ms'] },
  { code: 'tr', name: 'Türkçe', english: 'Turkish', dir: 'ltr', engine: 'nllb', geoCountries: ['TR', 'CY'], browserCodes: ['tr'] },
];

/** Lookup map: code → LangDef */
export const LANG_MAP = new Map(LANGUAGES.map((l) => [l.code, l]));

/** Get language definition by code */
export function getLang(code: string): LangDef | undefined {
  return LANG_MAP.get(code);
}

/** Default language */
export const DEFAULT_LANG = 'en';

/** All supported language codes */
export const SUPPORTED_CODES = LANGUAGES.map((l) => l.code);

/**
 * Detect language from browser Accept-Language header.
 * Returns the best matching language code, or 'en' as default.
 */
export function detectFromAcceptLanguage(header: string | null): string {
  if (!header) return DEFAULT_LANG;

  // Parse Accept-Language: "en-US,en;q=0.9,hi;q=0.8"
  const parts = header.split(',').map((p) => {
    const [tag, qStr] = p.trim().split(';q=');
    return { tag: tag.trim().toLowerCase(), q: qStr ? parseFloat(qStr) : 1.0 };
  });

  // Sort by quality descending
  parts.sort((a, b) => b.q - a.q);

  for (const { tag } of parts) {
    // Direct match: "hi" → "hi"
    const direct = LANGUAGES.find((l) => l.browserCodes.some((bc) => tag === bc || tag.startsWith(bc + '-')));
    if (direct) return direct.code;
  }

  return DEFAULT_LANG;
}
