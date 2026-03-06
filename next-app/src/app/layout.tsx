import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Headless WordPress',
  description: 'Powered by WordPress REST API + Next.js',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="zh-TW">
      <body>
        <header style={{ padding: '1rem 2rem', borderBottom: '1px solid #eee' }}>
          <nav>
            <a href="/" style={{ fontWeight: 'bold', fontSize: '1.25rem', textDecoration: 'none' }}>
              My Blog
            </a>
          </nav>
        </header>
        <main style={{ maxWidth: '800px', margin: '0 auto', padding: '2rem' }}>
          {children}
        </main>
      </body>
    </html>
  );
}
