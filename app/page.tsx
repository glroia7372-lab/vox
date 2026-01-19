'use client';

import Link from 'next/link';
import { useApp } from '@/context/AppContext';
import { Clock, Sparkles, TrendingUp, Star } from 'lucide-react';

export default function HomePage() {
  const { showDarkMode, setShowStyleQuiz } = useApp();

  return (
    <>
      <div className={showDarkMode ? 'bg-black text-white' : 'bg-white text-black'}>
        {/* DEV_TEST_MARKER */}
        {/* Hero Section */}
        <section className="pt-20 px-6">
          <div className="max-w-7xl mx-auto py-20">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div className="space-y-8">
                <div className="text-xs tracking-widest text-vox-red">
                  DATA-DRIVEN FASHION CURATION
                </div>
                <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl leading-[1.1] font-serif tracking-tight">
                  Find Your Voice,<br />Define Your Style.
                </h1>
                <p className="text-lg sm:text-xl text-gray-600 leading-relaxed max-w-lg">
                  나보다 나를 더 잘 아는 패션 큐레이션, VOX.<br />3분 진단으로 당신만의 스타일 DNA를 확인하세요.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 pt-4">
                  <button
                    onClick={() => setShowStyleQuiz(true)}
                    className="px-8 py-4 text-white bg-vox-red hover:opacity-90 transition-opacity rounded-lg text-sm font-bold tracking-widest uppercase"
                  >
                    스타일 DNA 진단 시작
                  </button>
                  <Link
                    href="/archive"
                    className="px-8 py-4 border border-gray-300 hover:border-gray-900 transition-colors rounded-lg inline-flex items-center justify-center text-sm font-bold tracking-widest uppercase"
                  >
                    아카이브 탐색
                  </Link>
                </div>
              </div>
              <div className="relative h-96 lg:h-[600px]">
                <img
                  src="https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=1200&h=800&fit=crop"
                  alt="VOX Fashion"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1539109132314-3477524c8d95?w=1200';
                  }}
                  className="w-full h-full object-cover rounded-lg shadow-2xl"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Why VOX Section */}
        <section className={`py-20 ${showDarkMode ? 'bg-black' : 'bg-gray-50'}`}>
          <div className="max-w-7xl mx-auto px-6">
            <div className="text-center mb-16 px-4">
              <h2 className="text-3xl sm:text-4xl mb-4 font-serif">Why VOX?</h2>
              <p className="text-lg sm:text-xl text-gray-600">데이터로 분석하고 감각으로 제안하는 새로운 패션 기준</p>
            </div>

            <div className="grid md:grid-cols-3 gap-12">
              <div className="text-center">
                <div className="w-16 h-16 mx-auto mb-6 rounded-full flex items-center justify-center bg-vox-red">
                  <Clock className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-2xl mb-4 font-serif">3분 브리핑</h3>
                <p className="text-gray-600 leading-relaxed">
                  매주 월요일 아침, 글로벌 패션 트렌드를 3분 요약으로 쉽고 빠르게 전달합니다.
                </p>
              </div>

              <div className="text-center">
                <div className="w-16 h-16 mx-auto mb-6 rounded-full flex items-center justify-center bg-vox-red">
                  <Sparkles className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-2xl mb-4 font-serif">개인화 큐레이션</h3>
                <p className="text-gray-600 leading-relaxed">
                  스타일 DNA 분석을 통해 수많은 정보 중 당신의 취향에 꼭 맞는 소식만 선별합니다.
                </p>
              </div>

              <div className="text-center">
                <div className="w-16 h-16 mx-auto mb-6 rounded-full flex items-center justify-center bg-vox-red">
                  <TrendingUp className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-2xl mb-4 font-serif">실시간 트렌드</h3>
                <p className="text-gray-600 leading-relaxed">
                  전 세계 패션 수도의 흐름을 실시간으로 분석하여 가장 빠르고 정확하게 공유합니다.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Newsletter Preview */}
        <section className="py-20 px-6">
          <div className="max-w-3xl mx-auto">
            <div className="text-center mb-12 px-4">
              <h2 className="text-3xl sm:text-4xl md:text-5xl mb-6 font-serif leading-tight">
                매주 월요일 오전 8시,<br className="hidden sm:block" />당신의 받은편지함으로
              </h2>
              <p className="text-lg sm:text-xl text-gray-600">
                나만을 위한 패션 브리핑을 매주 받아보세요
              </p>
            </div>

            <div className={`${showDarkMode ? 'bg-black border-gray-800' : 'bg-white border-gray-200'} border-2 rounded-lg overflow-hidden shadow-2xl`}>
              <div className="p-8 border-b border-gray-200">
                <div className="flex items-center justify-between mb-6">
                  <div className="text-2xl font-serif">VOX Weekly Briefing</div>
                  <div className="text-sm text-gray-600">2026.01.20</div>
                </div>
                <div className={`${showDarkMode ? 'bg-gray-900' : 'bg-gray-50'} p-4 rounded`}>
                  <div className="flex items-center gap-2 mb-2">
                    <Star className="w-4 h-4 text-vox-red" />
                    <span className="text-sm font-medium">이번 주 당신을 위한 Top 3</span>
                  </div>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li>• Miu Miu 2026 S/S 컬렉션 - 당신의 스타일에 95% 매칭</li>
                    <li>• 지속가능한 데님 브랜드 5선 - 예산 범위 내</li>
                    <li>• 18°C 날씨 완벽 대응 레이어링 가이드</li>
                  </ul>
                </div>
              </div>
              <div className="p-6 text-center">
                <a
                  href="https://page.stibee.com/subscriptions/466654"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block px-8 py-3 text-white bg-vox-red hover:opacity-90 transition-opacity rounded-lg"
                >
                  지금 구독하고 받아보기
                </a>
              </div>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}