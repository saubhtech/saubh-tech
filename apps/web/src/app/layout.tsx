import type { Metadata } from 'next';
import { cookies } from 'next/headers';
import './globals.css';
import './mobile-lang.css';

export const metadata: Metadata = {
  title: 'Saubh.Tech — Phygital Gig Marketplace | UGC & Branding Platform',
  description:
    'Connect with verified individuals and businesses worldwide for secure gig work, UGC content creation, and digital branding. Escrow-protected payments.',
  keywords:
    'gig work, phygital marketplace, UGC, user generated content, branding, escrow payments, freelance India',
  authors: [{ name: 'Saubh.Tech' }],
  openGraph: {
    title: 'Saubh.Tech — Phygital Gig Marketplace',
    description:
      'Connect with verified individuals and businesses worldwide for secure gig work payments.',
    url: 'https://saubh.tech',
    siteName: 'Saubh.Tech',
    type: 'website',
  },
};

// RTL languages
const RTL_LANGS = new Set(['ar', 'ur', 'sd', 'ks']);

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  // Read language from cookie (set by middleware)
  const cookieStore = await cookies();
  const lang = cookieStore.get('saubh-lang')?.value || 'en';
  const dir = RTL_LANGS.has(lang) ? 'rtl' : 'ltr';

  return (
    <html lang={lang} dir={dir}>
      <head>
        {/* Google Fonts */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=Space+Grotesk:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
        {/* Font Awesome */}
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css"
          integrity="sha512-DTOQO9RWCH3ppGqcWaEA1BIZOC6xxalwEsw9c2QQeAIftl+Vegovlnee1c9QX4TctnWMn13TZye+giMm8e2LwA=="
          crossOrigin="anonymous"
          referrerPolicy="no-referrer"
        />
        <link rel="icon" href="/favicon.ico" />
      </head>
      <body>{children}</body>
    </html>
  );
}
