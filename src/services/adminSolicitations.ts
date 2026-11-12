
import { api } from "./api";

export type StatusSolicitacao =
  | "PENDENTE"
  | "EM_ANALISE"
  | "APROVADA"
  | "RECUSADA"
  | "AGENDADA"
  | "CONCLUIDA"
  | "CANCELADA";

export type DecisaoSolicitacao = "APROVADA" | "RECUSADA";

export interface ServicoAdmin {
  id: string;
  nome: string;
  descricao: string | null;
}

export interface SolicitacaoAdmin {
  id: string;
  status: StatusSolicitacao;
  observacoes: string | null;
  observacoesAnalise: string | null;
  createdAt: string;
  updatedAt: string;

  tutor: {
    id: string;
    telefone: string;
    usuario: {
      nome: string;
      email: string;
    };
  };

  animal: {
    id: string;
    nome: string;
    especie: "CAO" | "GATO" | "OUTRA";
    sexo: "MACHO" | "FEMEA" | "NAO_INFORMADO";
    porte: "PEQUENO" | "MEDIO" | "GRANDE" | "NAO_INFORMADO";
  };

  servico: {
    id: string;
    nome: string;
  };
}

export interface ListagemSolicitacoesAdmin {
  data: SolicitacaoAdmin[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface FiltrosSolicitacoesAdmin {
  page?: number;
  limit?: number;
  search?: string;
  status?: StatusSolicitacao | "";
  servicoId?: string;
}

export async function listarSolicitacoesAdmin(
  filtros: FiltrosSolicitacoesAdmin = {},
): Promise<ListagemSolicitacoesAdmin> {
  const response = await api.get<ListagemSolicitacoesAdmin>(
    "/admin/solicitations",
    {
      params: filtros,
    },
  );

  return response.data;
}

export async function listarServicosAdmin(): Promise<ServicoAdmin[]> {
  const response = await api.get<ServicoAdmin[]>(
    "/admin/solicitations/services",
  );

  return response.data;
}

export async function consultarSolicitacaoAdmin(
  id: string,
): Promise<SolicitacaoAdmin> {
  const response = await api.get<SolicitacaoAdmin>(
    `/admin/solicitations/${id}`,
  );

  return response.data;
}

export async function decidirSolicitacaoAdmin(
  id: string,
  dados: {
    status: DecisaoSolicitacao;
    observacao?: string;
  },
): Promise<SolicitacaoAdmin> {
  const response = await api.patch<SolicitacaoAdmin>(
    `/admin/solicitations/${id}/status`,
    dados,
  );

  return response.data;
}
