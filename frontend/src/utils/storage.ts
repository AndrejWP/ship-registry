import { UserRole } from '../types';

const TOKEN_KEY = 'shipRegistry:accessToken';
const ROLE_KEY = 'shipRegistry:role';
const USER_NAME_KEY = 'shipRegistry:userName';
const USER_EMAIL_KEY = 'shipRegistry:userEmail';
const THEME_KEY = 'shipRegistry:theme';
const SHIP_FILTER_KEY = 'shipRegistry:lastShipFilter';

export type ThemeName = 'light' | 'dark';

export const storage = {
  getToken: () => localStorage.getItem(TOKEN_KEY),
  setToken: (token: string) => localStorage.setItem(TOKEN_KEY, token),
  getRole: () => localStorage.getItem(ROLE_KEY) as UserRole | null,
  setRole: (role: UserRole) => localStorage.setItem(ROLE_KEY, role),
  getUserName: () => localStorage.getItem(USER_NAME_KEY),
  setUserName: (name: string) => localStorage.setItem(USER_NAME_KEY, name),
  getUserEmail: () => localStorage.getItem(USER_EMAIL_KEY),
  setUserEmail: (email: string) => localStorage.setItem(USER_EMAIL_KEY, email),
  getTheme: () => (localStorage.getItem(THEME_KEY) as ThemeName | null) ?? 'light',
  setTheme: (theme: ThemeName) => localStorage.setItem(THEME_KEY, theme),
  getShipFilter: () => localStorage.getItem(SHIP_FILTER_KEY) ?? '',
  setShipFilter: (value: string) => localStorage.setItem(SHIP_FILTER_KEY, value),
  clearAuth: () => {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(ROLE_KEY);
    localStorage.removeItem(USER_NAME_KEY);
    localStorage.removeItem(USER_EMAIL_KEY);
  },
};

