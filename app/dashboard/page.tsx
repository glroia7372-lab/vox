'use client';

import { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import {
    Plus,
    Settings,
    MoreHorizontal,
    Folder,
    Grid as GridIcon,
    Bookmark,
    Camera,
    Image as ImageIcon,
    Trash2,
    X,
    ChevronRight,
    Search,
    Edit3,
    ArrowLeft,
    Layout,
    ArrowUpRight
} from 'lucide-react';
import { useApp } from '@/context/AppContext';
import Link from 'next/link';

export default function DashboardPage() {
    const router = useRouter();
    const {
        isSubscriber,
        userProfile,
        showDarkMode,
        bookmarks,
        boards,
        createBoard,
        deleteBoard,
        toggleBookmark,
        toggleItemInBoard,
        updateUserProfile,
        deletedItems,
        restoreItem,
        permanentlyDeleteItem
    } = useApp();

    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [newBoardName, setNewBoardName] = useState('');
    const [activeTab, setActiveTab] = useState<'boards' | 'pins' | 'trash'>('boards');
    const [selectedBoardId, setSelectedBoardId] = useState<string | null>(null);
    const [pinSearchQuery, setPinSearchQuery] = useState('');
    const [isEditingBio, setIsEditingBio] = useState(false);
    const [bioText, setBioText] = useState(userProfile?.description || 'Fashion curator and trend analyst at VOX.');
    const [organizingPinId, setOrganizingPinId] = useState<string | null>(null);
    const [layoutMode, setLayoutMode] = useState<'masonry' | 'grid'>('masonry');
    const [isShared, setIsShared] = useState(false);
    const [isAddingFromSaved, setIsAddingFromSaved] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [isEditProfileOpen, setIsEditProfileOpen] = useState(false);
    const [editFormData, setEditFormData] = useState({
        name: userProfile?.name || '',
        email: userProfile?.email || '',
        description: userProfile?.description || '',
        style: userProfile?.style || '',
        context: userProfile?.context || '',
        priority: userProfile?.priority || '',
        budget: userProfile?.budget || '',
    });
    const [selectedItemsFromSaved, setSelectedItemsFromSaved] = useState<string[]>([]);

    useEffect(() => {
        if (userProfile && !isEditProfileOpen) {
            setEditFormData({
                name: userProfile.name || '',
                email: userProfile.email || '',
                description: userProfile.description || '',
                style: userProfile.style || '',
                context: userProfile.context || '',
                priority: userProfile.priority || '',
                budget: userProfile.budget || '',
            });
            setBioText(userProfile.description || 'Fashion curator and trend analyst at VOX.');
        }
    }, [userProfile, isEditProfileOpen]);

    useEffect(() => {
        if (!isSubscriber) {
            router.push('/');
        }
    }, [isSubscriber, router]);

    if (!isSubscriber) return null;

    const handleCreateBoard = (e: React.FormEvent) => {
        e.preventDefault();
        if (newBoardName.trim()) {
            createBoard(newBoardName);
            setNewBoardName('');
            setIsCreateModalOpen(false);
        }
    };

    const handleUpdateBio = () => {
        updateUserProfile({ description: bioText });
        setIsEditingBio(false);
    };

    const handleUpdateProfile = (e: React.FormEvent) => {
        e.preventDefault();
        updateUserProfile(editFormData);
        setIsEditProfileOpen(false);
    };

    const handleCoverChange = () => {
        fileInputRef.current?.click();
    };

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

    const handleToggleItemInBoard = (boardId: string, itemId: string) => {
        toggleItemInBoard(boardId, itemId);
        setOrganizingPinId(null);
    };

    const handleShareBoard = () => {
        const boardUrl = window.location.href + (selectedBoardId ? `?board=${selectedBoardId}` : '');
        navigator.clipboard.writeText(boardUrl);
        setIsShared(true);
        setTimeout(() => setIsShared(false), 2000);
    };

    const toggleLayout = () => {
        setLayoutMode(prev => prev === 'masonry' ? 'grid' : 'masonry');
    };

    const filteredPins = bookmarks.filter(pin =>
        pin.title.toLowerCase().includes(pinSearchQuery.toLowerCase()) ||
        pin.type.toLowerCase().includes(pinSearchQuery.toLowerCase())
    );

    const activeBoard = boards.find(b => b.id === selectedBoardId);
    const boardPins = activeBoard ? bookmarks.filter(b => activeBoard.itemIds.includes(b.id)) : [];
    const pinsInEverythingButNotThisBoard = bookmarks.filter(b => !activeBoard?.itemIds.includes(b.id));

    const handleAddSelectedFromSaved = () => {
        if (selectedBoardId && selectedItemsFromSaved.length > 0) {
            selectedItemsFromSaved.forEach(itemId => {
                if (!activeBoard?.itemIds.includes(itemId)) {
                    toggleItemInBoard(selectedBoardId, itemId);
                }
            });
            setIsAddingFromSaved(false);
            setSelectedItemsFromSaved([]);
        }
    };

    return (
        <div className={`min-h-screen pb-20 pt-32 ${showDarkMode ? 'bg-black text-white' : 'bg-white text-black'}`}>
            {/* Minimalist Profile Header (Hidden when board is selected for focused view) */}
            <div className={`transition-all duration-700 overflow-hidden ${selectedBoardId ? 'h-0 opacity-0' : 'h-auto opacity-100 mb-20'}`}>
                <div className="relative group mb-32">
                    <div className="h-[30vh] md:h-[35vh] w-full overflow-hidden relative">
                        <input
                            type="file"
                            ref={fileInputRef}
                            onChange={handleFileUpload}
                            accept="image/*"
                            className="invisible absolute w-0 h-0"
                        />
                        <img
                            src={userProfile?.coverImage || 'https://images.unsplash.com/photo-1441998856307-567d5e68339d?auto=format&fit=crop&q=80&w=2000'}
                            onError={(e) => {
                                (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1441998856307-567d5e68339d?auto=format&fit=crop&q=80&w=2000';
                            }}
                            className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                            alt="Profile Cover"
                        />
                        <div className="absolute inset-0 bg-black/20"></div>

                        <button
                            onClick={(e) => { e.stopPropagation(); handleCoverChange(); }}
                            className="absolute bottom-6 right-6 z-20 p-4 bg-white/10 backdrop-blur-xl border border-white/20 rounded-full text-white hover:bg-white/20 transition-all opacity-0 group-hover:opacity-100 flex items-center gap-2 cursor-pointer"
                        >
                            <Camera className="w-5 h-5" />
                            <span className="text-[10px] font-black tracking-widest uppercase">Curate Canvas</span>
                        </button>
                    </div>

                    <div className="absolute -bottom-24 left-1/2 -translate-x-1/2 text-center w-full px-6">
                        <div className="relative inline-block mb-6 group/avatar">
                            <div className="w-32 h-32 md:w-36 md:h-36 rounded-full border-[6px] border-white dark:border-black bg-gray-100 overflow-hidden mx-auto shadow-2xl relative">
                                <img
                                    src={`https://ui-avatars.com/api/?name=${userProfile?.name || userProfile?.style || 'V'}&background=FF0000&color=fff&size=200`}
                                    onError={(e) => {
                                        (e.target as HTMLImageElement).src = 'https://ui-avatars.com/api/?name=V&background=FF0000&color=fff&size=200';
                                    }}
                                    className="w-full h-full object-cover"
                                    alt="Avatar"
                                />
                                <button
                                    onClick={() => setIsEditProfileOpen(true)}
                                    className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover/avatar:opacity-100 transition-opacity"
                                >
                                    <Edit3 className="text-white w-8 h-8" />
                                </button>
                            </div>
                        </div>
                        <h1 className="text-4xl md:text-6xl font-serif font-black tracking-tighter mb-4 uppercase">
                            {userProfile?.name || userProfile?.style || 'VOX LOVER'}
                        </h1>

                        <div className="max-w-xl mx-auto mb-8 px-4">
                            {isEditingBio ? (
                                <div className="flex flex-col items-center gap-4">
                                    <textarea
                                        autoFocus
                                        value={bioText}
                                        onChange={(e) => setBioText(e.target.value)}
                                        className={`w-full p-5 rounded-3xl border-2 border-vox-red bg-transparent text-center outline-none ${showDarkMode ? 'text-white' : 'text-black'} font-medium text-lg leading-relaxed`}
                                        rows={2}
                                    />
                                    <div className="flex gap-4">
                                        <button onClick={handleUpdateBio} className="px-6 py-2 bg-vox-red text-white rounded-full text-[10px] font-black tracking-widest uppercase shadow-xl hover:bg-black transition-colors">Apply</button>
                                        <button onClick={() => setIsEditingBio(false)} className="px-6 py-2 border border-gray-200 rounded-full text-[10px] font-black tracking-widest uppercase">Cancel</button>
                                    </div>
                                </div>
                            ) : (
                                <p
                                    className="text-gray-400 font-medium text-lg mb-4 italic leading-relaxed cursor-pointer hover:text-vox-red transition-all flex items-center justify-center gap-3 group/bio"
                                    onClick={() => setIsEditingBio(true)}
                                >
                                    "{userProfile?.description || bioText}"
                                    <Edit3 className="w-4 h-4 opacity-0 group-hover/bio:opacity-100 transition-opacity" />
                                </p>
                            )}
                            <button
                                onClick={() => setIsEditProfileOpen(true)}
                                className="mt-4 px-8 py-2 border border-gray-200 dark:border-gray-800 rounded-full text-[10px] font-black tracking-widest uppercase hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black transition-all"
                            >
                                Edit Profile
                            </button>
                        </div>

                        <div className="flex items-center justify-center gap-10 text-[10px] text-gray-400 font-black tracking-[0.3em] uppercase">
                            <span className="flex flex-col gap-1 items-center">
                                <span className="text-3xl text-black dark:text-white font-serif">{bookmarks.length}</span>
                                PINS
                            </span>
                            <div className="w-px h-10 bg-gray-200 dark:bg-gray-800"></div>
                            <span className="flex flex-col gap-1 items-center">
                                <span className="text-3xl text-black dark:text-white font-serif">{boards.length + 1}</span>
                                BOARDS
                            </span>
                        </div>
                    </div>
                </div>

                <div className="max-w-[1600px] mx-auto px-6">
                    <div className="flex flex-col lg:flex-row items-center justify-between gap-8 mb-16 pt-10 border-t border-gray-100 dark:border-gray-900">
                        <div className="flex gap-14">
                            {['boards', 'pins', 'trash'].map((tab) => (
                                <button
                                    key={tab}
                                    onClick={() => setActiveTab(tab as any)}
                                    className={`text-xs font-black tracking-[0.4em] uppercase pb-4 transition-all relative ${activeTab === tab ? 'text-vox-red' : 'text-gray-300 hover:text-black dark:hover:text-white'}`}
                                >
                                    {tab}
                                    {tab === 'trash' && deletedItems.length > 0 && (
                                        <span className="absolute -top-1 -right-4 w-4 h-4 bg-vox-red text-white text-[8px] flex items-center justify-center rounded-full">
                                            {deletedItems.length}
                                        </span>
                                    )}
                                    {activeTab === tab && <div className="absolute -bottom-1 left-0 w-full h-[3px] bg-vox-red rounded-full"></div>}
                                </button>
                            ))}
                        </div>

                        <div className="flex items-center gap-8 w-full lg:w-auto">
                            <div className="relative flex-1 lg:w-96 group">
                                <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-vox-red transition-colors" />
                                <input
                                    type="text"
                                    placeholder="SEARCH YOUR ARCHIVE..."
                                    value={pinSearchQuery}
                                    onChange={(e) => setPinSearchQuery(e.target.value)}
                                    className="w-full pl-16 pr-8 py-5 rounded-3xl bg-gray-50 dark:bg-gray-950 text-[10px] font-black tracking-widest border-none outline-none ring-1 ring-gray-100 dark:ring-gray-900 focus:ring-2 focus:ring-vox-red transition-all"
                                />
                            </div>
                            <button
                                onClick={() => setIsCreateModalOpen(true)}
                                className="bg-vox-red text-white p-5 px-8 rounded-3xl hover:scale-105 active:scale-95 transition-all shadow-2xl flex items-center gap-3"
                            >
                                <Plus className="w-5 h-5" />
                                <span className="text-[10px] font-black tracking-widest uppercase hidden md:inline">New theme</span>
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <div className="max-w-[1600px] mx-auto px-6">
                {/* Content Area */}
                {activeTab === 'boards' ? (
                    selectedBoardId ? (
                        /* Board Detail View - Focused & Minimalist */
                        <div className="animate-scaleIn max-w-7xl mx-auto pt-10">
                            <div className="text-center mb-20 relative px-20">
                                <button
                                    onClick={() => setSelectedBoardId(null)}
                                    className="absolute left-0 top-0 p-4 bg-gray-50 dark:bg-gray-900 rounded-full hover:bg-vox-red hover:text-white transition-all group"
                                >
                                    <ArrowLeft className="w-6 h-6 group-hover:-translate-x-1 transition-transform" />
                                </button>

                                <h2 className="text-6xl md:text-8xl font-serif font-black tracking-tighter uppercase mb-6 leading-none">
                                    {selectedBoardId === 'all-saved' ? 'Everything I Love' : activeBoard?.name}
                                </h2>
                                <div className="flex items-center justify-center gap-4 text-xs font-black tracking-[0.2em] text-gray-400 uppercase">
                                    <span>{selectedBoardId === 'all-saved' ? bookmarks.length : boardPins.length} curated pins</span>
                                    <div className="w-1.5 h-1.5 bg-vox-red rounded-full"></div>
                                    <span>Created by {userProfile?.style || 'VOX Member'}</span>
                                </div>

                                <div className="mt-10 flex items-center justify-center gap-4">
                                    <button
                                        onClick={toggleLayout}
                                        className={`px-8 py-3 rounded-full text-[10px] font-black tracking-widest uppercase transition-all shadow-xl flex items-center gap-2 ${layoutMode === 'grid' ? 'bg-vox-red text-white' : 'bg-black dark:bg-white text-white dark:text-black'}`}
                                    >
                                        <Layout className="w-4 h-4" />
                                        {layoutMode === 'grid' ? 'USE MASONRY' : 'ORGANIZE GRID'}
                                    </button>
                                    <button
                                        onClick={handleShareBoard}
                                        className={`px-8 py-3 dark:bg-gray-900 border border-gray-200 rounded-full text-[10px] font-black tracking-widest uppercase hover:bg-gray-100 transition-all flex items-center gap-2 ${isShared ? 'text-green-500 border-green-500' : ''}`}
                                    >
                                        {isShared ? 'LINK COPIED!' : 'SHARE BOARD'}
                                    </button>
                                </div>
                            </div>

                            {(selectedBoardId === 'all-saved' ? bookmarks : boardPins).length > 0 ? (
                                <div className={layoutMode === 'masonry'
                                    ? "columns-2 md:columns-3 lg:columns-4 gap-8 space-y-8"
                                    : "grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8"
                                }>
                                    {(selectedBoardId === 'all-saved' ? bookmarks : boardPins).map((pin) => (
                                        <div key={pin.id} className={`${layoutMode === 'masonry' ? 'break-inside-avoid' : ''} group relative`}>
                                            <a href={pin.url} target="_blank" rel="noreferrer" className="block outline-none">
                                                <div className={`relative rounded-[2rem] overflow-hidden bg-gray-100 shadow-sm transition-all duration-500 group-hover:shadow-[0_30px_60px_-15px_rgba(0,0,0,0.3)] ${layoutMode === 'grid' ? 'aspect-square' : ''}`}>
                                                    <img
                                                        src={pin.imageUrl}
                                                        onError={(e) => {
                                                            (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1539109132314-3477524c8d95?w=600';
                                                        }}
                                                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                                        alt={pin.title}
                                                    />
                                                    <div className="absolute inset-x-0 bottom-0 p-6 bg-gradient-to-t from-black/80 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500 translate-y-6 group-hover:translate-y-0" onClick={(e) => e.stopPropagation()}>
                                                        <div className="flex flex-col gap-3">
                                                            <div className="relative">
                                                                <button
                                                                    onClick={(e) => { e.preventDefault(); e.stopPropagation(); setOrganizingPinId(organizingPinId === pin.id ? null : pin.id); }}
                                                                    className="w-full bg-white text-black py-3 rounded-full text-[10px] font-black tracking-widest uppercase flex items-center justify-center gap-2 hover:bg-vox-red hover:text-white transition-all shadow-2xl"
                                                                >
                                                                    COLLECT TO THEME <ChevronRight className={`w-3 h-3 ${organizingPinId === pin.id ? 'rotate-90' : ''} transition-transform`} />
                                                                </button>

                                                                {organizingPinId === pin.id && (
                                                                    <div className="absolute bottom-full left-0 mb-3 w-full bg-white dark:bg-gray-900 rounded-[2rem] shadow-2xl overflow-hidden z-20 animate-scaleIn border border-gray-100 dark:border-gray-800">
                                                                        <div className="p-4 border-b border-gray-100 dark:border-gray-800 text-[10px] font-black text-center text-gray-400 uppercase tracking-widest">Select Theme</div>
                                                                        <div className="max-h-56 overflow-y-auto">
                                                                            {boards.filter(b => b.id !== selectedBoardId).map(board => (
                                                                                <button
                                                                                    key={board.id}
                                                                                    onClick={(e) => { e.preventDefault(); e.stopPropagation(); handleToggleItemInBoard(board.id, pin.id); }}
                                                                                    className={`w-full text-center px-6 py-4 text-[10px] font-black uppercase tracking-widest transition-colors border-b border-gray-50 dark:border-gray-900 last:border-0 ${board.itemIds.includes(pin.id) ? 'bg-vox-red text-white' : 'hover:bg-vox-red hover:text-white'}`}
                                                                                >
                                                                                    {board.name}
                                                                                    {board.itemIds.includes(pin.id) && <span className="ml-2 font-bold">✓</span>}
                                                                                </button>
                                                                            ))}
                                                                        </div>
                                                                    </div>
                                                                )}
                                                            </div>
                                                            <button
                                                                onClick={(e) => { e.preventDefault(); e.stopPropagation(); selectedBoardId === 'all-saved' ? toggleBookmark(pin) : handleToggleItemInBoard(selectedBoardId!, pin.id); }}
                                                                className="w-full border border-white/40 backdrop-blur-md text-white py-3 rounded-full text-[10px] font-black tracking-widest uppercase hover:bg-white hover:text-black transition-colors"
                                                            >
                                                                {selectedBoardId === 'all-saved' ? 'Unsave Pin' : 'Remove from Board'}
                                                            </button>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="mt-5 px-2">
                                                    <h4 className="text-lg font-serif font-bold leading-snug group-hover:text-vox-red transition-colors">{pin.title}</h4>
                                                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mt-2">{pin.type}</p>
                                                </div>
                                            </a>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="py-40 text-center bg-gray-50 dark:bg-gray-950 rounded-[4rem] border-2 border-dashed border-gray-100 dark:border-gray-900">
                                    <div className="w-24 h-24 bg-white dark:bg-gray-900 rounded-full flex items-center justify-center mx-auto mb-8 shadow-xl">
                                        <Layout className="w-10 h-10 text-vox-red" />
                                    </div>
                                    <h3 className="text-3xl font-serif italic text-gray-900 dark:text-white mb-4">A Blank Canvas Awaits</h3>
                                    <p className="text-gray-400 max-w-sm mx-auto mb-10 text-lg">Start curating this board by adding your favorite fashion finds and digital inspirations.</p>
                                    <div className="flex flex-col md:flex-row items-center justify-center gap-4">
                                        <button
                                            onClick={() => setIsAddingFromSaved(true)}
                                            className="inline-flex items-center gap-3 bg-black dark:bg-white text-white dark:text-black px-10 py-4 rounded-full text-[10px] font-black tracking-widest uppercase hover:opacity-80 transition-all shadow-2xl"
                                        >
                                            <Bookmark className="w-4 h-4 fill-current" /> Add from Saved
                                        </button>
                                        <button
                                            onClick={() => router.push('/fashion')}
                                            className="inline-flex items-center gap-3 bg-vox-red text-white px-10 py-4 rounded-full text-[10px] font-black tracking-widest uppercase hover:bg-black transition-all shadow-2xl"
                                        >
                                            Explore Trends <ArrowUpRight className="w-4 h-4" />
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    ) : (
                        /* Boards Grid with Aesthetic Collage */
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-12">
                            {/* "All" Board */}
                            <div className="group cursor-pointer" onClick={() => setSelectedBoardId('all-saved')}>
                                <div className="relative aspect-[4/5] rounded-[3rem] overflow-hidden bg-gray-50 mb-6 shadow-sm group-hover:shadow-[0_40px_80px_-20px_rgba(0,0,0,0.2)] transition-all duration-700 group-hover:-translate-y-4">
                                    <div className="grid grid-cols-2 grid-rows-2 h-full gap-1">
                                        {[0, 1, 2, 3].map((i) => (
                                            <div key={i} className="bg-gray-100 overflow-hidden">
                                                {bookmarks[i] && (
                                                    <img
                                                        src={bookmarks[i].imageUrl}
                                                        onError={(e) => {
                                                            (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?w=400';
                                                        }}
                                                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000"
                                                        alt="pin"
                                                    />
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                    <div className="absolute inset-0 bg-black/10 group-hover:bg-black/0 transition-colors"></div>
                                </div>
                                <h3 className="text-2xl font-serif font-black uppercase tracking-tighter group-hover:text-vox-red transition-all">Everything I Love</h3>
                                <p className="text-[10px] text-gray-400 font-bold uppercase tracking-[0.2em] mt-2">{bookmarks.length} PINS COLLECTED</p>
                            </div>

                            {/* User Custom Boards */}
                            {boards.map(board => (
                                <div key={board.id} className="group cursor-pointer" onClick={() => setSelectedBoardId(board.id)}>
                                    <div className="relative aspect-[4/5] rounded-[3rem] overflow-hidden bg-gray-50 mb-6 shadow-sm group-hover:shadow-[0_40px_80px_-20px_rgba(0,0,0,0.2)] transition-all duration-700 group-hover:-translate-y-4">
                                        {board.itemIds.length > 0 ? (
                                            <div className="grid grid-cols-2 grid-rows-2 h-full gap-1">
                                                {[0, 1, 2, 3].map((i) => {
                                                    const item = bookmarks.find(b => b.id === (board.itemIds[i % board.itemIds.length]));
                                                    return (
                                                        <div key={i} className="bg-gray-100 overflow-hidden">
                                                            {item && (
                                                                <img
                                                                    src={item.imageUrl}
                                                                    onError={(e) => {
                                                                        (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1558769132-cb1aea9f3dbc?w=400';
                                                                    }}
                                                                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000"
                                                                    alt="pin"
                                                                />
                                                            )}
                                                        </div>
                                                    );
                                                })}
                                            </div>
                                        ) : (
                                            <div className="flex items-center justify-center h-full text-gray-200">
                                                <Folder className="w-20 h-20 stroke-[1]" />
                                            </div>
                                        )}
                                        <div className="absolute inset-0 bg-black/10 group-hover:bg-black/0 transition-colors"></div>
                                    </div>
                                    <div className="flex items-center justify-between px-2">
                                        <div>
                                            <h3 className="text-2xl font-serif font-black uppercase tracking-tighter group-hover:text-vox-red transition-all">{board.name}</h3>
                                            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-[0.2em] mt-2">{board.itemIds.length} PINS COLLECTED</p>
                                        </div>
                                        <button
                                            onClick={(e) => { e.stopPropagation(); deleteBoard(board.id); }}
                                            className="p-3 opacity-0 group-hover:opacity-100 hover:text-vox-red transition-all"
                                        >
                                            <Trash2 className="w-5 h-5" />
                                        </button>
                                    </div>
                                </div>
                            ))}

                            {/* Create New Theme Card */}
                            <div
                                onClick={() => setIsCreateModalOpen(true)}
                                className="aspect-[4/5] rounded-[3rem] border-4 border-dashed border-gray-100 dark:border-gray-900 flex flex-col items-center justify-center gap-8 cursor-pointer hover:border-vox-red hover:bg-vox-red/5 transition-all group group-hover:-translate-y-4 duration-700"
                            >
                                <div className="p-10 bg-gray-50 dark:bg-gray-950 rounded-full group-hover:bg-vox-red group-hover:text-white transition-all shadow-md group-hover:shadow-2xl">
                                    <Plus className="w-14 h-14" />
                                </div>
                                <div className="text-center px-6">
                                    <span className="text-[10px] font-black tracking-[0.4em] uppercase text-gray-400 group-hover:text-vox-red">START NEW THEME</span>
                                    <p className="text-[9px] text-gray-300 mt-2 font-bold uppercase tracking-widest group-hover:opacity-0 transition-opacity">Build your next inspiration board</p>
                                </div>
                            </div>
                        </div>
                    )
                ) : activeTab === 'pins' ? (
                    /* Pinterest Masonry Grid */
                    <div className="columns-2 md:columns-3 lg:columns-4 xl:columns-5 gap-8 space-y-8">
                        {filteredPins.map((pin) => (
                            <div key={pin.id} className="break-inside-avoid group relative">
                                <a href={pin.url} target="_blank" rel="noreferrer" className="block outline-none">
                                    <div className="relative rounded-[2.5rem] overflow-hidden bg-gray-100 shadow-sm hover:shadow-[0_40px_80px_-20px_rgba(0,0,0,0.3)] transition-all duration-700 group-hover:scale-[1.03]">
                                        <img
                                            src={pin.imageUrl}
                                            onError={(e) => {
                                                (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=600';
                                            }}
                                            className="w-full h-auto object-cover transition-transform duration-1000 group-hover:scale-110"
                                            alt={pin.title}
                                        />

                                        <div className="absolute inset-x-0 bottom-0 p-6 bg-gradient-to-t from-black/80 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500 translate-y-6 group-hover:translate-y-0" onClick={(e) => e.stopPropagation()}>
                                            <div className="flex flex-col gap-3">
                                                <div className="relative">
                                                    <button
                                                        onClick={(e) => { e.preventDefault(); e.stopPropagation(); setOrganizingPinId(organizingPinId === pin.id ? null : pin.id); }}
                                                        className="w-full bg-white text-black py-3 rounded-full text-[10px] font-black tracking-widest uppercase flex items-center justify-center gap-2 hover:bg-vox-red hover:text-white transition-all shadow-2xl"
                                                    >
                                                        COLLECT TO THEME <ChevronRight className={`w-3 h-3 ${organizingPinId === pin.id ? 'rotate-90' : ''} transition-transform`} />
                                                    </button>

                                                    {organizingPinId === pin.id && (
                                                        <div className="absolute bottom-full left-0 mb-3 w-full bg-white dark:bg-gray-900 rounded-[2rem] shadow-2xl overflow-hidden z-20 animate-scaleIn border border-gray-100 dark:border-gray-800">
                                                            <div className="p-4 border-b border-gray-100 dark:border-gray-800 text-[10px] font-black text-center text-gray-400 uppercase tracking-widest">Select Theme</div>
                                                            <div className="max-h-56 overflow-y-auto">
                                                                {boards.map(board => (
                                                                    <button
                                                                        key={board.id}
                                                                        onClick={(e) => { e.preventDefault(); e.stopPropagation(); handleToggleItemInBoard(board.id, pin.id); }}
                                                                        className={`w-full text-center px-6 py-4 text-[10px] font-black uppercase tracking-widest transition-colors border-b border-gray-50 dark:border-gray-900 last:border-0 ${board.itemIds.includes(pin.id) ? 'bg-vox-red text-white' : 'hover:bg-vox-red hover:text-white'}`}
                                                                    >
                                                                        {board.name}
                                                                        {board.itemIds.includes(pin.id) && <span className="ml-2 font-bold">✓</span>}
                                                                    </button>
                                                                ))}
                                                                {boards.length === 0 && <div className="p-6 text-[10px] text-gray-400 font-bold uppercase text-center">No themes yet</div>}
                                                            </div>
                                                        </div>
                                                    )}
                                                </div>
                                                <button
                                                    onClick={(e) => { e.preventDefault(); e.stopPropagation(); toggleBookmark(pin); }}
                                                    className="w-full border border-white/40 backdrop-blur-md text-white py-3 rounded-full text-[10px] font-black tracking-widest uppercase hover:bg-white hover:text-black transition-colors"
                                                >
                                                    Remove Pin
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="mt-5 px-3">
                                        <h4 className="text-xl font-serif font-black leading-tight line-clamp-2 uppercase tracking-tight">{pin.title}</h4>
                                        <div className="flex items-center gap-2 mt-3">
                                            <div className="w-4 h-4 rounded-full bg-vox-red/20 flex items-center justify-center">
                                                <div className="w-1 h-1 bg-vox-red rounded-full" />
                                            </div>
                                            <p className="text-[10px] text-gray-400 font-black uppercase tracking-[0.2em]">{pin.type}</p>
                                        </div>
                                    </div>
                                </a>
                            </div>
                        ))}
                    </div>
                ) : (
                    /* Trash Tab View */
                    <div className="animate-scaleIn">
                        <div className="text-center mb-16">
                            <h2 className="text-5xl font-serif font-black tracking-tighter uppercase mb-4">Recently Deleted</h2>
                            <p className="text-[10px] font-black tracking-[0.3em] text-gray-400 uppercase">Items will be kept here temporarily</p>
                        </div>

                        {deletedItems.length > 0 ? (
                            <div className="grid grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-8">
                                {deletedItems.map((pin) => (
                                    <div key={pin.id} className="group relative">
                                        <div className="relative rounded-[2.5rem] overflow-hidden bg-gray-50 grayscale opacity-60 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-500">
                                            <img src={pin.imageUrl} className="w-full aspect-[3/4] object-cover" alt={pin.title} />
                                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-6">
                                                <button
                                                    onClick={() => restoreItem(pin.id)}
                                                    className="w-full bg-white text-black py-4 rounded-full text-[10px] font-black tracking-widest uppercase mb-3 hover:bg-vox-red hover:text-white transition-colors"
                                                >
                                                    Restore Pin
                                                </button>
                                                <button
                                                    onClick={() => permanentlyDeleteItem(pin.id)}
                                                    className="w-full text-white/60 hover:text-vox-red text-[9px] font-black tracking-widest uppercase transition-colors"
                                                >
                                                    Delete Permanently
                                                </button>
                                            </div>
                                        </div>
                                        <div className="mt-4 px-2">
                                            <h4 className="text-sm font-serif font-bold truncate text-gray-400 group-hover:text-black dark:group-hover:text-white transition-colors">{pin.title}</h4>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="py-40 text-center bg-gray-50 dark:bg-gray-950 rounded-[4rem] border-2 border-dashed border-gray-100 dark:border-gray-900">
                                <div className="w-24 h-24 bg-white dark:bg-gray-900 rounded-full flex items-center justify-center mx-auto mb-8 shadow-xl">
                                    <Trash2 className="w-10 h-10 text-gray-300" />
                                </div>
                                <h3 className="text-3xl font-serif italic text-gray-400 mb-2">Trash is empty</h3>
                                <p className="text-gray-400 text-sm font-black tracking-widest uppercase">Everything is in its right place</p>
                            </div>
                        )}
                    </div>
                )}
            </div>

            {/* Create Board Modal - Vogue Style */}
            {isCreateModalOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
                    <div className="absolute inset-0 bg-black/90 backdrop-blur-2xl" onClick={() => setIsCreateModalOpen(false)}></div>
                    <div className={`${showDarkMode ? 'bg-black border-gray-800' : 'bg-white'} relative w-full max-w-2xl p-20 rounded-[4rem] shadow-2xl animate-scaleIn border`}>
                        <button onClick={() => setIsCreateModalOpen(false)} className="absolute top-12 right-12 p-3 hover:scale-110 transition-transform">
                            <X className="w-10 h-10" />
                        </button>
                        <div className="text-center mb-16">
                            <h2 className="text-6xl md:text-7xl font-serif font-black tracking-tighter uppercase mb-4">New Theme</h2>
                            <p className="text-[10px] font-black tracking-[0.4em] text-gray-400 uppercase">Define your next visual aesthetic</p>
                        </div>
                        <form onSubmit={handleCreateBoard}>
                            <div className="mb-16">
                                <label className="block text-[10px] font-black tracking-[0.3em] text-vox-red uppercase mb-6 text-center">Theme Title</label>
                                <input
                                    type="text"
                                    autoFocus
                                    value={newBoardName}
                                    onChange={(e) => setNewBoardName(e.target.value)}
                                    placeholder='e.g., TECH MINIMAL / LUXE GOTH'
                                    className="w-full bg-transparent border-b-8 border-gray-100 dark:border-gray-900 py-8 text-4xl md:text-6xl font-serif text-center outline-none focus:border-vox-red transition-all placeholder:text-gray-100 dark:placeholder:text-gray-900 uppercase tracking-tighter"
                                />
                            </div>
                            <button
                                type="submit"
                                className="w-full bg-vox-red text-white py-8 rounded-[2rem] font-black tracking-[0.4em] hover:bg-black transition-all transform active:scale-95 shadow-[0_25px_50px_-12px_rgba(255,0,0,0.5)] text-xs uppercase"
                            >
                                START CURATING
                            </button>
                        </form>
                    </div>
                </div>
            )}

            {/* Edit Profile Modal */}
            {isEditProfileOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
                    <div className="absolute inset-0 bg-black/90 backdrop-blur-2xl" onClick={() => setIsEditProfileOpen(false)}></div>
                    <div className={`${showDarkMode ? 'bg-black border-gray-800' : 'bg-white'} relative w-full max-w-2xl p-12 md:p-20 rounded-[4rem] shadow-2xl animate-scaleIn border overflow-y-auto max-h-[90vh]`}>
                        <button onClick={() => setIsEditProfileOpen(false)} className="absolute top-12 right-12 p-3 hover:scale-110 transition-transform">
                            <X className="w-10 h-10" />
                        </button>
                        <div className="text-center mb-12">
                            <h2 className="text-5xl md:text-6xl font-serif font-black tracking-tighter uppercase mb-4">Edit Profile</h2>
                            <p className="text-[10px] font-black tracking-[0.4em] text-gray-400 uppercase">Update your VOX identity</p>
                        </div>
                        <form onSubmit={handleUpdateProfile} className="space-y-8">
                            <div>
                                <label className="block text-[10px] font-black tracking-[0.3em] text-vox-red uppercase mb-3">Public Name</label>
                                <input
                                    type="text"
                                    value={editFormData.name}
                                    onChange={(e) => setEditFormData({ ...editFormData, name: e.target.value })}
                                    className="w-full bg-transparent border-b-2 border-gray-100 dark:border-gray-900 py-4 text-2xl font-serif outline-none focus:border-vox-red transition-all"
                                    placeholder="Your Name"
                                />
                            </div>
                            <div>
                                <label className="block text-[10px] font-black tracking-[0.3em] text-vox-red uppercase mb-3">Email Address</label>
                                <input
                                    type="email"
                                    value={editFormData.email}
                                    onChange={(e) => setEditFormData({ ...editFormData, email: e.target.value })}
                                    className="w-full bg-transparent border-b-2 border-gray-100 dark:border-gray-900 py-4 text-2xl font-serif outline-none focus:border-vox-red transition-all"
                                    placeholder="your@email.com"
                                />
                            </div>
                            <div>
                                <label className="block text-[10px] font-black tracking-[0.3em] text-vox-red uppercase mb-3">Biography</label>
                                <textarea
                                    value={editFormData.description}
                                    onChange={(e) => setEditFormData({ ...editFormData, description: e.target.value })}
                                    className="w-full bg-transparent border-b-2 border-gray-100 dark:border-gray-900 py-4 text-lg font-medium outline-none focus:border-vox-red transition-all resize-none"
                                    rows={3}
                                    placeholder="Tell us about your style..."
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-8">
                                <div>
                                    <label className="block text-[10px] font-black tracking-[0.3em] text-vox-red uppercase mb-3">Context</label>
                                    <input
                                        type="text"
                                        value={editFormData.context}
                                        onChange={(e) => setEditFormData({ ...editFormData, context: e.target.value })}
                                        className="w-full bg-transparent border-b-2 border-gray-100 dark:border-gray-900 py-4 text-xl font-serif outline-none focus:border-vox-red transition-all"
                                    />
                                </div>
                                <div>
                                    <label className="block text-[10px] font-black tracking-[0.3em] text-vox-red uppercase mb-3">Priority</label>
                                    <input
                                        type="text"
                                        value={editFormData.priority}
                                        onChange={(e) => setEditFormData({ ...editFormData, priority: e.target.value })}
                                        className="w-full bg-transparent border-b-2 border-gray-100 dark:border-gray-900 py-4 text-xl font-serif outline-none focus:border-vox-red transition-all"
                                    />
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-8">
                                <div>
                                    <label className="block text-[10px] font-black tracking-[0.3em] text-vox-red uppercase mb-3">Style Identity</label>
                                    <input
                                        type="text"
                                        value={editFormData.style}
                                        onChange={(e) => setEditFormData({ ...editFormData, style: e.target.value })}
                                        className="w-full bg-transparent border-b-2 border-gray-100 dark:border-gray-900 py-4 text-xl font-serif outline-none focus:border-vox-red transition-all"
                                    />
                                </div>
                                <div>
                                    <label className="block text-[10px] font-black tracking-[0.3em] text-vox-red uppercase mb-3">Budget Range</label>
                                    <input
                                        type="text"
                                        value={editFormData.budget}
                                        onChange={(e) => setEditFormData({ ...editFormData, budget: e.target.value })}
                                        className="w-full bg-transparent border-b-2 border-gray-100 dark:border-gray-900 py-4 text-xl font-serif outline-none focus:border-vox-red transition-all"
                                    />
                                </div>
                            </div>
                            <button
                                type="submit"
                                className="w-full bg-black dark:bg-white text-white dark:text-black py-6 rounded-full font-black tracking-[0.3em] hover:bg-vox-red hover:text-white transition-all transform active:scale-95 shadow-xl text-xs uppercase mt-8"
                            >
                                SAVE CHANGES
                            </button>
                        </form>
                    </div>
                </div>
            )}

            <style jsx>{`
                @keyframes scaleIn {
                    from { opacity: 0; transform: scale(0.9); }
                    to { opacity: 1; transform: scale(1); }
                }
                .animate-scaleIn {
                    animation: scaleIn 0.6s cubic-bezier(0.16, 1, 0.3, 1);
                }
                .line-clamp-2 {
                    display: -webkit-box;
                    -webkit-line-clamp: 2;
                    -webkit-box-orient: vertical;
                    overflow: hidden;
                }
            `}</style>

            {/* Add From Saved Modal */}
            {isAddingFromSaved && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
                    <div className="absolute inset-0 bg-black/90 backdrop-blur-2xl" onClick={() => setIsAddingFromSaved(false)}></div>
                    <div className={`${showDarkMode ? 'bg-black border-gray-800' : 'bg-white'} relative w-full max-w-5xl p-12 md:p-16 rounded-[4rem] shadow-2xl animate-scaleIn border flex flex-col max-h-[90vh]`}>
                        <button onClick={() => setIsAddingFromSaved(false)} className="absolute top-12 right-12 p-3 hover:scale-110 transition-transform">
                            <X className="w-8 h-8" />
                        </button>

                        <div className="text-center mb-10">
                            <h2 className="text-4xl font-serif font-black tracking-tighter uppercase mb-2">Build Your Theme</h2>
                            <p className="text-[10px] font-black tracking-[0.4em] text-gray-400 uppercase">Select items from your collection to add to {activeBoard?.name}</p>
                        </div>

                        <div className="flex-1 overflow-y-auto mb-10 px-4">
                            {pinsInEverythingButNotThisBoard.length > 0 ? (
                                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                                    {pinsInEverythingButNotThisBoard.map(pin => (
                                        <div
                                            key={pin.id}
                                            onClick={() => setSelectedItemsFromSaved(prev =>
                                                prev.includes(pin.id) ? prev.filter(id => id !== pin.id) : [...prev, pin.id]
                                            )}
                                            className="group cursor-pointer relative"
                                        >
                                            <div className={`relative aspect-[3/4] rounded-2xl overflow-hidden border-4 transition-all ${selectedItemsFromSaved.includes(pin.id) ? 'border-vox-red' : 'border-transparent group-hover:border-gray-200 dark:group-hover:border-gray-800'}`}>
                                                <img src={pin.imageUrl} className="w-full h-full object-cover" alt={pin.title} />
                                                {selectedItemsFromSaved.includes(pin.id) && (
                                                    <div className="absolute inset-0 bg-vox-red/20 flex items-center justify-center">
                                                        <div className="w-10 h-10 bg-vox-red text-white flex items-center justify-center rounded-full shadow-2xl scale-125 animate-scaleIn">
                                                            <Plus className="w-6 h-6 stroke-[3]" />
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                            <div className="mt-3 px-1">
                                                <p className="text-[9px] font-black uppercase tracking-widest text-gray-400 mb-1">{pin.type}</p>
                                                <h4 className="text-xs font-bold truncate">{pin.title}</h4>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="h-full flex flex-col items-center justify-center text-center py-20">
                                    <div className="w-20 h-20 bg-gray-50 dark:bg-gray-900 rounded-full flex items-center justify-center mb-6">
                                        <ImageIcon className="w-8 h-8 text-gray-200" />
                                    </div>
                                    <h3 className="text-xl font-serif italic text-gray-400 mb-2">No items to add</h3>
                                    <p className="text-[10px] font-black tracking-widest uppercase text-gray-400">Everything you love is already in this board</p>
                                </div>
                            )}
                        </div>

                        <div className="flex items-center justify-center gap-4">
                            <button
                                onClick={() => setIsAddingFromSaved(false)}
                                className="px-10 py-4 border border-gray-200 dark:border-gray-800 rounded-full text-[10px] font-black tracking-widest uppercase hover:bg-gray-50 dark:hover:bg-gray-900 transition-all"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleAddSelectedFromSaved}
                                disabled={selectedItemsFromSaved.length === 0}
                                className={`px-12 py-4 rounded-full text-[10px] font-black tracking-widest uppercase transition-all shadow-xl ${selectedItemsFromSaved.length > 0 ? 'bg-vox-red text-white hover:bg-black translate-y-0' : 'bg-gray-100 text-gray-300 cursor-not-allowed translate-y-0'}`}
                            >
                                Add {selectedItemsFromSaved.length > 0 ? `(${selectedItemsFromSaved.length}) ` : ''}Items to Theme
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}