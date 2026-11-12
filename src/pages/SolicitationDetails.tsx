
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  FiArrowLeft,
  FiClipboard,
  FiCalendar,
  FiClock,
  FiCheckCircle,
  FiXCircle,
  FiAlertCircle,
  FiLoader,
  FiFileText,
} from "react-icons/fi";

import {
  consultarSolicitacao,
} from "../services/solicitations";

import type {
  Solicitacao,
  StatusSolicitacao,
} from "../services/solicitations";

const statusConfig: Record<
  StatusSolicitacao,
  { label: string; className: string; icon: typeof FiClock }
> = {
  PENDENTE: {
    label: "Pendente",
    className: "bg-yellow-50 text-yellow-700",
    icon: FiClock,
  },
  EM_ANALISE: {
    label: "Em análise",
    className: "bg-blue-50 text-blue-700",
    icon: FiAlertCircle,
  },
  APROVADA: {
    label: "Aprovada",
    className: "bg-green-50 text-green-700",
    icon: FiCheckCircle,
  },
  RECUSADA: {
    label: "Recusada",
    className: "bg-red-50 text-red-700",
    icon: FiXCircle,
  },
  AGENDADA: {
    label: "Agendada",
    className: "bg-purple-50 text-purple-700",
    icon: FiCalendar,
  },
  CONCLUIDA: {
    label: "Concluída",
    className: "bg-green-50 text-green-700",
    icon: FiCheckCircle,
  },
  CANCELADA: {
    label: "Cancelada",
    className: "bg-gray-100 text-gray-600",
    icon: FiXCircle,
  },
};

function formatarData(data: string) {
  return new Date(data).toLocaleString("pt-BR", {
    day: "2-digit",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default function SolicitationDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [solicitacao, setSolicitacao] =
    useState<Solicitacao | null>(null);

  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState("");

  useEffect(() => {
    async function carregarDetalhes() {
      if (!id) {
        setErro("Identificador da solicitação não informado.");
        setCarregando(false);
        return;
      }

      try {
        const resposta = await consultarSolicitacao(id);
        setSolicitacao(resposta);
      } catch (error: any) {
        console.error("Erro ao carregar detalhes:", error);

        setErro(
          error.response?.data?.message ||
            "Não foi possível carregar os detalhes da solicitação."
        );
      } finally {
        setCarregando(false);
      }
    }

    carregarDetalhes();
  }, [id]);

  if (carregando) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#F5F8F8] text-[#026B6D]">
        <FiLoader className="animate-spin text-4xl mb-3" />
        <p className="font-medium">Carregando detalhes...</p>
      </div>
    );
  }

  if (erro || !solicitacao) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#F5F8F8] px-5">
        <FiAlertCircle className="text-red-500 text-5xl mb-4" />

        <h2 className="text-xl font-bold text-gray-800">
          Não foi possível encontrar a solicitação
        </h2>

        <p className="text-sm text-gray-500 mt-2 text-center">
          {erro || "Solicitação não encontrada."}
        </p>

        <button
          type="button"
          onClick={() => navigate("/solicitacoes/minhas")}
          className="mt-6 bg-[#05ABAD] hover:bg-[#026B6D] text-white px-5 py-3 rounded-xl font-semibold transition"
        >
          Voltar às solicitações
        </button>
      </div>
    );
  }

  const statusAtual = statusConfig[solicitacao.status];
  const StatusIcon = statusAtual.icon;

  const historicos = [...(solicitacao.historicos || [])].sort(
    (a, b) =>
      new Date(a.createdAt).getTime() -
      new Date(b.createdAt).getTime()
  );

  return (
    <div className="min-h-screen bg-[#F5F8F8]">
      <header className="bg-white border-b border-gray-100">
        <div className="max-w-5xl mx-auto px-5 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-[#026B6D]">
              Núcleo de Zoonoses
            </h1>
            <p className="text-xs text-gray-500">
              Prefeitura de Cajazeiras
            </p>
          </div>

          <button
            type="button"
            onClick={() => navigate("/solicitacoes/minhas")}
            className="flex items-center gap-2 text-sm font-medium text-gray-500 hover:text-[#026B6D] transition"
          >
            <FiArrowLeft />
            Voltar
          </button>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-5 py-8 md:py-12">
        <div className="mb-8">
          <p className="text-sm text-gray-500 mb-1">
            Área do cidadão
          </p>

          <h2 className="text-2xl md:text-3xl font-bold text-gray-800">
            Detalhes da solicitação
          </h2>

          <p className="text-sm text-gray-500 mt-2">
            Protocolo: {solicitacao.id.slice(0, 8).toUpperCase()}
          </p>
        </div>

        <section className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 md:p-8 mb-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-[#E8F7F7] flex items-center justify-center">
                <FiClipboard className="text-[#05ABAD] text-xl" />
              </div>

              <div>
                <h3 className="font-bold text-gray-800 text-lg">
                  {solicitacao.servico.nome}
                </h3>

                <p className="text-sm text-gray-500">
                  Serviço solicitado
                </p>
              </div>
            </div>

            <span
              className={`inline-flex items-center gap-2 w-fit px-3 py-2 rounded-full text-xs font-semibold ${statusAtual.className}`}
            >
              <StatusIcon />
              {statusAtual.label}
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 border-t border-gray-100 pt-6">
            <div>
              <p className="text-xs text-gray-400 mb-1">
                Animal
              </p>

              <p className="font-semibold text-gray-800">
                {solicitacao.animal.nome}
              </p>
            </div>

            <div>
              <p className="text-xs text-gray-400 mb-1">
                Espécie
              </p>

              <p className="font-semibold text-gray-800">
                {solicitacao.animal.especie === "CAO"
                  ? "Cachorro"
                  : solicitacao.animal.especie === "GATO"
                    ? "Gato"
                    : "Outro"}
              </p>
            </div>

            <div>
              <p className="text-xs text-gray-400 mb-1">
                Data da solicitação
              </p>

              <p className="flex items-center gap-2 text-sm font-medium text-gray-700">
                <FiCalendar className="text-[#05ABAD]" />
                {formatarData(solicitacao.createdAt)}
              </p>
            </div>

            <div>
              <p className="text-xs text-gray-400 mb-1">
                Última atualização
              </p>

              <p className="flex items-center gap-2 text-sm font-medium text-gray-700">
                <FiClock className="text-[#05ABAD]" />
                {formatarData(solicitacao.updatedAt)}
              </p>
            </div>
          </div>

          {solicitacao.observacoes && (
            <div className="mt-6 pt-6 border-t border-gray-100">
              <h4 className="flex items-center gap-2 text-sm font-bold text-gray-700 mb-2">
                <FiFileText className="text-[#05ABAD]" />
                Observações do tutor
              </h4>

              <p className="text-sm text-gray-600 leading-relaxed">
                {solicitacao.observacoes}
              </p>
            </div>
          )}

          {solicitacao.observacoesAnalise && (
            <div className="mt-5 bg-blue-50 border border-blue-100 rounded-xl p-4">
              <h4 className="text-sm font-bold text-blue-800 mb-2">
                Retorno da equipe
              </h4>

              <p className="text-sm text-blue-700 leading-relaxed">
                {solicitacao.observacoesAnalise}
              </p>
            </div>
          )}
        </section>

        <section className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 md:p-8">
          <div className="mb-6">
            <h3 className="text-lg font-bold text-gray-800">
              Histórico da solicitação
            </h3>

            <p className="text-sm text-gray-500 mt-1">
              Acompanhe as movimentações do seu pedido.
            </p>
          </div>

          {historicos.length === 0 ? (
            <p className="text-sm text-gray-500">
              Nenhuma movimentação registrada até o momento.
            </p>
          ) : (
            <div className="relative">
              {historicos.map((historico, index) => {
                const config = statusConfig[historico.statusNovo];
                const HistoricoIcon = config.icon;
                const ultimo = index === historicos.length - 1;

                return (
                  <div
                    key={historico.id}
                    className="relative flex gap-4 pb-7 last:pb-0"
                  >
                    <div className="flex flex-col items-center">
                      <div
                        className={`w-10 h-10 rounded-full flex items-center justify-center ${config.className}`}
                      >
                        <HistoricoIcon />
                      </div>

                      {!ultimo && (
                        <div className="w-px flex-1 bg-gray-200 mt-2" />
                      )}
                    </div>

                    <div className="flex-1 pb-2">
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1">
                        <p className="font-semibold text-gray-800">
                          {config.label}
                        </p>

                        <p className="text-xs text-gray-400">
                          {formatarData(historico.createdAt)}
                        </p>
                      </div>

                      {historico.observacao && (
                        <p className="text-sm text-gray-500 mt-2">
                          {historico.observacao}
                        </p>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </section>

        <div className="mt-6">
          <button
            type="button"
            onClick={() => navigate("/solicitacoes/minhas")}
            className="w-full sm:w-auto border border-gray-200 bg-white text-gray-600 hover:bg-gray-50 px-6 py-3 rounded-xl font-semibold transition cursor-pointer"
          >
            Voltar às minhas solicitações
          </button>
        </div>
      </main>
    </div>
  );
}
