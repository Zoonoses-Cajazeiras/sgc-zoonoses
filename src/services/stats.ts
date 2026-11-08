
import { api } from "./api";

export interface ImpactStats {
  id: string;
  vaccinated: number;
  castrations: number;
  tests: number;
  sheltered: number;
  citizens: number;
  createdAt: string;
  updatedAt: string;
}

export interface UpdateImpactStatsInput {
  vaccinated: number;
  castrations: number;
  tests: number;
  sheltered: number;
  citizens: number;
}

// Consulta os indicadores públicos.
export async function getImpactStats(): Promise<ImpactStats> {
  const { data } = await api.get<ImpactStats>("/stats");
  return data;
}

// Atualiza os indicadores como administrador.
export async function updateImpactStats(
  id: string,
  input: UpdateImpactStatsInput,
): Promise<ImpactStats> {
  const { data } = await api.patch<ImpactStats>(
    `/stats/${id}`,
    input,
  );

  return data;
}
