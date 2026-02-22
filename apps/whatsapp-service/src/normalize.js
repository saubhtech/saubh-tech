export function normalizeWhatsApp(raw) {
  if (!raw) return '';
  // Remove @s.whatsapp.net suffix if present
  let n = raw.split('@')[0];
  // Remove spaces, dashes, brackets
  n = n.replace(/[\s\-\(\)]/g, '');
  // Remove leading +
  if (n.startsWith('+')) n = n.slice(1);
  // If 10 digits: add 91 country code
  if (n.length === 10) n = '91' + n;
  return n;
}

export function getStaticPasscode(number) {
  // Last 4 digits of normalized number
  return number.slice(-4);
}

export function generateOTP() {
  return Math.floor(1000 + Math.random() * 9000).toString();
}
