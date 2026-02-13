import type { Metadata } from 'next';
import './home-v2.css';

export const metadata: Metadata = {
  title: 'Saubh.Tech — Phygital Gig Marketplace',
  description: 'Connect with verified individuals and businesses worldwide for secure gig work payments.',
};

export default function HomeV2Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
