
import { api } from "./api";

export interface Servico {
    id: string;
    nome: string;
    descricao: string | null;
    ativo: boolean;
}

export interface CriarSolicitacaoData {
    animalId: string;
    servicoId: string;
    observacoes?: string;
}

export type StatusSolicitacao =
    | "PENDENTE"
    | "EM_ANALISE"
    | "APROVADA"
    | "RECUSADA"
    | "AGENDADA"
    | "CONCLUIDA"
    | "CANCELADA";

export interface HistoricoSolicitacao {
    id: string;
    solicitacaoId: string;
    statusAnterior: StatusSolicitacao | null;
    statusNovo: StatusSolicitacao;
    observacao: string | null;
    alteradoPorId: string | null;
    createdAt: string;
}

export interface Solicitacao {
    id: string;
    organizacaoId: string;
    tutorId: string;
    animalId: string;
    servicoId: string;
    status: StatusSolicitacao;
    observacoes: string | null;
    observacoesAnalise: string | null;
    analisadoPorId: string | null;
    analisadoEm: string | null;
    createdAt: string;
    updatedAt: string;
    animal: {
        id: string;
        nome: string;
        especie: string;
        sexo?: string;
        raca?: string | null;
    };
    servico: {
        id: string;
        nome: string;
        descricao?: string | null;
    };
    historicos?: HistoricoSolicitacao[];
}

export async function listarServicos(): Promise<Servico[]> {
    const response = await api.get<Servico[]>("/services");
    return response.data;
}

export async function criarSolicitacao(
    dados: CriarSolicitacaoData,
): Promise<Solicitacao> {
    const response = await api.post<Solicitacao>(
        "/solicitations",
        dados,
    );

    return response.data;
}

export async function listarMinhasSolicitacoes(): Promise<Solicitacao[]> {
    const response = await api.get<Solicitacao[]>("/solicitations/my");
    return response.data;
}

export async function consultarSolicitacao(
    id: string,
): Promise<Solicitacao> {
    const response = await api.get<Solicitacao>(
        `/solicitations/my/${id}`,
    );

    return response.data;
}
