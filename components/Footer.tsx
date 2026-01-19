'use client';

import Link from 'next/link';
import { useApp } from '@/context/AppContext';

export default function Footer() {
    const { isSubscriber, showDarkMode, setShowStyleQuiz, setShowSubscribeModal } = useApp();

    return (
        <footer className={`border-t ${showDarkMode ? 'bg-black border-gray-800' : 'bg-gray-50 border-gray-200'} transition-colors`}>
            <div className="max-w-7xl mx-auto px-6 py-12">
                <div className="grid md:grid-cols-4 gap-8 mb-12">
                    {/* 브랜드 */}
                    <Link href="/about" className="group block">
                        <div className="text-xl mb-4 tracking-wider font-serif group-hover:text-vox-red transition-colors">VOX</div>
                        <p className="text-sm text-gray-600 group-hover:text-gray-900 transition-colors">Find Your Voice, Define Your Style.</p>
                        <p className="text-xs text-gray-500 mt-2">데이터 지능형 패션 큐레이션 플랫폼</p>
                    </Link>

                    {/* 서비스 */}
                    <div>
                        <h4 className="text-xs tracking-widest mb-4 font-medium">서비스</h4>
                        <div className="space-y-2 text-sm text-gray-600">
                            {isSubscriber && (
                                <Link href="/dashboard" className="block cursor-pointer hover:text-vox-red transition-colors font-bold text-black border-b border-black/10 pb-2 mb-2">
                                    MY VOX (마이페이지)
                                </Link>
                            )}
                            <button
                                onClick={() => setShowStyleQuiz(true)}
                                className="block cursor-pointer hover:text-vox-red transition-colors text-left w-full"
                            >
                                스타일 진단
                            </button>
                            <Link href="/archive" className="block cursor-pointer hover:text-vox-red transition-colors">
                                트렌드 아카이브
                            </Link>
                            <a
                                href="https://page.stibee.com/subscriptions/466654"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="block cursor-pointer hover:text-vox-red transition-colors text-left w-full"
                            >
                                뉴스레터 구독
                            </a>
                            <button
                                onClick={() => setShowSubscribeModal(true)}
                                className="block cursor-pointer hover:text-vox-red transition-colors text-left w-full"
                            >
                                프리미엄 멤버십
                            </button>
                        </div>
                    </div>

                    {/* 연결 */}
                    <div>
                        <h4 className="text-xs tracking-widest mb-4 font-medium">연결</h4>
                        <div className="space-y-2 text-sm text-gray-600">
                            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="block hover:text-vox-red transition-colors">Instagram</a>
                            <a href="https://pinterest.com" target="_blank" rel="noopener noreferrer" className="block hover:text-vox-red transition-colors">Pinterest</a>
                        </div>
                    </div>

                    {/* 법적 고지 */}
                    <div>
                        <h4 className="text-xs tracking-widest mb-4 font-medium">법적 고지</h4>
                        <div className="space-y-2 text-sm text-gray-600">
                            <Link href="/terms" className="block hover:text-vox-red transition-colors">이용약관</Link>
                            <Link href="/privacy" className="block hover:text-vox-red transition-colors">개인정보처리방침</Link>
                        </div>
                    </div>
                </div>

                {/* 저작권 */}
                <div className="pt-8 border-t border-gray-200 text-xs text-gray-500 text-center space-y-2">
                    <p>© 2026 VOX. All rights reserved.</p>
                    <p>당신의 스타일을 찾는 가장 빠르고 정확한 목소리, VOX</p>
                </div>
            </div>
        </footer>
    );
}