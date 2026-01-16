'use client';

import { useAppContext } from '@/context/AppContext';

export function useUserProfile() {
    const { user, setUser } = useAppContext();
    return { user, setUser };
}
