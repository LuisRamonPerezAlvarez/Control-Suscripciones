import type {
  Categoria,
  DashboardResumen,
  ProximoCobro,
  Servicio,
  Suscripcion,
  SuscripcionInput,
} from '../types';
import { authService } from './auth';

const BASE = import.meta.env.BASE_URL || '/';
const API_BASE = `${BASE}api`;

async function request<T>(url: string, options?: RequestInit): Promise<T> {
  const token = authService.getToken();
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  if (options?.headers) {
    Object.assign(headers, options.headers);
  }

  const response = await fetch(`${API_BASE}${url}`, {
    headers,
    ...options,
  });

  if (response.status === 204) {
    return undefined as T;
  }

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || 'Error en la solicitud');
  }

  return data as T;
}

export const api = {
  dashboard: {
    getResumen: () => request<DashboardResumen>('/dashboard/resumen'),
    getProximosCobros: () => request<ProximoCobro[]>('/dashboard/proximos-cobros'),
  },
  categorias: {
    getAll: () => request<Categoria[]>('/categorias'),
  },
  servicios: {
    getAll: (params?: { busqueda?: string; categoria_id?: number }) => {
      const searchParams = new URLSearchParams();
      if (params?.busqueda) searchParams.set('busqueda', params.busqueda);
      if (params?.categoria_id) searchParams.set('categoria_id', String(params.categoria_id));
      const query = searchParams.toString();
      return request<Servicio[]>(`/servicios${query ? `?${query}` : ''}`);
    },
    getById: (id: number) => request<Servicio>(`/servicios/${id}`),
  },
  suscripciones: {
    getAll: () => request<Suscripcion[]>('/suscripciones'),
    getById: (id: number) => request<Suscripcion>(`/suscripciones/${id}`),
    create: (data: SuscripcionInput) =>
      request<Suscripcion>('/suscripciones', {
        method: 'POST',
        body: JSON.stringify(data),
      }),
    update: (id: number, data: SuscripcionInput) =>
      request<Suscripcion>(`/suscripciones/${id}`, {
        method: 'PUT',
        body: JSON.stringify(data),
      }),
    delete: (id: number) =>
      request<void>(`/suscripciones/${id}`, { method: 'DELETE' }),
    activar: (id: number) =>
      request<Suscripcion>(`/suscripciones/${id}/activar`, { method: 'PATCH' }),
    desactivar: (id: number) =>
      request<Suscripcion>(`/suscripciones/${id}/desactivar`, { method: 'PATCH' }),
  },
};
