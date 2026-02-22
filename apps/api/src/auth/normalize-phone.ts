/**
 * Normalize a WhatsApp number to digits-only with country code (no +).
 * Handles: JID suffixes, LID format, plus signs, spaces, dashes.
 * Examples:
 *   +919770370187                    → 919770370187
 *   919212401007:54@s.whatsapp.net   → 919212401007
 *   9770370187                       → 919770370187
 *   +91 9770370187                   → 919770370187
 */
export function normalizeWhatsApp(raw: string): string {
  let n = (raw || '')
    .replace(/@[sc]\.whatsapp\.net$/i, '') // strip JID suffix
    .replace(/:\d+$/, '');                 // strip LID suffix (:54)
  n = n.replace(/[^\d]/g, '');             // keep only digits
  if (n.length === 10) n = '91' + n;       // assume India if 10 digits
  return n;
}
