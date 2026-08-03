import { supabase } from "./supabase";

export type CampaignStatus =
  | "ativa"
  | "encerrada"
  | "rascunho";

export interface Campaign {
  id: string;
  title: string;
  description: string;
  status: CampaignStatus;
  schedule: string | null;
  location: string | null;
  buttonText: string;
  createdBy: string | null;
  createdAt: string;
  updatedAt: string;
}

interface CampaignRow {
  id: string;
  title: string;
  description: string;
  status: CampaignStatus;
  schedule: string | null;
  location: string | null;
  button_text: string | null;
  created_by: string | null;
  created_at: string;
  updated_at: string;
}

export interface CreateCampaignInput {
  title: string;
  description: string;
  status: CampaignStatus;
  schedule: string | null;
  location: string | null;
  buttonText?: string;
}

function mapCampaign(row: CampaignRow): Campaign {
  return {
    id: row.id,
    title: row.title,
    description: row.description,
    status: row.status,
    schedule: row.schedule,
    location: row.location,
    buttonText: row.button_text ?? "Saiba mais",
    createdBy: row.created_by,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

//listas campanhas

export async function listCampaigns(): Promise<Campaign[]> {
  const { data, error } = await supabase
    .from("campaigns")
    .select(`
      id,
      title,
      description,
      status,
      schedule,
      location,
      button_text,
      created_by,
      created_at,
      updated_at
    `)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Erro ao listar campanhas:", error);
    throw error;
  }

  return (data ?? []).map((row) =>
    mapCampaign(row as CampaignRow)
  );
}

//cadastrar campanha

export async function createCampaign(
  input: CreateCampaignInput
): Promise<Campaign> {
  const {
    data: authData,
    error: authError,
  } = await supabase.auth.getUser();

  if (authError) {
    console.error("Erro ao identificar usuário:", authError);
    throw authError;
  }

  const user = authData.user;

  if (!user) {
    throw new Error(
      "É necessário estar autenticado para criar uma campanha."
    );
  }

  const { data, error } = await supabase
    .from("campaigns")
    .insert({
      title: input.title.trim(),
      description: input.description.trim(),
      status: input.status,
      schedule: input.schedule,
      location: input.location?.trim() || null,
      button_text: input.buttonText?.trim() || "Saiba mais",
      created_by: user.id,
    })
    .select()
    .single();

  if (error) {
    console.error("Erro ao criar campanha:", error);
    throw error;
  }

  return mapCampaign(data as CampaignRow);
}

//excluir campanha

export async function deleteCampaign(
  id: string
): Promise<void> {
  const { error } = await supabase
    .from("campaigns")
    .delete()
    .eq("id", id);

  if (error) {
    console.error("Erro ao excluir campanha:", error);
    throw error;
  }
}