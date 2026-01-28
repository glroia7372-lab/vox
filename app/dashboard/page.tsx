'use client';

import { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import {
    Settings,
    Edit3,
    Camera,
    TrendingUp,
    Layout,
    Bookmark,
    CreditCard,
    LogOut,
    ArrowUpRight,
    Bell,
    User,
    X,
    Check,
    Zap,
    Plus
} from 'lucide-react';
import { useApp } from '@/context/AppContext';
import Link from 'next/link';
import Image from 'next/image';

export default function DashboardPage() {
    const router = useRouter();
    const [isEditProfileOpen, setIsEditProfileOpen] = useState(false);
    const [isEditBoardOpen, setIsEditBoardOpen] = useState(false);
    const [editingBoard, setEditingBoard] = useState<{ id: string, name: string } | null>(null);

    const {
        isSubscriber,
        userProfile,
        showDarkMode,
        bookmarks,
        boards,
        updateUserProfile,
        updateBoard,
        deleteBoard
    } = useApp();

    const [editFormData, setEditFormData] = useState({
        name: userProfile?.name || '',
        email: userProfile?.email || '',
        description: userProfile?.description || '',
        style: userProfile?.style || '',
        context: userProfile?.context || '',
        priority: userProfile?.priority || '',
        budget: userProfile?.budget || '',
    });

    const handleUpdateBoard = (e: React.FormEvent) => {
        e.preventDefault();
        if (editingBoard) {
            updateBoard(editingBoard.id, { name: editingBoard.name });
            setIsEditBoardOpen(false);
            setEditingBoard(null);
        }
    };

    // 이펙트로 데이터 동기화
    useEffect(() => {
        if (userProfile) {
            setEditFormData({
                name: userProfile.name || '',
                email: userProfile.email || '',
                description: userProfile.description || '',
                style: userProfile.style || '',
                context: userProfile.context || '',
                priority: userProfile.priority || '',
                budget: userProfile.budget || '',
            });
        }
    }, [userProfile]);

    useEffect(() => {
        if (!isSubscriber) {
            router.push('/');
        }
    }, [isSubscriber, router]);

    const handleUpdateProfile = (e: React.FormEvent) => {
        e.preventDefault();
        updateUserProfile(editFormData);
        setIsEditProfileOpen(false);
    };

    const fileInputRef = useRef<HTMLInputElement>(null);
    const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                updateUserProfile({ coverImage: reader.result as string });
            };
            reader.readAsDataURL(file);
        }
    };

    if (!isSubscriber) return null;

    // 통계 계산
    const totalPins = bookmarks.length;
    const totalBoards = boards.length + 1; // +1 for 'All Saved'
    const recentPins = bookmarks.slice(0, 4);

    return (
        <div className={`min-h-screen pt-24 pb-20 px-6 ${showDarkMode ? 'bg-black text-white' : 'bg-gray-50 text-black'}`}>
            <div className="max-w-7xl mx-auto">
                <header className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6">
                    <div>
                        <h1 className="text-4xl md:text-6xl font-serif font-black uppercase tracking-tighter mb-2">Member Hub</h1>
                        <p className="text-gray-500 font-medium">Manage your creative profile and insights.</p>
                    </div>
                    <div className="flex gap-3">
                        <Link href="/archive" className="px-6 py-3 bg-black dark:bg-white text-white dark:text-black rounded-full font-bold text-xs tracking-widest uppercase hover:opacity-80 transition-opacity flex items-center gap-2">
                            Go to Archive <ArrowUpRight className="w-4 h-4" />
                        </Link>
                    </div>
                </header>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                    {/* Left Column: Profile Card */}
                    <div className="lg:col-span-4 space-y-8">
                        <div className={`rounded-[2.5rem] p-8 ${showDarkMode ? 'bg-gray-900' : 'bg-white'} shadow-sm relative overflow-hidden group`}>
                            <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-b from-gray-200 to-transparent dark:from-gray-800 opacity-50"></div>

                            <div className="relative z-10 flex flex-col items-center text-center">
                                <div className="relative mb-6 group/avatar cursor-pointer" onClick={() => fileInputRef.current?.click()}>
                                    <input
                                        type="file"
                                        ref={fileInputRef}
                                        onChange={handleFileUpload}
                                        accept="image/*"
                                        className="hidden"
                                    />
                                    <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-white dark:border-gray-800 shadow-xl">
                                        <img
                                            src={userProfile?.coverImage || `https://ui-avatars.com/api/?name=${userProfile?.name || 'V'}&background=FF0000&color=fff&size=200`}
                                            alt="Profile"
                                            className="w-full h-full object-cover"
                                            onError={(e) => { (e.target as HTMLImageElement).src = 'https://ui-avatars.com/api/?name=VOX&background=000&color=fff'; }}
                                        />
                                    </div>
                                    <div className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-full opacity-0 group-hover/avatar:opacity-100 transition-opacity">
                                        <Camera className="w-8 h-8 text-white" />
                                    </div>
                                </div>

                                <h2 className="text-2xl font-serif font-bold mb-2">{userProfile?.name || 'VOX Member'}</h2>
                                <p className="text-sm text-gray-500 mb-6 px-4 line-clamp-2">{userProfile?.description || 'No description yet.'}</p>

                                <div className="flex gap-2 w-full">
                                    <button
                                        onClick={() => setIsEditProfileOpen(true)}
                                        className="flex-1 py-3 rounded-xl border border-gray-200 dark:border-gray-700 font-bold text-xs uppercase tracking-wider hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                                    >
                                        Edit Profile
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Quick Stats (Vertical on mobile, stacked on desktop) */}
                        <div className={`rounded-[2.5rem] p-8 ${showDarkMode ? 'bg-gray-900' : 'bg-white'} shadow-sm`}>
                            <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest mb-6">Subscription</h3>
                            <div className="flex items-center justify-between mb-6">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-full bg-vox-red/10 flex items-center justify-center text-vox-red">
                                        <CreditCard className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <p className="font-bold">Pro Member</p>
                                        <p className="text-xs text-gray-500">Since Oct 2023</p>
                                    </div>
                                </div>
                                <span className="px-3 py-1 bg-green-100 text-green-700 text-xs font-bold rounded-full">Active</span>
                            </div>
                            <button
                                onClick={() => alert('구독 관리 페이지는 준비 중입니다.\n(실제 서비스에서는 결제 관리 페이지로 이동합니다)')}
                                className="w-full py-3 text-left text-xs font-bold text-gray-400 hover:text-vox-red transition-colors flex items-center justify-between group"
                            >
                                Manage Subscription <ArrowUpRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                            </button>
                        </div>
                    </div>

                    {/* Right Column: Content Dashboard */}
                    <div className="lg:col-span-8 space-y-8">
                        {/* Stats Grid */}
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                            <Link href="/archive?tab=moodboard&board=all-saved" className={`p-6 rounded-[2rem] ${showDarkMode ? 'bg-gray-900' : 'bg-white'} shadow-sm flex flex-col justify-between h-40 hover:scale-105 transition-transform cursor-pointer`}>
                                <div className="flex justify-between items-start">
                                    <Bookmark className="w-6 h-6 text-vox-red" />
                                    <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Total Pins</span>
                                </div>
                                <div>
                                    <span className="text-4xl font-serif font-black">{totalPins}</span>
                                    <p className="text-xs text-gray-500 mt-1">Items in archive</p>
                                </div>
                            </Link>
                            <Link href="/archive?tab=moodboard" className={`p-6 rounded-[2rem] ${showDarkMode ? 'bg-gray-900' : 'bg-white'} shadow-sm flex flex-col justify-between h-40 hover:scale-105 transition-transform cursor-pointer`}>
                                <div className="flex justify-between items-start">
                                    <Layout className="w-6 h-6 text-blue-500" />
                                    <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Moodboards</span>
                                </div>
                                <div>
                                    <span className="text-4xl font-serif font-black">{totalBoards}</span>
                                    <p className="text-xs text-gray-500 mt-1">Curated themes</p>
                                </div>
                            </Link>
                            <Link href="/archive?tab=alerts" className={`p-6 rounded-[2rem] ${showDarkMode ? 'bg-gray-900' : 'bg-white'} shadow-sm flex flex-col justify-between h-40 hover:scale-105 transition-transform cursor-pointer`}>
                                <div className="flex justify-between items-start">
                                    <Bell className="w-6 h-6 text-purple-500" />
                                    <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Alerts</span>
                                </div>
                                <div>
                                    <span className="text-4xl font-serif font-black">2</span>
                                    <p className="text-xs text-gray-500 mt-1">Active keywords</p>
                                </div>
                            </Link>
                        </div>

                        {/* Recent Boards */}
                        <section className={`p-8 rounded-[2.5rem] ${showDarkMode ? 'bg-gray-900' : 'bg-white'} shadow-sm`}>
                            <div className="flex items-center justify-between mb-6">
                                <h3 className="text-xl font-serif font-bold">Your Moodboards</h3>
                                <Link href="/archive?tab=moodboard" className="text-xs font-bold text-gray-400 hover:text-vox-red uppercase tracking-widest">
                                    View All
                                </Link>
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                                {/* Always show 'All Saved' first */}
                                <Link href="/archive?tab=moodboard&board=all-saved" className="block group">
                                    <div className="aspect-[4/3] rounded-3xl bg-gray-100 dark:bg-gray-800 overflow-hidden relative mb-3">
                                        <div className="grid grid-cols-2 grid-rows-2 h-full gap-0.5 opacity-80 group-hover:opacity-100 transition-opacity">
                                            {[0, 1, 2, 3].map(i => (
                                                <div key={i} className="bg-gray-200 dark:bg-gray-700">
                                                    {bookmarks[i] && <img src={bookmarks[i].imageUrl} className="w-full h-full object-cover" />}
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                    <h4 className="font-bold text-sm truncate">All Saved Pins</h4>
                                    <p className="text-xs text-gray-500">{bookmarks.length} items</p>
                                </Link>

                                {boards.slice(0, 2).map(board => (
                                    <div key={board.id} className="block group relative">
                                        <Link href={`/archive?tab=moodboard&board=${board.id}`} className="block">
                                            <div className="aspect-[4/3] rounded-3xl bg-gray-100 dark:bg-gray-800 overflow-hidden relative mb-3">
                                                {board.itemIds.length > 0 ? (
                                                    <div className="grid grid-cols-2 grid-rows-2 h-full gap-0.5 opacity-80 group-hover:opacity-100 transition-opacity">
                                                        {[0, 1, 2, 3].map(i => {
                                                            const item = bookmarks.find(b => b.id === board.itemIds[i % board.itemIds.length]);
                                                            return <div key={i} className="bg-gray-200 dark:bg-gray-700">{item && <img src={item.imageUrl} className="w-full h-full object-cover" alt="" />}</div>
                                                        })}
                                                    </div>
                                                ) : (
                                                    <div className="w-full h-full flex items-center justify-center">
                                                        <Layout className="w-8 h-8 text-gray-300" />
                                                    </div>
                                                )}
                                            </div>
                                            <h4 className="font-bold text-sm truncate">{board.name}</h4>
                                            <p className="text-xs text-gray-500">{board.itemIds.length} items</p>
                                        </Link>
                                        <button
                                            onClick={(e) => {
                                                e.preventDefault();
                                                e.stopPropagation();
                                                setEditingBoard({ id: board.id, name: board.name });
                                                setIsEditBoardOpen(true);
                                            }}
                                            className="absolute top-4 right-4 p-2 bg-white/90 dark:bg-black/90 backdrop-blur rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-all hover:scale-110"
                                        >
                                            <Edit3 className="w-4 h-4 text-vox-red" />
                                        </button>
                                    </div>
                                ))}

                                {boards.length < 2 && (
                                    <Link href="/archive?tab=moodboard" className="block group border-2 border-dashed border-gray-200 dark:border-gray-800 rounded-3xl aspect-[4/3] flex flex-col items-center justify-center gap-2 hover:border-vox-red hover:bg-vox-red/5 transition-colors">
                                        <div className="w-10 h-10 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-gray-400 group-hover:text-vox-red"><Plus className="w-5 h-5" /></div>
                                        <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">Create New</span>
                                    </Link>
                                )}
                            </div>
                        </section>

                        {/* Recent Pins */}
                        <section className={`p-8 rounded-[2.5rem] ${showDarkMode ? 'bg-gray-900' : 'bg-white'} shadow-sm`}>
                            <div className="flex items-center justify-between mb-6">
                                <h3 className="text-xl font-serif font-bold">Recently Saved</h3>
                            </div>
                            {recentPins.length > 0 ? (
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                    {recentPins.map(pin => (
                                        <a href={pin.url} key={pin.id} className="group cursor-pointer block">
                                            <div className="aspect-square rounded-2xl bg-gray-100 dark:bg-gray-800 overflow-hidden mb-2 relative">
                                                <img src={pin.imageUrl} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" alt="" />
                                                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors"></div>
                                                <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                    <div className="bg-white/90 backdrop-blur rounded-full p-1.5 shadow-sm">
                                                        <ArrowUpRight className="w-3 h-3 text-black" />
                                                    </div>
                                                </div>
                                            </div>
                                            <p className="text-xs font-bold truncate group-hover:text-vox-red transition-colors">{pin.title}</p>
                                        </a>
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center py-10 text-gray-500">
                                    No saved items yet. Visit <Link href="/archive" className="text-vox-red underline">Archive</Link> to start collecting.
                                </div>
                            )}
                        </section>
                    </div>
                </div>
            </div>

            {/* Edit Profile Modal (Reused Logic) */}
            {isEditProfileOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/80 backdrop-blur-sm">
                    <div className={`${showDarkMode ? 'bg-gray-900 border-gray-800' : 'bg-white'} relative w-full max-w-lg p-8 rounded-[2rem] shadow-2xl animate-scaleIn overflow-hidden`}>
                        <div className="flex justify-between items-center mb-8">
                            <h2 className="text-2xl font-serif font-bold">Edit Profile</h2>
                            <button onClick={() => setIsEditProfileOpen(false)}><Edit3 className="w-5 h-5" /></button>
                        </div>
                        <form onSubmit={handleUpdateProfile} className="space-y-4 max-h-[70vh] overflow-y-auto pr-2 custom-scrollbar">
                            <div>
                                <label className="block text-xs font-bold uppercase text-gray-500 mb-1">Name</label>
                                <input type="text" value={editFormData.name} onChange={e => setEditFormData({ ...editFormData, name: e.target.value })} className="w-full bg-transparent border-b border-gray-200 dark:border-gray-700 py-2 focus:border-vox-red outline-none" />
                            </div>
                            <div>
                                <label className="block text-xs font-bold uppercase text-gray-500 mb-1">Email</label>
                                <input type="email" value={editFormData.email} onChange={e => setEditFormData({ ...editFormData, email: e.target.value })} className="w-full bg-transparent border-b border-gray-200 dark:border-gray-700 py-2 focus:border-vox-red outline-none" />
                            </div>
                            <div>
                                <label className="block text-xs font-bold uppercase text-gray-500 mb-1">Bio</label>
                                <textarea rows={2} value={editFormData.description} onChange={e => setEditFormData({ ...editFormData, description: e.target.value })} className="w-full bg-transparent border-b border-gray-200 dark:border-gray-700 py-2 focus:border-vox-red outline-none resize-none" />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-bold uppercase text-gray-500 mb-1">Style</label>
                                    <input type="text" value={editFormData.style} onChange={e => setEditFormData({ ...editFormData, style: e.target.value })} className="w-full bg-transparent border-b border-gray-200 dark:border-gray-700 py-2 focus:border-vox-red outline-none" />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold uppercase text-gray-500 mb-1">Budget</label>
                                    <input type="text" value={editFormData.budget} onChange={e => setEditFormData({ ...editFormData, budget: e.target.value })} className="w-full bg-transparent border-b border-gray-200 dark:border-gray-700 py-2 focus:border-vox-red outline-none" />
                                </div>
                            </div>

                            <button type="submit" className="w-full bg-vox-red text-white py-4 rounded-xl font-bold uppercase mt-4">Save Changes</button>
                        </form>
                    </div>
                </div>
            )}

            {/* Edit Moodboard Modal */}
            {isEditBoardOpen && editingBoard && (
                <div className="fixed inset-0 z-[110] flex items-center justify-center p-6 bg-black/80 backdrop-blur-sm">
                    <div className={`${showDarkMode ? 'bg-gray-900 border-gray-800' : 'bg-white'} relative w-full max-w-sm p-8 rounded-[2rem] shadow-2xl animate-scaleIn`}>
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-xl font-serif font-bold">Edit Moodboard</h2>
                            <button onClick={() => setIsEditBoardOpen(false)}><X className="w-5 h-5 text-gray-400" /></button>
                        </div>
                        <form onSubmit={handleUpdateBoard} className="space-y-6">
                            <div>
                                <label className="block text-[10px] font-black uppercase text-gray-400 tracking-widest mb-2">Board Name</label>
                                <input
                                    type="text"
                                    value={editingBoard.name}
                                    onChange={e => setEditingBoard({ ...editingBoard, name: e.target.value })}
                                    className="w-full bg-transparent border-b-2 border-gray-100 dark:border-gray-800 py-3 focus:border-vox-red outline-none font-bold text-lg"
                                    autoFocus
                                />
                            </div>
                            <div className="flex flex-col gap-3">
                                <button type="submit" className="w-full bg-vox-red text-white py-4 rounded-xl font-bold uppercase tracking-widest text-xs hover:opacity-90 transition-opacity">Save Name</button>
                                <button
                                    type="button"
                                    onClick={() => {
                                        if (confirm('Are you sure you want to delete this board? items will remain saved.')) {
                                            deleteBoard(editingBoard.id);
                                            setIsEditBoardOpen(false);
                                        }
                                    }}
                                    className="w-full py-4 text-gray-400 hover:text-red-500 font-bold uppercase tracking-widest text-[10px] transition-colors"
                                >
                                    Delete Board
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}