import { Inter, Cormorant_Garamond, Noto_Serif_KR } from 'next/font/google';
import { AppProvider } from '@/context/AppContext';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import GlobalModals from '@/components/GlobalModals';
import './globals.css';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

const cormorantGaramond = Cormorant_Garamond({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-cormorant',
  display: 'swap',
});

const notoSerifKR = Noto_Serif_KR({
  subsets: ['latin'],
  weight: ['400', '700', '900'],
  variable: '--font-noto-serif-kr',
  display: 'swap',
});

export const metadata = {
  title: 'VOX - 데이터 지능형 패션 큐레이션 플랫폼',
  description: 'Find Your Voice, Define Your Style. 바쁜 2030을 위한 초개인화 패션 뉴스레터 서비스',
};

export default function RootLayout({ children }) {
  return (
    <html lang="ko" className={`${inter.variable} ${cormorantGaramond.variable} ${notoSerifKR.variable}`}>
      <body className="font-sans antialiased">
        <AppProvider>
          <GlobalModals />
          <Navigation />
          <main>{children}</main>
          <Footer />
        </AppProvider>
      </body>
    </html>
  );
}