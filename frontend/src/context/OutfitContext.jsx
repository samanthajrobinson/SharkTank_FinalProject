import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { authApi, outfitApi } from '../api/client.js';

const OutfitContext = createContext(null);

const getStoredValue = (key, fallback) => {
  try {
    const value = localStorage.getItem(key);
    return value ? JSON.parse(value) : fallback;
  } catch {
    return fallback;
  }
};

function createGuestOutfit(outfit) {
  return {
    ...outfit,
    id: outfit.id || `guest-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    createdAt: outfit.createdAt || new Date().toISOString(),
    favorite: Boolean(outfit.favorite)
  };
}

export function OutfitProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem('fitmatch_token') || '');
  const [user, setUser] = useState(() => getStoredValue('fitmatch_user', null));
  const [savedOutfits, setSavedOutfits] = useState(() => getStoredValue('fitmatch_saved', []));
  const [lastGeneratedOutfit, setLastGeneratedOutfit] = useState(() => getStoredValue('fitmatch_last', null));

  useEffect(() => {
    localStorage.setItem('fitmatch_saved', JSON.stringify(savedOutfits));
  }, [savedOutfits]);

  useEffect(() => {
    localStorage.setItem('fitmatch_last', JSON.stringify(lastGeneratedOutfit));
  }, [lastGeneratedOutfit]);

  const login = useCallback(async (credentials, mode = 'login') => {
    const payload = mode === 'register'
      ? await authApi.register(credentials)
      : await authApi.login(credentials);

    setToken(payload.token);
    setUser(payload.user);
    localStorage.setItem('fitmatch_token', payload.token);
    localStorage.setItem('fitmatch_user', JSON.stringify(payload.user));
    return payload;
  }, []);

  const logout = useCallback(() => {
    setToken('');
    setUser(null);
    localStorage.removeItem('fitmatch_token');
    localStorage.removeItem('fitmatch_user');
  }, []);

  const refreshSavedOutfits = useCallback(async () => {
    if (!token) return;
    const outfits = await outfitApi.getAll(token);
    setSavedOutfits(outfits);
  }, [token]);

  const createOutfit = useCallback(async (form) => {
    const generated = await outfitApi.generate(form, token || undefined);
    setLastGeneratedOutfit(generated);
    return generated;
  }, [token]);

  const saveOutfit = useCallback(async (outfit) => {
    if (!token) {
      const guestOutfit = createGuestOutfit(outfit);
      setSavedOutfits((current) => [guestOutfit, ...current]);
      return guestOutfit;
    }

    const saved = await outfitApi.create(outfit, token);
    setSavedOutfits((current) => [saved, ...current]);
    return saved;
  }, [token]);

  const updateOutfit = useCallback(async (id, updates) => {
    if (!token) {
      setSavedOutfits((current) => current.map((item) => (item.id === id ? { ...item, ...updates, favorite: Boolean(updates.favorite) } : item)));
      return;
    }

    const updated = await outfitApi.update(id, updates, token);
    setSavedOutfits((current) => current.map((item) => (item.id === id ? updated : item)));
  }, [token]);

  const deleteOutfit = useCallback(async (id) => {
    if (token) {
      await outfitApi.remove(id, token);
    }
    setSavedOutfits((current) => current.filter((item) => item.id !== id));
  }, [token]);

  const value = useMemo(
    () => ({
      token,
      user,
      savedOutfits,
      lastGeneratedOutfit,
      login,
      logout,
      createOutfit,
      saveOutfit,
      updateOutfit,
      deleteOutfit,
      refreshSavedOutfits
    }),
    [token, user, savedOutfits, lastGeneratedOutfit, login, logout, createOutfit, saveOutfit, updateOutfit, deleteOutfit, refreshSavedOutfits]
  );

  return <OutfitContext.Provider value={value}>{children}</OutfitContext.Provider>;
}

export function useOutfit() {
  const context = useContext(OutfitContext);
  if (!context) {
    throw new Error('useOutfit must be used inside OutfitProvider');
  }
  return context;
}
