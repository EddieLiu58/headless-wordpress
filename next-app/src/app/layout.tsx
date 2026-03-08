import type { Metadata } from 'next';
import './globals.css';
import SmoothScrollProvider from '@/components/SmoothScrollProvider';
import PageLoader from '@/components/PageLoader';
import Navbar from '@/components/Navbar';

export const metadata: Metadata = {
  title: 'Headless WordPress',
  description: 'Powered by WordPress REST API + Next.js',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="zh-TW" style={{ scrollBehavior: 'auto' }}>
      <body>
        <SmoothScrollProvider>
          <PageLoader />
          <Navbar />
          {children}
        </SmoothScrollProvider>
      </body>
    </html>
  );
}
