import type { Metadata } from 'next';
import { AppProvider } from '@/lib/contexts/AppContext';
import { Navbar } from '@/components/layout/Navbar';
import './globals.css';

export const metadata: Metadata = {
  title: 'Choirul Anam Nasrudin - Full Stack Developer',
  description: 'Portfolio & Developer Tools',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <AppProvider>
          <Navbar />
          {children}
        </AppProvider>
      </body>
    </html>
  );
}