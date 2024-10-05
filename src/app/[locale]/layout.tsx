import { ThemeProvider } from '@/src/app/[locale]/components/ThemeProvider'
import type { Metadata } from 'next'
import {
  AbstractIntlMessages,
  NextIntlClientProvider,
  useMessages
} from 'next-intl'
import { Inter, Rubik, Space_Grotesk } from 'next/font/google'
import NextTopLoader from 'nextjs-toploader'
import { Header } from './components/Header'
import RainbowKitProviderImport from "../RainbowKitProviderImport";

import './globals.css'
import { OwnerContextProvider } from '@/src/context/owner'

const inter = Inter({
  subsets: ['latin'],
  variable: '--inter'
});
const rubik = Rubik({
  subsets: ['arabic'],
  variable: '--rubik'
});
const space_grotesk = Space_Grotesk({
  subsets: ['latin'],
  variable: '--font-space-grotesk'
});

export const metadata: Metadata = {
  title: 'Verax',
  description: ''
};

export default function RootLayout({
  children,
  params: { locale }
}: {
  children: React.ReactNode;
  params: { locale: string };
}) {
  const messages = useMessages();
  return (
    <html lang={locale} dir={locale === 'ar' || locale === 'fa' ? 'rtl' : 'ltr'} className={`${space_grotesk.variable} ${rubik.variable} scroll-smooth`} suppressHydrationWarning>
    <body>
      <RainbowKitProviderImport>
      <OwnerContextProvider>
        <ThemeProvider enableSystem attribute='class' defaultTheme='facebook'>
          <NextIntlClientProvider locale={locale} messages={messages as AbstractIntlMessages}>
              <NextTopLoader initialPosition={0.08} crawlSpeed={200} height={3} crawl={true} easing='ease' speed={200} shadow='0 0 10px #2299DD,0 0 5px #2299DD' color='var(--primary)' showSpinner={false} />
              <Header locale={locale} />
                  <main className='mx-auto max-w-screen-2xl'>{children}</main>
          </NextIntlClientProvider>
        </ThemeProvider>
        </OwnerContextProvider>
      </RainbowKitProviderImport>
    </body>
  </html>
  )
}
