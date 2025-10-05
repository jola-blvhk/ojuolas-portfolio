import type { Metadata } from 'next';
import { Poppins, Montserrat } from 'next/font/google';
import './globals.css';
import { LanguageSwitcher } from '../components/language-switcher';
import { Header } from '../components/header';
import { ThemeProvider } from '../components/theme-provider';
import { headers } from 'next/headers';

const poppins = Poppins({
  variable: '--font-poppins',
  weight: ['400', '500', '600', '700'],
  subsets: ['latin'],
});

const montserrat = Montserrat({
  variable: '--font-montserrat',
  weight: ['400', '500', '600', '700'],
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: "Ojuolape Bello's Portfolio",
  description:
    "I'm a UX/UI Designer with 4 years of Technical Support experience, blending problem-solving and user-focused design. Outside of Design, I enjoy cooking, working out, and making 3D seal characters ",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const hdrs = await headers();
  const headerLocale = hdrs.get('x-next-locale') || 'en';
  return (
    <html lang={headerLocale} suppressHydrationWarning>
      <body
        className={`${poppins.variable} ${montserrat.variable} mx-auto max-w-[1440px] antialiased`}
      >
        <div className="px-5 pb-10 lg:px-24 lg:pb-15">
          <ThemeProvider>
            <Header />
            {children}
          </ThemeProvider>
        </div>
      </body>
    </html>
  );
}
