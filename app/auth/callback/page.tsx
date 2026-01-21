'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { useApp } from '@/context/AppContext';

export default function AuthCallback() {
    const router = useRouter();
    const { setIsSubscriber, setUserProfile } = useApp();

    useEffect(() => {
        const handleAuthCallback = async () => {
            const { data, error } = await supabase.auth.getSession();

            if (data.session) {
                // 로그인 성공 시 상태 업데이트
                setIsSubscriber(true);

                // 사용자 프로필 설정 (카카오 기본 정보 활용 가능)
                const user = data.session.user;
                setUserProfile({
                    name: user.user_metadata.full_name || 'Kakao User',
                    email: user.email || `${user.id}@kakao.user`,
                    style: 'Minimalist', // 기본값
                    context: 'Daily',
                    priority: 'Quality',
                    budget: 'mid',
                    time: 'evening',
                    preferences: ['Modern', 'Chic'],
                    completedAt: new Date().toISOString()
                });

                router.push('/dashboard');
            } else if (error) {
                console.error('Auth callback error:', error.message);
                router.push('/login');
            } else {
                router.push('/login');
            }
        };

        handleAuthCallback();
    }, [router, setIsSubscriber, setUserProfile]);

    return (
        <div className="min-h-screen flex items-center justify-center bg-white whitespace-pre-wrap">
            <div className="text-center">
                <div className="w-16 h-16 border-4 border-vox-red border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                <p className="text-gray-500 font-serif italic">Authenticating...</p>
            </div>
        </div>
    );
}
