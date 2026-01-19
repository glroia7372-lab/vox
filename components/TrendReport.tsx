'use client';

import { useState } from 'react';
import { Download, TrendingUp, Award, MapPin, Calendar } from 'lucide-react';
import { useApp } from '@/context/AppContext';

interface TrendReportProps {
    isSubscriber: boolean;
}

export default function TrendReport({ isSubscriber }: TrendReportProps) {
    const { showDarkMode } = useApp();
    const [isGenerating, setIsGenerating] = useState(false);

    const generateReport = () => {
        setIsGenerating(true);
        // 리포트 생성 로직 (추후 실제 데이터로 교체)
        setTimeout(() => {
            setIsGenerating(false);
            alert('리포트가 생성되었습니다!');
        }, 2000);
    };

    const topBrands = [
        { name: 'Miu Miu', mentions: 2847, growth: '+34%' },
        { name: 'The Row', mentions: 2103, growth: '+28%' },
        { name: 'Loro Piana', mentions: 1856, growth: '+22%' },
        { name: 'Bottega Veneta', mentions: 1645, growth: '+19%' },
        { name: 'Toteme', mentions: 1432, growth: '+15%' },
    ];

    const topStyles = [
        { name: 'Quiet Luxury', growth: '+245%', mentions: 3421 },
        { name: 'Old Money', growth: '+189%', mentions: 2876 },
        { name: 'Coastal Grandmother', growth: '+156%', mentions: 2234 },
    ];

    const topCities = [
        { name: 'Seoul', trends: 34, growth: '+12%' },
        { name: 'Paris', trends: 28, growth: '+8%' },
        { name: 'New York', trends: 24, growth: '+6%' },
    ];

    return (
        <div className={`${showDarkMode ? 'bg-black border border-gray-800' : 'bg-gray-50'} rounded-lg p-8`}>
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h2 className="text-2xl mb-2 font-serif">지난 24시간 트렌드 리포트</h2>
                    <p className="text-sm text-gray-600 flex items-center gap-2">
                        <Calendar className="w-4 h-4" />
                        {new Date().toLocaleDateString('ko-KR', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                        })}
                    </p>
                </div>
                {isSubscriber && (
                    <button
                        onClick={generateReport}
                        disabled={isGenerating}
                        className="flex items-center gap-2 px-4 py-2 bg-vox-red text-white rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50"
                    >
                        <Download className="w-4 h-4" />
                        {isGenerating ? '생성 중...' : 'PDF 다운로드'}
                    </button>
                )}
            </div>

            {/* 기본 리포트 (모든 사용자) */}
            <div className="grid md:grid-cols-3 gap-6 mb-8">
                <div>
                    <div className="text-sm text-gray-600 mb-2">가장 많이 언급된 브랜드</div>
                    <div className="text-3xl font-medium mb-2 text-vox-red">Miu Miu</div>
                    <div className="text-sm">+2,847 mentions</div>
                </div>
                <div>
                    <div className="text-sm text-gray-600 mb-2">급상승 스타일</div>
                    <div className="text-3xl font-medium mb-2 text-vox-red">Quiet Luxury</div>
                    <div className="text-sm">+245% growth</div>
                </div>
                <div>
                    <div className="text-sm text-gray-600 mb-2">핫플레이스</div>
                    <div className="text-3xl font-medium mb-2 text-vox-red">Seoul</div>
                    <div className="text-sm">34 new trends</div>
                </div>
            </div>

            {/* 구독자 전용 상세 리포트 */}
            {isSubscriber ? (
                <div className="space-y-6 border-t pt-6">
                    {/* TOP 5 브랜드 */}
                    <div>
                        <h3 className="text-xl font-serif mb-4 flex items-center gap-2">
                            <Award className="w-5 h-5 text-vox-red" />
                            가장 많이 언급된 브랜드 TOP 5
                        </h3>
                        <div className="space-y-3">
                            {topBrands.map((brand, idx) => (
                                <div
                                    key={idx}
                                    className={`flex items-center justify-between p-3 rounded ${showDarkMode ? 'bg-gray-900' : 'bg-white'}`}
                                >
                                    <div className="flex items-center gap-3">
                                        <span className="text-2xl font-bold text-gray-400">#{idx + 1}</span>
                                        <span className="font-medium">{brand.name}</span>
                                    </div>
                                    <div className="flex items-center gap-4 text-sm">
                                        <span className="text-gray-600">{brand.mentions.toLocaleString()} mentions</span>
                                        <span className="text-green-600 font-medium">{brand.growth}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* 급상승 스타일 */}
                    <div>
                        <h3 className="text-xl font-serif mb-4 flex items-center gap-2">
                            <TrendingUp className="w-5 h-5 text-vox-red" />
                            급상승 스타일 TOP 3
                        </h3>
                        <div className="grid md:grid-cols-3 gap-4">
                            {topStyles.map((style, idx) => (
                                <div
                                    key={idx}
                                    className={`p-4 rounded ${showDarkMode ? 'bg-gray-900' : 'bg-white'}`}
                                >
                                    <div className="text-lg font-medium mb-2">{style.name}</div>
                                    <div className="text-2xl font-bold text-vox-red mb-1">{style.growth}</div>
                                    <div className="text-sm text-gray-600">{style.mentions.toLocaleString()} mentions</div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* 핫플레이스 */}
                    <div>
                        <h3 className="text-xl font-serif mb-4 flex items-center gap-2">
                            <MapPin className="w-5 h-5 text-vox-red" />
                            트렌드 핫플레이스 TOP 3
                        </h3>
                        <div className="grid md:grid-cols-3 gap-4">
                            {topCities.map((city, idx) => (
                                <div
                                    key={idx}
                                    className={`p-4 rounded ${showDarkMode ? 'bg-gray-900' : 'bg-white'}`}
                                >
                                    <div className="text-lg font-medium mb-2">{city.name}</div>
                                    <div className="text-2xl font-bold text-vox-red mb-1">{city.trends}</div>
                                    <div className="text-sm text-gray-600">new trends ({city.growth})</div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            ) : (
                /* 비구독자 안내 */
                <div className="border-t pt-6">
                    <div className={`${showDarkMode ? 'bg-gray-900' : 'bg-white'} p-6 rounded-lg text-center`}>
                        <div className="text-lg font-medium mb-2">🔒 구독자 전용 상세 리포트</div>
                        <p className="text-gray-600 mb-4">
                            TOP 5 브랜드, 급상승 스타일, 핫플레이스 등<br />
                            더 상세한 트렌드 분석을 확인하세요
                        </p>
                        <a
                            href="https://page.stibee.com/subscriptions/466654"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-block px-6 py-2 bg-vox-red text-white rounded-lg hover:opacity-90 transition-opacity"
                        >
                            구독하고 전체 리포트 보기
                        </a>
                    </div>
                </div>
            )}
        </div>
    );
}
