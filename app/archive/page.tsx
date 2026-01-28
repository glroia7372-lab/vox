'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Zap, TrendingUp, Clock, MapPin, Bookmark, Heart, Mail, Lock } from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { realtimeTrends } from '@/lib/data';
import TrendReport from '@/components/TrendReport';
import MoodBoard from '@/components/MoodBoard';
import KeywordAlerts, { KeywordAlert } from '@/components/KeywordAlerts';
import { supabase } from '@/utils/supabase/client';
import { registerServiceWorker, subscribeToPush } from '@/lib/pushNotification';

function ArchiveContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const { showDarkMode, isSubscriber, setIsSubscriber, setShowSubscribeModal, toggleBookmark: toggleGlobalBookmark, bookmarks: globalBookmarks } = useApp();
    const [likedTrends, setLikedTrends] = useState<number[]>([]);
    // bookmarkedTrends replaced by globalBookmarks of Context
    const [activeFilter, setActiveFilter] = useState('All');
    const [activeTab, setActiveTab] = useState<'trends' | 'moodboard' | 'alerts'>('trends');
    const [trends, setTrends] = useState<any[]>(realtimeTrends);
    const [alertKeywords, setAlertKeywords] = useState<KeywordAlert[]>([
        { id: '1', keyword: '샤넬', enabled: true, matchCount: 3, lastMatched: '2시간 전' },
        { id: '2', keyword: '데님', enabled: true, matchCount: 7, lastMatched: '30분 전' }
    ]);
    const [pushSubscription, setPushSubscription] = useState<PushSubscription | null>(null);

    // Function to trigger push via API
    const triggerPushNotification = async (title: string, body: string, url: string) => {
        if (!pushSubscription) return;

        try {
            await fetch('/api/push', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    subscription: pushSubscription,
                    title,
                    body,
                    url
                })
            });
        } catch (error) {
            console.error('Failed to send push notification:', error);
        }
    };

    useEffect(() => {
        // Initial Fetch
        const fetchTrends = async () => {
            const { data } = await supabase.from('realtime_trends').select('*').order('mentions', { ascending: false });
            if (data && data.length > 0) {
                setTrends(data.map(item => ({
                    ...item,
                    time: 'Live'
                })));
            }
        };
        fetchTrends();

        // Realtime Subscription
        const channel = supabase
            .channel('realtime-trends')
            .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'realtime_trends' }, (payload) => {
                const updatedTrend = payload.new;

                // Update Trends List
                setTrends(prev => prev.map(item =>
                    item.keyword === updatedTrend.keyword ? { ...item, ...updatedTrend, time: 'Just now' } : item
                ));

                // Check for Keyword Alerts
                setAlertKeywords(prev => prev.map(k => {
                    if (k.enabled && k.keyword === updatedTrend.keyword) {
                        const alertMsg = `'${k.keyword}' 트렌드가 업데이트 되었습니다!`;

                        // 1. Browser Notification (Current Session)
                        if (typeof Notification !== 'undefined' && Notification.permission === 'granted') {
                            new Notification('VOX Trend Alert', { body: alertMsg });
                        }

                        // 2. Web Push Notification (Background/Mobile)
                        triggerPushNotification('VOX Trend Alert', alertMsg, `/archive?trend=${k.keyword}`);

                        return { ...k, matchCount: k.matchCount + 1, lastMatched: '방금 전' };
                    }
                    return k;
                }));
            })
            .subscribe();

        // Request Notification Permission and Set up Push
        const setupPush = async () => {
            if (typeof Notification !== 'undefined') {
                const permission = await Notification.requestPermission();
                if (permission === 'granted') {
                    const registration = await registerServiceWorker();
                    if (registration) {
                        const subscription = await subscribeToPush(registration);
                        if (subscription) setPushSubscription(subscription);
                    }
                }
            }
        };
        setupPush();

        return () => { supabase.removeChannel(channel); };
    }, []);

    const handleAddKeyword = (keyword: string) => {
        const newAlert: KeywordAlert = {
            id: Date.now().toString(),
            keyword,
            enabled: true,
            matchCount: 0
        };
        setAlertKeywords(prev => [...prev, newAlert]);
    };

    const handleToggleKeyword = (id: string) => {
        setAlertKeywords(prev => prev.map(k => k.id === id ? { ...k, enabled: !k.enabled } : k));
    };

    const handleDeleteKeyword = (id: string) => {
        setAlertKeywords(prev => prev.filter(k => k.id !== id));
    };

    useEffect(() => {
        const tab = searchParams.get('tab');
        if (tab === 'moodboard') {
            setActiveTab('moodboard');
        } else if (tab === 'alerts') {
            setActiveTab('alerts');
        }

        const status = searchParams.get('status');
        if (status === 'subscribed') {
            setIsSubscriber(true);
            // URL 정리 (쿼리 파라미터 제거)
            router.replace('/archive');
        }
    }, [searchParams, setIsSubscriber, router]);

    const filters = ['All', 'Style', 'Item', 'Brand', 'Influencer'];

    const toggleLike = (idx: number) => {
        setLikedTrends(prev =>
            prev.includes(idx) ? prev.filter(i => i !== idx) : [...prev, idx]
        );
    };

    const handleToggleBookmark = (trend: any) => {
        // Construct a standard bookmark item from the trend
        const newItem = {
            id: trend.keyword,
            title: trend.keyword,
            type: trend.category,
            imageUrl: `https://source.unsplash.com/random/400x500?fashion,${trend.keyword.replace(/\s/g, ',')}`,
            url: `/archive?trend=${trend.keyword}`,
            date: new Date().toISOString()
        };
        toggleGlobalBookmark(newItem);
    };

    // 비구독자용 구독 유도 화면
    if (!isSubscriber) {
        return (
            <div className={`pt-24 px-6 pb-20 min-h-screen ${showDarkMode ? 'bg-black text-white' : 'bg-white'}`}>
                <div className="max-w-4xl mx-auto">
                    {/* 헤더 */}
                    <div className="mb-12 text-center">
                        <div className="flex items-center justify-center gap-3 mb-4">
                            <Zap className="w-8 h-8 text-vox-red" />
                            <h1 className="text-4xl font-serif">Real-time Trend Archive</h1>
                        </div>
                        <p className="text-xl text-gray-600">
                            전 세계에서 지금 일어나고 있는 패션 트렌드를 실시간으로 추적합니다
                        </p>
                    </div>

                    {/* 구독 유도 카드 */}
                    <div className={`relative overflow-hidden rounded-2xl ${showDarkMode ? 'bg-gray-900' : 'bg-gradient-to-br from-gray-50 to-gray-100'} p-8 md:p-12`}>
                        {/* 배경 장식 */}
                        <div className="absolute top-0 right-0 w-64 h-64 bg-vox-red/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
                        <div className="absolute bottom-0 left-0 w-48 h-48 bg-yellow-400/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />

                        <div className="relative z-10">
                            {/* 잠금 아이콘 */}
                            <div className="flex justify-center mb-6">
                                <div className="w-20 h-20 bg-vox-red/10 rounded-full flex items-center justify-center">
                                    <Lock className="w-10 h-10 text-vox-red" />
                                </div>
                            </div>

                            <h2 className="text-3xl font-serif text-center mb-4">
                                구독자 전용 콘텐츠
                            </h2>
                            <p className={`text-center mb-8 ${showDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                                실시간 트렌드 아카이브는 VOX 구독자만 이용할 수 있습니다.
                                <br />
                                구독하고 전 세계 패션 트렌드를 가장 먼저 만나보세요.
                            </p>

                            {/* 혜택 목록 */}
                            <div className="grid md:grid-cols-3 gap-6 mb-10">
                                <div className={`p-6 rounded-xl ${showDarkMode ? 'bg-gray-800' : 'bg-white'} shadow-sm`}>
                                    <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                                        <TrendingUp className="w-6 h-6 text-green-600" />
                                    </div>
                                    <h3 className="font-semibold mb-2">실시간 트렌드</h3>
                                    <p className={`text-sm ${showDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                                        전 세계 패션 트렌드를 실시간으로 추적하고 분석합니다
                                    </p>
                                </div>
                                <div className={`p-6 rounded-xl ${showDarkMode ? 'bg-gray-800' : 'bg-white'} shadow-sm`}>
                                    <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
                                        <Bookmark className="w-6 h-6 text-purple-600" />
                                    </div>
                                    <h3 className="font-semibold mb-2">나만의 무드보드</h3>
                                    <p className={`text-sm ${showDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                                        관심 트렌드를 저장하고 나만의 무드보드를 만들어보세요
                                    </p>
                                </div>
                                <div className={`p-6 rounded-xl ${showDarkMode ? 'bg-gray-800' : 'bg-white'} shadow-sm`}>
                                    <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                                        <Zap className="w-6 h-6 text-blue-600" />
                                    </div>
                                    <h3 className="font-semibold mb-2">키워드 알림</h3>
                                    <p className={`text-sm ${showDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                                        관심 키워드 등록 시 새로운 트렌드 알림을 받아보세요
                                    </p>
                                </div>
                            </div>

                            {/* 미리보기 (블러 처리된 트렌드 목록) */}
                            <div className="mb-10">
                                <h3 className={`text-sm font-medium mb-4 ${showDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                                    지금 뜨고 있는 트렌드 미리보기
                                </h3>
                                <div className="space-y-3 relative">
                                    {realtimeTrends.slice(0, 3).map((trend, idx) => (
                                        <div
                                            key={idx}
                                            className={`${showDarkMode ? 'bg-gray-800' : 'bg-white'} p-4 rounded-lg blur-sm select-none`}
                                        >
                                            <div className="flex items-center gap-3">
                                                <span className="text-lg font-medium">{trend.keyword}</span>
                                                <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded">
                                                    {trend.growth}
                                                </span>
                                            </div>
                                        </div>
                                    ))}
                                    {/* 오버레이 */}
                                    <div className="absolute inset-0 flex items-center justify-center">
                                        <div className={`px-4 py-2 rounded-lg ${showDarkMode ? 'bg-gray-900/90' : 'bg-white/90'} shadow-lg`}>
                                            <span className="text-sm font-medium">구독 후 전체 내용 확인</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* CTA 버튼 */}
                            <div className="flex flex-col sm:flex-row gap-4 justify-center">
                                <a
                                    href="https://page.stibee.com/subscriptions/466654"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="px-8 py-4 bg-vox-red text-white rounded-lg font-medium hover:bg-red-700 transition-colors flex items-center justify-center gap-2"
                                >
                                    <Mail className="w-5 h-5" />
                                    구독하기
                                </a>
                                <a
                                    href="/"
                                    className={`px-8 py-4 border rounded-lg font-medium transition-colors flex items-center justify-center ${showDarkMode ? 'border-gray-700 hover:bg-gray-800' : 'border-gray-300 hover:bg-gray-50'}`}
                                >
                                    홈으로 돌아가기
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    // 구독자용 전체 콘텐츠
    return (
        <div className={`pt-24 px-6 pb-20 min-h-screen ${showDarkMode ? 'bg-black text-white' : 'bg-white'}`}>
            <div className="max-w-7xl mx-auto">
                {/* 헤더 */}
                <div className="mb-12">
                    <div className="flex items-center gap-3 mb-4">
                        <Zap className="w-6 h-6 text-vox-red" />
                        <h1 className="text-4xl font-serif">Real-time Trend Archive</h1>
                    </div>
                    <p className="text-xl text-gray-600">
                        전 세계에서 지금 일어나고 있는 패션 트렌드를 실시간으로 추적합니다
                    </p>
                </div>

                {/* 구독자 전용 탭 네비게이션 */}
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
                            {trends.map((trend, idx) => {
                                const isBookmarked = globalBookmarks.some((b: any) => b.id === trend.keyword);
                                return (
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
                                                        handleToggleBookmark(trend);
                                                    }}
                                                    className={`p-2 rounded-full transition-colors ${showDarkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-200'}`}
                                                >
                                                    <Bookmark
                                                        className={`w-5 h-5 transition-colors ${isBookmarked ? 'fill-black text-black' : ''}`}
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
                                );
                            })}
                        </div>

                        {/* 24시간 트렌드 리포트 */}
                        <TrendReport isSubscriber={isSubscriber} />
                    </>
                )}

                {/* 무드보드 탭 (구독자 전용) */}
                {activeTab === 'moodboard' && (
                    <MoodBoard initialBoardId={searchParams.get('board')} />
                )}

                {/* 키워드 알림 탭 (구독자 전용) */}
                {activeTab === 'alerts' && (
                    <KeywordAlerts
                        keywords={alertKeywords}
                        onAdd={handleAddKeyword}
                        onToggle={handleToggleKeyword}
                        onDelete={handleDeleteKeyword}
                    />
                )}
            </div>
        </div>
    );
}

export default function ArchivePage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-vox-red"></div>
            </div>
        }>
            <ArchiveContent />
        </Suspense>
    );
}