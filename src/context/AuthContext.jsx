import React, { createContext, useContext, useState, useEffect, useRef, useCallback } from 'react';
import { supabase, isMocking } from '../supabaseClient';

const AuthContext = createContext(null);

export const DEFAULT_PROFILE = {
  id: 'guest',
  name: 'Ciudadano Bogotá',
  full_name: 'Ciudadano Bogotá',
  email: '',
  avatar: '👤',
  avatar_url: null,
  localidad: 'Bogotá D.C.',
  transporte: 'Metro / SITP',
  saldo: 24500,
  estaciones_favoritas: ['Patio Taller Bosa', 'Calle 72', 'Av. Primero de Mayo'],
  saved_items: [],
  search_history: [],
  configuracion: {
    dark: false,
    large_text: false,
    high_contrast: false,
    traffic_notifs: true,
    language: 'es'
  }
};

const USERS_DB_KEY = 'urbango_registered_users';
const ACTIVE_USER_KEY = 'urbango_user';
const LEGACY_USER_KEY = 'urbanGoUser';
const MOCK_SESSION_KEY = 'urbango_mock_session';

/**
 * Helper to safely read from localStorage
 */
const safeReadJson = (key, fallback = null) => {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
};

/**
 * Helper to safely write to localStorage
 */
const safeWriteJson = (key, value) => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (err) {
    console.warn(`Error writing to localStorage for key ${key}:`, err);
  }
};

/**
 * Registry of registered users simulation in localStorage
 */
const getRegisteredUsersDb = () => {
  return safeReadJson(USERS_DB_KEY, {}) || {};
};

const saveUserToDb = (userData) => {
  if (!userData) return;
  const db = getRegisteredUsersDb();
  const emailKey = (userData.email || '').toLowerCase().trim();
  const idKey = userData.id || emailKey;

  const entry = {
    ...DEFAULT_PROFILE,
    ...(db[emailKey] || {}),
    ...(db[idKey] || {}),
    ...userData,
    updated_at: new Date().toISOString()
  };

  if (emailKey) {
    db[emailKey] = entry;
  }
  if (idKey && idKey !== emailKey) {
    db[idKey] = entry;
  }

  safeWriteJson(USERS_DB_KEY, db);
  return entry;
};

const findUserInDb = (emailOrId) => {
  if (!emailOrId) return null;
  const db = getRegisteredUsersDb();
  const key = String(emailOrId).toLowerCase().trim();
  return db[key] || Object.values(db).find(u => (u.email && u.email.toLowerCase() === key) || u.id === key) || null;
};

export const AuthProvider = ({ children }) => {
  const [session, setSession] = useState(null);

  // Initialize profile immediately from localStorage ('urbango_user' or 'urbanGoUser')
  const [userProfile, setUserProfile] = useState(() => {
    const active = safeReadJson(ACTIVE_USER_KEY) || safeReadJson(LEGACY_USER_KEY);
    if (active) {
      return {
        ...DEFAULT_PROFILE,
        ...active,
        avatar: active.avatar_url || active.avatar || DEFAULT_PROFILE.avatar,
        saved_items: Array.isArray(active.saved_items) ? active.saved_items : [],
        search_history: Array.isArray(active.search_history) ? active.search_history : []
      };
    }
    return null;
  });

  const [loading, setLoading] = useState(true);
  const profileFetchInProgress = useRef(false);

  // Helper to normalize and synchronize profile object
  const normalizeProfile = useCallback((data, fallbackId, fallbackEmail, userMetadata = {}) => {
    const rawEmail = (data?.email || fallbackEmail || userMetadata?.email || '').toLowerCase().trim();
    // Check if we have persistent registered user data in localStorage DB
    const savedInDb = rawEmail ? findUserInDb(rawEmail) : (fallbackId ? findUserInDb(fallbackId) : null);

    const rawName = data?.full_name || 
                    data?.name || 
                    savedInDb?.full_name || 
                    savedInDb?.name || 
                    userMetadata?.full_name || 
                    userMetadata?.name || 
                    (rawEmail ? rawEmail.split('@')[0] : 'Ciudadano Bogotá');

    const avatarUrl = data?.avatar_url || 
                      savedInDb?.avatar_url || 
                      userMetadata?.avatar_url || 
                      (typeof data?.avatar === 'string' && (data.avatar.startsWith('http') || data.avatar.startsWith('data:')) ? data.avatar : null);

    const avatar = avatarUrl || 
                   data?.avatar || 
                   savedInDb?.avatar || 
                   userMetadata?.avatar || 
                   DEFAULT_PROFILE.avatar;

    const saldo = typeof data?.saldo === 'number' 
      ? data.saldo 
      : (typeof savedInDb?.saldo === 'number' ? savedInDb.saldo : DEFAULT_PROFILE.saldo);

    const savedItems = Array.isArray(data?.saved_items) && data.saved_items.length > 0
      ? data.saved_items
      : (Array.isArray(savedInDb?.saved_items) ? savedInDb.saved_items : (safeReadJson('urbango_saved_items', [])));

    const searchHistory = Array.isArray(data?.search_history) && data.search_history.length > 0
      ? data.search_history
      : (Array.isArray(savedInDb?.search_history) ? savedInDb.search_history : (safeReadJson('urbango_search_history', [])));

    const favStations = Array.isArray(data?.estaciones_favoritas) && data.estaciones_favoritas.length > 0
      ? data.estaciones_favoritas
      : (Array.isArray(savedInDb?.estaciones_favoritas) ? savedInDb.estaciones_favoritas : DEFAULT_PROFILE.estaciones_favoritas);

    return {
      ...DEFAULT_PROFILE,
      ...(savedInDb || {}),
      ...(data || {}),
      id: data?.id || savedInDb?.id || fallbackId || `user-${Date.now()}`,
      email: rawEmail,
      full_name: rawName,
      name: rawName,
      avatar_url: avatarUrl,
      avatar: avatar,
      saldo: saldo,
      estaciones_favoritas: favStations,
      saved_items: Array.isArray(savedItems) ? savedItems : [],
      search_history: Array.isArray(searchHistory) ? searchHistory : [],
      configuracion: {
        ...DEFAULT_PROFILE.configuracion,
        ...(savedInDb?.configuracion || {}),
        ...(data?.configuracion || {})
      },
      localidad: data?.localidad || savedInDb?.localidad || DEFAULT_PROFILE.localidad,
      transporte: data?.transporte || savedInDb?.transporte || DEFAULT_PROFILE.transporte,
      created_at: data?.created_at || savedInDb?.created_at || new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
  }, []);

  // Save session & user across all persistent keys
  const persistSessionAndUser = useCallback((sess, profile) => {
    if (!profile) return;
    const normalized = {
      ...profile,
      avatar: profile.avatar_url || profile.avatar || DEFAULT_PROFILE.avatar
    };

    safeWriteJson(ACTIVE_USER_KEY, normalized);
    safeWriteJson(LEGACY_USER_KEY, normalized);
    saveUserToDb(normalized);

    if (sess) {
      safeWriteJson(MOCK_SESSION_KEY, { session: sess, profile: normalized });
    }
  }, []);

  // Load mock session from localStorage
  const loadMockSession = useCallback(() => {
    const raw = safeReadJson(MOCK_SESSION_KEY);
    const activeUser = safeReadJson(ACTIVE_USER_KEY) || safeReadJson(LEGACY_USER_KEY);

    if (raw?.session) {
      setSession(raw.session);
      const profile = normalizeProfile(raw.profile || activeUser, raw.session?.user?.id, raw.session?.user?.email);
      setUserProfile(profile);
      persistSessionAndUser(raw.session, profile);
    } else if (activeUser) {
      const fallbackSession = { 
        user: { 
          id: activeUser.id || 'mock-user', 
          email: activeUser.email || 'usuario@urbango.gov.co' 
        }, 
        access_token: 'mock-token' 
      };
      setSession(fallbackSession);
      const profile = normalizeProfile(activeUser, fallbackSession.user.id, fallbackSession.user.email);
      setUserProfile(profile);
      persistSessionAndUser(fallbackSession, profile);
    }
  }, [normalizeProfile, persistSessionAndUser]);

  // Synchronize profile with Supabase 'profiles' table if available
  const fetchProfile = async (userId, userEmail = '', userMetadata = {}) => {
    if (!userId) return null;
    profileFetchInProgress.current = true;

    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (data && !error) {
        const fullProfile = normalizeProfile(data, userId, userEmail, userMetadata);
        setUserProfile(fullProfile);
        persistSessionAndUser(session, fullProfile);
        profileFetchInProgress.current = false;
        return fullProfile;
      }

      // Initial insert or local fallback
      const currentLocal = safeReadJson(ACTIVE_USER_KEY) || safeReadJson(LEGACY_USER_KEY) || {};
      const initialProfile = normalizeProfile(
        {
          id: userId,
          email: userEmail,
          ...currentLocal
        },
        userId,
        userEmail,
        userMetadata
      );

      try {
        await supabase.from('profiles').upsert(initialProfile);
      } catch (insertCatchErr) {
        console.warn('Fallback inserting into profiles table:', insertCatchErr);
      }

      setUserProfile(initialProfile);
      persistSessionAndUser(session, initialProfile);
      profileFetchInProgress.current = false;
      return initialProfile;
    } catch (e) {
      console.warn('Could not fetch profiles from Supabase, preserving local profile:', e);
      const local = safeReadJson(ACTIVE_USER_KEY) || safeReadJson(LEGACY_USER_KEY);
      const safeProfile = normalizeProfile(local, userId, userEmail, userMetadata);
      setUserProfile(safeProfile);
      persistSessionAndUser(session, safeProfile);
      profileFetchInProgress.current = false;
      return safeProfile;
    }
  };

  // Auth initialization effect
  useEffect(() => {
    if (isMocking) {
      loadMockSession();
      setLoading(false);
      return;
    }

    supabase.auth.getSession().then(({ data: { session: s } }) => {
      setSession(s);
      if (s?.user) {
        fetchProfile(s.user.id, s.user.email, s.user.user_metadata).finally(() => {
          setLoading(false);
        });
      } else {
        loadMockSession();
        setLoading(false);
      }
    }).catch((err) => {
      console.warn('Error reading session, using local cache:', err);
      loadMockSession();
      setLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, s) => {
      if (event === 'SIGNED_OUT') {
        // Clear active session keys but preserve USERS_DB_KEY so user can log back in
        setSession(null);
        setUserProfile(null);
        localStorage.removeItem(ACTIVE_USER_KEY);
        localStorage.removeItem(LEGACY_USER_KEY);
        localStorage.removeItem(MOCK_SESSION_KEY);
        localStorage.removeItem('urbango_is_guest');
        return;
      }

      if (s?.user) {
        setSession(s);
        fetchProfile(s.user.id, s.user.email, s.user.user_metadata);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [loadMockSession]);

  // Upload or update profile avatar (supports both Base64 and Supabase Storage)
  const uploadAvatar = async (file) => {
    const userId = session?.user?.id || userProfile?.id || 'user-local';

    if (!file) {
      throw new Error('Debes seleccionar un archivo de imagen válido.');
    }

    // Convert file to Base64 data URL for instant local preview and persistent localStorage storage
    const readBase64 = (f) => new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => resolve(e.target.result);
      reader.onerror = (err) => reject(err);
      reader.readAsDataURL(f);
    });

    const base64Url = await readBase64(file);

    // If mocking or offline, update immediately with Base64
    if (isMocking || !session?.user?.id) {
      const updated = await updateProfile({
        avatar_url: base64Url,
        avatar: base64Url
      });
      return { publicUrl: base64Url, profile: updated, isMock: true };
    }

    // Try Supabase Storage upload
    try {
      let ext = 'jpg';
      if (file.name && file.name.includes('.')) {
        ext = file.name.split('.').pop().toLowerCase();
      } else if (file.type) {
        ext = file.type.split('/')[1] || 'jpg';
      }
      ext = ext.replace(/[^a-z0-9]/g, '') || 'jpg';
      const filePath = `${userId}/avatar.${ext}`;

      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(filePath, file, {
          upsert: true,
          cacheControl: '3600',
          contentType: file.type || `image/${ext}`
        });

      if (uploadError) throw uploadError;

      const { data: urlData } = supabase.storage
        .from('avatars')
        .getPublicUrl(filePath);

      const rawUrl = urlData?.publicUrl;
      if (!rawUrl) throw new Error('No se pudo obtener URL pública.');

      const publicUrl = `${rawUrl}?t=${Date.now()}`;
      const updated = await updateProfile({
        avatar_url: publicUrl,
        avatar: publicUrl
      });

      return { publicUrl, profile: updated };
    } catch (storageErr) {
      console.warn('Storage upload fallback to base64 data URL:', storageErr);
      const updated = await updateProfile({
        avatar_url: base64Url,
        avatar: base64Url
      });
      return { publicUrl: base64Url, profile: updated, fallback: true };
    }
  };

  // Update profile fields with automatic synchronization across React and localStorage
  const updateProfile = async (updates) => {
    const now = new Date().toISOString();
    const current = userProfile || DEFAULT_PROFILE;

    const normalizedUpdates = {
      ...updates,
      updated_at: now
    };

    if (updates.name && !updates.full_name) {
      normalizedUpdates.full_name = updates.name;
    }
    if (updates.full_name && !updates.name) {
      normalizedUpdates.name = updates.full_name;
    }
    if (updates.avatar && !updates.avatar_url && (updates.avatar.startsWith('http') || updates.avatar.startsWith('data:'))) {
      normalizedUpdates.avatar_url = updates.avatar;
    }

    const newProfile = {
      ...current,
      ...normalizedUpdates
    };

    // 1. Update React state immediately
    setUserProfile(newProfile);

    // 2. Persist to active user and registered users DB
    persistSessionAndUser(session, newProfile);

    // 3. Persist to Supabase if connected
    const userId = session?.user?.id || newProfile.id;
    if (!isMocking && userId && userId !== 'guest') {
      try {
        await supabase.from('profiles').upsert({ id: userId, ...newProfile });
      } catch (err) {
        console.warn('Failed to persist update to Supabase profiles:', err);
      }
    }

    return newProfile;
  };

  // Update custom card balance (saldo)
  const updateSaldo = async (newSaldo) => {
    const num = Number(newSaldo);
    localStorage.setItem('urbango_tullave_balance', String(num));
    return updateProfile({ saldo: num });
  };

  // Toggle or update favorite stations
  const toggleFavoriteStation = async (stationId) => {
    const current = userProfile?.estaciones_favoritas || DEFAULT_PROFILE.estaciones_favoritas;
    const exists = current.includes(stationId);
    const updatedFavorites = exists
      ? current.filter(id => id !== stationId)
      : [...current, stationId];

    return updateProfile({ estaciones_favoritas: updatedFavorites });
  };

  const updateFavorites = async (favoritesArray) => {
    return updateProfile({ estaciones_favoritas: favoritesArray });
  };

  // Saved items persistence (Rutas guardadas, posts, convocatorias)
  const toggleSavedItem = async (item) => {
    if (!item) return userProfile?.saved_items || [];
    const key = item.title || item.name || item.id;
    const currentSaved = Array.isArray(userProfile?.saved_items) ? userProfile.saved_items : [];

    const exists = currentSaved.some(s => (s.title || s.name || s.id) === key);
    let updated;
    if (exists) {
      updated = currentSaved.filter(s => (s.title || s.name || s.id) !== key);
    } else {
      updated = [{ ...item, saved_at: new Date().toISOString() }, ...currentSaved];
    }

    safeWriteJson('urbango_saved_items', updated);
    await updateProfile({ saved_items: updated });
    return updated;
  };

  const updateSavedItems = async (itemsArray) => {
    const list = Array.isArray(itemsArray) ? itemsArray : [];
    safeWriteJson('urbango_saved_items', list);
    return updateProfile({ saved_items: list });
  };

  // Search history persistence
  const addSearchHistory = async (query) => {
    const trimmed = (query || '').trim();
    if (!trimmed) return userProfile?.search_history || [];

    const currentHistory = Array.isArray(userProfile?.search_history) ? userProfile.search_history : [];
    const filtered = currentHistory.filter(q => q.toLowerCase() !== trimmed.toLowerCase());
    const updated = [trimmed, ...filtered].slice(0, 20); // Keep last 20 searches

    safeWriteJson('urbango_search_history', updated);
    await updateProfile({ search_history: updated });
    return updated;
  };

  const clearSearchHistory = async () => {
    safeWriteJson('urbango_search_history', []);
    return updateProfile({ search_history: [] });
  };

  // Configuration settings (theme, accessibility, language)
  const updateConfiguracion = async (configUpdates) => {
    const currentConfig = userProfile?.configuracion || DEFAULT_PROFILE.configuracion;
    const merged = { ...currentConfig, ...configUpdates };
    return updateProfile({ configuracion: merged });
  };

  // Sign in: Retrieves profile from persistent simulated database or Supabase
  const signIn = async (email, password) => {
    const cleanEmail = (email || '').toLowerCase().trim();
    const existingInDb = findUserInDb(cleanEmail);

    if (isMocking) {
      const mockUser = { id: existingInDb?.id || 'mock-user-1', email: cleanEmail };
      const mockSession = { user: mockUser, access_token: 'mock-token' };
      const profile = normalizeProfile(existingInDb, mockUser.id, cleanEmail);

      setSession(mockSession);
      setUserProfile(profile);
      persistSessionAndUser(mockSession, profile);
      return { data: { session: mockSession, user: mockUser }, profile, error: null };
    }

    try {
      const { data, error } = await supabase.auth.signInWithPassword({ email: cleanEmail, password });
      if (error) {
        // If Supabase fails but user exists in local mock db, allow login
        if (existingInDb) {
          const mockUser = { id: existingInDb.id, email: cleanEmail };
          const mockSession = { user: mockUser, access_token: 'mock-token' };
          const profile = normalizeProfile(existingInDb, mockUser.id, cleanEmail);
          setSession(mockSession);
          setUserProfile(profile);
          persistSessionAndUser(mockSession, profile);
          return { data: { session: mockSession, user: mockUser }, profile, error: null };
        }
        return { error };
      }

      if (data?.user) {
        setSession(data.session);
        const p = await fetchProfile(data.user.id, data.user.email, data.user.user_metadata);
        return { data, profile: p, error: null };
      }

      return { data, error: null };
    } catch (e) {
      if (existingInDb) {
        const mockUser = { id: existingInDb.id, email: cleanEmail };
        const mockSession = { user: mockUser, access_token: 'mock-token' };
        const profile = normalizeProfile(existingInDb, mockUser.id, cleanEmail);
        setSession(mockSession);
        setUserProfile(profile);
        persistSessionAndUser(mockSession, profile);
        return { data: { session: mockSession, user: mockUser }, profile, error: null };
      }
      return { error: e };
    }
  };

  // Sign up: Registers user, creates entry in persistent database and active session
  const signUp = async (email, password, profileData = {}) => {
    const cleanEmail = (email || '').toLowerCase().trim();
    const existingInDb = findUserInDb(cleanEmail);

    const initial = normalizeProfile(
      {
        ...(existingInDb || {}),
        ...profileData,
        email: cleanEmail,
        saldo: existingInDb?.saldo || 24500
      },
      null,
      cleanEmail
    );

    if (isMocking) {
      const mockUser = { id: initial.id || ('mock-user-' + Date.now()), email: cleanEmail };
      const mockSession = { user: mockUser, access_token: 'mock-token' };
      const profile = { ...initial, id: mockUser.id };

      setSession(mockSession);
      setUserProfile(profile);
      persistSessionAndUser(mockSession, profile);
      return { data: { session: mockSession, user: mockUser }, profile, error: null };
    }

    try {
      const { data, error } = await supabase.auth.signUp({ 
        email: cleanEmail, 
        password,
        options: {
          data: {
            full_name: profileData.name || profileData.full_name || cleanEmail.split('@')[0],
            name: profileData.name || profileData.full_name || cleanEmail.split('@')[0],
            avatar_url: profileData.avatar_url || null
          }
        }
      });

      if (error) {
        // Fallback local registration if Supabase rejects
        const mockUser = { id: initial.id || ('user-' + Date.now()), email: cleanEmail };
        const mockSession = { user: mockUser, access_token: 'mock-token' };
        const profile = { ...initial, id: mockUser.id };
        setSession(mockSession);
        setUserProfile(profile);
        persistSessionAndUser(mockSession, profile);
        return { data: { session: mockSession, user: mockUser }, profile, error: null };
      }

      if (data?.user) {
        setSession(data.session);
        const row = {
          ...initial,
          id: data.user.id,
          email: data.user.email,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        };

        try {
          await supabase.from('profiles').upsert(row);
        } catch (dbErr) {
          console.warn('Error saving to profiles table during signup:', dbErr);
        }

        setUserProfile(row);
        persistSessionAndUser(data.session, row);
        return { data, profile: row, error: null };
      }

      return { data, error: null };
    } catch (e) {
      const mockUser = { id: initial.id || ('user-' + Date.now()), email: cleanEmail };
      const mockSession = { user: mockUser, access_token: 'mock-token' };
      const profile = { ...initial, id: mockUser.id };
      setSession(mockSession);
      setUserProfile(profile);
      persistSessionAndUser(mockSession, profile);
      return { data: { session: mockSession, user: mockUser }, profile, error: null };
    }
  };

  // Sign out / Logout: Clears active session while keeping registered users DB safe
  const signOut = async () => {
    try {
      if (!isMocking) {
        await supabase.auth.signOut();
      }
    } catch {
      // ignore
    }

    setSession(null);
    setUserProfile(null);
    localStorage.removeItem(ACTIVE_USER_KEY);
    localStorage.removeItem(LEGACY_USER_KEY);
    localStorage.removeItem(MOCK_SESSION_KEY);
    localStorage.removeItem('urbango_is_guest');
  };

  const value = {
    session,
    userProfile,
    user: userProfile,
    currentUser: userProfile,
    loading,
    isAuthenticated: !!session || (!!userProfile && userProfile.id !== 'guest'),
    signIn,
    signUp,
    signOut,
    logout: signOut,
    uploadAvatar,
    updateProfile,
    updateSaldo,
    toggleFavoriteStation,
    updateFavorites,
    savedItems: userProfile?.saved_items || [],
    toggleSavedItem,
    updateSavedItems,
    searchHistory: userProfile?.search_history || [],
    addSearchHistory,
    clearSearchHistory,
    updateConfiguracion
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};

export default AuthContext;
