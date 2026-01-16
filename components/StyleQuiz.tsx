'use client';

import { useState } from 'react';
import { X } from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { styleQuiz } from '@/lib/data';

export default function StyleQuiz() {
    const { setUserProfile, setShowStyleQuiz, setShowSubscribeModal } = useApp();
    const [quizStep, setQuizStep] = useState(0);
    const [answers, setAnswers] = useState<Record<number, any>>({});

    const handleAnswer = (answer: any) => {
        const newAnswers = { ...answers, [quizStep]: answer };
        setAnswers(newAnswers);

        if (quizStep < styleQuiz.length - 1) {
            setQuizStep(quizStep + 1);
        } else {
            // 퀴즈 완료 - 프로필 생성
            const profile = {
                style: newAnswers[0]?.style || 'Fashion Lover',
                budget: newAnswers[1]?.budget || 'mid',
                time: newAnswers[2]?.time || 'evening',
                preferences: ['Sustainable', 'Minimalism', 'Quality'],
                completedAt: new Date().toISOString()
            };

            setUserProfile(profile);
            setShowStyleQuiz(false);
            setShowSubscribeModal(true);
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center p-4">
            <div className="bg-white text-gray-900 max-w-3xl w-full rounded-lg p-8 max-h-[90vh] overflow-y-auto">
                {/* 헤더 */}
                <div className="flex items-center justify-between mb-6">
                    <div>
                        <h2 className="text-3xl font-serif mb-2">Style Voice 진단</h2>
                        <p className="text-gray-600">3분이면 당신의 패션 DNA를 찾을 수 있습니다</p>
                    </div>
                    <button
                        onClick={() => setShowStyleQuiz(false)}
                        className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                    >
                        <X className="w-6 h-6" />
                    </button>
                </div>

                {/* 진행바 */}
                <div className="mb-8">
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-sm text-gray-600">
                            Question {quizStep + 1} of {styleQuiz.length}
                        </span>
                        <span className="text-sm font-medium text-vox-red">
                            {Math.round(((quizStep + 1) / styleQuiz.length) * 100)}%
                        </span>
                    </div>
                    <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div
                            className="h-full transition-all duration-300 rounded-full bg-vox-red"
                            style={{ width: `${((quizStep + 1) / styleQuiz.length) * 100}%` }}
                        />
                    </div>
                </div>

                {/* 질문 */}
                <div className="mb-8">
                    <h3 className="text-2xl mb-6 font-serif">
                        {styleQuiz[quizStep].question}
                    </h3>

                    <div className="grid md:grid-cols-2 gap-4">
                        {styleQuiz[quizStep].options.map((option, idx) => (
                            <button
                                key={idx}
                                onClick={() => handleAnswer(option)}
                                className="relative group overflow-hidden rounded-lg border-2 border-gray-200 hover:border-gray-900 transition-all text-left"
                            >
                                {option.image && (
                                    <div className="h-48 overflow-hidden">
                                        <img
                                            src={option.image}
                                            alt={option.text}
                                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                        />
                                    </div>
                                )}
                                <div className="p-4">
                                    <p className="font-medium">{option.text}</p>
                                    {option.style && (
                                        <span className="text-xs text-gray-500 mt-1 block">
                                            {option.style}
                                        </span>
                                    )}
                                </div>
                            </button>
                        ))}
                    </div>
                </div>

                {/* 뒤로가기 버튼 */}
                {quizStep > 0 && (
                    <button
                        onClick={() => setQuizStep(quizStep - 1)}
                        className="text-sm text-gray-600 hover:text-gray-900 transition-colors"
                    >
                        ← 이전 질문
                    </button>
                )}
            </div>
        </div>
    );
}