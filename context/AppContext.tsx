'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

// Define types for the context state
interface UserProfile {
    style: string;
    budget: string;
    time: string;
    preferences: string[];
    completedAt: string;
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
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: React.ReactNode }) {
    const [isSubscriber, setIsSubscriber] = useState(false);
    const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
    const [showDarkMode, setShowDarkMode] = useState(false);
    const [showStyleQuiz, setShowStyleQuiz] = useState(false);
    const [showSubscribeModal, setShowSubscribeModal] = useState(false);

    // localStorage에서 사용자 정보 불러오기
    useEffect(() => {
        const savedProfile = localStorage.getItem('vox_user_profile');
        const savedSubscriber = localStorage.getItem('vox_is_subscriber');

        if (savedProfile) {
            setUserProfile(JSON.parse(savedProfile));
        }
        if (savedSubscriber) {
            setIsSubscriber(JSON.parse(savedSubscriber));
        }
    }, []);

    // 사용자 정보 저장
    const saveUserProfile = (profile: UserProfile | null) => {
        setUserProfile(profile);
        if (profile) {
            localStorage.setItem('vox_user_profile', JSON.stringify(profile));
        } else {
            localStorage.removeItem('vox_user_profile');
        }
    };

    const saveSubscriberStatus = (status: boolean) => {
        setIsSubscriber(status);
        localStorage.setItem('vox_is_subscriber', JSON.stringify(status));
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
