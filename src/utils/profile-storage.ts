import { useEffect, useState } from 'react';

export type TravelerProfile = {
  name: string;
  age: string;
  destination: string;
  country: string;
  updatedAt: string;
};

const STORAGE_KEY = 'journey-traveler-profile';
let currentProfile: TravelerProfile | null = null;
const listeners = new Set<(profile: TravelerProfile | null) => void>();

function notifyListeners(profile: TravelerProfile | null) {
  listeners.forEach((listener) => listener(profile));
}

export function loadTravelerProfile(): TravelerProfile | null {
  if (typeof window === 'undefined' || !window.localStorage) {
    return currentProfile;
  }

  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    const profile = raw ? (JSON.parse(raw) as TravelerProfile) : null;
    currentProfile = profile;
    return profile;
  } catch {
    return currentProfile;
  }
}

export function saveTravelerProfile(profile: TravelerProfile) {
  if (typeof window === 'undefined' || !window.localStorage) {
    currentProfile = profile;
    notifyListeners(profile);
    return;
  }

  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(profile));
  currentProfile = profile;
  notifyListeners(profile);
}

export function getCurrentTravelerProfile() {
  return currentProfile ?? loadTravelerProfile();
}

export function subscribeTravelerProfile(listener: (profile: TravelerProfile | null) => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export function useTravelerProfile() {
  const [profile, setProfile] = useState<TravelerProfile | null>(() => getCurrentTravelerProfile());

  useEffect(() => {
    setProfile(getCurrentTravelerProfile());
    return subscribeTravelerProfile(setProfile);
  }, []);

  return profile;
}
