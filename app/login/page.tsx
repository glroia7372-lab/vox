'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Mail, Lock, ArrowRight, Loader2 } from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { supabase } from '@/lib/supabase';


export default function LoginPage() {
    const router = useRouter();
    const { setIsSubscriber, setUserProfile } = useApp();
    const [isLoading, setIsLoading] = useState(false);
    const [formData, setFormData] = useState({ email: '', password: '' });

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        // 시뮬레이션: 실제 로그인 로직으로 대체 가능
        setTimeout(() => {
            setIsSubscriber(true);
            // 더미 프로필 설정
            setUserProfile({
                style: 'Minimalist',
                context: 'Daily',
                priority: 'Quality',
                budget: 'mid',
                time: 'evening',
                preferences: ['Modern', 'Chic'],
                completedAt: new Date().toISOString()
            });
            setIsLoading(false);
            router.push('/dashboard');
        }, 1500);
    };

    const handleKakaoLogin = async () => {
        setIsLoading(true);
        const { error } = await supabase.auth.signInWithOAuth({
            provider: 'kakao',
            options: {
                redirectTo: `${window.location.origin}/auth/callback`,
                queryParams: {
                    scope: 'profile_nickname'
                }
            },
        });

        if (error) {
            console.error('Error logging in with Kakao:', error.message);
            setIsLoading(false);
        }
    };

    const handleNaverLogin = () => {
        const clientId = process.env.NEXT_PUBLIC_NAVER_CLIENT_ID;
        const redirectUri = encodeURIComponent(`${window.location.origin}/auth/callback`);
        const state = Math.random().toString(36).substring(7);

        // Save state to verify later if needed
        localStorage.setItem('naver_auth_state', state);

        const naverAuthUrl = `https://nid.naver.com/oauth2.0/authorize?response_type=code&client_id=${clientId}&redirect_uri=${redirectUri}&state=${state}`;

        window.location.href = naverAuthUrl;
    };





    return (
        <div className="min-h-screen flex bg-white">
            {/* Left: Editorial Image (Hidden on Mobile) */}
            <div className="hidden lg:block w-1/2 relative overflow-hidden bg-black">
                <motion.div
                    initial={{ scale: 1.1, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 1.5, ease: "easeOut" }}
                    className="absolute inset-0"
                >
                    <img
                        src="https://images.unsplash.com/photo-1509631179647-0177331693ae?q=80&w=1920&auto=format&fit=crop"
                        alt="Fashion Editorial"
                        className="w-full h-full object-cover opacity-80"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                </motion.div>

                <div className="absolute bottom-20 left-12 text-white p-8">
                    <p className="text-vox-red tracking-[0.3em] text-xs font-bold mb-4 uppercase">
                        Member Access
                    </p>
                    <h2 className="text-6xl font-serif italic font-black leading-tight mb-6">
                        Unlock<br />The Archive.
                    </h2>
                    <p className="text-gray-300 font-light max-w-md leading-relaxed">
                        VOX 멤버십 회원을 위한 프리미엄 아카이브와 <br />
                        데이터 기반의 스타일 리포트를 확인하세요.
                    </p>
                </div>
            </div>

            {/* Right: Login Form */}
            <div className="w-full lg:w-1/2 flex items-center justify-center p-8 lg:p-24 relative">
                <div className="w-full max-w-md space-y-12">
                    {/* Header */}
                    <div className="text-center lg:text-left">
                        <Link href="/" className="inline-block text-3xl font-black italic tracking-tighter mb-12 hover:opacity-70 transition-opacity font-serif">
                            VOX
                        </Link>
                        <h1 className="text-4xl lg:text-5xl font-serif mb-4">Welcome Back</h1>
                        <p className="text-gray-500">
                            계정이 없으신가요?{' '}
                            <button onClick={() => router.push('/')} className="text-vox-red font-medium underline underline-offset-4 hover:text-black transition-colors">
                                스타일 진단하고 가입하기
                            </button>
                        </p>
                    </div>

                    {/* Form */}
                    <form onSubmit={handleLogin} className="space-y-6">
                        <div className="space-y-2">
                            <label className="text-xs font-bold tracking-widest uppercase text-gray-500">Email Address</label>
                            <div className="relative group">
                                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-vox-red transition-colors" />
                                <input
                                    type="email"
                                    required
                                    className="w-full bg-gray-50 border-b-2 border-gray-200 px-12 py-4 outline-none focus:border-vox-red focus:bg-white transition-all placeholder:text-gray-300"
                                    placeholder="name@example.com"
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-xs font-bold tracking-widest uppercase text-gray-500">Password</label>
                            <div className="relative group">
                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-vox-red transition-colors" />
                                <input
                                    type="password"
                                    required
                                    className="w-full bg-gray-50 border-b-2 border-gray-200 px-12 py-4 outline-none focus:border-vox-red focus:bg-white transition-all placeholder:text-gray-300"
                                    placeholder="••••••••"
                                    value={formData.password}
                                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                />
                            </div>
                        </div>

                        <div className="flex items-center justify-between text-sm">
                            <label className="flex items-center gap-2 cursor-pointer group">
                                <input type="checkbox" className="w-4 h-4 border-gray-300 rounded text-vox-red focus:ring-vox-red" />
                                <span className="text-gray-500 group-hover:text-black transition-colors">로그인 상태 유지</span>
                            </label>
                            <a href="#" className="text-gray-400 hover:text-vox-red transition-colors underline underline-offset-4">
                                비밀번호 찾기
                            </a>
                        </div>

                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full bg-black text-white h-16 flex items-center justify-between px-8 hover:bg-vox-red transition-all duration-300 group disabled:opacity-70 disabled:cursor-not-allowed"
                        >
                            <span className="font-bold tracking-[0.2em] font-serif uppercase">
                                {isLoading ? 'Authenticating...' : 'Sign In'}
                            </span>
                            {isLoading ? (
                                <Loader2 className="w-6 h-6 animate-spin" />
                            ) : (
                                <ArrowRight className="w-6 h-6 group-hover:translate-x-2 transition-transform" />
                            )}
                        </button>
                    </form>

                    {/* Social Login */}
                    <div className="pt-8 border-t border-gray-100">
                        <p className="text-center text-xs text-gray-400 mb-6 uppercase tracking-widest">Or continue with</p>
                        <div className="grid grid-cols-2 gap-4">
                            <button
                                onClick={handleNaverLogin}
                                disabled={isLoading}
                                className="flex items-center justify-center gap-3 py-3 border border-gray-200 hover:border-black transition-colors bg-[#03C75A] text-white border-none"
                            >
                                <span className="font-serif">Naver</span>
                            </button>
                            <button
                                onClick={handleKakaoLogin}
                                disabled={isLoading}
                                className="flex items-center justify-center gap-3 py-3 border border-gray-200 hover:border-black transition-colors bg-[#FEE500] text-black border-none"
                            >
                                <span className="font-serif">Kakao</span>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
