'use client';

import { useApp } from '@/context/AppContext';
import { categoryContents } from '@/lib/data';
import { useParams } from 'next/navigation';
import Link from 'next/link';

export default function CategoryPage() {
    const { showDarkMode } = useApp();
    const params = useParams();
    const category = params.category as string;

    // Normalize category to match data keys
    const content = categoryContents[category as keyof typeof categoryContents];

    if (!content) {
        return (
            <div className={`pt-32 px-6 pb-20 min-h-screen text-center flex flex-col items-center justify-center ${showDarkMode ? 'bg-black text-white' : 'bg-white text-black'}`}>
                <h1 className="text-4xl font-serif mb-4">Page Not Found</h1>
                <p className="mb-8 text-gray-500">요청하신 페이지를 찾을 수 없습니다.</p>
                <Link href="/" className="px-6 py-3 bg-vox-red text-white rounded hover:opacity-90 transition-opacity">
                    홈으로 돌아가기
                </Link>
            </div>
        );
    }

    return (
        <div className={`pt-24 px-6 pb-20 min-h-screen ${showDarkMode ? 'bg-black text-white' : 'bg-white text-black'}`}>
            <div className="max-w-7xl mx-auto">
                <header className="mb-16 md:mb-24 text-center">
                    <h1 className="text-5xl md:text-8xl font-serif font-black tracking-tighter uppercase mb-6">
                        {category}
                    </h1>
                    <div className={`w-24 h-1 mx-auto ${showDarkMode ? 'bg-white' : 'bg-black'}`}></div>
                </header>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-16">
                    {content.map((item) => (
                        <article key={item.id} className="group cursor-pointer flex flex-col">
                            <div className="aspect-[3/4] overflow-hidden mb-6 bg-gray-200 relative">
                                <img
                                    src={item.image}
                                    alt={item.title}
                                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                                />
                                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300" />
                            </div>
                            <div className="space-y-3 mt-auto">
                                <div className={`text-xs font-bold tracking-widest uppercase ${showDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                                    {item.date} — {item.author}
                                </div>
                                <h3 className="text-2xl font-serif leading-tight group-hover:text-vox-red transition-colors">
                                    {item.title}
                                </h3>
                                <p className={`text-sm leading-relaxed ${showDarkMode ? 'text-gray-400' : 'text-gray-600'} line-clamp-2`}>
                                    {item.description}
                                </p>
                            </div>
                        </article>
                    ))}
                </div>
            </div>
        </div>
    );
}
