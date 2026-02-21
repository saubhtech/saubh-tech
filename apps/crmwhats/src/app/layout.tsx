import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
});

export const metadata: Metadata = {
  title: 'Saubh CRM',
  description: 'WhatsApp CRM for Business Owners & Agents',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={inter.variable}>
      <body style={{ background: '#0A0A0F', minHeight: '100vh' }}>
        {children}
      </body>
    </html>
  );
}
