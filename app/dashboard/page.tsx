'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { MapPin, ShoppingBag } from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { exclusiveContent, todayLookbook } from '@/lib/data';

export default function DashboardPage() {
    const router = useRouter();
    const { isSubscriber, userProfile, showDarkMode } = useApp();

    // 구독자가 아니면 홈으로 리다이렉트
    useEffect(() => {
        if (!isSubscriber) {
            router.push('/');
        }
    }, [isSubscriber, router]);

    if (!isSubscriber) {
        return null;
    }

    return (
        <div className={`pt-24 px-6 pb-20 min-h-screen ${showDarkMode ? 'bg-black text-white' : 'bg-white'}`}>
            <div className="max-w-7xl mx-auto">
                {/* 웰컴 섹션 */}
                <div className="mb-12">
                    <h1 className="text-4xl mb-4 font-serif">
                        반가워요, {userProfile?.style || 'Fashion Lover'}님.
                    </h1>
                    <p className="text-xl text-gray-600">오늘 당신을 위한 트렌드 리포트입니다.</p>
                    <div className="flex gap-2 mt-4">
                        {userProfile?.preferences?.map((pref, idx) => (
                            <span
                                key={idx}
                                className={`px-3 py-1 text-sm rounded-full ${showDarkMode ? 'bg-gray-900 border border-gray-700' : 'bg-gray-100'}`}
                            >
                                {pref}
                            </span>
                        ))}
                    </div>
                </div>

                {/* 오늘의 룩북 */}
                <section className="mb-12">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-2xl font-serif">오늘의 룩북</h2>
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                            <MapPin className="w-4 h-4" />
                            서울, 맑음 18°C
                        </div>
                    </div>
                    <div className="grid md:grid-cols-2 gap-6">
                        {todayLookbook.map((look, idx) => (
                            <div
                                key={idx}
                                className={`${showDarkMode ? 'bg-black border border-gray-800' : 'bg-gray-50'} rounded-lg overflow-hidden hover:shadow-lg transition-shadow`}
                            >
                                <div className="h-64 overflow-hidden">
                                    <img
                                        src={look.image}
                                        alt={look.occasion}
                                        className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                                    />
                                </div>
                                <div className="p-6">
                                    <div className="flex items-center justify-between mb-3">
                                        <span className="text-sm font-medium">{look.occasion}</span>
                                        <span className="text-xs text-gray-500">{look.weather}</span>
                                    </div>
                                    <div className="flex flex-wrap gap-2">
                                        {look.items.map((item, i) => (
                                            <span
                                                key={i}
                                                className="text-xs px-2 py-1 border border-gray-300 rounded"
                                            >
                                                {item}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>

                {/* 독점 콘텐츠 */}
                <section className="mb-12">
                    <h2 className="text-2xl mb-6 font-serif">Curated for You</h2>
                    <div className="grid md:grid-cols-3 gap-6">
                        {exclusiveContent.sort((a, b) => {
                            const aMatch = a.tags?.some(t => t === userProfile?.style || userProfile?.preferences?.includes(t));
                            const bMatch = b.tags?.some(t => t === userProfile?.style || userProfile?.preferences?.includes(t));
                            return (aMatch === bMatch) ? 0 : aMatch ? -1 : 1;
                        }).map((content, idx) => {
                            const isMatch = content.tags?.some(t => t === userProfile?.style || userProfile?.preferences?.includes(t));
                            return (
                                <div key={idx} className="group cursor-pointer">
                                    <div className="relative h-48 mb-4 overflow-hidden rounded-lg">
                                        <img
                                            src={content.thumbnail}
                                            alt={content.title}
                                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                        />
                                        <div className="absolute top-3 right-3 flex gap-2">
                                            {isMatch && (
                                                <span className="px-2 py-1 bg-vox-red text-white text-xs rounded font-bold">Recommended</span>
                                            )}
                                            <span className="px-2 py-1 bg-black bg-opacity-70 text-white text-xs rounded">
                                                {content.type}
                                            </span>
                                        </div>
                                        {content.duration && (
                                            <div className="absolute bottom-3 left-3 text-white text-xs">
                                                {content.duration}
                                            </div>
                                        )}
                                    </div>
                                    <h3 className="text-lg mb-2 group-hover:opacity-60 transition-opacity font-serif">
                                        {content.title}
                                    </h3>
                                    <div className="text-sm text-gray-600">
                                        {content.duration && `${content.duration} 영상`}
                                        {content.pages && `${content.pages} 페이지`}
                                        {content.items && `${content.items} 아이템`}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </section>

                {/* 가상 드레스룸 */}
                <section className={`${showDarkMode ? 'bg-black border border-gray-800' : 'bg-gray-50'} rounded-lg p-8`}>
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-2xl font-serif">Virtual Closet</h2>
                        <button className="text-sm hover:opacity-60 transition-opacity">
                            + 새 아이템
                        </button>
                    </div>
                    <div className="grid grid-cols-4 md:grid-cols-6 gap-4">
                        {[1, 2, 3, 4, 5, 6].map((i) => (
                            <div
                                key={i}
                                className={`aspect-square ${showDarkMode ? 'bg-black border-gray-700' : 'bg-white'} rounded-lg border-2 border-dashed border-gray-300 flex items-center justify-center cursor-pointer hover:border-gray-400 transition-colors`}
                            >
                                <ShoppingBag className="w-8 h-8 text-gray-400" />
                            </div>
                        ))}
                    </div>
                </section>
            </div>
        </div>
    );
}