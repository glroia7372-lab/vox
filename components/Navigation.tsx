'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Menu, Search, X, ChevronDown, User, ShoppingBag, Bookmark } from 'lucide-react';
import { useApp } from '@/context/AppContext';

export default function Navigation() {
    const pathname = usePathname();
    const router = useRouter();
    const { isSubscriber, setIsSubscriber, setUserProfile, showDarkMode, setShowDarkMode, setShowStyleQuiz, cartItems } = useApp();
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
                <div className={`fixed inset-0 ${showDarkMode ? 'bg-black/95 text-white' : 'bg-white/95 text-black'} z-[100] flex flex-col pt-32 px-6 animate-fadeIn`}>
                    <button
                        onClick={() => setIsSearchOpen(false)}
                        className="absolute top-8 right-8 p-3 hover:scale-110 transition-transform"
                    >
                        <X className="w-10 h-10" />
                    </button>
                    <form onSubmit={handleSearch} className={`w-full max-w-5xl mx-auto border-b-2 ${showDarkMode ? 'border-white' : 'border-black'} pb-6 flex items-center gap-6`}>
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="SEARCH VOX..."
                            className="flex-1 bg-transparent text-5xl md:text-7xl font-black font-serif outline-none placeholder-gray-400 uppercase tracking-tighter"
                            autoFocus
                        />
                        <button type="submit" className="hover:text-vox-red transition-colors">
                            <Search className="w-10 h-10 md:w-12 md:h-12" />
                        </button>
                    </form>
                </div>
            )}

            {/* Main Nav Bar */}
            <div className="max-w-[1920px] mx-auto px-6 lg:px-12 h-20 md:h-24 flex items-center justify-between">
                {/* Left: Logo */}
                <Link href="/" className="z-50 shrink-0">
                    <span className={`text-3xl md:text-5xl font-serif tracking-vogue hover:opacity-70 transition-opacity ${showDarkMode ? 'text-white' : 'text-black'}`}>
                        VOX
                    </span>
                </Link>

                {/* Center: Categories (Desktop Only) */}
                <div className="hidden lg:flex items-center gap-8 xl:gap-12 text-[11px] font-bold tracking-vogue-tight">
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
                        <button onClick={() => setIsSearchOpen(true)} className="hover:opacity-60">
                            <Search className="w-5 h-5 md:w-6 md:h-6" />
                        </button>

                        {/* Cart Icon - Only show when logged in */}
                        {isSubscriber && (
                            <>
                                <Link href="/cart" className="hover:opacity-60 relative group" title="Shopping Bag">
                                    <ShoppingBag className="w-5 h-5 md:w-6 md:h-6" />
                                    {cartItems.length > 0 && (
                                        <span className="absolute -top-2 -right-2 bg-vox-red text-white text-[10px] w-4 h-4 flex items-center justify-center rounded-full animate-bounce">
                                            {cartItems.length}
                                        </span>
                                    )}
                                </Link>
                            </>
                        )}

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
                        <div className="flex flex-col gap-8 mb-12">
                            <div className="space-y-4">
                                <p className="text-[10px] font-black tracking-[0.3em] text-gray-400 uppercase">Collections</p>
                                <div className="flex flex-col gap-4 text-3xl sm:text-4xl lg:text-5xl font-serif italic">
                                    <Link href="/" onClick={() => setMenuOpen(false)} className="group flex items-baseline gap-4 hover:translate-x-2 transition-transform">
                                        <span>Home</span>
                                        <span className="text-xs font-sans not-italic font-bold text-gray-300 group-hover:text-vox-red uppercase tracking-widest">홈</span>
                                    </Link>
                                    <Link href="/archive" onClick={() => setMenuOpen(false)} className="group flex items-baseline gap-4 hover:translate-x-2 transition-transform">
                                        <span>Trend Archive</span>
                                        <span className="text-xs font-sans not-italic font-bold text-gray-300 group-hover:text-vox-red uppercase tracking-widest">아카이브</span>
                                    </Link>
                                    {['Fashion', 'Beauty', 'Culture', 'Runway', 'Video'].map((item) => (
                                        <Link key={item} href={`/${item.toLowerCase()}`} onClick={() => setMenuOpen(false)} className="group flex items-baseline gap-4 hover:translate-x-2 transition-transform">
                                            <span>{item}</span>
                                            <span className="text-xs font-sans not-italic font-bold text-gray-300 group-hover:text-vox-red uppercase tracking-widest">
                                                {item === 'Fashion' ? '패션' : item === 'Beauty' ? '뷰티' : item === 'Culture' ? '컬처' : item === 'Runway' ? '런웨이' : '비디오'}
                                            </span>
                                        </Link>
                                    ))}
                                </div>
                            </div>

                            <div className="space-y-4 pt-8 border-t border-gray-100 dark:border-gray-900 font-serif">
                                <p className="text-[10px] font-black tracking-[0.3em] text-gray-400 uppercase">Personal</p>
                                <div className="flex flex-col gap-4 text-xl sm:text-2xl italic">
                                    <Link href="/cart" onClick={() => setMenuOpen(false)} className="group flex items-center justify-between hover:translate-x-2 transition-transform">
                                        <span>My Bag</span>
                                        <span className="text-sm font-sans not-italic font-bold bg-vox-red text-white px-2 py-0.5 rounded-full">{cartItems.length}</span>
                                    </Link>

                                    {isSubscriber ? (
                                        <>
                                            <Link href="/dashboard" onClick={() => setMenuOpen(false)} className="text-vox-red hover:translate-x-2 transition-transform">My Dashboard</Link>
                                            <button onClick={() => { handleLogout(); setMenuOpen(false); }} className="text-left hover:translate-x-2 transition-transform text-gray-500 font-serif">Logout</button>
                                        </>
                                    ) : (
                                        <div className="flex flex-col gap-4">
                                            <Link href="/login" onClick={() => setMenuOpen(false)} className="hover:translate-x-2 transition-transform">Login / Join</Link>
                                            <button
                                                onClick={() => { setShowStyleQuiz(true); setMenuOpen(false); }}
                                                className="text-left text-vox-red hover:translate-x-2 transition-transform"
                                            >
                                                Start Style DNA
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Bottom Actions */}
                        <div className={`mt-auto pt-8 border-t ${showDarkMode ? 'border-gray-800' : 'border-gray-200'}`}>
                            <button
                                onClick={() => setShowDarkMode(!showDarkMode)}
                                className="flex items-center gap-2 text-sm font-bold tracking-widest hover:opacity-60 mb-4"
                            >
                                {showDarkMode ? 'LIGHT MODE' : 'DARK MODE'}
                            </button>

                            {/* DEV: 구독자 상태 토글 (개발용) */}
                            <button
                                onClick={() => setIsSubscriber(!isSubscriber)}
                                className="flex items-center gap-2 text-xs font-bold tracking-widest hover:opacity-60 text-gray-500"
                            >
                                [DEV] {isSubscriber ? '구독자 모드 OFF' : '구독자 모드 ON'}
                            </button>
                        </div>
                    </div>
                </>
            )}
        </nav>
    );
}