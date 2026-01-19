'use client';

import { useState } from 'react';
import { Zap, TrendingUp, Clock, MapPin, Bookmark, Heart, Crown } from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { realtimeTrends } from '@/lib/data';
import TrendReport from '@/components/TrendReport';
import MoodBoard from '@/components/MoodBoard';
import KeywordAlerts from '@/components/KeywordAlerts';

export default function ArchivePage() {
    const { showDarkMode, isSubscriber } = useApp();
    const [likedTrends, setLikedTrends] = useState<number[]>([]);
    const [bookmarkedTrends, setBookmarkedTrends] = useState<number[]>([]);
    const [activeFilter, setActiveFilter] = useState('All');
    const [activeTab, setActiveTab] = useState<'trends' | 'moodboard' | 'alerts'>('trends');

    const filters = ['All', 'Style', 'Item', 'Brand', 'Influencer'];

    const toggleLike = (idx: number) => {
        setLikedTrends(prev =>
            prev.includes(idx) ? prev.filter(i => i !== idx) : [...prev, idx]
        );
    };

    const toggleBookmark = (idx: number) => {
        setBookmarkedTrends(prev =>
            prev.includes(idx) ? prev.filter(i => i !== idx) : [...prev, idx]
        );
    };

    return (
        <div className={`pt-24 px-6 pb-20 min-h-screen ${showDarkMode ? 'bg-black text-white' : 'bg-white'}`}>
            <div className="max-w-7xl mx-auto">
                {/* 헤더 */}
                <div className="mb-12">
                    <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-3">
                            <Zap className="w-6 h-6 text-vox-red" />
                            <h1 className="text-4xl font-serif">Real-time Trend Archive</h1>
                        </div>
                        {isSubscriber && (
                            <div className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-yellow-400 to-orange-500 text-white rounded-lg">
                                <Crown className="w-5 h-5" />
                                <span className="font-medium">프리미엄 구독자</span>
                            </div>
                        )}
                    </div>
                    <p className="text-xl text-gray-600">
                        전 세계에서 지금 일어나고 있는 패션 트렌드를 실시간으로 추적합니다
                    </p>
                </div>

                {/* 구독자 전용 탭 네비게이션 */}
                {isSubscriber && (
                    <div className="flex gap-2 mb-8 border-b pb-2">
                        <button
                            onClick={() => setActiveTab('trends')}
                            className={`px-4 py-2 rounded-t-lg transition-colors ${activeTab === 'trends'
                                    ? 'bg-vox-red text-white'
                                    : 'hover:bg-gray-100'
                                }`}
                        >
                            실시간 트렌드
                        </button>
                        <button
                            onClick={() => setActiveTab('moodboard')}
                            className={`px-4 py-2 rounded-t-lg transition-colors ${activeTab === 'moodboard'
                                    ? 'bg-vox-red text-white'
                                    : 'hover:bg-gray-100'
                                }`}
                        >
                            나만의 무드보드
                        </button>
                        <button
                            onClick={() => setActiveTab('alerts')}
                            className={`px-4 py-2 rounded-t-lg transition-colors ${activeTab === 'alerts'
                                    ? 'bg-vox-red text-white'
                                    : 'hover:bg-gray-100'
                                }`}
                        >
                            키워드 알림
                        </button>
                    </div>
                )}

                {/* 트렌드 탭 */}
                {activeTab === 'trends' && (
                    <>
                        {/* 필터 */}
                        <div className="flex gap-3 mb-8 overflow-x-auto pb-2">
                            {filters.map((filter) => (
                                <button
                                    key={filter}
                                    onClick={() => setActiveFilter(filter)}
                                    className={`px-4 py-2 border rounded-full text-sm whitespace-nowrap transition-colors ${activeFilter === filter
                                        ? 'bg-vox-red text-white border-vox-red'
                                        : 'border-gray-300 hover:border-gray-900'
                                        }`}
                                >
                                    {filter}
                                </button>
                            ))}
                        </div>

                        {/* 트렌드 리스트 */}
                        <div className="space-y-4 mb-12">
                            {realtimeTrends.map((trend, idx) => (
                                <div
                                    key={idx}
                                    className={`${showDarkMode ? 'bg-black border border-gray-800' : 'bg-gray-50'} p-6 rounded-lg hover:shadow-lg transition-shadow cursor-pointer`}
                                    onClick={() => toggleLike(idx)}
                                >
                                    <div className="flex items-start justify-between">
                                        <div className="flex-1">
                                            <div className="flex items-center gap-3 mb-2 flex-wrap">
                                                <h3 className="text-2xl font-medium font-serif">
                                                    {trend.keyword}
                                                </h3>
                                                <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded">
                                                    {trend.growth}
                                                </span>
                                                <span className={`px-2 py-1 text-xs rounded ${showDarkMode ? 'bg-gray-700' : 'bg-gray-200'}`}>
                                                    {trend.category}
                                                </span>
                                            </div>
                                            <div className="flex items-center gap-4 text-sm text-gray-600 flex-wrap">
                                                <span className="flex items-center gap-1">
                                                    <TrendingUp className="w-4 h-4" />
                                                    {trend.mentions.toLocaleString()} mentions
                                                </span>
                                                <span className="flex items-center gap-1">
                                                    <Clock className="w-4 h-4" />
                                                    {trend.time}
                                                </span>
                                                <span className="flex items-center gap-1">
                                                    <MapPin className="w-4 h-4" />
                                                    {trend.city}
                                                </span>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    toggleBookmark(idx);
                                                }}
                                                className={`p-2 rounded-full transition-colors ${showDarkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-200'}`}
                                            >
                                                <Bookmark
                                                    className={`w-5 h-5 transition-colors ${bookmarkedTrends.includes(idx) ? 'fill-black text-black' : ''}`}
                                                />
                                            </button>
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    toggleLike(idx);
                                                }}
                                                className={`p-2 rounded-full transition-colors ${showDarkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-200'}`}
                                            >
                                                <Heart
                                                    className={`w-5 h-5 transition-colors ${likedTrends.includes(idx) ? 'fill-red-500 text-red-500' : ''}`}
                                                />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* 24시간 트렌드 리포트 */}
                        <TrendReport isSubscriber={isSubscriber} />
                    </>
                )}

                {/* 무드보드 탭 (구독자 전용) */}
                {activeTab === 'moodboard' && isSubscriber && (
                    <MoodBoard
                        bookmarkedTrends={bookmarkedTrends}
                        allTrends={realtimeTrends}
                    />
                )}

                {/* 키워드 알림 탭 (구독자 전용) */}
                {activeTab === 'alerts' && isSubscriber && (
                    <KeywordAlerts />
                )}
            </div>
        </div>
    );
}
