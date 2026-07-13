import type { StudentProfile } from '../types';

/**
 * Hybrid token store — sessionStorage for persistence across navigation,
 * with in-memory cache for fast reads. Avoids localStorage per spec.
 */
const TOKEN_KEY = 'mytrackify_token';
const USER_KEY = 'mytrackify_user';

let _token: string | null = null;
let _user: StudentProfile | null = null;

function loadFromStorage() {
  try {
    _token = sessionStorage.getItem(TOKEN_KEY);
    const userData = sessionStorage.getItem(USER_KEY);
    _user = userData ? JSON.parse(userData) : null;
  } catch { /* ignore */ }
}

function saveToStorage() {
  try {
    if (_token) sessionStorage.setItem(TOKEN_KEY, _token);
    else sessionStorage.removeItem(TOKEN_KEY);
    if (_user) sessionStorage.setItem(USER_KEY, JSON.stringify(_user));
    else sessionStorage.removeItem(USER_KEY);
  } catch { /* ignore */ }
}

// Initial load
loadFromStorage();

export const tokenStore = {
  getToken: (): string | null => _token,
  setToken: (t: string | null) => { _token = t; saveToStorage(); },
  getUser: <T>(): T | null => _user as T,
  setUser: (u: StudentProfile | null) => { _user = u; saveToStorage(); },
  clear: () => { _token = null; _user = null; saveToStorage(); },
};