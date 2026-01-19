'use client';

import { useState } from 'react';
import { X } from 'lucide-react';
import { useApp, UserProfile } from '@/context/AppContext';
import { styleQuiz } from '@/lib/data';

export default function StyleQuiz() {
    const { isSubscriber, setIsSubscriber, setUserProfile, setShowStyleQuiz, setShowSubscribeModal, showDarkMode } = useApp();
    const [quizStep, setQuizStep] = useState(0);
    const [answers, setAnswers] = useState<Record<number, any>>({});

    const handleAnswer = (answer: any) => {
        const newAnswers = { ...answers, [quizStep]: answer };
        setAnswers(newAnswers);

        if (quizStep < styleQuiz.length - 1) {
            setQuizStep(quizStep + 1);
        } else {
            // 퀴즈 완료 - 프로필 생성
            // The UserProfile interface definition was incorrectly placed in the provided edit snippet.
            // It should be defined externally (e.g., in AppContext.tsx or a types file).
            // We are keeping the usage of UserProfile type here as it was, assuming its definition
            // is updated elsewhere as per the instruction.
            const profile: UserProfile = {
                style: newAnswers[0]?.text || 'Fashion Lover',
                context: newAnswers[1]?.text || 'Lifestyle',
                priority: newAnswers[2]?.text || 'Quality',
                budget: '',
                time: '',
                preferences: [newAnswers[0]?.style, newAnswers[1]?.text, newAnswers[2]?.text],
                completedAt: new Date().toISOString()
            };

            setUserProfile(profile);
            setIsSubscriber(true);
            setShowStyleQuiz(false);
            setShowSubscribeModal(true);
        }
    };

    return (
        <div className="fixed inset-0 bg-black/95 backdrop-blur-3xl z-[100] flex items-center justify-center p-6 animate-fadeIn">
            <div className={`relative w-full max-w-6xl p-8 md:p-16 rounded-[3rem] shadow-2xl border flex flex-col max-h-[90vh] overflow-hidden ${showDarkMode ? 'bg-black border-white/10' : 'bg-white border-black/5'}`}>

                {/* Close Button */}
                <button
                    onClick={() => setShowStyleQuiz(false)}
                    className="absolute top-8 right-8 p-3 hover:bg-vox-red/10 rounded-full transition-all group z-10"
                >
                    <X className={`w-8 h-8 group-hover:rotate-90 transition-transform ${showDarkMode ? 'text-white' : 'text-black'}`} />
                </button>

                {/* Progress Bar */}
                <div className="mb-12 relative z-10">
                    <div className="flex items-center justify-between mb-4">
                        <span className="text-[10px] font-black tracking-[0.4em] text-gray-400 uppercase">
                            Step {quizStep + 1} of {styleQuiz.length}
                        </span>
                        <div className="text-right">
                            <h2 className="text-2xl font-serif italic text-vox-red">Style DNA Scan</h2>
                        </div>
                    </div>
                    <div className={`w-full h-1 ${showDarkMode ? 'bg-white/5' : 'bg-gray-100'} rounded-full overflow-hidden`}>
                        <div
                            className="h-full transition-all duration-1000 ease-out bg-vox-red shadow-[0_0_15px_rgba(255,0,0,0.6)]"
                            style={{ width: `${((quizStep + 1) / styleQuiz.length) * 100}%` }}
                        />
                    </div>
                </div>

                {/* Question */}
                <div className="flex-1 overflow-y-auto mb-8 px-2 custom-scrollbar relative z-10">
                    <h3 className={`text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-serif mb-8 md:mb-12 leading-[1.1] tracking-tighter ${showDarkMode ? 'text-white' : 'text-black'}`}>
                        {styleQuiz[quizStep].question}
                    </h3>

                    <div className={`grid ${(styleQuiz[quizStep].options[0] as any).image ? 'md:grid-cols-2 lg:grid-cols-4' : 'md:grid-cols-2'} gap-6`}>
                        {styleQuiz[quizStep].options.map((option: any, idx) => (
                            <button
                                key={idx}
                                onClick={() => handleAnswer(option)}
                                className={`relative group overflow-hidden rounded-3xl border-2 transition-all duration-500 text-left flex flex-col h-full ${showDarkMode
                                    ? 'border-white/5 hover:border-vox-red bg-white/5'
                                    : 'border-black/5 hover:border-vox-red bg-gray-50'
                                    } hover:-translate-y-2 shadow-xl hover:shadow-vox-red/10`}
                            >
                                {option.image && (
                                    <div className="h-64 sm:h-80 overflow-hidden relative">
                                        <img
                                            src={option.image}
                                            alt={option.text}
                                            onError={(e) => {
                                                (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=800';
                                            }}
                                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000 grayscale group-hover:grayscale-0 opacity-70 group-hover:opacity-100"
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-60 group-hover:opacity-20 transition-opacity" />
                                    </div>
                                )}
                                <div className="p-8 flex flex-col flex-1 justify-between">
                                    <div>
                                        <p className={`text-xl font-bold mb-3 uppercase tracking-tight ${showDarkMode ? 'text-white' : 'text-black'}`}>{option.text}</p>
                                        {option.style && (
                                            <p className="text-[10px] font-black tracking-widest text-vox-red uppercase mb-4 opacity-80">
                                                {option.style}
                                            </p>
                                        )}
                                        {option.detail && (
                                            <p className="text-sm opacity-60 leading-relaxed font-light mb-4 italic">
                                                {option.detail}
                                            </p>
                                        )}
                                    </div>
                                    <div className="flex justify-end">
                                        <div className="w-8 h-8 rounded-full border border-gray-400 flex items-center justify-center group-hover:bg-vox-red group-hover:border-vox-red transition-all group-hover:scale-110">
                                            <div className="w-2 h-2 bg-gray-400 group-hover:bg-white rounded-full" />
                                        </div>
                                    </div>
                                </div>
                            </button>
                        ))}
                    </div>
                </div>

                {/* Footer Insight */}
                {quizStep > 0 && (
                    <button
                        onClick={() => setQuizStep(quizStep - 1)}
                        className="self-start text-[10px] font-black tracking-[0.3em] text-gray-500 hover:text-vox-red transition-all uppercase mb-4"
                    >
                        ← RETRACE INSIGHT
                    </button>
                )}
                <div className="mt-auto opacity-20 text-[8px] font-black tracking-[0.5em] text-center uppercase">
                    VOX BIOMETRIC STYLE ANALYSIS ENGINE V2.0
                </div>
            </div>
        </div>
    );
}