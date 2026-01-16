'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Sparkles } from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { subscribeToStibee } from '@/lib/stibee';

export default function SubscribeModal() {
    const router = useRouter();
    const { userProfile, setIsSubscriber, setShowSubscribeModal } = useApp();
    const [email, setEmail] = useState('');
    const [name, setName] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [subscribeSuccess, setSubscribeSuccess] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        setError('');

        try {
            if (userProfile) { // Guard against null
                await subscribeToStibee(email, name, userProfile);
            } else {
                throw new Error('User profile not found');
            }

            setSubscribeSuccess(true);
            setIsSubscriber(true);

            // 2초 후 대시보드로 이동
            setTimeout(() => {
                setShowSubscribeModal(false);
                router.push('/dashboard');
            }, 2000);
        } catch (err) {
            console.error('구독 오류:', err);
            setError('구독 신청 중 오류가 발생했습니다. 다시 시도해주세요.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center p-4">
            <div className="bg-white text-gray-900 max-w-md w-full rounded-lg p-8">
                {!subscribeSuccess ? (
                    <>
                        {/* 헤더 */}
                        <div className="text-center mb-6">
                            <div className="w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center bg-vox-red">
                                <Sparkles className="w-8 h-8 text-white" />
                            </div>
                            <h2 className="text-3xl mb-2 font-serif">진단 완료!</h2>
                            <p className="text-gray-600">
                                당신의 스타일은 <strong>{userProfile?.style}</strong>입니다.
                            </p>
                        </div>

                        {/* 구독 폼 */}
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium mb-2">이름</label>
                                <input
                                    type="text"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    required
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-gray-900 transition-colors"
                                    placeholder="이름을 입력하세요"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-2">이메일</label>
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-gray-900 transition-colors"
                                    placeholder="email@example.com"
                                />
                            </div>

                            {/* 혜택 안내 */}
                            <div className="bg-gray-50 p-4 rounded-lg">
                                <p className="text-sm text-gray-600 mb-2">
                                    매주 월요일 오전 8시, 당신만을 위한 패션 브리핑을 받아보세요:
                                </p>
                                <ul className="text-sm text-gray-600 space-y-1">
                                    <li>✓ {userProfile?.style} 스타일 맞춤 큐레이션</li>
                                    <li>✓ 실시간 트렌드 리포트</li>
                                    <li>✓ 독점 콘텐츠 및 할인 혜택</li>
                                </ul>
                            </div>

                            {/* 에러 메시지 */}
                            {error && (
                                <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg text-sm">
                                    {error}
                                </div>
                            )}

                            {/* 제출 버튼 */}
                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="w-full py-4 text-white font-medium rounded-lg bg-vox-red hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {isSubmitting ? '구독 신청 중...' : '뉴스레터 구독하기'}
                            </button>

                            {/* 약관 동의 */}
                            <p className="text-xs text-gray-500 text-center">
                                구독 신청 시 <a href="#" className="underline">이용약관</a> 및{' '}
                                <a href="#" className="underline">개인정보처리방침</a>에 동의하게 됩니다.
                            </p>
                        </form>

                        {/* 나중에 하기 */}
                        <button
                            onClick={() => setShowSubscribeModal(false)}
                            className="w-full mt-4 py-2 text-sm text-gray-600 hover:text-gray-900 transition-colors"
                        >
                            나중에 하기
                        </button>
                    </>
                ) : (
                    /* 성공 메시지 */
                    <div className="text-center py-8">
                        <div className="w-20 h-20 mx-auto mb-4 rounded-full flex items-center justify-center bg-green-100">
                            <span className="text-4xl">✓</span>
                        </div>
                        <h3 className="text-2xl mb-2 font-serif">구독 완료!</h3>
                        <p className="text-gray-600 mb-2">
                            이메일로 전송된 링크를 클릭하여 구독을 확인해주세요.
                        </p>
                        <p className="text-sm text-gray-500">잠시 후 대시보드로 이동합니다...</p>
                    </div>
                )}
            </div>
        </div>
    );
}