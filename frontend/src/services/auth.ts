const BASE = import.meta.env.BASE_URL || '/';
const API_BASE = `${BASE}api`;
const TOKEN_KEY = 'auth_token';

export interface LoginResponse {
  token: string;
  username: string;
}

async function parseJsonSafe(response: Response) {
  const text = await response.text();
  if (!text) {
    return null;
  }

  try {
    return JSON.parse(text);
  } catch {
    return null;
  }
}

export const authService = {
  login: async (username: string, password: string): Promise<LoginResponse> => {
    const response = await fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password }),
    });

    const data = await parseJsonSafe(response);

    if (!response.ok) {
      throw new Error((data && data.error) || 'Error al iniciar sesión');
    }

    if (!data) {
      throw new Error('Respuesta inválida del servidor');
    }

    return data as LoginResponse;
  },

  register: async (username: string, password: string): Promise<LoginResponse> => {
    const response = await fetch(`${API_BASE}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password }),
    });

    const data = await parseJsonSafe(response);

    if (!response.ok) {
      throw new Error((data && data.error) || 'Error al registrarse');
    }

    if (!data) {
      throw new Error('Respuesta inválida del servidor');
    }

    return data as LoginResponse;
  },

  logout: (): void => {
    localStorage.removeItem(TOKEN_KEY);
  },

  getToken: (): string | null => {
    return localStorage.getItem(TOKEN_KEY);
  },

  setToken: (token: string): void => {
    localStorage.setItem(TOKEN_KEY, token);
  },

  isAuthenticated: (): boolean => {
    return !!localStorage.getItem(TOKEN_KEY);
  },
};
