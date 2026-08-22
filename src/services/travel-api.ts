
type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE';

export type ApiLoginResponse = {
  token: string;
  user?: {
    id: number;
    name: string;
    email: string;
  };
};

export type ApiDestination = {
  id: number;
  slug: string;
  country: string;
  title: string;
  location: string;
  description: string;
  vibe: string;
  highlights: string[];
  best_time: string;
  route: string;
  image_url?: string | null;
};

export type ApiDestinationPayload = {
  slug: string;
  country: string;
  title: string;
  location: string;
  description: string;
  vibe: string;
  highlights: string[];
  best_time: string;
  route: string;
  image_url?: string;
};

export type ApiViaje = {
  id: number;
  destino: string;
  pais: string;
  fecha_inicio: string;
  fecha_fin: string;
  descripcion: string;
  imagen?: string | null;
  estado: 'planeado' | 'en curso' | 'completado';
};

export type ApiViajePayload = Omit<ApiViaje, 'id'>;

export type PexelsPhoto = {
  id: number;
  alt: string;
  photographer: string;
  src: {
    medium: string;
    large: string;
  };
};

export type PexelsSearchResponse = {
  total_results: number;
  page: number;
  per_page: number;
  photos: PexelsPhoto[];
};

const API_BASE_URL =
  process.env.EXPO_PUBLIC_TRAVEL_API_URL ??
  'http://127.0.0.1:8000/api';
const TOKEN_STORAGE_KEY = 'travel-api-token';

let cachedToken: string | null = null;

function storageAvailable() {
  return typeof window !== 'undefined' && typeof window.localStorage !== 'undefined';
}

function getTokenFromStorage() {
  if (!storageAvailable()) {
    return null;
  }

  return window.localStorage.getItem(TOKEN_STORAGE_KEY);
}

function normalizeApiData<T>(payload: unknown): T {
  if (payload && typeof payload === 'object' && 'data' in payload) {
    return (payload as { data: T }).data;
  }

  return payload as T;
}

async function request<T>(
  path: string,
  method: HttpMethod,
  body?: unknown,
  requiresAuth = true,
): Promise<T> {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  };

  const token = getApiToken();
  if (requiresAuth && token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE_URL}${path}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  });

  const raw = await response.text();
  let parsed: unknown = null;

  if (raw) {
    try {
      parsed = JSON.parse(raw);
    } catch {
      parsed = { message: raw };
    }
  }

  if (!response.ok) {
    let message = `Error ${response.status}`;
    if (parsed && typeof parsed === 'object') {
      const payload = parsed as { message?: string; errors?: Record<string, string[]> };
      message = payload.message ?? message;
      if (payload.errors) {
        const validationMessages = Object.values(payload.errors).flat();
        if (validationMessages.length > 0) {
          message = validationMessages.join(' ');
        }
      }
    }

    throw new Error(message);
  }

  return normalizeApiData<T>(parsed);
}

export function getApiBaseUrl() {
  return API_BASE_URL;
}

export function getApiToken() {
  if (cachedToken) {
    return cachedToken;
  }

  cachedToken = getTokenFromStorage();
  return cachedToken;
}

export function setApiToken(token: string) {
  cachedToken = token;

  if (storageAvailable()) {
    window.localStorage.setItem(TOKEN_STORAGE_KEY, token);
  }
}

export function clearApiToken() {
  cachedToken = null;

  if (storageAvailable()) {
    window.localStorage.removeItem(TOKEN_STORAGE_KEY);
  }
}

export async function loginAndStoreToken(email: string, password: string, deviceName = 'expo-app') {
  const result = await request<ApiLoginResponse>(
    '/login',
    'POST',
    { email, password, device_name: deviceName },
    false,
  );

  setApiToken(result.token);
  return result;
}

export async function registerAndStoreToken(name: string, email: string, password: string, deviceName = 'expo-app') {
  const result = await request<ApiLoginResponse>(
    '/registro',
    'POST',
    {
      name,
      email,
      password,
      password_confirmation: password,
    },
    false,
  );

  setApiToken(result.token);
  return result;
}

export async function listDestinations(country?: string) {
  const query = country ? `?country=${encodeURIComponent(country)}` : '';
  return request<ApiDestination[]>(`/destinations${query}`, 'GET');
}

export async function createDestination(payload: ApiDestinationPayload) {
  return request<ApiDestination>('/destinations', 'POST', payload);
}

export async function updateDestination(id: number, payload: Partial<ApiDestinationPayload>) {
  return request<ApiDestination>(`/destinations/${id}`, 'PUT', payload);
}

export async function deleteDestination(id: number) {
  return request<{ success: boolean }>(`/destinations/${id}`, 'DELETE');
}

export async function listViajes() {
  return request<ApiViaje[]>('/viajes', 'GET');
}

export async function getViaje(id: number) {
  return request<ApiViaje>(`/viajes/${id}`, 'GET');
}

export async function createViaje(payload: ApiViajePayload) {
  return request<ApiViaje>('/viajes', 'POST', payload);
}

export async function updateViaje(id: number, payload: Partial<ApiViajePayload>) {
  return request<ApiViaje>(`/viajes/${id}`, 'PUT', payload);
}

export async function deleteViaje(id: number) {
  return request<{ message: string }>(`/viajes/${id}`, 'DELETE');
}

export async function searchPhotos(query: string, perPage = 15) {
  return request<PexelsSearchResponse>(`/fotos?query=${encodeURIComponent(query)}&per_page=${perPage}`, 'GET');
}
