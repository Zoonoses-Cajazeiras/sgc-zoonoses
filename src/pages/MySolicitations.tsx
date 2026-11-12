
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  FiArrowLeft,
  FiClipboard,
  FiCalendar,
  FiClock,
  FiCheckCircle,
  FiXCircle,
  FiAlertCircle,
  FiLoader,
  FiPlus,
  FiEye,
} from "react-icons/fi";

import {
  listarMinhasSolicitacoes,
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
  return new Date(data).toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
}

export default function MySolicitations() {
  const navigate = useNavigate();

  const [solicitacoes, setSolicitacoes] = useState<Solicitacao[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState("");

  useEffect(() => {
    async function carregarSolicitacoes() {
      try {
        setErro("");

        const resposta = await listarMinhasSolicitacoes();

        setSolicitacoes(resposta);
      } catch (error: any) {
        console.error("Erro ao carregar solicitações:", error);

        setErro(
          error.response?.data?.message ||
            "Não foi possível carregar suas solicitações."
        );
      } finally {
        setCarregando(false);
      }
    }

    carregarSolicitacoes();
  }, []);

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
            onClick={() => navigate("/perfil")}
            className="flex items-center gap-2 text-sm font-medium text-gray-500 hover:text-[#026B6D] transition cursor-pointer"
          >
            <FiArrowLeft />
            Voltar ao perfil
          </button>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-5 py-8 md:py-12">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <div>
            <p className="text-sm text-gray-500 mb-1">
              Área do cidadão
            </p>

            <h2 className="text-2xl md:text-3xl font-bold text-gray-800">
              Minhas solicitações
            </h2>

            <p className="text-gray-500 mt-2">
              Acompanhe os serviços solicitados para seus animais.
            </p>
          </div>

          <button
            type="button"
            onClick={() => navigate("/solicitacoes/nova")}
            className="inline-flex items-center justify-center gap-2 bg-[#05ABAD] hover:bg-[#026B6D] text-white px-5 py-3 rounded-xl font-semibold transition cursor-pointer"
          >
            <FiPlus />
            Nova solicitação
          </button>
        </div>

        {carregando ? (
          <div className="flex flex-col items-center justify-center py-20 text-[#026B6D]">
            <FiLoader className="animate-spin text-4xl mb-3" />
            <p className="font-medium">
              Carregando solicitações...
            </p>
          </div>
        ) : erro ? (
          <section className="bg-white rounded-2xl border border-red-100 p-8 text-center">
            <FiAlertCircle className="text-red-500 text-4xl mx-auto mb-4" />

            <h3 className="font-bold text-gray-800">
              Não foi possível carregar os dados
            </h3>

            <p className="text-sm text-gray-500 mt-2">
              {erro}
            </p>

            <button
              type="button"
              onClick={() => window.location.reload()}
              className="mt-5 bg-[#05ABAD] hover:bg-[#026B6D] text-white px-5 py-2.5 rounded-xl font-semibold transition cursor-pointer"
            >
              Tentar novamente
            </button>
          </section>
        ) : solicitacoes.length === 0 ? (
          <section className="bg-white rounded-2xl border border-gray-100 shadow-sm p-10 text-center">
            <FiClipboard className="text-[#05ABAD] text-5xl mx-auto mb-4" />

            <h3 className="text-lg font-bold text-gray-800">
              Você ainda não possui solicitações
            </h3>

            <p className="text-sm text-gray-500 mt-2 mb-6">
              Quando você solicitar algum serviço, ele aparecerá nesta página.
            </p>

            <button
              type="button"
              onClick={() => navigate("/solicitacoes/nova")}
              className="bg-[#05ABAD] hover:bg-[#026B6D] text-white px-6 py-3 rounded-xl font-semibold transition cursor-pointer"
            >
              Solicitar serviço
            </button>
          </section>
        ) : (
          <div className="space-y-4">
            <div className="flex items-center justify-between text-sm text-gray-500">
              <span>
                {solicitacoes.length}{" "}
                {solicitacoes.length === 1
                  ? "solicitação encontrada"
                  : "solicitações encontradas"}
              </span>
            </div>

            {solicitacoes.map((solicitacao) => {
              const config = statusConfig[solicitacao.status];
              const StatusIcon = config.icon;

              return (
                <article
                  key={solicitacao.id}
                  className="bg-white border border-gray-100 rounded-2xl shadow-sm p-5 md:p-6"
                >
                  <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                    <div>
                      <h3 className="font-bold text-gray-800 text-lg">
                        {solicitacao.servico.nome}
                      </h3>

                      <p className="text-sm text-gray-500 mt-1">
                        Animal:{" "}
                        <span className="font-semibold text-gray-700">
                          {solicitacao.animal.nome}
                        </span>
                      </p>
                    </div>

                    <span
                      className={`inline-flex items-center gap-2 w-fit px-3 py-2 rounded-full text-xs font-semibold ${config.className}`}
                    >
                      <StatusIcon />
                      {config.label}
                    </span>
                  </div>

                  <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-6 mt-5 pt-4 border-t border-gray-100">
                    <p className="flex items-center gap-2 text-sm text-gray-500">
                      <FiCalendar className="text-[#05ABAD]" />
                      Solicitada em {formatarData(solicitacao.createdAt)}
                    </p>

                    <p className="text-xs text-gray-400">
                      Protocolo: {solicitacao.id.slice(0, 8).toUpperCase()}
                    </p>
                  </div>

                  {solicitacao.observacoes && (
                    <div className="mt-4 bg-[#F5F8F8] rounded-xl p-4">
                      <p className="text-xs font-semibold text-gray-600 mb-1">
                        Observações
                      </p>

                      <p className="text-sm text-gray-500">
                        {solicitacao.observacoes}
                      </p>
                    </div>
                  )}

                  {solicitacao.observacoesAnalise && (
                    <div className="mt-3 bg-blue-50 rounded-xl p-4">
                      <p className="text-xs font-semibold text-blue-700 mb-1">
                        Retorno da equipe
                      </p>

                      <p className="text-sm text-blue-700">
                        {solicitacao.observacoesAnalise}
                      </p>
                    </div>
                  )}

                  <div className="mt-5 pt-4 border-t border-gray-100 flex justify-end">
                    <button
                      type="button"
                      onClick={() =>
                        navigate(`/solicitacoes/${solicitacao.id}`)
                      }
                      className="inline-flex items-center gap-2 text-sm font-semibold text-[#05ABAD] hover:text-[#026B6D] transition cursor-pointer"
                    >
                      <FiEye />
                      Ver detalhes
                    </button>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
}
