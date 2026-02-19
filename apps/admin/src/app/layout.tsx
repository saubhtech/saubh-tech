import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Saubh Admin',
  description: 'Saubh.Tech Admin Portal',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return children;
}
