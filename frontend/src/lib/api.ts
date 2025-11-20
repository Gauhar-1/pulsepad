import Cookies from 'js-cookie';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL ?? 'http://localhost:4000/api';

export const getApiUrl = (path: string) => {
  if (!path.startsWith('/')) {
    throw new Error(`API path must start with "/": received "${path}"`);
  }
  return `${API_BASE_URL}${path}`;
};

const getAuthToken = () => {
  if (typeof window === 'undefined') return undefined;
  return Cookies.get('auth_token');
};

export const apiFetch = (path: string, init: RequestInit = {}) => {
  const headers = new Headers(init.headers ?? {});
  const token = getAuthToken();
  if (token && !headers.has('Authorization')) {
    headers.set('Authorization', `Bearer ${token}`);
  }

  return fetch(getApiUrl(path), {
    ...init,
    headers,
  });
};

export { API_BASE_URL };

