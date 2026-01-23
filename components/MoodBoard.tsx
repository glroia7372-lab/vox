'use client';

import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import {
    Plus,
    MoreHorizontal,
    Folder,
    Bookmark,
    Camera,
    Trash2,
    X,
    ChevronRight,
    Search,
    Edit3,
    ArrowLeft,
    Layout,
    Share2
} from 'lucide-react';
import { useApp } from '@/context/AppContext';

interface MoodBoardProps {
    initialBoardId?: string | null;
}

export default function MoodBoard({ initialBoardId }: MoodBoardProps) {
    const router = useRouter();
    const {
        userProfile,
        showDarkMode,
        bookmarks,
        boards,
        createBoard,
        toggleBookmark,
        toggleItemInBoard,
        updateUserProfile,
        deletedItems
    } = useApp();

    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [newBoardName, setNewBoardName] = useState('');
    const [activeTab, setActiveTab] = useState<'boards' | 'pins' | 'trash'>('boards');
    const [selectedBoardId, setSelectedBoardId] = useState<string | null>(initialBoardId || null);
    const [pinSearchQuery, setPinSearchQuery] = useState('');
    const [isEditingBio, setIsEditingBio] = useState(false);
    const [bioText, setBioText] = useState(userProfile?.description || 'VOX가 정제한 당신만의 고유한 패션 미학 아카이브.');
    const [organizingPinId, setOrganizingPinId] = useState<string | null>(null);
    const [layoutMode, setLayoutMode] = useState<'masonry' | 'grid'>('masonry');
    const [isShared, setIsShared] = useState(false);
    const [isAddingFromSaved, setIsAddingFromSaved] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

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

    return (
        <div className={`w-full min-h-screen animate-fadeIn ${showDarkMode ? 'text-white' : 'text-black'}`}>
            {/* Minimalist Profile Header (Hidden when board is selected for focused view) */}
            <div className={`transition-all duration-700 overflow-hidden ${selectedBoardId ? 'h-0 opacity-0' : 'h-auto opacity-100 mb-20'}`}>
                <div className="relative group mb-12">
                    <div className="flex flex-col items-center justify-center gap-6">
                        <div className="relative inline-block group/avatar">
                            <div className="w-24 h-24 md:w-32 md:h-32 rounded-full border-4 border-white dark:border-gray-800 bg-gray-100 overflow-hidden mx-auto shadow-xl relative">
                                <img
                                    src={`https://ui-avatars.com/api/?name=${userProfile?.name || 'V'}&background=FF0000&color=fff&size=200`}
                                    onError={(e) => {
                                        (e.target as HTMLImageElement).src = 'https://ui-avatars.com/api/?name=V&background=FF0000&color=fff&size=200';
                                    }}
                                    className="w-full h-full object-cover"
                                    alt="Avatar"
                                />
                            </div>
                        </div>

                        <div className="text-center max-w-xl mx-auto px-4">
                            <h2 className="text-3xl font-serif font-bold mb-2">My Moodboards</h2>
                            {isEditingBio ? (
                                <div className="flex flex-col items-center gap-4">
                                    <textarea
                                        autoFocus
                                        value={bioText}
                                        onChange={(e) => setBioText(e.target.value)}
                                        className={`w-full p-3 rounded-xl border border-vox-red bg-transparent text-center outline-none ${showDarkMode ? 'text-white' : 'text-black'} text-sm`}
                                        rows={2}
                                    />
                                    <div className="flex gap-2">
                                        <button onClick={handleUpdateBio} className="px-4 py-1 bg-vox-red text-white rounded-full text-xs font-bold uppercase">Save</button>
                                        <button onClick={() => setIsEditingBio(false)} className="px-4 py-1 border border-gray-200 rounded-full text-xs font-bold uppercase">Cancel</button>
                                    </div>
                                </div>
                            ) : (
                                <p
                                    className="text-gray-500 text-sm cursor-pointer hover:text-vox-red transition-colors"
                                    onClick={() => setIsEditingBio(true)}
                                >
                                    {userProfile?.description || bioText} <Edit3 className="w-3 h-3 inline opacity-50 ml-1" />
                                </p>
                            )}
                        </div>

                        <div className="flex items-center justify-center gap-6 text-[10px] text-gray-400 font-black tracking-[0.2em] uppercase">
                            <span className="flex flex-col gap-1 items-center">
                                <span className="text-xl text-black dark:text-white font-serif">{bookmarks.length}</span>
                                PINS
                            </span>
                            <div className="w-px h-8 bg-gray-200 dark:bg-gray-800"></div>
                            <span className="flex flex-col gap-1 items-center">
                                <span className="text-xl text-black dark:text-white font-serif">{boards.length + 1}</span>
                                BOARDS
                            </span>
                        </div>
                    </div>
                </div>

                <div className="flex flex-col lg:flex-row items-center justify-between gap-6 pb-6 border-b border-gray-100 dark:border-gray-900">
                    <div className="flex gap-8 overflow-x-auto no-scrollbar scroll-smooth">
                        {['boards', 'pins', 'trash'].map((tab) => (
                            <button
                                key={tab}
                                onClick={() => setActiveTab(tab as any)}
                                className={`text-[10px] font-black tracking-[0.3em] uppercase pb-2 transition-all relative whitespace-nowrap ${activeTab === tab ? 'text-vox-red border-b-2 border-vox-red' : 'text-gray-300 hover:text-black dark:hover:text-white'}`}
                            >
                                {tab}
                            </button>
                        ))}
                    </div>

                    <div className="flex items-center gap-4 w-full lg:w-auto">
                        <div className="relative flex-1 lg:w-64 group">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                            <input
                                type="text"
                                placeholder="SEARCH..."
                                value={pinSearchQuery}
                                onChange={(e) => setPinSearchQuery(e.target.value)}
                                className="w-full pl-10 pr-4 py-3 rounded-full bg-gray-50 dark:bg-gray-900 text-xs font-bold outline-none ring-1 ring-transparent focus:ring-vox-red transition-all"
                            />
                        </div>
                        <button
                            onClick={() => setIsCreateModalOpen(true)}
                            className="bg-vox-red text-white p-3 rounded-full hover:scale-105 active:scale-95 transition-all shadow-lg"
                        >
                            <Plus className="w-5 h-5" />
                        </button>
                    </div>
                </div>
            </div>

            {/* Content Area */}
            <div className="py-8">
                {activeTab === 'boards' ? (
                    selectedBoardId ? (
                        /* Board Detail View */
                        <div className="animate-scaleIn">
                            <div className="flex flex-col items-center mb-12 relative">
                                <button
                                    onClick={() => setSelectedBoardId(null)}
                                    className={`absolute left-0 top-1 p-3 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors group`}
                                >
                                    <ArrowLeft className={`w-6 h-6 ${showDarkMode ? 'text-white' : 'text-black'} group-hover:-translate-x-1 transition-transform`} />
                                </button>
                                <h2 className={`text-5xl font-serif font-black mb-4 tracking-tight ${showDarkMode ? 'text-white' : 'text-black'}`}>{selectedBoardId === 'all-saved' ? 'All Saved Pins' : activeBoard?.name}</h2>
                                <div className="flex items-center gap-4 text-sm text-gray-500 mb-8">
                                    <span>{(selectedBoardId === 'all-saved' ? bookmarks : boardPins).length} Pins</span>
                                    <div className="flex gap-2">
                                        <button onClick={toggleLayout} className="p-2 hover:bg-gray-100 rounded-full dark:hover:bg-gray-800"><Layout className="w-4 h-4" /></button>
                                        <button onClick={handleShareBoard} className="p-2 hover:bg-gray-100 rounded-full dark:hover:bg-gray-800"><Share2 className="w-4 h-4" /></button>
                                    </div>
                                </div>
                            </div>

                            <div className={layoutMode === 'masonry'
                                ? "columns-2 md:columns-3 lg:columns-4 gap-6 space-y-6"
                                : "grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6"
                            }>
                                {(selectedBoardId === 'all-saved' ? bookmarks : boardPins).map((pin) => (
                                    <div key={pin.id} className={`${layoutMode === 'masonry' ? 'break-inside-avoid' : ''} group relative mb-6`}>
                                        <div className="relative rounded-[2rem] overflow-hidden bg-gray-100 dark:bg-gray-900 shadow-sm transition-all hover:-translate-y-1">
                                            <img
                                                src={pin.imageUrl}
                                                onError={(e) => { (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1542272201-b1ca555f8505?w=500&q=80'; }}
                                                className="w-full h-auto object-cover"
                                                alt={pin.title}
                                            />
                                            <div className="absolute inset-x-0 bottom-0 p-4 bg-gradient-to-t from-black/80 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300">
                                                <div className="flex gap-2 justify-end">
                                                    <button
                                                        onClick={(e) => { e.preventDefault(); e.stopPropagation(); setOrganizingPinId(organizingPinId === pin.id ? null : pin.id); }}
                                                        className="p-2 bg-white text-black rounded-full hover:bg-vox-red hover:text-white transition-colors"
                                                    >
                                                        <Folder className="w-4 h-4" />
                                                    </button>
                                                    <button
                                                        onClick={(e) => { e.preventDefault(); e.stopPropagation(); toggleBookmark(pin); }}
                                                        className="p-2 bg-white text-black rounded-full hover:bg-vox-red hover:text-white transition-colors"
                                                    >
                                                        <Trash2 className="w-4 h-4" />
                                                    </button>
                                                </div>
                                            </div>
                                            {organizingPinId === pin.id && (
                                                <div className="absolute inset-0 bg-black/80 flex items-center justify-center p-4 z-20 animate-fadeIn">
                                                    <div className="bg-white dark:bg-gray-900 w-full max-h-full rounded-xl overflow-hidden shadow-lg p-2">
                                                        <div className="text-center font-bold text-xs mb-2 p-2">Select Board</div>
                                                        <div className="flex flex-col gap-1 max-h-40 overflow-y-auto">
                                                            {boards.map(board => (
                                                                <button
                                                                    key={board.id}
                                                                    onClick={(e) => { e.preventDefault(); e.stopPropagation(); handleToggleItemInBoard(board.id, pin.id); }}
                                                                    className={`text-left px-3 py-2 text-xs rounded-lg ${board.itemIds.includes(pin.id) ? 'bg-vox-red text-white' : 'hover:bg-gray-100 dark:hover:bg-gray-800'}`}
                                                                >
                                                                    {board.name}
                                                                </button>
                                                            ))}
                                                        </div>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                        <div className="mt-2 px-1">
                                            <h4 className="font-bold text-sm truncate">{pin.title}</h4>
                                            <p className="text-[10px] text-gray-500 uppercase">{pin.type}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                            {(selectedBoardId === 'all-saved' ? bookmarks : boardPins).length === 0 && (
                                <div className="text-center py-20 text-gray-500">
                                    <p>No pins in this board yet.</p>
                                    {selectedBoardId !== 'all-saved' && (
                                        <button onClick={() => setIsAddingFromSaved(true)} className="mt-4 text-vox-red font-bold text-sm">Add from Saved Pins</button>
                                    )}
                                </div>
                            )}
                        </div>
                    ) : (
                        /* Boards Grid */
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                            {/* All Saved */}
                            <div className="group cursor-pointer" onClick={() => setSelectedBoardId('all-saved')}>
                                <div className="aspect-[4/5] rounded-[2rem] overflow-hidden bg-gray-100 dark:bg-gray-900 relative mb-4">
                                    <div className="grid grid-cols-2 grid-rows-2 h-full gap-0.5">
                                        {[0, 1, 2, 3].map(i => (
                                            <div key={i} className="bg-gray-200 dark:bg-gray-800 overflow-hidden">
                                                {bookmarks[i] && <img src={bookmarks[i].imageUrl} className="w-full h-full object-cover" />}
                                            </div>
                                        ))}
                                    </div>
                                    <div className="absolute inset-0 bg-black/10 group-hover:bg-black/0 transition-colors" />
                                </div>
                                <h3 className="font-serif font-bold text-lg">All Saved Pins</h3>
                                <p className="text-xs text-gray-500">{bookmarks.length} Pins</p>
                            </div>

                            {/* Custom Boards */}
                            {boards.map(board => (
                                <div key={board.id} className="group cursor-pointer" onClick={() => setSelectedBoardId(board.id)}>
                                    <div className="aspect-[4/5] rounded-[2rem] overflow-hidden bg-gray-100 dark:bg-gray-900 relative mb-4">
                                        {board.itemIds.length > 0 ? (
                                            <div className="grid grid-cols-2 grid-rows-2 h-full gap-0.5">
                                                {[0, 1, 2, 3].map(i => {
                                                    const item = bookmarks.find(b => b.id === (board.itemIds[i % board.itemIds.length] || ''));
                                                    return item ? <img key={i} src={item.imageUrl} className="w-full h-full object-cover" /> : <div key={i} className="bg-gray-200 dark:bg-gray-800" />
                                                })}
                                            </div>
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center text-gray-300">
                                                <Folder className="w-12 h-12" />
                                            </div>
                                        )}
                                    </div>
                                    <h3 className="font-serif font-bold text-lg truncate">{board.name}</h3>
                                    <p className="text-xs text-gray-500">{board.itemIds.length} Pins</p>
                                </div>
                            ))}

                            {/* Create New */}
                            <div
                                onClick={() => setIsCreateModalOpen(true)}
                                className="aspect-[4/5] rounded-[2rem] border-2 border-dashed border-gray-200 dark:border-gray-800 flex flex-col items-center justify-center gap-4 cursor-pointer hover:border-vox-red hover:bg-vox-red/5 transition-colors"
                            >
                                <div className="w-12 h-12 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-gray-400">
                                    <Plus className="w-6 h-6" />
                                </div>
                                <span className="text-xs font-bold uppercase tracking-widest text-gray-400">New Board</span>
                            </div>
                        </div>
                    )
                ) : activeTab === 'pins' ? (
                    <div className="columns-2 md:columns-3 lg:columns-4 gap-6 space-y-6">
                        {filteredPins.map((pin) => (
                            <div key={pin.id} className="break-inside-avoid rounded-[2rem] overflow-hidden bg-white dark:bg-gray-900 mb-6">
                                <img src={pin.imageUrl} className="w-full h-auto" />
                                <div className="p-4">
                                    <h4 className="font-bold text-sm truncate">{pin.title}</h4>
                                    <p className="text-xs text-gray-500">{pin.type}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-20">
                        <h3 className="text-2xl font-serif text-gray-400">Trash</h3>
                        {deletedItems.length > 0 && <p className="text-sm mt-2">{deletedItems.length} items</p>}
                    </div>
                )}
            </div>

            {/* Create Board Modal */}
            {isCreateModalOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/80 backdrop-blur-sm animate-fadeIn">
                    <div className={`${showDarkMode ? 'bg-gray-900 border-gray-800' : 'bg-white'} relative w-full max-w-md p-10 rounded-[2rem] shadow-2xl animate-scaleIn`}>
                        <button onClick={() => setIsCreateModalOpen(false)} className="absolute top-6 right-6 p-2 hover:bg-gray-100 rounded-full dark:hover:bg-gray-800">
                            <X className="w-6 h-6" />
                        </button>
                        <h2 className="text-2xl font-serif font-black uppercase mb-8 text-center">New Board</h2>
                        <form onSubmit={handleCreateBoard}>
                            <input
                                type="text"
                                autoFocus
                                value={newBoardName}
                                onChange={(e) => setNewBoardName(e.target.value)}
                                placeholder='Board Name'
                                className="w-full bg-transparent border-b-2 border-gray-200 py-4 text-xl text-center outline-none focus:border-vox-red transition-all mb-8"
                            />
                            <button
                                type="submit"
                                className="w-full bg-vox-red text-white py-4 rounded-xl font-bold uppercase tracking-widest hover:bg-black transition-all"
                            >
                                Create
                            </button>
                        </form>
                    </div>
                </div>
            )}

            {/* Add From Saved Modal */}
            {isAddingFromSaved && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/80 backdrop-blur-sm">
                    <div className={`${showDarkMode ? 'bg-gray-900' : 'bg-white'} w-full max-w-2xl p-8 rounded-[2rem] h-[80vh] flex flex-col`}>
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-2xl font-serif">Add to {activeBoard?.name}</h2>
                            <button onClick={() => setIsAddingFromSaved(false)}><X className="w-6 h-6" /></button>
                        </div>
                        <div className="flex-1 overflow-y-auto grid grid-cols-2 md:grid-cols-3 gap-4">
                            {pinsInEverythingButNotThisBoard.map(pin => (
                                <div key={pin.id} className="cursor-pointer group relative" onClick={() => handleToggleItemInBoard(selectedBoardId!, pin.id)}>
                                    <img src={pin.imageUrl} className="w-full aspect-[3/4] object-cover rounded-xl" />
                                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity rounded-xl">
                                        <Plus className="w-8 h-8 text-white" />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
