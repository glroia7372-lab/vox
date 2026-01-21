"use client";

import { useApp } from "@/context/AppContext";

export function useUserProfile() {
  const { userProfile, setUserProfile } = useApp();
  return { user: userProfile, setUser: setUserProfile };
}
