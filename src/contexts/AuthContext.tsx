import type { ReactNode } from 'react';
import { useCallback, useContext, useEffect, useMemo, useReducer, createContext } from 'react';

import * as authApi from 'src/lib/api/auth';
import { getErrorMessage, isAdminRole } from 'src/lib/utils';
import {
  clearSession,
  getAccessToken,
  getRefreshToken,
  getStoredUser,
  setSession,
  type StoredUser,
} from 'src/lib/auth/storage';

type AuthState = {
  user: StoredUser | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  isAdmin: boolean;
  error: string | null;
};

type AuthAction =
  | { type: 'BOOTSTRAP_START' }
  | { type: 'AUTH_START' }
  | { type: 'AUTH_SUCCESS'; payload: { user: StoredUser; token: string } }
  | { type: 'AUTH_FAILURE'; payload: string }
  | { type: 'LOGOUT' }
  | { type: 'CLEAR_ERROR' };

const initialState: AuthState = {
  user: null,
  token: null,
  isAuthenticated: false,
  isLoading: true,
  isAdmin: false,
  error: null,
};

function authReducer(state: AuthState, action: AuthAction): AuthState {
  switch (action.type) {
    case 'BOOTSTRAP_START':
      return { ...state, isLoading: true };
    case 'AUTH_START':
      return { ...state, isLoading: true, error: null };
    case 'AUTH_SUCCESS':
      return {
        ...state,
        user: action.payload.user,
        token: action.payload.token,
        isAuthenticated: true,
        isAdmin: isAdminRole(action.payload.user.role),
        isLoading: false,
        error: null,
      };
    case 'AUTH_FAILURE':
      return { ...state, isLoading: false, error: action.payload };
    case 'LOGOUT':
      return { ...initialState, isLoading: false };
    case 'CLEAR_ERROR':
      return { ...state, error: null };
    default:
      return state;
  }
}

function toStoredUser(raw: Record<string, unknown> | undefined | null): StoredUser | null {
  if (!raw) return null;
  return {
    id: String(raw.id || ''),
    email: raw.email ? String(raw.email) : undefined,
    phone: raw.phone ? String(raw.phone) : undefined,
    name: raw.name ? String(raw.name) : undefined,
    role: raw.role ? String(raw.role) : undefined,
    profile_photo: raw.profile_photo ? String(raw.profile_photo) : undefined,
    status: raw.status ? String(raw.status) : undefined,
    is_verified: Boolean(raw.is_verified),
    ekyc_status: raw.ekyc_status as boolean | string | undefined,
  };
}

type AuthContextType = AuthState & {
  login: (identifier: string, password: string) => Promise<void>;
  register: (email: string, password: string) => Promise<void>;
  verifyOtp: (email: string, otp: string) => Promise<void>;
  logout: () => void;
  refreshProfile: () => Promise<void>;
  clearError: () => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(authReducer, initialState);

  const hydrateFromProfile = useCallback(async (accessToken: string) => {
    const profile = await authApi.getProfile();
    const user = toStoredUser(profile);
    if (!user?.id) {
      throw new Error('Unable to load admin profile');
    }
    if (!isAdminRole(user.role)) {
      clearSession();
      throw new Error('Access denied. Admin role is required.');
    }
    setSession({ accessToken, user });
    dispatch({ type: 'AUTH_SUCCESS', payload: { user, token: accessToken } });
  }, []);

  useEffect(() => {
    const bootstrap = async () => {
      const token = getAccessToken();
      const storedUser = getStoredUser();

      if (!token) {
        dispatch({ type: 'LOGOUT' });
        return;
      }

      // If we have a stored user and token, use them without requiring API validation
      // This prevents logout on page reload when API is temporarily unavailable
      if (storedUser && token) {
        dispatch({ 
          type: 'AUTH_SUCCESS', 
          payload: { user: storedUser, token } 
        });
        return;
      }

      try {
        await hydrateFromProfile(token);
      } catch {
        const refreshToken = getRefreshToken();
        if (!refreshToken) {
          clearSession();
          dispatch({ type: 'LOGOUT' });
          return;
        }
        try {
          const refreshed = await authApi.refreshAccessToken(refreshToken);
          if (!refreshed.token) {
            throw new Error('Refresh failed');
          }
          setSession({ accessToken: refreshed.token, refreshToken: refreshed.refreshToken, user: storedUser });
          await hydrateFromProfile(refreshed.token);
        } catch {
          clearSession();
          dispatch({ type: 'LOGOUT' });
        }
      }
    };

    bootstrap();
  }, [hydrateFromProfile]);

  const login = useCallback(
    async (identifier: string, password: string) => {
      dispatch({ type: 'AUTH_START' });
      try {
        const trimmed = identifier.trim();
        const payload = trimmed.includes('@')
          ? { email: trimmed, password }
          : { phone: trimmed, password };

        const result = await authApi.login(payload);
        if (!result.token) {
          throw new Error('No access token received');
        }

        const loginUser = toStoredUser(result.user);
        setSession({
          accessToken: result.token,
          refreshToken: result.refreshToken,
          user: loginUser || undefined,
        });

        await hydrateFromProfile(result.token);
      } catch (error) {
        clearSession();
        dispatch({
          type: 'AUTH_FAILURE',
          payload: getErrorMessage(error, 'Login failed'),
        });
      }
    },
    [hydrateFromProfile]
  );

  const logout = useCallback(() => {
    clearSession();
    dispatch({ type: 'LOGOUT' });
  }, []);

  const register = useCallback(async () => {
    dispatch({ type: 'AUTH_FAILURE', payload: 'Admin registration is not available in the portal.' });
  }, []);

  const verifyOtp = useCallback(async () => {
    dispatch({ type: 'AUTH_FAILURE', payload: 'OTP verification is not used for admin login.' });
  }, []);

  const refreshProfile = useCallback(async () => {
    const token = getAccessToken();
    if (!token) return;
    await hydrateFromProfile(token);
  }, [hydrateFromProfile]);

  const clearError = useCallback(() => dispatch({ type: 'CLEAR_ERROR' }), []);

  const value = useMemo(
    () => ({
      ...state,
      login,
      register,
      verifyOtp,
      logout,
      refreshProfile,
      clearError,
    }),
    [state, login, register, verifyOtp, logout, refreshProfile, clearError]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
