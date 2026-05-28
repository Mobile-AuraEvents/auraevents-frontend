const API_BASE_URL = 'http://localhost:8080/api';

export async function apiGet<T>(path: string): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${path}`);

  if (!response.ok) {
    throw new Error(`Erro ${response.status} ao buscar ${path}`);
  }

  return response.json() as Promise<T>;
}

