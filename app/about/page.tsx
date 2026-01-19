'use client';

import { useApp } from '@/context/AppContext';
import { Sparkles, Target, Zap, Globe, Users, Heart } from 'lucide-react';
import Link from 'next/link';

export default function AboutPage() {
    const { showDarkMode, setShowStyleQuiz } = useApp();

    return (
        <div className={`pt-24 min-h-screen ${showDarkMode ? 'bg-black text-white' : 'bg-white text-black'} transition-colors duration-500`}>
            {/* Hero Section */}
            <section className="relative h-[80vh] flex items-center justify-center overflow-hidden">
                <div className="absolute inset-0 z-0">
                    <img
                        src="https://images.unsplash.com/photo-1441998856307-57b6299b643a?w=1600&q=80"
                        alt="Fashion Editorial"
                        className="w-full h-full object-cover opacity-60"
                    />
                    <div className={`absolute inset-0 ${showDarkMode ? 'bg-gradient-to-b from-black/70 via-black/40 to-black' : 'bg-gradient-to-b from-white/70 via-white/40 to-white'}`}></div>
                </div>

                <div className="relative z-10 text-center px-6 max-w-5xl mx-auto">
                    <span className="text-vox-red tracking-[0.3em] font-bold text-sm mb-6 block animate-fadeIn">ESTABLISHED 2026</span>
                    <h1 className="text-6xl md:text-9xl font-serif mb-8 tracking-tighter leading-tight animate-slideUp">
                        Find Your Voice, <br />
                        <span className="italic">Define Your Style.</span>
                    </h1>
                    <p className="text-xl md:text-2xl opacity-80 max-w-2xl mx-auto leading-relaxed font-light">
                        VOX는 정보의 홍수 속에서 길을 잃은 현대인을 위한 초개인화 데이터 지능형 패션 큐레이션 플랫폼입니다.
                    </p>
                </div>
            </section>

            {/* Mission Section */}
            <section className="py-32 px-6">
                <div className="max-w-7xl mx-auto">
                    <div className="grid lg:grid-cols-2 gap-20 items-center">
                        <div className="space-y-8">
                            <h2 className="text-4xl md:text-5xl font-serif leading-tight">
                                미학적 감수성과 <br />
                                기술의 완벽한 결합
                            </h2>
                            <p className="text-lg opacity-70 leading-relaxed font-light">
                                우리는 단순히 옷을 추천하지 않습니다. 당신의 취향, 라이프스타일, 그리고 가치관이 담긴 '스타일 DNA'를 분석합니다.
                                VOX의 독자적인 데이터 엔진은 전 세계 패션 트렌드를 실시간으로 수집하고, 당신에게 가장 의미 있는 정보만을 정교하게 다듬어 전달합니다.
                            </p>
                            <div className="grid grid-cols-2 gap-8 pt-8">
                                <div className="space-y-3">
                                    <div className="text-3xl font-serif text-vox-red">12,000+</div>
                                    <div className="text-xs tracking-widest opacity-60 uppercase font-bold">Daily Trends Tracked</div>
                                </div>
                                <div className="space-y-3">
                                    <div className="text-3xl font-serif text-vox-red">3 min</div>
                                    <div className="text-xs tracking-widest opacity-60 uppercase font-bold">Fast Curation</div>
                                </div>
                            </div>
                        </div>
                        <div className="relative group">
                            <div className="absolute -inset-4 bg-vox-red/10 rounded-xl blur-2xl group-hover:bg-vox-red/20 transition-all"></div>
                            <img
                                src="https://images.unsplash.com/photo-1549439602-43ebca2327af?w=1200&q=80"
                                alt="Style Analysis"
                                className="relative rounded-2xl shadow-2xl grayscale group-hover:grayscale-0 transition-all duration-700"
                            />
                        </div>
                    </div>
                </div>
            </section>

            {/* Values Section */}
            <section className={`py-32 ${showDarkMode ? 'bg-zinc-900/50' : 'bg-gray-50'}`}>
                <div className="max-w-7xl mx-auto px-6">
                    <div className="text-center mb-20 space-y-4">
                        <h2 className="text-4xl font-serif italic text-vox-red">Inside VOX</h2>
                        <h3 className="text-3xl md:text-5xl font-serif">우리가 지향하는 핵심 가치</h3>
                    </div>

                    <div className="grid md:grid-cols-3 gap-12">
                        {[
                            {
                                icon: <Sparkles className="w-10 h-10" />,
                                title: "Intelligence",
                                desc: "무분별한 데이터가 아닌, 당신의 스타일 DNA에 최적화된 지능형 큐레이션을 제공합니다."
                            },
                            {
                                icon: <Target className="w-10 h-10" />,
                                title: "Precision",
                                desc: "단순한 유행이 아닌, 당신의 체형, 예산, 선호도를 고려한 정밀한 분석을 약속합니다."
                            },
                            {
                                icon: <Zap className="w-10 h-10" />,
                                title: "Efficiency",
                                desc: "바쁜 당신의 시간을 존중합니다. 단 3분의 리딩만으로 한 주간의 트렌드를 마스터하세요."
                            },
                            {
                                icon: <Globe className="w-10 h-10" />,
                                title: "Global Vision",
                                desc: "서울부터 파리까지, 전 세계 패션위크와 스트릿 트렌드를 로컬의 시각으로 재해석합니다."
                            },
                            {
                                icon: <Users className="w-10 h-10" />,
                                title: "Community",
                                desc: "같은 취향을 공유하는 이들의 목소리를 담아, 함께 성장하는 패션 에코시스템을 구축합니다."
                            },
                            {
                                icon: <Heart className="w-10 h-10" />,
                                title: "Originality",
                                desc: "모든 사람은 저마다의 목소리가 있습니다. 당신만의 독창적인 스타일을 찾는 여정을 돕습니다."
                            }
                        ].map((item, idx) => (
                            <div key={idx} className={`p-8 rounded-2xl border transition-all hover:-translate-y-2 ${showDarkMode ? 'bg-black border-white/10' : 'bg-white border-black/5 shadow-sm'}`}>
                                <div className="text-vox-red mb-6">{item.icon}</div>
                                <h4 className="text-2xl font-serif mb-4 italic">{item.title}</h4>
                                <p className="opacity-60 leading-relaxed font-light">{item.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Brand Story */}
            <section className="py-32 px-6 overflow-hidden">
                <div className="max-w-7xl mx-auto">
                    <div className="flex flex-col md:flex-row gap-20 items-center">
                        <div className="md:w-1/2 order-2 md:order-1">
                            <img
                                src="https://images.unsplash.com/photo-1512436991641-6745cdb1723f?w=1000&q=80"
                                alt="Brand Story"
                                className="rounded-lg shadow-2xl"
                            />
                        </div>
                        <div className="md:w-1/2 space-y-8 order-1 md:order-2">
                            <h2 className="text-4xl md:text-5xl font-serif">A Voice for Everyone</h2>
                            <p className="text-lg opacity-70 leading-relaxed font-light">
                                'VOX'는 라틴어로 '목소리'를 의미합니다. <br /><br />
                                과거의 패션이 소수의 권위적인 편집자들에 의해 정의되었다면, 오늘날의 패션은 수만 가지의 다채로운 목소리로 이루어집니다.
                                우리는 그 수많은 목소리 중에서 당신에게 가장 어울리는 진실한 목소리를 찾아내어, 당신이 자신있게 당신의 스타일을 정의할 수 있도록 돕고자 합니다.
                            </p>
                            <div className="pt-8 block">
                                <button
                                    onClick={() => setShowStyleQuiz(true)}
                                    className="px-10 py-5 bg-vox-red text-white text-sm font-bold tracking-[0.2em] rounded-full hover:bg-black transition-all hover:scale-105"
                                >
                                    GET STARTED WITH DNA TEST
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Footer-like Spacer */}
            <section className={`py-40 text-center ${showDarkMode ? 'bg-black' : 'bg-white'}`}>
                <h2 className="text-6xl md:text-9xl font-serif opacity-10 tracking-widest select-none">VOX MAGAZINE</h2>
            </section>
        </div>
    );
}
