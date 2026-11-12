
import { useCallback, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
    FiArrowLeft,
    FiSearch,
    FiClipboard,
    FiUser,
    FiHeart,
    FiCalendar,
    FiEye,
    FiChevronLeft,
    FiChevronRight,
    FiX,
    FiRefreshCw,
    FiAlertCircle,
    FiClock,
    FiMapPin,
    FiCheckCircle,
} from "react-icons/fi";

import { getSession, logout } from "../services/auth";

import {
    listarSolicitacoesAdmin,
    listarServicosAdmin,
    consultarSolicitacaoAdmin,
    decidirSolicitacaoAdmin,
    type SolicitacaoAdmin,
    type ServicoAdmin,
    type StatusSolicitacao,
} from "../services/adminSolicitations";

type FiltroStatus = StatusSolicitacao | "TODAS";

interface DetalheSolicitacao extends SolicitacaoAdmin {
    tutor: SolicitacaoAdmin["tutor"] & {
        cpf?: string;
        endereco?: string;
        numero?: string;
        bairro?: string;
        cidade?: string;
        cep?: string;
    };

    animal: SolicitacaoAdmin["animal"] & {
        raca?: string | null;
        cor?: string | null;
        observacoes?: string | null;
        dataNascimento?: string | null;
        idadeAproximadaMeses?: number | null;
    };

    historicos?: {
        id: string;
        statusAnterior: StatusSolicitacao | null;
        statusNovo: StatusSolicitacao;
        observacao: string | null;
        createdAt: string;
    }[];

    agendamentos?: {
        id: string;
        dataInicio: string;
        dataFim: string;
        local: string;
        observacoes: string | null;
        status: string;
    }[];
}

const statusConfig: Record<
    StatusSolicitacao,
    { label: string; classes: string }
> = {
    PENDENTE: {
        label: "Pendente",
        classes: "bg-amber-50 text-amber-700",
    },
    EM_ANALISE: {
        label: "Em análise",
        classes: "bg-blue-50 text-blue-700",
    },
    APROVADA: {
        label: "Aprovada",
        classes: "bg-green-50 text-green-700",
    },
    RECUSADA: {
        label: "Recusada",
        classes: "bg-red-50 text-red-600",
    },
    AGENDADA: {
        label: "Agendada",
        classes: "bg-purple-50 text-purple-700",
    },
    CONCLUIDA: {
        label: "Concluída",
        classes: "bg-emerald-50 text-emerald-700",
    },
    CANCELADA: {
        label: "Cancelada",
        classes: "bg-gray-100 text-gray-600",
    },
};

const filtrosStatus: { valor: FiltroStatus; label: string }[] = [
    { valor: "TODAS", label: "Todas" },
    { valor: "PENDENTE", label: "Pendentes" },
    { valor: "EM_ANALISE", label: "Em análise" },
    { valor: "APROVADA", label: "Aprovadas" },
    { valor: "RECUSADA", label: "Recusadas" },
    { valor: "AGENDADA", label: "Agendadas" },
    { valor: "CONCLUIDA", label: "Concluídas" },
    { valor: "CANCELADA", label: "Canceladas" },
];

export default function AdminSolicitations() {
    const navigate = useNavigate();

    const [solicitacoes, setSolicitacoes] = useState<SolicitacaoAdmin[]>([]);
    const [servicos, setServicos] = useState<ServicoAdmin[]>([]);

    const [busca, setBusca] = useState("");
    const [statusSelecionado, setStatusSelecionado] =
        useState<FiltroStatus>("TODAS");
    const [servicoSelecionado, setServicoSelecionado] = useState("");

    const [pagina, setPagina] = useState(1);
    const [totalPaginas, setTotalPaginas] = useState(1);
    const [totalSolicitacoes, setTotalSolicitacoes] = useState(0);

    const [carregando, setCarregando] = useState(true);
    const [erro, setErro] = useState("");

    const [solicitacaoSelecionada, setSolicitacaoSelecionada] =
        useState<DetalheSolicitacao | null>(null);

    const [carregandoDetalhes, setCarregandoDetalhes] = useState(false);
    const [erroDetalhes, setErroDetalhes] = useState("");

    const [observacaoAnalise, setObservacaoAnalise] = useState("");
    const [decidindo, setDecidindo] = useState(false);
    const [erroDecisao, setErroDecisao] = useState("");
    const [sucessoDecisao, setSucessoDecisao] = useState("");

    useEffect(() => {
        async function verificarAcesso() {
            try {
                const session = await getSession();

                if (!session || session.user.papel !== "ADMIN") {
                    await logout();
                    navigate("/login");
                }
            } catch {
                await logout();
                navigate("/login");
            }
        }

        verificarAcesso();
    }, [navigate]);

    const carregarServicos = useCallback(async () => {
        try {
            const resposta = await listarServicosAdmin();
            setServicos(resposta);
        } catch (error) {
            console.error("Erro ao carregar serviços:", error);
        }
    }, []);

    const carregarSolicitacoes = useCallback(async () => {
        try {
            setCarregando(true);
            setErro("");

            const resposta = await listarSolicitacoesAdmin({
                page: pagina,
                limit: 10,
                search: busca.trim() || undefined,
                status:
                    statusSelecionado === "TODAS"
                        ? undefined
                        : statusSelecionado,
                servicoId: servicoSelecionado || undefined,
            });

            setSolicitacoes(resposta.data);
            setTotalSolicitacoes(resposta.pagination.total);
            setTotalPaginas(Math.max(1, resposta.pagination.totalPages));
        } catch (error: any) {
            console.error("Erro ao carregar solicitações:", error);

            setErro(
                error.response?.data?.message ||
                "Não foi possível carregar as solicitações.",
            );
        } finally {
            setCarregando(false);
        }
    }, [pagina, busca, statusSelecionado, servicoSelecionado]);

    useEffect(() => {
        carregarServicos();
    }, [carregarServicos]);

    useEffect(() => {
        const timeout = window.setTimeout(() => {
            carregarSolicitacoes();
        }, busca ? 350 : 0);

        return () => window.clearTimeout(timeout);
    }, [carregarSolicitacoes, busca]);

    function handleBusca(valor: string) {
        setBusca(valor);
        setPagina(1);
    }

    function handleStatus(valor: FiltroStatus) {
        setStatusSelecionado(valor);
        setPagina(1);
    }

    function handleServico(valor: string) {
        setServicoSelecionado(valor);
        setPagina(1);
    }

    async function abrirDetalhes(id: string) {
        try {
            setCarregandoDetalhes(true);
            setErroDetalhes("");
            setObservacaoAnalise("");
            setErroDecisao("");
            setSucessoDecisao("");
            setSolicitacaoSelecionada(null);

            const resposta = await consultarSolicitacaoAdmin(id);

            setSolicitacaoSelecionada(
                resposta as DetalheSolicitacao,
            );
        } catch (error: any) {
            console.error("Erro ao consultar solicitação:", error);

            setErroDetalhes(
                error.response?.data?.message ||
                "Não foi possível carregar os detalhes da solicitação.",
            );
        } finally {
            setCarregandoDetalhes(false);
        }
    }


    async function handleDecisao(status: "APROVADA" | "RECUSADA") {
        if (!solicitacaoSelecionada) return;

        const observacao = observacaoAnalise.trim();

        if (status === "RECUSADA" && !observacao) {
            setErroDecisao(
                "Informe uma justificativa para recusar a solicitação.",
            );
            return;
        }

        try {
            setDecidindo(true);
            setErroDecisao("");
            setSucessoDecisao("");

            const resposta = await decidirSolicitacaoAdmin(
                solicitacaoSelecionada.id,
                {
                    status,
                    observacao: observacao || undefined,
                },
            );

            setSolicitacaoSelecionada(
                resposta as DetalheSolicitacao,
            );

            setSolicitacoes((atuais) =>
                atuais.map((item) =>
                    item.id === resposta.id
                        ? {
                            ...item,
                            status: resposta.status,
                            observacoesAnalise: resposta.observacoesAnalise,
                            updatedAt: resposta.updatedAt,
                        }
                        : item,
                ),
            );

            setObservacaoAnalise("");
            setSucessoDecisao(
                status === "APROVADA"
                    ? "Solicitação aprovada com sucesso!"
                    : "Solicitação recusada com sucesso!",
            );
        } catch (error: any) {
            console.error("Erro ao decidir solicitação:", error);

            setErroDecisao(
                error.response?.data?.message ||
                "Não foi possível registrar a decisão.",
            );
        } finally {
            setDecidindo(false);
        }
    }


    function fecharDetalhes() {
        setSolicitacaoSelecionada(null);
        setErroDetalhes("");
    }

    async function handleLogout() {
        await logout();
        navigate("/login");
    }

    function formatarData(data: string | null | undefined) {
        if (!data) return "Não informado";

        return new Date(data).toLocaleDateString("pt-BR", {
            timeZone: "America/Fortaleza",
        });
    }

    function formatarDataHora(data: string | null | undefined) {
        if (!data) return "Não informado";

        return new Date(data).toLocaleString("pt-BR", {
            timeZone: "America/Fortaleza",
        });
    }

    function formatarEspecie(especie: string) {
        const especies: Record<string, string> = {
            CAO: "Cachorro",
            GATO: "Gato",
            OUTRA: "Outra",
        };

        return especies[especie] || especie;
    }

    function formatarSexo(sexo: string) {
        const sexos: Record<string, string> = {
            MACHO: "Macho",
            FEMEA: "Fêmea",
            NAO_INFORMADO: "Não informado",
        };

        return sexos[sexo] || sexo;
    }

    function copiarProtocolo(id: string) {
        navigator.clipboard.writeText(id);
    }

    return (
        <div className="min-h-screen bg-[#F5F8F8]">
            <header className="bg-white border-b border-gray-100">
                <div className="max-w-7xl mx-auto px-5 py-4 flex items-center justify-between">
                    <div>
                        <div className="flex items-center gap-2">
                            <FiHeart className="text-[#026B6D] text-xl" />

                            <h1 className="text-xl font-bold text-[#026B6D]">
                                Núcleo de Zoonoses
                            </h1>
                        </div>

                        <p className="text-xs text-gray-500 ml-7">
                            Prefeitura de Cajazeiras
                        </p>
                    </div>

                    <button
                        type="button"
                        onClick={handleLogout}
                        className="text-sm font-medium text-gray-500 hover:text-red-500 transition cursor-pointer"
                    >
                        Sair
                    </button>
                </div>
            </header>

            <main className="max-w-7xl mx-auto px-5 py-8 md:py-10">
                <Link
                    to="/admin"
                    className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-[#026B6D] transition mb-6 cursor-pointer"
                >
                    <FiArrowLeft />
                    Voltar ao painel
                </Link>

                <section className="mb-8">
                    <p className="text-sm text-[#05ABAD] font-semibold mb-1">
                        Área administrativa
                    </p>

                    <h2 className="text-2xl md:text-3xl font-bold text-gray-800">
                        Solicitações de serviços
                    </h2>

                    <p className="text-gray-500 mt-2">
                        Consulte, organize e acompanhe os pedidos enviados pelos tutores.
                    </p>
                </section>

                <section className="bg-white border border-gray-100 rounded-2xl shadow-sm p-5 md:p-6 mb-6">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-5">
                        <div>
                            <h3 className="text-lg font-bold text-gray-800">
                                Solicitações recebidas
                            </h3>

                            <p className="text-sm text-gray-500 mt-1">
                                {totalSolicitacoes}{" "}
                                {totalSolicitacoes === 1
                                    ? "solicitação encontrada"
                                    : "solicitações encontradas"}
                            </p>
                        </div>

                        <button
                            type="button"
                            onClick={carregarSolicitacoes}
                            className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50 transition text-sm font-medium cursor-pointer"
                        >
                            <FiRefreshCw />
                            Atualizar
                        </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-5">
                        <div className="relative">
                            <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />

                            <input
                                type="text"
                                value={busca}
                                onChange={(e) => handleBusca(e.target.value)}
                                placeholder="Pesquisar tutor, animal, serviço ou protocolo..."
                                className="w-full pl-11 pr-4 py-3 rounded-xl border border-gray-200 bg-[#FAFCFC] text-gray-700 placeholder:text-gray-400 outline-none focus:border-[#05ABAD] focus:ring-2 focus:ring-[#05ABAD]/10 transition"
                            />
                        </div>

                        <select
                            value={servicoSelecionado}
                            onChange={(e) => handleServico(e.target.value)}
                            className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-[#FAFCFC] text-gray-700 outline-none focus:border-[#05ABAD] focus:ring-2 focus:ring-[#05ABAD]/10 transition"
                        >
                            <option value="">Todos os serviços</option>

                            {servicos.map((servico) => (
                                <option key={servico.id} value={servico.id}>
                                    {servico.nome}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <p className="text-xs font-semibold text-gray-500 mb-3">
                            FILTRAR POR SITUAÇÃO
                        </p>

                        <div className="flex flex-wrap gap-2">
                            {filtrosStatus.map((filtro) => (
                                <button
                                    key={filtro.valor}
                                    type="button"
                                    onClick={() => handleStatus(filtro.valor)}
                                    className={`px-3.5 py-2 rounded-lg text-sm font-medium border transition cursor-pointer ${statusSelecionado === filtro.valor
                                        ? "bg-[#026B6D] text-white border-[#026B6D]"
                                        : "bg-white text-gray-600 border-gray-200 hover:border-[#05ABAD] hover:text-[#026B6D]"
                                        }`}
                                >
                                    {filtro.label}
                                </button>
                            ))}
                        </div>
                    </div>
                </section>

                {erro && (
                    <div className="bg-red-50 border border-red-100 text-red-600 rounded-xl p-4 mb-6 flex items-center gap-3">
                        <FiAlertCircle className="shrink-0" />
                        <p className="text-sm">{erro}</p>
                    </div>
                )}

                <section className="bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden">
                    {carregando ? (
                        <div className="flex flex-col items-center justify-center py-16">
                            <div className="w-9 h-9 border-4 border-[#BCE7E7] border-t-[#026B6D] rounded-full animate-spin" />

                            <p className="text-sm text-gray-500 mt-4">
                                Carregando solicitações...
                            </p>
                        </div>
                    ) : solicitacoes.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-16 px-5 text-center">
                            <div className="w-14 h-14 rounded-full bg-[#E2F7F7] flex items-center justify-center mb-4">
                                <FiClipboard className="text-[#026B6D] text-2xl" />
                            </div>

                            <h3 className="font-bold text-gray-800">
                                Nenhuma solicitação encontrada
                            </h3>

                            <p className="text-sm text-gray-500 mt-2 max-w-md">
                                {busca || statusSelecionado !== "TODAS" || servicoSelecionado
                                    ? "Não encontramos resultados com os filtros selecionados. Experimente alterar sua pesquisa."
                                    : "Ainda não existem solicitações de serviços cadastradas."}
                            </p>
                        </div>
                    ) : (
                        <>
                            <div className="divide-y divide-gray-100">
                                {solicitacoes.map((solicitacao) => (
                                    <div
                                        key={solicitacao.id}
                                        className="p-5 md:p-6 flex flex-col xl:flex-row xl:items-center gap-5 hover:bg-[#FAFCFC] transition"
                                    >
                                        <div className="w-12 h-12 rounded-full bg-[#E2F7F7] flex items-center justify-center shrink-0">
                                            <FiClipboard className="text-[#026B6D] text-xl" />
                                        </div>

                                        <div className="flex-1 min-w-0">
                                            <div className="flex flex-wrap items-center gap-2 mb-3">
                                                <h4 className="font-bold text-gray-800">
                                                    {solicitacao.servico.nome}
                                                </h4>

                                                <span
                                                    className={`text-xs px-2.5 py-1 rounded-full font-medium ${statusConfig[solicitacao.status].classes
                                                        }`}
                                                >
                                                    {statusConfig[solicitacao.status].label}
                                                </span>
                                            </div>

                                            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-2 text-sm text-gray-500">
                                                <p className="flex items-center gap-2 min-w-0">
                                                    <FiUser className="shrink-0" />
                                                    <span className="truncate">
                                                        {solicitacao.tutor.usuario.nome}
                                                    </span>
                                                </p>

                                                <p className="flex items-center gap-2">
                                                    <FiHeart className="shrink-0" />
                                                    {solicitacao.animal.nome}
                                                </p>

                                                <p className="flex items-center gap-2">
                                                    <FiCalendar className="shrink-0" />
                                                    {formatarData(solicitacao.createdAt)}
                                                </p>
                                            </div>

                                            <div className="mt-3 flex flex-wrap items-center gap-2">
                                                <span className="text-xs text-gray-400">
                                                    Protocolo:
                                                </span>

                                                <span className="text-xs text-gray-500 font-mono break-all">
                                                    {solicitacao.id}
                                                </span>

                                                <button
                                                    type="button"
                                                    onClick={() => copiarProtocolo(solicitacao.id)}
                                                    className="text-xs font-semibold text-[#05ABAD] hover:text-[#026B6D] cursor-pointer"
                                                >
                                                    Copiar
                                                </button>
                                            </div>
                                        </div>

                                        <button
                                            type="button"
                                            onClick={() => abrirDetalhes(solicitacao.id)}
                                            className="inline-flex items-center justify-center gap-2 px-5 py-3 bg-[#026B6D] hover:bg-[#0D6C73] text-white rounded-lg text-sm font-semibold transition cursor-pointer shrink-0"
                                        >
                                            <FiEye />
                                            Ver detalhes
                                        </button>
                                    </div>
                                ))}
                            </div>

                            <div className="border-t border-gray-100 px-5 py-4 flex flex-col sm:flex-row items-center justify-between gap-4">
                                <p className="text-sm text-gray-500">
                                    Página {pagina} de {totalPaginas}
                                </p>

                                <div className="flex items-center gap-2">
                                    <button
                                        type="button"
                                        disabled={pagina <= 1}
                                        onClick={() => setPagina((atual) => atual - 1)}
                                        className="flex items-center gap-1 px-3 py-2 rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition cursor-pointer"
                                    >
                                        <FiChevronLeft />
                                        Anterior
                                    </button>

                                    <button
                                        type="button"
                                        disabled={pagina >= totalPaginas}
                                        onClick={() => setPagina((atual) => atual + 1)}
                                        className="flex items-center gap-1 px-3 py-2 rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition cursor-pointer"
                                    >
                                        Próxima
                                        <FiChevronRight />
                                    </button>
                                </div>
                            </div>
                        </>
                    )}
                </section>
            </main>

            {(carregandoDetalhes || solicitacaoSelecionada || erroDetalhes) && (
                <div
                    className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4"
                    onClick={fecharDetalhes}
                >
                    <div
                        className="bg-white w-full max-w-3xl max-h-[90vh] overflow-y-auto rounded-2xl shadow-xl"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="sticky top-0 z-10 bg-white border-b border-gray-100 px-5 md:px-7 py-4 flex items-center justify-between">
                            <div>
                                <h3 className="text-lg font-bold text-gray-800">
                                    Detalhes da solicitação
                                </h3>

                                <p className="text-xs text-gray-500 mt-1">
                                    Informações do pedido e histórico de acompanhamento
                                </p>
                            </div>

                            <button
                                type="button"
                                onClick={fecharDetalhes}
                                className="w-9 h-9 rounded-full flex items-center justify-center text-gray-500 hover:bg-gray-100 transition cursor-pointer"
                            >
                                <FiX className="text-xl" />
                            </button>
                        </div>

                        {carregandoDetalhes ? (
                            <div className="py-16 flex flex-col items-center">
                                <div className="w-9 h-9 border-4 border-[#BCE7E7] border-t-[#026B6D] rounded-full animate-spin" />

                                <p className="text-sm text-gray-500 mt-4">
                                    Carregando informações...
                                </p>
                            </div>
                        ) : erroDetalhes ? (
                            <div className="p-7 text-center">
                                <FiAlertCircle className="text-red-500 text-3xl mx-auto mb-3" />
                                <p className="text-sm text-red-600">{erroDetalhes}</p>
                            </div>
                        ) : solicitacaoSelecionada ? (
                            <div className="p-5 md:p-7 space-y-7">
                                <section>
                                    <div className="flex flex-wrap items-center gap-2 mb-4">
                                        <h4 className="text-lg font-bold text-gray-800">
                                            {solicitacaoSelecionada.servico.nome}
                                        </h4>

                                        <span
                                            className={`text-xs px-2.5 py-1 rounded-full font-medium ${statusConfig[solicitacaoSelecionada.status].classes
                                                }`}
                                        >
                                            {statusConfig[solicitacaoSelecionada.status].label}
                                        </span>
                                    </div>

                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        <DetailItem
                                            icon={<FiUser />}
                                            label="Tutor"
                                            value={solicitacaoSelecionada.tutor.usuario.nome}
                                        />

                                        <DetailItem
                                            icon={<FiHeart />}
                                            label="Animal"
                                            value={solicitacaoSelecionada.animal.nome}
                                        />

                                        <DetailItem
                                            icon={<FiCalendar />}
                                            label="Data da solicitação"
                                            value={formatarDataHora(
                                                solicitacaoSelecionada.createdAt,
                                            )}
                                        />

                                        <DetailItem
                                            icon={<FiClock />}
                                            label="Última atualização"
                                            value={formatarDataHora(
                                                solicitacaoSelecionada.updatedAt,
                                            )}
                                        />

                                        <DetailItem
                                            icon={<FiClipboard />}
                                            label="Protocolo"
                                            value={solicitacaoSelecionada.id}
                                        />

                                        <DetailItem
                                            icon={<FiUser />}
                                            label="Telefone do tutor"
                                            value={solicitacaoSelecionada.tutor.telefone}
                                        />

                                        <DetailItem
                                            icon={<FiMapPin />}
                                            label="Endereço do tutor"
                                            value={
                                                solicitacaoSelecionada.tutor.endereco
                                                    ? `${solicitacaoSelecionada.tutor.endereco}, ${solicitacaoSelecionada.tutor.numero || "S/N"} - ${solicitacaoSelecionada.tutor.bairro || ""}, ${solicitacaoSelecionada.tutor.cidade || ""}`
                                                    : "Não informado"
                                            }
                                        />
                                    </div>
                                </section>

                                <section>
                                    <h4 className="font-bold text-gray-800 mb-4">
                                        Dados do animal
                                    </h4>

                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        <DetailItem
                                            icon={<FiHeart />}
                                            label="Nome"
                                            value={solicitacaoSelecionada.animal.nome}
                                        />

                                        <DetailItem
                                            icon={<FiHeart />}
                                            label="Espécie"
                                            value={formatarEspecie(
                                                solicitacaoSelecionada.animal.especie,
                                            )}
                                        />

                                        <DetailItem
                                            icon={<FiUser />}
                                            label="Sexo"
                                            value={formatarSexo(
                                                solicitacaoSelecionada.animal.sexo,
                                            )}
                                        />

                                        <DetailItem
                                            icon={<FiHeart />}
                                            label="Porte"
                                            value={solicitacaoSelecionada.animal.porte}
                                        />

                                        {solicitacaoSelecionada.animal.raca && (
                                            <DetailItem
                                                icon={<FiHeart />}
                                                label="Raça"
                                                value={solicitacaoSelecionada.animal.raca}
                                            />
                                        )}

                                        {solicitacaoSelecionada.animal.cor && (
                                            <DetailItem
                                                icon={<FiHeart />}
                                                label="Cor"
                                                value={solicitacaoSelecionada.animal.cor}
                                            />
                                        )}
                                    </div>
                                </section>

                                <section>
                                    <h4 className="font-bold text-gray-800 mb-3">
                                        Observações do tutor
                                    </h4>

                                    <div className="bg-[#F8FAFA] border border-gray-100 rounded-xl p-4">
                                        <p className="text-sm text-gray-600 whitespace-pre-wrap">
                                            {solicitacaoSelecionada.observacoes ||
                                                "Nenhuma observação informada."}
                                        </p>
                                    </div>
                                </section>

                                <section>
                                    <h4 className="font-bold text-gray-800 mb-3">
                                        Resposta da administração
                                    </h4>

                                    <div className="bg-[#F8FAFA] border border-gray-100 rounded-xl p-4">
                                        <p className="text-sm text-gray-600 whitespace-pre-wrap">
                                            {solicitacaoSelecionada.observacoesAnalise ||
                                                "Ainda não existe uma resposta registrada."}
                                        </p>
                                    </div>
                                </section>

                                {sucessoDecisao && (
                                    <div className="rounded-lg bg-green-50 border border-green-100 p-3 text-sm text-green-700">
                                        {sucessoDecisao}
                                    </div>
                                )}

                                {(solicitacaoSelecionada.status === "PENDENTE" ||
                                    solicitacaoSelecionada.status === "EM_ANALISE") && (
                                        <section className="border border-[#BCE7E7] bg-[#F8FCFC] rounded-xl p-5">
                                            <h4 className="font-bold text-gray-800 mb-2">
                                                Análise administrativa
                                            </h4>

                                            <p className="text-sm text-gray-500 mb-4">
                                                Registre uma observação, aprove a solicitação ou informe o motivo da recusa.
                                                A justificativa é obrigatória para recusar.
                                            </p>

                                            <label
                                                htmlFor="observacao-analise"
                                                className="block text-sm font-medium text-gray-700 mb-2"
                                            >
                                                Observação / justificativa
                                            </label>

                                            <textarea
                                                id="observacao-analise"
                                                value={observacaoAnalise}
                                                onChange={(e) => {
                                                    setObservacaoAnalise(e.target.value);
                                                    setErroDecisao("");
                                                }}
                                                maxLength={2000}
                                                rows={4}
                                                placeholder="Escreva aqui uma observação sobre a análise..."
                                                disabled={decidindo}
                                                className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-700 placeholder:text-gray-400 outline-none focus:border-[#05ABAD] focus:ring-2 focus:ring-[#05ABAD]/10 transition disabled:bg-gray-100"
                                            />

                                            <div className="flex flex-col sm:flex-row justify-end gap-3 mt-4">
                                                <button
                                                    type="button"
                                                    onClick={() => handleDecisao("RECUSADA")}
                                                    disabled={decidindo}
                                                    className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-lg border border-red-200 text-red-600 hover:bg-red-50 disabled:opacity-50 disabled:cursor-not-allowed text-sm font-semibold transition cursor-pointer"
                                                >
                                                    {decidindo ? "Processando..." : "Recusar solicitação"}
                                                </button>

                                                <button
                                                    type="button"
                                                    onClick={() => handleDecisao("APROVADA")}
                                                    disabled={decidindo}
                                                    className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-lg bg-[#026B6D] hover:bg-[#0D6C73] text-white disabled:opacity-50 disabled:cursor-not-allowed text-sm font-semibold transition cursor-pointer"
                                                >
                                                    <FiCheckCircle />
                                                    {decidindo ? "Processando..." : "Aprovar solicitação"}
                                                </button>
                                            </div>

                                            {erroDecisao && (
                                                <div className="mt-4 rounded-lg bg-red-50 border border-red-100 p-3 text-sm text-red-600 flex items-center gap-2">
                                                    <FiAlertCircle className="shrink-0" />
                                                    {erroDecisao}
                                                </div>
                                            )}

                                        </section>
                                    )}

                                {solicitacaoSelecionada.status !== "PENDENTE" &&
                                    solicitacaoSelecionada.status !== "EM_ANALISE" &&
                                    (solicitacaoSelecionada.status === "APROVADA" ||
                                        solicitacaoSelecionada.status === "RECUSADA") && (
                                        <div className="rounded-xl bg-gray-50 border border-gray-100 p-4">
                                            <p className="text-sm font-semibold text-gray-700">
                                                Esta solicitação já foi analisada.
                                            </p>
                                            <p className="text-sm text-gray-500 mt-1">
                                                A decisão registrada foi: {statusConfig[solicitacaoSelecionada.status].label}.
                                            </p>
                                        </div>
                                    )}

                                <section>
                                    <div className="flex items-center gap-2 mb-4">
                                        <FiClock className="text-[#026B6D]" />

                                        <h4 className="font-bold text-gray-800">
                                            Histórico da solicitação
                                        </h4>
                                    </div>

                                    {!solicitacaoSelecionada.historicos?.length ? (
                                        <p className="text-sm text-gray-500">
                                            Nenhum histórico disponível.
                                        </p>
                                    ) : (
                                        <div className="space-y-4">
                                            {solicitacaoSelecionada.historicos.map((historico) => (
                                                <div
                                                    key={historico.id}
                                                    className="flex gap-3"
                                                >
                                                    <div className="mt-1">
                                                        <FiCheckCircle className="text-[#05ABAD] text-lg" />
                                                    </div>

                                                    <div className="flex-1 border-b border-gray-100 pb-4">
                                                        <p className="font-semibold text-sm text-gray-800">
                                                            {statusConfig[historico.statusNovo].label}
                                                        </p>

                                                        <p className="text-xs text-gray-400 mt-1">
                                                            {formatarDataHora(historico.createdAt)}
                                                        </p>

                                                        {historico.observacao && (
                                                            <p className="text-sm text-gray-500 mt-2">
                                                                {historico.observacao}
                                                            </p>
                                                        )}
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </section>

                                <section>
                                    <h4 className="font-bold text-gray-800 mb-3">
                                        Agendamentos
                                    </h4>

                                    {!solicitacaoSelecionada.agendamentos?.length ? (
                                        <div className="bg-[#F8FAFA] border border-gray-100 rounded-xl p-4">
                                            <p className="text-sm text-gray-500">
                                                Esta solicitação ainda não possui agendamentos.
                                            </p>
                                        </div>
                                    ) : (
                                        <div className="space-y-3">
                                            {solicitacaoSelecionada.agendamentos.map(
                                                (agendamento) => (
                                                    <div
                                                        key={agendamento.id}
                                                        className="bg-[#F8FAFA] border border-gray-100 rounded-xl p-4"
                                                    >
                                                        <p className="font-semibold text-gray-800 text-sm">
                                                            {formatarDataHora(agendamento.dataInicio)}
                                                        </p>

                                                        <p className="text-sm text-gray-500 mt-2">
                                                            Local: {agendamento.local}
                                                        </p>

                                                        <p className="text-sm text-gray-500 mt-1">
                                                            Situação: {agendamento.status}
                                                        </p>

                                                        {agendamento.observacoes && (
                                                            <p className="text-sm text-gray-500 mt-2">
                                                                {agendamento.observacoes}
                                                            </p>
                                                        )}
                                                    </div>
                                                ),
                                            )}
                                        </div>
                                    )}
                                </section>
                            </div>
                        ) : null}
                    </div>
                </div>
            )}
        </div>
    );
}

function DetailItem({
    icon,
    label,
    value,
}: {
    icon: React.ReactNode;
    label: string;
    value: string;
}) {
    return (
        <div className="bg-[#F8FAFA] rounded-xl p-3.5 min-w-0">
            <div className="flex items-center gap-2 text-[#026B6D] text-sm mb-1.5">
                {icon}
                <span className="font-medium">{label}</span>
            </div>

            <p className="text-sm text-gray-700 break-words">{value}</p>
        </div>
    );
}
