
import { api } from "./api";

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

export interface CreateCampaignInput {
  title: string;
  description: string;
  status: CampaignStatus;
  schedule: string | null;
  location: string | null;
  buttonText?: string;
}

export type UpdateCampaignInput =
  Partial<CreateCampaignInput>;

// Lista as campanhas ativas para o site público.
export async function listCampaigns(): Promise<Campaign[]> {
  const { data } = await api.get<Campaign[]>("/campaigns");
  return data;
}

// Lista todas as campanhas para o painel administrativo.
export async function listAdminCampaigns(): Promise<Campaign[]> {
  const { data } = await api.get<Campaign[]>("/campaigns/admin");
  return data;
}

// Cadastra uma campanha.
export async function createCampaign(
  input: CreateCampaignInput,
): Promise<Campaign> {
  const { data } = await api.post<Campaign>("/campaigns", {
    ...input,
    title: input.title.trim(),
    description: input.description.trim(),
    location: input.location?.trim() || null,
    buttonText: input.buttonText?.trim() || "Saiba mais",
  });

  return data;
}

// Edita os campos informados de uma campanha.
export async function updateCampaign(
  id: string,
  input: UpdateCampaignInput,
): Promise<Campaign> {
  const { data } = await api.patch<Campaign>(
    `/campaigns/${id}`,
    input,
  );

  return data;
}

// Exclui uma campanha.
export async function deleteCampaign(id: string): Promise<void> {
  await api.delete(`/campaigns/${id}`);
}
