
import { useCallback, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  FiArrowLeft,
  FiSearch,
  FiUsers,
  FiUser,
  FiMail,
  FiPhone,
  FiMapPin,
  FiCalendar,
  FiEye,
  FiChevronLeft,
  FiChevronRight,
  FiX,
  FiHeart,
  FiCheckCircle,
  FiAlertCircle,
  FiRefreshCw,
} from "react-icons/fi";

import { getSession, logout } from "../services/auth";
import {
  listarTutores,
  consultarTutor,
  type AdminTutor,
  type AdminTutorDetails,
} from "../services/admin";

export default function AdminTutors() {
  const navigate = useNavigate();

  const [tutores, setTutores] = useState<AdminTutor[]>([]);
  const [busca, setBusca] = useState("");
  const [pagina, setPagina] = useState(1);
  const [totalPaginas, setTotalPaginas] = useState(1);
  const [totalTutores, setTotalTutores] = useState(0);

  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState("");

  const [tutorSelecionado, setTutorSelecionado] =
    useState<AdminTutorDetails | null>(null);

  const [carregandoDetalhes, setCarregandoDetalhes] = useState(false);
  const [erroDetalhes, setErroDetalhes] = useState("");

  const carregarTutores = useCallback(async () => {
    try {
      setCarregando(true);
      setErro("");

      const resposta = await listarTutores(pagina, 10, busca);

      setTutores(resposta.data);
      setTotalTutores(resposta.pagination.total);
      setTotalPaginas(Math.max(1, resposta.pagination.totalPages));
    } catch (error: any) {
      console.error("Erro ao carregar tutores:", error);

      setErro(
        error.response?.data?.message ||
          "Não foi possível carregar os tutores.",
      );
    } finally {
      setCarregando(false);
    }
  }, [pagina, busca]);

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

  useEffect(() => {
    const timeout = window.setTimeout(() => {
      carregarTutores();
    }, busca ? 350 : 0);

    return () => window.clearTimeout(timeout);
  }, [carregarTutores, busca]);

  function handleBusca(valor: string) {
    setBusca(valor);
    setPagina(1);
  }

  async function abrirDetalhes(id: string) {
    try {
      setCarregandoDetalhes(true);
      setErroDetalhes("");
      setTutorSelecionado(null);

      const resposta = await consultarTutor(id);

      setTutorSelecionado(resposta);
    } catch (error: any) {
      console.error("Erro ao consultar tutor:", error);

      setErroDetalhes(
        error.response?.data?.message ||
          "Não foi possível carregar os dados do tutor.",
      );
    } finally {
      setCarregandoDetalhes(false);
    }
  }

  function fecharDetalhes() {
    setTutorSelecionado(null);
    setErroDetalhes("");
  }

  async function handleLogout() {
    await logout();
    navigate("/login");
  }

  function formatarCPF(cpf: string) {
    const numeros = cpf.replace(/\D/g, "");

    if (numeros.length !== 11) return cpf;

    return numeros.replace(
      /(\d{3})(\d{3})(\d{3})(\d{2})/,
      "$1.$2.$3-$4",
    );
  }

  function formatarTelefone(telefone: string) {
    const numeros = telefone.replace(/\D/g, "");

    if (numeros.length === 11) {
      return numeros.replace(
        /(\d{2})(\d{5})(\d{4})/,
        "($1) $2-$3",
      );
    }

    if (numeros.length === 10) {
      return numeros.replace(
        /(\d{2})(\d{4})(\d{4})/,
        "($1) $2-$3",
      );
    }

    return telefone;
  }

  function formatarData(data: string | null) {
    if (!data) return "Não informado";

    return new Date(data).toLocaleDateString("pt-BR", {
      timeZone: "UTC",
    });
  }

  function formatarEspecie(especie: string) {
    const especies: Record<string, string> = {
      CAO: "Cachorro",
      GATO: "Gato",
      OUTRO: "Outro",
    };

    return especies[especie] || especie;
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
            Gerenciamento de tutores
          </h2>

          <p className="text-gray-500 mt-2">
            Consulte os tutores cadastrados e visualize seus dados e animais.
          </p>
        </section>

        <section className="bg-white border border-gray-100 rounded-2xl shadow-sm p-5 md:p-6 mb-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-5">
            <div>
              <h3 className="text-lg font-bold text-gray-800">
                Tutores cadastrados
              </h3>

              <p className="text-sm text-gray-500 mt-1">
                {totalTutores}{" "}
                {totalTutores === 1 ? "tutor encontrado" : "tutores encontrados"}
              </p>
            </div>

            <button
              type="button"
              onClick={carregarTutores}
              className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50 transition text-sm font-medium cursor-pointer"
            >
              <FiRefreshCw />
              Atualizar
            </button>
          </div>

          <div className="relative">
            <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />

            <input
              type="text"
              value={busca}
              onChange={(e) => handleBusca(e.target.value)}
              placeholder="Pesquisar por nome, CPF ou e-mail..."
              className="w-full pl-11 pr-4 py-3 rounded-xl border border-gray-200 bg-[#FAFCFC] text-gray-700 placeholder:text-gray-400 outline-none focus:border-[#05ABAD] focus:ring-2 focus:ring-[#05ABAD]/10 transition"
            />
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
                Carregando tutores...
              </p>
            </div>
          ) : tutores.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 px-5 text-center">
              <div className="w-14 h-14 rounded-full bg-[#E2F7F7] flex items-center justify-center mb-4">
                <FiUsers className="text-[#026B6D] text-2xl" />
              </div>

              <h3 className="font-bold text-gray-800">
                Nenhum tutor encontrado
              </h3>

              <p className="text-sm text-gray-500 mt-2 max-w-sm">
                {busca
                  ? "Não encontramos resultados para sua pesquisa. Tente outro nome, CPF ou e-mail."
                  : "Ainda não existem tutores cadastrados na organização."}
              </p>
            </div>
          ) : (
            <>
              <div className="divide-y divide-gray-100">
                {tutores.map((tutor) => (
                  <div
                    key={tutor.id}
                    className="p-5 md:p-6 flex flex-col lg:flex-row lg:items-center gap-5 hover:bg-[#FAFCFC] transition"
                  >
                    <div className="w-12 h-12 rounded-full bg-[#E2F7F7] flex items-center justify-center shrink-0">
                      <FiUser className="text-[#026B6D] text-xl" />
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-2 mb-2">
                        <h4 className="font-bold text-gray-800 text-base">
                          {tutor.usuario.nome}
                        </h4>

                        {tutor.usuario.ativo ? (
                          <span className="text-xs px-2.5 py-1 rounded-full bg-green-50 text-green-700 font-medium">
                            Ativo
                          </span>
                        ) : (
                          <span className="text-xs px-2.5 py-1 rounded-full bg-red-50 text-red-600 font-medium">
                            Inativo
                          </span>
                        )}

                        {tutor.usuario.emailVerificadoEm ? (
                          <span className="text-xs px-2.5 py-1 rounded-full bg-[#E2F7F7] text-[#026B6D] font-medium">
                            E-mail verificado
                          </span>
                        ) : (
                          <span className="text-xs px-2.5 py-1 rounded-full bg-amber-50 text-amber-700 font-medium">
                            E-mail pendente
                          </span>
                        )}
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-2 text-sm text-gray-500">
                        <p className="flex items-center gap-2 min-w-0">
                          <FiMail className="shrink-0" />
                          <span className="truncate">
                            {tutor.usuario.email}
                          </span>
                        </p>

                        <p className="flex items-center gap-2">
                          <FiUser className="shrink-0" />
                          {formatarCPF(tutor.cpf)}
                        </p>

                        <p className="flex items-center gap-2">
                          <FiPhone className="shrink-0" />
                          {formatarTelefone(tutor.telefone)}
                        </p>

                        <p className="flex items-center gap-2">
                          <FiMapPin className="shrink-0" />
                          {tutor.bairro}, {tutor.cidade}
                        </p>

                        <p className="flex items-center gap-2">
                          <FiHeart className="shrink-0" />
                          {tutor._count.animais}{" "}
                          {tutor._count.animais === 1
                            ? "animal cadastrado"
                            : "animais cadastrados"}
                        </p>

                        <p className="flex items-center gap-2">
                          <FiCalendar className="shrink-0" />
                          Cadastro: {formatarData(tutor.createdAt)}
                        </p>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => abrirDetalhes(tutor.id)}
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

      {(carregandoDetalhes || tutorSelecionado || erroDetalhes) && (
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
                  Detalhes do tutor
                </h3>

                <p className="text-xs text-gray-500 mt-1">
                  Informações cadastrais e animais vinculados
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
            ) : tutorSelecionado ? (
              <div className="p-5 md:p-7 space-y-7">
                <section>
                  <div className="flex flex-wrap items-center gap-2 mb-4">
                    <h4 className="text-lg font-bold text-gray-800">
                      {tutorSelecionado.usuario.nome}
                    </h4>

                    <span
                      className={`text-xs px-2.5 py-1 rounded-full font-medium ${
                        tutorSelecionado.usuario.ativo
                          ? "bg-green-50 text-green-700"
                          : "bg-red-50 text-red-600"
                      }`}
                    >
                      {tutorSelecionado.usuario.ativo ? "Ativo" : "Inativo"}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <DetailItem
                      icon={<FiMail />}
                      label="E-mail"
                      value={tutorSelecionado.usuario.email}
                    />

                    <DetailItem
                      icon={<FiUser />}
                      label="CPF"
                      value={formatarCPF(tutorSelecionado.cpf)}
                    />

                    <DetailItem
                      icon={<FiCalendar />}
                      label="Data de nascimento"
                      value={formatarData(tutorSelecionado.dataNascimento)}
                    />

                    <DetailItem
                      icon={<FiPhone />}
                      label="Telefone"
                      value={formatarTelefone(tutorSelecionado.telefone)}
                    />

                    <DetailItem
                      icon={<FiMapPin />}
                      label="Endereço"
                      value={`${tutorSelecionado.endereco}, ${tutorSelecionado.numero}`}
                    />

                    <DetailItem
                      icon={<FiMapPin />}
                      label="Bairro"
                      value={tutorSelecionado.bairro}
                    />

                    <DetailItem
                      icon={<FiMapPin />}
                      label="Cidade"
                      value={tutorSelecionado.cidade}
                    />

                    <DetailItem
                      icon={<FiMapPin />}
                      label="CEP"
                      value={tutorSelecionado.cep}
                    />

                    <DetailItem
                      icon={<FiCalendar />}
                      label="Data do cadastro"
                      value={formatarData(tutorSelecionado.createdAt)}
                    />

                    <DetailItem
                      icon={
                        tutorSelecionado.usuario.emailVerificadoEm ? (
                          <FiCheckCircle />
                        ) : (
                          <FiAlertCircle />
                        )
                      }
                      label="Verificação de e-mail"
                      value={
                        tutorSelecionado.usuario.emailVerificadoEm
                          ? "E-mail verificado"
                          : "Pendente"
                      }
                    />
                  </div>
                </section>

                <section>
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h4 className="font-bold text-gray-800">
                        Animais cadastrados
                      </h4>

                      <p className="text-sm text-gray-500 mt-1">
                        {tutorSelecionado.animais.filter((animal) => animal.ativo).length}{" "}
                        animais ativos
                      </p>
                    </div>

                    <FiHeart className="text-[#026B6D] text-xl" />
                  </div>

                  {tutorSelecionado.animais.length === 0 ? (
                    <div className="bg-[#F8FAFA] border border-gray-100 rounded-xl p-6 text-center">
                      <p className="text-sm text-gray-500">
                        Este tutor ainda não cadastrou animais.
                      </p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {tutorSelecionado.animais.map((animal) => (
                        <div
                          key={animal.id}
                          className="border border-gray-100 rounded-xl overflow-hidden"
                        >
                          {animal.fotoUrl ? (
                            <img
                              src={animal.fotoUrl}
                              alt={animal.nome}
                              className="w-full h-40 object-cover"
                            />
                          ) : (
                            <div className="w-full h-40 bg-[#E2F7F7] flex items-center justify-center">
                              <FiHeart className="text-[#026B6D] text-4xl" />
                            </div>
                          )}

                          <div className="p-4">
                            <div className="flex items-center justify-between gap-2">
                              <h5 className="font-bold text-gray-800">
                                {animal.nome}
                              </h5>

                              <span
                                className={`text-xs px-2 py-1 rounded-full ${
                                  animal.ativo
                                    ? "bg-green-50 text-green-700"
                                    : "bg-gray-100 text-gray-500"
                                }`}
                              >
                                {animal.ativo ? "Ativo" : "Inativo"}
                              </span>
                            </div>

                            <div className="text-sm text-gray-500 mt-3 space-y-1">
                              <p>
                                Espécie: {formatarEspecie(animal.especie)}
                              </p>

                              <p>Sexo: {animal.sexo}</p>

                              {animal.raca && <p>Raça: {animal.raca}</p>}

                              {animal.cor && <p>Cor: {animal.cor}</p>}

                              {animal.porte && <p>Porte: {animal.porte}</p>}

                              <p>
                                Idade:{" "}
                                {animal.dataNascimento
                                  ? formatarData(animal.dataNascimento)
                                  : animal.idadeAproximadaMeses !== null
                                    ? `${animal.idadeAproximadaMeses} meses (aproximada)`
                                    : "Não informada"}
                              </p>

                              {animal.observacoes && (
                                <p className="pt-2">
                                  Observações: {animal.observacoes}
                                </p>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
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
