'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Menu, Search, X, ChevronDown, User } from 'lucide-react';
import { useApp } from '@/context/AppContext';

export default function Navigation() {
    const pathname = usePathname();
    const router = useRouter();
    const { isSubscriber, setIsSubscriber, setUserProfile, showDarkMode, setShowDarkMode, setShowStyleQuiz } = useApp();
    const [menuOpen, setMenuOpen] = useState(false);
    const [isSearchOpen, setIsSearchOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            console.log('Searching for:', searchQuery);
            setIsSearchOpen(false);
            setSearchQuery('');
        }
    };

    const handleLogout = () => {
        setIsSubscriber(false);
        setUserProfile(null);
        router.push('/');
    };

    return (
        <nav className={`fixed top-0 w-full ${showDarkMode ? 'bg-black text-white border-gray-800' : 'bg-white text-black border-gray-200'} border-b z-40 transition-colors`}>
            {/* Search Overlay */}
            {isSearchOpen && (
                <div className="absolute top-0 left-0 w-full h-screen bg-white/95 z-50 flex flex-col pt-32 px-6 animate-fadeIn text-black">
                    <button
                        onClick={() => setIsSearchOpen(false)}
                        className="absolute top-8 right-8 p-2"
                    >
                        <X className="w-8 h-8" />
                    </button>
                    <form onSubmit={handleSearch} className="w-full max-w-4xl mx-auto border-b-2 border-black pb-4 flex items-center gap-4">
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="SEARCH"
                            className="flex-1 bg-transparent text-4xl font-black font-serif outline-none placeholder-gray-300 uppercase"
                            autoFocus
                        />
                        <button type="submit">
                            <Search className="w-8 h-8" />
                        </button>
                    </form>
                </div>
            )}

            {/* Main Nav Bar */}
            <div className="max-w-[1920px] mx-auto px-6 lg:px-12 h-20 md:h-24 flex items-center justify-between">
                {/* Left: Logo */}
                <Link href="/" className="z-50 shrink-0">
                    <span className={`text-3xl md:text-5xl font-serif tracking-tighter hover:opacity-70 transition-opacity ${showDarkMode ? 'text-white' : 'text-black'}`}>
                        VOX
                    </span>
                </Link>

                {/* Center: Categories (Desktop Only) */}
                <div className="hidden lg:flex items-center gap-8 xl:gap-12 text-[11px] font-bold tracking-[0.15em]">
                    {['FASHION', 'BEAUTY', 'CULTURE', 'RUNWAY', 'VIDEO'].map((item) => (
                        <Link
                            key={item}
                            href={`/${item.toLowerCase()}`}
                            className="hover:text-vox-red transition-colors"
                        >
                            {item}
                        </Link>
                    ))}
                </div>

                {/* Right: Actions */}
                <div className="flex items-center gap-4 lg:gap-8">
                    {/* Region Selector */}


                    {/* Subscribe / My Vox Button */}
                    <button
                        onClick={() => isSubscriber ? router.push('/dashboard') : setShowStyleQuiz(true)}
                        className={`hidden lg:block px-6 py-2.5 text-[10px] font-bold tracking-widest text-white transition-all ${isSubscriber
                            ? 'bg-vox-red hover:bg-black'
                            : 'bg-black hover:bg-vox-red'
                            }`}
                    >
                        {isSubscriber ? 'MY VOX' : 'SUBSCRIBE'}
                    </button>

                    {/* Hamburger / Mobile Toggle */}
                    <div className="flex items-center gap-4 lg:gap-8">
                        {/* Search Icon (Visible) */}
                        <button onClick={() => setIsSearchOpen(true)} className="hover:opacity-60">
                            <Search className="w-5 h-5 md:w-6 md:h-6" />
                        </button>

                        {/* User Icon */}
                        <button onClick={() => isSubscriber ? router.push('/dashboard') : router.push('/login')} className="hover:opacity-60">
                            <User className="w-5 h-5 md:w-6 md:h-6" />
                        </button>

                        <button
                            onClick={() => setMenuOpen(true)}
                            className="group p-1"
                        >
                            <Menu className="w-6 h-6 md:w-8 md:h-8 stroke-[1.5]" />
                        </button>
                    </div>
                </div>
            </div>

            {/* Slide-out Menu (Right Side Drawer) */}
            {menuOpen && (
                <>
                    <div className="fixed inset-0 bg-black/50 z-50" onClick={() => setMenuOpen(false)} />
                    <div className={`fixed top-0 right-0 h-full w-[100%] md:w-[400px] max-w-full ${showDarkMode ? 'bg-black text-white' : 'bg-white text-black'} z-50 p-8 md:p-12 flex flex-col shadow-2xl transition-transform duration-300 animate-slideLeft`}>
                        <div className="flex justify-between items-center mb-16">
                            <span className="text-2xl font-serif">MENU</span>
                            <button onClick={() => setMenuOpen(false)}>
                                <X className="w-8 h-8" />
                            </button>
                        </div>

                        {/* Menu Links */}
                        <div className="flex flex-col gap-6 text-2xl font-serif italic mb-12">
                            <Link href="/" onClick={() => setMenuOpen(false)} className="hover:translate-x-2 transition-transform">Home</Link>
                            <Link href="/archive" onClick={() => setMenuOpen(false)} className="hover:translate-x-2 transition-transform">Archive</Link>
                            {['Fashion', 'Beauty', 'Culture', 'Runway', 'Video'].map((item) => (
                                <Link key={item} href="/archive" onClick={() => setMenuOpen(false)} className="hover:translate-x-2 transition-transform">
                                    {item}
                                </Link>
                            ))}

                            <div className="h-px bg-gray-200 my-2" />

                            {isSubscriber ? (
                                <>
                                    <Link href="/dashboard" onClick={() => setMenuOpen(false)} className="text-vox-red hover:translate-x-2 transition-transform">My Dashboard</Link>
                                    <button onClick={() => { handleLogout(); setMenuOpen(false); }} className="text-left hover:translate-x-2 transition-transform text-gray-500 text-lg">Logout</button>
                                </>
                            ) : (
                                <Link href="/login" onClick={() => setMenuOpen(false)} className="hover:translate-x-2 transition-transform">Login / Join</Link>
                            )}
                        </div>

                        {/* Bottom Actions */}
                        <div className="mt-auto pt-8 border-t border-gray-200">
                            <button
                                onClick={() => setShowDarkMode(!showDarkMode)}
                                className="flex items-center gap-2 text-sm font-bold tracking-widest hover:opacity-60"
                            >
                                {showDarkMode ? 'LIGHT MODE' : 'DARK MODE'}
                            </button>
                        </div>
                    </div>
                </>
            )}
        </nav>
    );
}