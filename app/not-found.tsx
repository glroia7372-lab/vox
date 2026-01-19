'use client';

import { useApp } from '@/context/AppContext';
import { ArrowLeft, Search } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function NotFound() {
    const { showDarkMode } = useApp();
    const router = useRouter();

    return (
        <div className={`min-h-screen flex items-center justify-center p-6 ${showDarkMode ? 'bg-black text-white' : 'bg-white text-black'}`}>
            <div className="max-w-4xl w-full text-center space-y-12">
                {/* 404 Graphic */}
                <div className="relative inline-block">
                    <h1 className="text-[15rem] md:text-[25rem] font-serif font-black leading-none opacity-5 tracking-tighter select-none">
                        404
                    </h1>
                    <div className="absolute inset-0 flex items-center justify-center">
                        <div className="space-y-4">
                            <h2 className="text-4xl md:text-6xl font-serif italic tracking-tight">Lost in Voice.</h2>
                            <p className="text-gray-500 font-light tracking-widest uppercase text-sm">The style you are looking for has departed.</p>
                        </div>
                    </div>
                </div>

                {/* Content */}
                <div className="space-y-8 relative z-10">
                    <div className="flex flex-col md:flex-row gap-4 items-center justify-center pt-8">
                        <button
                            onClick={() => router.back()}
                            className={`flex items-center gap-3 px-10 py-5 rounded-full border transition-all hover:scale-105 ${showDarkMode ? 'border-white/10 hover:bg-white/5' : 'border-black/5 hover:bg-black/5'}`}
                        >
                            <ArrowLeft className="w-5 h-5" />
                            <span className="text-sm font-bold tracking-widest uppercase">Go Back</span>
                        </button>

                        <Link
                            href="/"
                            className="flex items-center gap-3 px-10 py-5 rounded-full bg-vox-red text-white transition-all hover:scale-105 hover:bg-black"
                        >
                            <span className="text-sm font-bold tracking-widest uppercase">Return Home</span>
                        </Link>
                    </div>

                    <div className="pt-12">
                        <p className={`text-xs opacity-40 uppercase tracking-[0.5em] font-black ${showDarkMode ? 'text-white' : 'text-black'}`}>
                            VOX Digital Intelligence Tracking — System Error 404
                        </p>
                    </div>
                </div>

                {/* Background Decoration */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full pointer-events-none opacity-[0.03] overflow-hidden">
                    <div className="grid grid-cols-4 gap-4 rotate-12 scale-150">
                        {Array.from({ length: 12 }).map((_, i) => (
                            <div key={i} className="aspect-[3/4] bg-current rounded-xl" />
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
