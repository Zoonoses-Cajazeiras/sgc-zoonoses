import { supabase } from "./supabase";

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

interface ImpactStatsRow {
  id: string;
  vaccinated: number;
  castrations: number;
  tests: number;
  sheltered: number;
  citizens: number;
  created_at: string;
  updated_at: string;
}

export interface UpdateImpactStatsInput {
  vaccinated: number;
  castrations: number;
  tests: number;
  sheltered: number;
  citizens: number;
}

function mapImpactStats(row: ImpactStatsRow): ImpactStats {
  return {
    id: row.id,
    vaccinated: row.vaccinated,
    castrations: row.castrations,
    tests: row.tests,
    sheltered: row.sheltered,
    citizens: row.citizens,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

export async function getImpactStats(): Promise<ImpactStats> {
  const { data, error } = await supabase
    .from("impact_stats")
    .select(`
      id,
      vaccinated,
      castrations,
      tests,
      sheltered,
      citizens,
      created_at,
      updated_at
    `)
    .limit(1)
    .single();

  if (error) {
    console.error("Erro ao buscar estatísticas:", error);
    throw error;
  }

  return mapImpactStats(data as ImpactStatsRow);
}

export async function updateImpactStats(
  id: string,
  input: UpdateImpactStatsInput
): Promise<ImpactStats> {
  const { data, error } = await supabase
    .from("impact_stats")
    .update({
      vaccinated: input.vaccinated,
      castrations: input.castrations,
      tests: input.tests,
      sheltered: input.sheltered,
      citizens: input.citizens,
      updated_at: new Date().toISOString(),
    })
    .eq("id", id)
    .select()
    .single();

  if (error) {
    console.error("Erro ao atualizar estatísticas:", error);
    throw error;
  }

  return mapImpactStats(data as ImpactStatsRow);
}