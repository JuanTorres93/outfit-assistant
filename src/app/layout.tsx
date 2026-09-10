import { Playfair_Display, Work_Sans } from 'next/font/google';

import './globals.css';

const fontBody = Work_Sans({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-body',
  fallback: ['system-ui', 'sans-serif'],
  style: ['normal', 'italic'],
});

const fontDisplay = Playfair_Display({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-display',
  fallback: ['Georgia', 'serif'],
  style: ['normal', 'italic'],
});

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${fontBody.className} ${fontDisplay.variable}`}>{children}</body>
    </html>
  );
}
