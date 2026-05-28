import { apiGet } from './api';

export type Artista = {
  id: number;
  nome: string;
  assessorResponsavel?: string;
  fotoUrl?: string;
  telefones?: string[];
};

export type Show = {
  id: number;
  data?: string;
  artista?: Artista;
  casaDeShow?: {
    id: number;
    nome: string;
    cidade?: string;
    uf?: string;
  };
};

export type VeiculoImprensa = {
  id: number;
  cnpj?: string;
  razaoSocial?: string;
  telefone?: string;
  nomeResponsavel?: string;
  tipo?: 'RADIO' | 'TV';
  numero?: string;
  frequencia?: 'AM' | 'FM';
  canal?: string;
};

export async function getArtistas(): Promise<Artista[]> {
  return apiGet<Artista[]>('/artistas');
}

export async function getShows(): Promise<Show[]> {
  return apiGet<Show[]>('/shows');
}

export async function getVeiculosImprensa(): Promise<VeiculoImprensa[]> {
  return apiGet<VeiculoImprensa[]>('/veiculos-imprensa');
}
