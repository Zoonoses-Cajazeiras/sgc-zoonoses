
import { api } from "./api";

// Dados de um tutor na listagem administrativa
export interface AdminTutor {
  id: string;
  cpf: string;
  telefone: string;
  cidade: string;
  bairro: string;
  createdAt: string;

  usuario: {
    id: string;
    nome: string;
    email: string;
    ativo: boolean;
    emailVerificadoEm: string | null;
    createdAt: string;
  };

  _count: {
    animais: number;
  };
}

// Resposta da listagem de tutores
export interface AdminTutorsResponse {
  data: AdminTutor[];

  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

// Dados dos animais vinculados ao tutor
export interface AdminTutorAnimal {
  id: string;
  nome: string;
  especie: string;
  sexo: string;
  raca: string | null;
  cor: string | null;
  porte: string | null;
  dataNascimento: string | null;
  idadeAproximadaMeses: number | null;
  fotoUrl: string | null;
  observacoes: string | null;
  ativo: boolean;
  createdAt: string;
}

// Dados completos do tutor
export interface AdminTutorDetails {
  id: string;
  cpf: string;
  dataNascimento: string;
  telefone: string;
  endereco: string;
  numero: string;
  bairro: string;
  cidade: string;
  cep: string;
  createdAt: string;
  updatedAt: string;

  usuario: {
    id: string;
    nome: string;
    email: string;
    ativo: boolean;
    emailVerificadoEm: string | null;
    ultimoAcessoEm: string | null;
    createdAt: string;
  };

  animais: AdminTutorAnimal[];
}

// Listar e pesquisar tutores
export async function listarTutores(
  page = 1,
  limit = 10,
  search = "",
): Promise<AdminTutorsResponse> {
  const { data } = await api.get<AdminTutorsResponse>("/admin/tutors", {
    params: {
      page,
      limit,
      search: search.trim() || undefined,
    },
  });

  return data;
}

// Consultar detalhes de um tutor
export async function consultarTutor(
  id: string,
): Promise<AdminTutorDetails> {
  const { data } = await api.get<AdminTutorDetails>(
    `/admin/tutors/${id}`,
  );

  return data;
}
