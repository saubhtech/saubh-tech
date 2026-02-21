'use client';

import { usePathname } from 'next/navigation';
import { UserProvider } from '@/context/UserContext';
import { ChannelProvider } from '@/context/ChannelContext';
import Sidebar from '@/components/Sidebar';

export default function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { locale: string };
}) {
  const pathname = usePathname();

  return (
    <UserProvider>
      <ChannelProvider>
        <div style={{ display: 'flex', minHeight: '100vh', background: '#0A0A0F' }}>
          {/* Desktop sidebar */}
          <Sidebar />

          {/* Main content */}
          <main style={{
            flex: 1,
            minHeight: '100vh',
            paddingBottom: '80px', /* space for mobile nav */
          }}>
            {children}
          </main>
        </div>
      </ChannelProvider>
    </UserProvider>
  );
}
