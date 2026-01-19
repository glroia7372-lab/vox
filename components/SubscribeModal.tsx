'use client';

import { Sparkles } from 'lucide-react';
import { useApp } from '@/context/AppContext';

export default function SubscribeModal() {
    const { userProfile, setShowSubscribeModal, showDarkMode } = useApp();

    // 스티비 구독 URL에 스타일 정보를 파라미터로 추가
    const stibeeUrl = `https://page.stibee.com/subscriptions/466654?style=${encodeURIComponent(userProfile?.style || '')}`;

    return (
        <div className="fixed inset-0 bg-black/95 backdrop-blur-2xl z-[100] flex items-center justify-center p-6">
            <div className={`relative w-full max-w-xl p-12 md:p-16 rounded-[4rem] shadow-2xl animate-scaleIn border ${showDarkMode ? 'bg-black border-gray-800 text-white' : 'bg-white border-gray-100 text-black'}`}>
                {/* Header */}
                <div className="text-center mb-12">
                    <div className="w-24 h-24 mx-auto mb-8 rounded-full flex items-center justify-center bg-vox-red shadow-[0_0_50px_rgba(255,0,0,0.3)]">
                        <Sparkles className="w-12 h-12 text-white animate-pulse" />
                    </div>
                    <h2 className="text-5xl font-serif font-black tracking-tighter uppercase mb-4">Diagnosis Complete</h2>
                    <p className={`${showDarkMode ? 'text-gray-400' : 'text-gray-600'} text-xs font-black tracking-[0.3em] uppercase`}>
                        Your DNA: <span className="text-vox-red">{userProfile?.style}</span>
                    </p>
                </div>

                {/* Benefits Case */}
                <div className={`${showDarkMode ? 'bg-white/5' : 'bg-gray-50'} p-8 rounded-[2rem] mb-10 border ${showDarkMode ? 'border-white/10' : 'border-gray-100'}`}>
                    <p className="text-[10px] font-black tracking-widest uppercase text-vox-red mb-6 text-center">Subscriber Privileges</p>
                    <ul className="space-y-4 text-sm font-medium">
                        <li className="flex items-center gap-3">
                            <div className="w-1.5 h-1.5 bg-vox-red rounded-full" />
                            <span>{userProfile?.style} Weekly Curation</span>
                        </li>
                        <li className="flex items-center gap-3">
                            <div className="w-1.5 h-1.5 bg-vox-red rounded-full" />
                            <span>Runway Intelligence Reports</span>
                        </li>
                        <li className="flex items-center gap-3">
                            <div className="w-1.5 h-1.5 bg-vox-red rounded-full" />
                            <span>Exclusive Editorial Archives</span>
                        </li>
                    </ul>
                </div>

                {/* Action */}
                <a
                    href={stibeeUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block w-full py-6 text-center text-white text-[10px] font-black tracking-[0.4em] uppercase rounded-full bg-vox-red hover:bg-black transition-all shadow-xl hover:-translate-y-1"
                >
                    Unlock full experience
                </a>

                {/* Terms */}
                <p className="text-[9px] font-bold text-gray-500 text-center mt-8 uppercase tracking-widest opacity-60">
                    By joining, you agree to our <a href="#" className="underline">Terms</a> & <a href="#" className="underline">Privacy</a>
                </p>

                {/* Secondary */}
                <button
                    onClick={() => setShowSubscribeModal(false)}
                    className="w-full mt-6 text-[10px] font-black tracking-[0.3em] text-gray-400 hover:text-vox-red transition-colors uppercase"
                >
                    Explore Dashboard First
                </button>
            </div>
        </div>
    );
}