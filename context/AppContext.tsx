'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

// Define types for the context state
export interface UserProfile {
    name?: string;
    email?: string;
    style: string;
    context: string;
    priority: string;
    budget: string;
    time: string;
    preferences: string[];
    completedAt: string;
    coverImage?: string;
    description?: string;
}

interface Board {
    id: string;
    name: string;
    description?: string;
    coverImage?: string;
    itemIds: string[];
}

interface AppContextType {
    isSubscriber: boolean;
    setIsSubscriber: (status: boolean) => void;
    userProfile: UserProfile | null;
    setUserProfile: (profile: UserProfile | null) => void;
    showDarkMode: boolean;
    setShowDarkMode: (show: boolean) => void;
    showStyleQuiz: boolean;
    setShowStyleQuiz: (show: boolean) => void;
    showSubscribeModal: boolean;
    setShowSubscribeModal: (show: boolean) => void;
    cartItems: any[];
    addToCart: (item: any) => void;
    removeFromCart: (itemId: number) => void;
    clearCart: () => void;
    favorites: number[];
    toggleFavorite: (id: number) => void;
    bookmarks: any[];
    toggleBookmark: (item: any) => void;
    deletedItems: any[];
    restoreItem: (itemId: string) => void;
    permanentlyDeleteItem: (itemId: string) => void;
    boards: Board[];
    createBoard: (name: string, description?: string) => void;
    deleteBoard: (boardId: string) => void;
    toggleItemInBoard: (boardId: string, itemId: string) => void;
    updateBoard: (boardId: string, updates: Partial<Board>) => void;
    updateUserProfile: (updates: Partial<UserProfile>) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: React.ReactNode }) {
    const [isSubscriber, setIsSubscriber] = useState(false);
    const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
    const [showDarkMode, setShowDarkMode] = useState(false);
    const [showStyleQuiz, setShowStyleQuiz] = useState(false);
    const [showSubscribeModal, setShowSubscribeModal] = useState(false);
    const [cartItems, setCartItems] = useState<any[]>([]);
    const [favorites, setFavorites] = useState<number[]>([]);
    const [bookmarks, setBookmarks] = useState<any[]>([]);
    const [deletedItems, setDeletedItems] = useState<any[]>([]);
    const [boards, setBoards] = useState<Board[]>([]);

    // localStorage에서 사용자 정보 불러오기
    useEffect(() => {
        const savedProfile = localStorage.getItem('vox_user_profile');
        const savedSubscriber = localStorage.getItem('vox_is_subscriber');
        const savedCart = localStorage.getItem('vox_cart_items');
        const savedFavorites = localStorage.getItem('vox_favorites');
        const savedBookmarks = localStorage.getItem('vox_bookmarks');
        const savedDeleted = localStorage.getItem('vox_deleted_items');
        const savedBoards = localStorage.getItem('vox_boards');
        const savedTheme = localStorage.getItem('vox_theme');

        if (savedProfile) {
            setUserProfile(JSON.parse(savedProfile));
        }
        if (savedSubscriber) {
            setIsSubscriber(JSON.parse(savedSubscriber));
        }
        if (savedCart) {
            setCartItems(JSON.parse(savedCart));
        }
        if (savedFavorites) {
            setFavorites(JSON.parse(savedFavorites));
        }
        if (savedBookmarks) {
            setBookmarks(JSON.parse(savedBookmarks));
        }
        if (savedDeleted) {
            setDeletedItems(JSON.parse(savedDeleted));
        }
        if (savedBoards) {
            setBoards(JSON.parse(savedBoards));
        }
        if (savedTheme) {
            const isDark = JSON.parse(savedTheme);
            setShowDarkMode(isDark);
            if (isDark) {
                document.documentElement.classList.add('dark');
            }
        }
    }, []);

    // 다크모드 동기화
    useEffect(() => {
        localStorage.setItem('vox_theme', JSON.stringify(showDarkMode));
        if (showDarkMode) {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }
    }, [showDarkMode]);

    // 사용자 정보 저장
    const saveUserProfile = (profile: UserProfile | null) => {
        setUserProfile(profile);
        if (profile) {
            localStorage.setItem('vox_user_profile', JSON.stringify(profile));
        } else {
            localStorage.removeItem('vox_user_profile');
        }
    };

    const updateUserProfile = (updates: Partial<UserProfile>) => {
        setUserProfile(prev => {
            if (!prev) return null;
            const updated = { ...prev, ...updates };
            localStorage.setItem('vox_user_profile', JSON.stringify(updated));
            return updated;
        });
    };

    const saveSubscriberStatus = (status: boolean) => {
        setIsSubscriber(status);
        localStorage.setItem('vox_is_subscriber', JSON.stringify(status));
    };

    const addToCart = (item: any) => {
        setCartItems(prev => {
            const newCart = [...prev, item];
            localStorage.setItem('vox_cart_items', JSON.stringify(newCart));
            return newCart;
        });
    };

    const removeFromCart = (itemId: number) => {
        setCartItems(prev => {
            const newCart = prev.filter(item => item.id !== itemId);
            localStorage.setItem('vox_cart_items', JSON.stringify(newCart));
            return newCart;
        });
    };

    const clearCart = () => {
        setCartItems([]);
        localStorage.removeItem('vox_cart_items');
    };

    const toggleFavorite = (id: number) => {
        setFavorites(prev => {
            const newFavorites = prev.includes(id)
                ? prev.filter(fid => fid !== id)
                : [...prev, id];
            localStorage.setItem('vox_favorites', JSON.stringify(newFavorites));
            return newFavorites;
        });
    };

    const toggleBookmark = (item: any) => {
        setBookmarks(prev => {
            const exists = prev.find(b => b.id === item.id);
            let newBookmarks;
            if (exists) {
                newBookmarks = prev.filter(b => b.id !== item.id);
                // 삭제 시 휴지통으로 이동 (중복 체크 추가)
                setDeletedItems(dPrev => {
                    if (dPrev.find(di => di.id === item.id)) return dPrev;
                    const dNew = [item, ...dPrev].slice(0, 50); // 최대 50개 유지
                    localStorage.setItem('vox_deleted_items', JSON.stringify(dNew));
                    return dNew;
                });
            } else {
                newBookmarks = [...prev, item];
            }
            localStorage.setItem('vox_bookmarks', JSON.stringify(newBookmarks));
            return newBookmarks;
        });
    };

    const restoreItem = (itemId: string) => {
        const itemToRestore = deletedItems.find(i => i.id === itemId);
        if (itemToRestore) {
            setDeletedItems(prev => {
                const updated = prev.filter(i => i.id !== itemId);
                localStorage.setItem('vox_deleted_items', JSON.stringify(updated));
                return updated;
            });
            setBookmarks(prev => {
                const updated = [...prev, itemToRestore];
                localStorage.setItem('vox_bookmarks', JSON.stringify(updated));
                return updated;
            });
        }
    };

    const permanentlyDeleteItem = (itemId: string) => {
        setDeletedItems(prev => {
            const updated = prev.filter(i => i.id !== itemId);
            localStorage.setItem('vox_deleted_items', JSON.stringify(updated));
            return updated;
        });
    };

    const createBoard = (name: string, description?: string) => {
        setBoards(prev => {
            const newBoard: Board = {
                id: Date.now().toString(),
                name,
                description,
                itemIds: []
            };
            const newBoards = [...prev, newBoard];
            localStorage.setItem('vox_boards', JSON.stringify(newBoards));
            return newBoards;
        });
    };

    const deleteBoard = (boardId: string) => {
        setBoards(prev => {
            const newBoards = prev.filter(b => b.id !== boardId);
            localStorage.setItem('vox_boards', JSON.stringify(newBoards));
            return newBoards;
        });
    };

    const toggleItemInBoard = (boardId: string, itemId: string) => {
        setBoards(prev => {
            const newBoards = prev.map(board => {
                if (board.id === boardId) {
                    const exists = board.itemIds.includes(itemId);
                    return {
                        ...board,
                        itemIds: exists
                            ? board.itemIds.filter(id => id !== itemId)
                            : [...board.itemIds, itemId]
                    };
                }
                return board;
            });
            localStorage.setItem('vox_boards', JSON.stringify(newBoards));
            return newBoards;
        });
    };

    const updateBoard = (boardId: string, updates: Partial<Board>) => {
        setBoards(prev => {
            const newBoards = prev.map(board =>
                board.id === boardId ? { ...board, ...updates } : board
            );
            localStorage.setItem('vox_boards', JSON.stringify(newBoards));
            return newBoards;
        });
    };

    const value = {
        isSubscriber,
        setIsSubscriber: saveSubscriberStatus,
        userProfile,
        setUserProfile: saveUserProfile,
        showDarkMode,
        setShowDarkMode,
        showStyleQuiz,
        setShowStyleQuiz,
        showSubscribeModal,
        setShowSubscribeModal,
        cartItems,
        addToCart,
        removeFromCart,
        clearCart,
        favorites,
        toggleFavorite,
        bookmarks,
        toggleBookmark,
        deletedItems,
        restoreItem,
        permanentlyDeleteItem,
        boards,
        createBoard,
        deleteBoard,
        toggleItemInBoard,
        updateBoard,
        updateUserProfile
    };

    return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
    const context = useContext(AppContext);
    if (context === undefined) {
        throw new Error('useApp must be used within AppProvider');
    }
    return context;
}
