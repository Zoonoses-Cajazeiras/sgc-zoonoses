
import { api } from "./api";

export interface Animal {
  id: string;
  nome: string;
  especie: "CAO" | "GATO" | "OUTRA";
  sexo: "MACHO" | "FEMEA" | "NAO_INFORMADO";
  raca: string | null;
  cor: string | null;
  porte: "PEQUENO" | "MEDIO" | "GRANDE" | "NAO_INFORMADO";
  dataNascimento: string | null;
  idadeAproximadaMeses: number | null;
  fotoUrl: string | null;
  observacoes: string | null;
  ativo: boolean;
  createdAt: string;
  updatedAt: string;
}

export async function listarMeusAnimais(): Promise<Animal[]> {
  const response = await api.get<Animal[]>("/animals/my-animals");
  return response.data;
}
export async function excluirAnimal(id: string): Promise<void> {
  await api.delete(`/animals/${id}`);
}