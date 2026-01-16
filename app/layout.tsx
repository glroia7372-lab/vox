import { AppProvider } from '@/context/AppContext';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import './globals.css';

export const metadata = {
  title: 'VOX - 데이터 지능형 패션 큐레이션 플랫폼',
  description: 'Find Your Voice, Define Your Style. 바쁜 2030을 위한 초개인화 패션 뉴스레터 서비스',
};

export default function RootLayout({ children }) {
  return (
    <html lang="ko">
      <body style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}>
        <AppProvider>
          <Navigation />
          <main>{children}</main>
          <Footer />
        </AppProvider>
      </body>
    </html>
  );
}