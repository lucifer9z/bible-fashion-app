import type { Metadata } from 'next';
import './globals.css';
import Sidebar from '@/components/Sidebar';

export const metadata: Metadata = {
  title: 'BibleFashion — Hệ thống quản lý bán hàng',
  description: 'Kinh thánh bán hàng thời trang nam online — quản lý, nhắc việc, kiểm soát',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="vi">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=JetBrains+Mono:wght@400;700&display=swap" rel="stylesheet" />
      </head>
      <body>
        <Sidebar />
        <div className="content-wrapper">
          <main className="main-content">
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}
