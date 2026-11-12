
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
    FiArrowLeft,
    FiClipboard,
    FiHeart,
    FiLoader,
    FiAlertCircle,
    FiCheckCircle,
} from "react-icons/fi";

import { listarMeusAnimais } from "../services/animals";
import type { Animal } from "../services/animals";

import {
    listarServicos,
    criarSolicitacao,
} from "../services/solicitations";
import type { Servico } from "../services/solicitations";

export default function NewSolicitation() {
    const navigate = useNavigate();

    const [animais, setAnimais] = useState<Animal[]>([]);
    const [servicos, setServicos] = useState<Servico[]>([]);

    const [animalId, setAnimalId] = useState("");
    const [servicoId, setServicoId] = useState("");
    const [observacoes, setObservacoes] = useState("");

    const [carregando, setCarregando] = useState(true);
    const [enviando, setEnviando] = useState(false);

    const [erro, setErro] = useState("");
    const [sucesso, setSucesso] = useState("");

    useEffect(() => {
        async function carregarDados() {
            try {
                const [animaisResponse, servicosResponse] = await Promise.all([
                    listarMeusAnimais(),
                    listarServicos(),
                ]);

                setAnimais(animaisResponse);
                setServicos(servicosResponse.filter((servico) => servico.ativo));
            } catch (error: any) {
                console.error("Erro ao carregar formulário:", error);

                setErro(
                    error.response?.data?.message ||
                    "Não foi possível carregar os dados. Tente novamente."
                );
            } finally {
                setCarregando(false);
            }
        }

        carregarDados();
    }, []);

    const servicoSelecionado = servicos.find(
        (servico) => servico.id === servicoId
    );

    const exigeDescricao = servicoSelecionado
        ? ["outros procedimentos", "outro serviço", "outro servico"].includes(
            servicoSelecionado.nome.trim().toLowerCase()
        )
        : false;

    async function enviarSolicitacao(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();

        setErro("");
        setSucesso("");

        if (!animalId || !servicoId) {
            setErro("Selecione o animal e o serviço desejado.");
            return;
        }

        if (exigeDescricao && !observacoes.trim()) {
            setErro("Descreva qual procedimento você deseja solicitar.");
            return;
        }

        try {
            setEnviando(true);

            await criarSolicitacao({
                animalId,
                servicoId,
                observacoes: observacoes.trim() || undefined,
            });

            setSucesso("Sua solicitação foi registrada com sucesso!");

            setAnimalId("");
            setServicoId("");
            setObservacoes("");
        } catch (error: any) {
            console.error("Erro ao criar solicitação:", error);

            setErro(
                error.response?.data?.message ||
                "Não foi possível registrar sua solicitação. Tente novamente."
            );
        } finally {
            setEnviando(false);
        }
    }

    if (carregando) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-[#F5F8F8] text-[#026B6D]">
                <FiLoader className="animate-spin text-4xl mb-3" />
                <p className="font-medium">Carregando formulário...</p>
            </div>
        );
    }

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

                    <div className="flex items-center gap-3">
                        <button
                            type="button"
                            onClick={() => navigate("/solicitacoes/minhas")}
                            className="flex items-center gap-2 text-sm font-semibold text-[#05ABAD] hover:text-[#026B6D] transition cursor-pointer"
                        >
                            <FiClipboard />
                            Minhas solicitações
                        </button>

                        <button
                            type="button"
                            onClick={() => navigate("/perfil")}
                            className="flex items-center gap-2 text-sm font-medium text-gray-500 hover:text-[#026B6D] transition cursor-pointer"
                        >
                            <FiArrowLeft />
                            Voltar ao perfil
                        </button>
                    </div>
                </div>
            </header>

            <main className="max-w-3xl mx-auto px-5 py-8 md:py-12">
                <div className="mb-8">
                    <p className="text-sm text-gray-500 mb-1">Área do cidadão</p>
                    <h2 className="text-2xl md:text-3xl font-bold text-gray-800">
                        Solicitar serviço
                    </h2>
                    <p className="text-gray-500 mt-2">
                        Preencha os dados abaixo para solicitar um atendimento para um dos
                        seus animais.
                    </p>
                </div>

                {animais.length === 0 ? (
                    <section className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8 text-center">
                        <FiHeart className="text-[#05ABAD] text-4xl mx-auto mb-4" />

                        <h3 className="text-lg font-bold text-gray-800">
                            Nenhum animal cadastrado
                        </h3>

                        <p className="text-sm text-gray-500 mt-2 mb-6">
                            Para solicitar um serviço, primeiro você precisa cadastrar um
                            animal no seu perfil.
                        </p>

                        <button
                            onClick={() => navigate("/animais/cadastrar")}
                            className="bg-[#05ABAD] hover:bg-[#026B6D] text-white px-6 py-3 rounded-xl font-semibold transition cursor-pointer"
                        >
                            Cadastrar animal
                        </button>
                    </section>
                ) : (
                    <section className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 md:p-8">
                        <div className="flex items-center gap-3 mb-7">
                            <div className="w-12 h-12 rounded-xl bg-[#E8F7F7] flex items-center justify-center">
                                <FiClipboard className="text-[#05ABAD] text-xl" />
                            </div>

                            <div>
                                <h3 className="font-bold text-gray-800">
                                    Dados da solicitação
                                </h3>
                                <p className="text-xs text-gray-500">
                                    Os campos marcados com * são obrigatórios.
                                </p>
                            </div>
                        </div>

                        {erro && (
                            <div className="flex items-start gap-2 bg-red-50 text-red-600 rounded-xl p-4 mb-5 text-sm">
                                <FiAlertCircle className="shrink-0 mt-0.5" />
                                <p>{erro}</p>
                            </div>
                        )}

                        {sucesso && (
                            <div className="flex items-start gap-2 bg-green-50 text-green-700 rounded-xl p-4 mb-5 text-sm">
                                <FiCheckCircle className="shrink-0 mt-0.5" />
                                <div>
                                    <p className="font-semibold">{sucesso}</p>
                                    <p className="mt-1">
                                        Você pode acompanhar o andamento na área de solicitações.
                                    </p>
                                    <button
                                        type="button"
                                        onClick={() => navigate("/solicitacoes/minhas")}
                                        className="font-semibold underline mt-2 cursor-pointer"
                                    >
                                        Ver minhas solicitações
                                    </button>
                                </div>
                            </div>
                        )}

                        <form onSubmit={enviarSolicitacao} className="space-y-6">
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                    Animal *
                                </label>

                                <select
                                    value={animalId}
                                    onChange={(event) => setAnimalId(event.target.value)}
                                    required
                                    className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-700 outline-none focus:border-[#05ABAD] focus:ring-2 focus:ring-[#05ABAD]/10"
                                >
                                    <option value="">Selecione um animal</option>

                                    {animais.map((animal) => (
                                        <option key={animal.id} value={animal.id}>
                                            {animal.nome} — {animal.especie === "CAO"
                                                ? "Cachorro"
                                                : animal.especie === "GATO"
                                                    ? "Gato"
                                                    : "Outro"}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                    Serviço desejado *
                                </label>

                                <select
                                    value={servicoId}
                                    onChange={(event) => setServicoId(event.target.value)}
                                    required
                                    className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-700 outline-none focus:border-[#05ABAD] focus:ring-2 focus:ring-[#05ABAD]/10"
                                >
                                    <option value="">Selecione um serviço</option>

                                    {servicos.map((servico) => (
                                        <option key={servico.id} value={servico.id}>
                                            {servico.nome}
                                        </option>
                                    ))}
                                </select>

                                {servicoSelecionado?.descricao && (
                                    <p className="text-xs text-gray-500 mt-2">
                                        {servicoSelecionado.descricao}
                                    </p>
                                )}
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                    {exigeDescricao
                                        ? "Descreva o procedimento desejado *"
                                        : "Observações (opcional)"}
                                </label>

                                <textarea
                                    value={observacoes}
                                    onChange={(event) => setObservacoes(event.target.value)}
                                    required={exigeDescricao}
                                    maxLength={2000}
                                    rows={5}
                                    placeholder={
                                        exigeDescricao
                                            ? "Explique qual procedimento você precisa..."
                                            : "Informe detalhes importantes sobre sua solicitação..."
                                    }
                                    className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-700 outline-none resize-none focus:border-[#05ABAD] focus:ring-2 focus:ring-[#05ABAD]/10"
                                />

                                <p className="text-xs text-gray-400 text-right mt-1">
                                    {observacoes.length}/2000 caracteres
                                </p>
                            </div>

                            <div className="bg-[#F0FAFA] border border-[#D5F0F0] rounded-xl p-4">
                                <p className="text-sm text-[#026B6D]">
                                    Após o envio, sua solicitação ficará com o status{" "}
                                    <strong>Pendente</strong> até ser analisada pela equipe do
                                    Núcleo de Zoonoses.
                                </p>
                            </div>

                            <div className="flex flex-col-reverse sm:flex-row gap-3 pt-2">
                                <button
                                    type="button"
                                    onClick={() => navigate("/perfil")}
                                    className="flex-1 border border-gray-200 text-gray-600 hover:bg-gray-50 px-5 py-3 rounded-xl font-semibold transition cursor-pointer"
                                >
                                    Cancelar
                                </button>

                                <button
                                    type="submit"
                                    disabled={enviando}
                                    className="flex-1 flex items-center justify-center gap-2 bg-[#05ABAD] hover:bg-[#026B6D] disabled:opacity-60 text-white px-5 py-3 rounded-xl font-semibold transition cursor-pointer disabled:cursor-not-allowed"
                                >
                                    {enviando ? (
                                        <>
                                            <FiLoader className="animate-spin" />
                                            Enviando...
                                        </>
                                    ) : (
                                        "Enviar solicitação"
                                    )}
                                </button>
                            </div>
                        </form>
                    </section>
                )}
            </main>
        </div>
    );
}
