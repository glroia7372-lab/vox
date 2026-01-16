'use client';

import Link from 'next/link';
import { useApp } from '@/context/AppContext';

export default function Footer() {
    const { showDarkMode } = useApp();

    return (
        <footer className={`border-t ${showDarkMode ? 'bg-black border-gray-800' : 'bg-gray-50 border-gray-200'} transition-colors`}>
            <div className="max-w-7xl mx-auto px-6 py-12">
                <div className="grid md:grid-cols-4 gap-8 mb-12">
                    {/* 브랜드 */}
                    <div>
                        <div className="text-xl mb-4 tracking-wider font-serif">VOX</div>
                        <p className="text-sm text-gray-600">Find Your Voice, Define Your Style.</p>
                        <p className="text-xs text-gray-500 mt-2">데이터 지능형 패션 큐레이션 플랫폼</p>
                    </div>

                    {/* 서비스 */}
                    <div>
                        <h4 className="text-xs tracking-widest mb-4 font-medium">서비스</h4>
                        <div className="space-y-2 text-sm text-gray-600">
                            <div className="cursor-pointer hover:opacity-60 transition-opacity">스타일 진단</div>
                            <div className="cursor-pointer hover:opacity-60 transition-opacity">트렌드 아카이브</div>
                            <div className="cursor-pointer hover:opacity-60 transition-opacity">뉴스레터 구독</div>
                            <div className="cursor-pointer hover:opacity-60 transition-opacity">프리미엄 멤버십</div>
                        </div>
                    </div>

                    {/* 연결 */}
                    <div>
                        <h4 className="text-xs tracking-widest mb-4 font-medium">연결</h4>
                        <div className="space-y-2 text-sm text-gray-600">
                            <a href="#" className="block hover:opacity-60 transition-opacity">Instagram</a>
                            <a href="#" className="block hover:opacity-60 transition-opacity">Newsletter</a>
                            <a href="#" className="block hover:opacity-60 transition-opacity">Contact</a>
                            <a href="#" className="block hover:opacity-60 transition-opacity">Partnership</a>
                        </div>
                    </div>

                    {/* 법적 고지 */}
                    <div>
                        <h4 className="text-xs tracking-widest mb-4 font-medium">법적 고지</h4>
                        <div className="space-y-2 text-sm text-gray-600">
                            <Link href="#" className="block hover:opacity-60 transition-opacity">이용약관</Link>
                            <Link href="#" className="block hover:opacity-60 transition-opacity">개인정보처리방침</Link>
                            <Link href="#" className="block hover:opacity-60 transition-opacity">구독 관리</Link>
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