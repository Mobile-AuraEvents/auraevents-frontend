const RAW_API_BASE_URL = process.env.EXPO_PUBLIC_API_BASE_URL ?? 'http://localhost:8080/api';
const API_BASE_URL =
  RAW_API_BASE_URL.replace(/\/$/, '') + (RAW_API_BASE_URL.endsWith('/api') ? '' : '/api');

export async function apiGet<T>(path: string): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${path}`);

  if (!response.ok) {
    throw new Error(`Erro ${response.status} ao buscar ${path}`);
  }

  return response.json() as Promise<T>;
}

export async function apiPost<TResponse, TBody>(path: string, body: TBody): Promise<TResponse> {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    throw new Error(`Erro ${response.status} ao enviar ${path}`);
  }

  return response.json() as Promise<TResponse>;
}

export async function apiPut<TResponse, TBody>(path: string, body: TBody): Promise<TResponse> {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    throw new Error(`Erro ${response.status} ao atualizar ${path}`);
  }

  return response.json() as Promise<TResponse>;
}

