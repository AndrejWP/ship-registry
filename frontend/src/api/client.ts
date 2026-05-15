import { AuthResponse, Captain, MaintenanceRecord, Port, Ship, ShipPayload, Voyage, VoyagePayload } from '../types';
import { storage } from '../utils/storage';

const API_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:3000';

interface RequestOptions extends RequestInit {
  auth?: boolean;
}

async function request<T>(path: string, options: RequestOptions = {}): Promise<T> {
  const headers = new Headers(options.headers);
  headers.set('Content-Type', 'application/json');

  if (options.auth !== false) {
    const token = storage.getToken();
    if (token) {
      headers.set('Authorization', `Bearer ${token}`);
    }
  }

  const response = await fetch(`${API_URL}${path}`, {
    ...options,
    headers,
  });

  if (response.status === 401) {
    storage.clearAuth();
  }

  if (!response.ok) {
    const errorBody = await response.json().catch(() => null);
    const message = errorBody?.message;
    throw new Error(Array.isArray(message) ? message.join(', ') : message || 'Request failed');
  }

  if (response.status === 204) {
    return undefined as T;
  }

  return response.json();
}

export const api = {
  login: (email: string, password: string) =>
    request<AuthResponse>('/auth/login', {
      method: 'POST',
      auth: false,
      body: JSON.stringify({ email, password }),
    }),

  getShips: (search?: string) => {
    const query = search ? `?search=${encodeURIComponent(search)}` : '';
    return request<Ship[]>(`/ships${query}`);
  },
  createShip: (payload: ShipPayload) =>
    request<Ship>('/ships', { method: 'POST', body: JSON.stringify(payload) }),
  updateShip: (id: number, payload: ShipPayload) =>
    request<Ship>(`/ships/${id}`, { method: 'PATCH', body: JSON.stringify(payload) }),
  deleteShip: (id: number) => request<void>(`/ships/${id}`, { method: 'DELETE' }),

  getVoyages: () => request<Voyage[]>('/voyages'),
  createVoyage: (payload: VoyagePayload) =>
    request<Voyage>('/voyages', { method: 'POST', body: JSON.stringify(payload) }),
  updateVoyage: (id: number, payload: VoyagePayload) =>
    request<Voyage>(`/voyages/${id}`, { method: 'PATCH', body: JSON.stringify(payload) }),
  deleteVoyage: (id: number) => request<void>(`/voyages/${id}`, { method: 'DELETE' }),

  getPorts: () => request<Port[]>('/ports'),
  getCaptains: () => request<Captain[]>('/captains'),
  getMaintenanceRecords: () => request<MaintenanceRecord[]>('/maintenance-records'),
};
