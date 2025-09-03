import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { ThemeProvider } from '@/components/ThemeProvider';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  metadataBase: new URL('https://ripplefind.netlify.app'),
  title: 'RippleFind - Start Your Ripple',
  description: 'You\'re just 5 people away from the next billion-dollar founder. Start your Ripple and own a piece of what\'s coming.',
  keywords: 'startup, founder, cofounder, referral, networking, ripple',
  openGraph: {
    title: 'RippleFind - Start Your Ripple',
    description: 'You\'re just 5 people away from the next billion-dollar founder.',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${inter.className} antialiased`}>
        <ThemeProvider
          defaultTheme="system"
          storageKey="ripplefind-theme"
        >
          <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-teal-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
            {children}
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}