
import { useEffect, useRef, useState } from "react";
import type { ChangeEvent } from "react";
import {
  FiUser,
  FiMapPin,
  FiPhone,
  FiMail,
  FiPlus,
  FiHeart,
  FiClipboard,
  FiAlertCircle,
  FiLogOut,
  FiLoader,
  FiRefreshCw,
  FiEdit2,
  FiTrash2,
  FiCamera,
  FiX,
} from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import { api } from "../services/api";
import {
  logout,
  uploadFotoPerfil,
  excluirFotoPerfil,
  atualizarPerfilTutor,
} from "../services/auth";
import type { UpdateTutorProfileData } from "../services/auth";
import type { Animal } from "../services/animals";
import {
  listarMeusAnimais,
  excluirAnimal as excluirAnimalApi,
} from "../services/animals";
import EditTutorProfileModal from "../components/EditTutorProfileModal";

interface Usuario {
  id: string;
  nome: string;
  email: string;
  papel: string;
  fotoPerfilUrl?: string | null;
}

interface Tutor {
  id: string;
  cpf: string;
  dataNascimento: string;
  telefone: string;
  endereco: string;
  numero: string;
  bairro: string;
  cidade: string;
  cep: string;
}

interface PerfilResponse {
  usuario: Usuario;
  tutor: Tutor;
}

export default function TutorProfile() {
  const navigate = useNavigate();
  const inputFotoRef = useRef<HTMLInputElement>(null);

  const [perfil, setPerfil] = useState<PerfilResponse | null>(null);
  const [animais, setAnimais] = useState<Animal[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [carregandoAnimais, setCarregandoAnimais] = useState(true);
  const [erro, setErro] = useState("");
  const [erroAnimais, setErroAnimais] = useState("");

  const [animalParaExcluir, setAnimalParaExcluir] = useState<Animal | null>(null);
  const [excluindoAnimalId, setExcluindoAnimalId] = useState<string | null>(null);
  const [erroExclusao, setErroExclusao] = useState("");

  const [enviandoFoto, setEnviandoFoto] = useState(false);
  const [excluindoFoto, setExcluindoFoto] = useState(false);
  const [erroFoto, setErroFoto] = useState("");
  const [sucessoFoto, setSucessoFoto] = useState("");

  const [editandoPerfil, setEditandoPerfil] = useState(false);

  useEffect(() => {
    async function carregarDados() {
      try {
        const [perfilResponse, animaisResponse] = await Promise.all([
          api.get<PerfilResponse>("/auth/profile"),
          listarMeusAnimais(),
        ]);

        setPerfil(perfilResponse.data);
        setAnimais(animaisResponse);
      } catch (error: any) {
        console.error("Erro ao carregar dados:", error);

        if (error.response?.status === 401) {
          setErro("Sua sessão expirou ou não foi possível acessar seu perfil. Entre novamente.");
        } else {
          setErro("Não foi possível carregar seus dados. Tente novamente.");
        }
      } finally {
        setCarregando(false);
        setCarregandoAnimais(false);
      }
    }

    carregarDados();
  }, []);

  async function atualizarAnimais() {
    try {
      setCarregandoAnimais(true);
      setErroAnimais("");

      const response = await listarMeusAnimais();
      setAnimais(response);
    } catch (error) {
      console.error("Erro ao carregar animais:", error);
      setErroAnimais("Não foi possível carregar seus animais.");
    } finally {
      setCarregandoAnimais(false);
    }
  }

  async function selecionarFoto(event: ChangeEvent<HTMLInputElement>) {
    const arquivo = event.target.files?.[0];

    if (!arquivo) return;

    setErroFoto("");
    setSucessoFoto("");

    const formatosPermitidos = ["image/jpeg", "image/png", "image/webp"];

    if (!formatosPermitidos.includes(arquivo.type)) {
      setErroFoto("Formato inválido. Selecione uma imagem JPG, PNG ou WEBP.");
      event.target.value = "";
      return;
    }

    if (arquivo.size > 5 * 1024 * 1024) {
      setErroFoto("A imagem deve ter no máximo 5 MB.");
      event.target.value = "";
      return;
    }

    try {
      setEnviandoFoto(true);

      const resposta = await uploadFotoPerfil(arquivo);

      setPerfil((perfilAtual) => {
        if (!perfilAtual) return perfilAtual;

        return {
          ...perfilAtual,
          usuario: {
            ...perfilAtual.usuario,
            fotoPerfilUrl: resposta.url,
          },
        };
      });

      setSucessoFoto("Foto de perfil atualizada com sucesso!");
    } catch (error: any) {
      console.error("Erro ao enviar foto:", error);

      setErroFoto(
        error.response?.data?.message ||
          "Não foi possível enviar a foto. Tente novamente."
      );
    } finally {
      setEnviandoFoto(false);

      if (inputFotoRef.current) {
        inputFotoRef.current.value = "";
      }
    }
  }

  async function removerFotoPerfil() {
    try {
      setExcluindoFoto(true);
      setErroFoto("");
      setSucessoFoto("");

      await excluirFotoPerfil();

      setPerfil((perfilAtual) => {
        if (!perfilAtual) return perfilAtual;

        return {
          ...perfilAtual,
          usuario: {
            ...perfilAtual.usuario,
            fotoPerfilUrl: null,
          },
        };
      });

      setSucessoFoto("Foto de perfil removida com sucesso!");
    } catch (error: any) {
      console.error("Erro ao remover foto:", error);

      setErroFoto(
        error.response?.data?.message ||
          "Não foi possível remover a foto. Tente novamente."
      );
    } finally {
      setExcluindoFoto(false);
    }
  }

  async function salvarPerfilAtualizado(dados: UpdateTutorProfileData) {
    try {
      const resposta = await atualizarPerfilTutor(dados);

      setPerfil((perfilAtual) => {
        if (!perfilAtual) return perfilAtual;

        return {
          ...perfilAtual,
          usuario: {
            ...perfilAtual.usuario,
            ...resposta.usuario,
          },
          tutor: {
            ...perfilAtual.tutor,
            ...resposta.tutor,
          },
        };
      });

      setEditandoPerfil(false);
    } catch (error) {
      console.error("Erro ao atualizar perfil:", error);
      throw error;
    }
  }

  async function confirmarExclusao() {
    if (!animalParaExcluir) return;

    try {
      setExcluindoAnimalId(animalParaExcluir.id);
      setErroExclusao("");

      await excluirAnimalApi(animalParaExcluir.id);

      setAnimais((animaisAtuais) =>
        animaisAtuais.filter((animal) => animal.id !== animalParaExcluir.id)
      );

      setAnimalParaExcluir(null);
    } catch (error: any) {
      console.error("Erro ao excluir animal:", error);

      setErroExclusao(
        error.response?.data?.message ||
          "Não foi possível excluir o animal. Tente novamente."
      );
    } finally {
      setExcluindoAnimalId(null);
    }
  }

  function sair() {
    logout();
    navigate("/login");
  }

  function formatarData(data: string) {
    if (!data) return "Não informado";

    return new Date(`${data.split("T")[0]}T00:00:00`).toLocaleDateString("pt-BR");
  }

  function formatarCpf(cpf: string) {
    const numeros = cpf?.replace(/\D/g, "");

    if (!numeros || numeros.length !== 11) return cpf || "Não informado";

    return numeros.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4");
  }

  function formatarCep(cep: string) {
    const numeros = cep?.replace(/\D/g, "");

    if (!numeros || numeros.length !== 8) return cep || "Não informado";

    return numeros.replace(/(\d{5})(\d{3})/, "$1-$2");
  }

  function nomeEspecie(especie: Animal["especie"]) {
    const especies = {
      CAO: "Cachorro",
      GATO: "Gato",
      OUTRA: "Outro",
    };

    return especies[especie];
  }

  function nomeSexo(sexo: Animal["sexo"]) {
    const sexos = {
      MACHO: "Macho",
      FEMEA: "Fêmea",
      NAO_INFORMADO: "Não informado",
    };

    return sexos[sexo];
  }

  function nomePorte(porte: Animal["porte"]) {
    const portes = {
      PEQUENO: "Pequeno",
      MEDIO: "Médio",
      GRANDE: "Grande",
      NAO_INFORMADO: "Não informado",
    };

    return portes[porte];
  }

  if (carregando) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 text-[#026B6D]">
        <FiLoader className="animate-spin text-4xl mb-3" />
        <p className="font-medium">Carregando seu perfil...</p>
      </div>
    );
  }

  if (erro || !perfil) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
        <div className="bg-white rounded-2xl shadow-sm p-8 max-w-md w-full text-center">
          <FiAlertCircle className="text-red-500 text-4xl mx-auto mb-4" />
          <h2 className="text-xl font-bold text-gray-800 mb-2">
            Não foi possível carregar o perfil
          </h2>
          <p className="text-gray-500 mb-6">{erro}</p>
          <button
            onClick={() => navigate("/login")}
            className="bg-[#05ABAD] hover:bg-[#026B6D] text-white px-6 py-3 rounded-xl font-semibold transition cursor-pointer"
          >
            Ir para o login
          </button>
        </div>
      </div>
    );
  }

  const { usuario, tutor } = perfil;
  const fotoEmProcessamento = enviandoFoto || excluindoFoto;

  return (
    <div className="min-h-screen bg-[#F5F8F8]">
      <header className="bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-5 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-[#026B6D]">
              Núcleo de Zoonoses
            </h1>
            <p className="text-xs text-gray-500">Prefeitura de Cajazeiras</p>
          </div>

          <button
            onClick={sair}
            className="flex items-center gap-2 text-gray-500 hover:text-red-500 transition text-sm font-medium cursor-pointer"
          >
            <FiLogOut />
            <span className="hidden sm:inline">Sair</span>
          </button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-5 py-8 md:py-10">
        <section className="mb-8">
          <p className="text-sm text-gray-500 mb-1">Área do cidadão</p>
          <h2 className="text-2xl md:text-3xl font-bold text-gray-800">
            Olá, {usuario.nome.split(" ")[0]}!
          </h2>
          <p className="text-gray-500 mt-2">
            Acompanhe seus animais e os serviços solicitados ao Núcleo de Zoonoses.
          </p>
        </section>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <section className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                <div>
                  <h3 className="text-lg font-bold text-gray-800">
                    Meus animais
                  </h3>
                  <p className="text-sm text-gray-500 mt-1">
                    Gerencie os animais vinculados ao seu cadastro.
                  </p>
                </div>

                <button
                  onClick={() => navigate("/animais/cadastrar")}
                  className="flex items-center justify-center gap-2 bg-[#05ABAD] hover:bg-[#026B6D] text-white px-5 py-3 rounded-xl font-semibold text-sm transition cursor-pointer"
                >
                  <FiPlus />
                  Cadastrar animal
                </button>
              </div>

              {carregandoAnimais ? (
                <div className="py-12 flex flex-col items-center text-[#05ABAD]">
                  <FiLoader className="animate-spin text-3xl mb-3" />
                  <p className="text-sm text-gray-500">Carregando seus animais...</p>
                </div>
              ) : erroAnimais ? (
                <div className="text-center py-10">
                  <FiAlertCircle className="text-red-500 text-3xl mx-auto mb-3" />
                  <p className="text-sm text-gray-600 mb-4">{erroAnimais}</p>
                  <button
                    onClick={atualizarAnimais}
                    className="inline-flex items-center gap-2 text-[#05ABAD] font-semibold text-sm hover:text-[#026B6D] cursor-pointer"
                  >
                    <FiRefreshCw />
                    Tentar novamente
                  </button>
                </div>
              ) : animais.length === 0 ? (
                <div className="border-2 border-dashed border-gray-200 rounded-xl py-10 px-5 text-center">
                  <div className="w-14 h-14 rounded-full bg-[#E8F7F7] flex items-center justify-center mx-auto mb-4">
                    <FiHeart className="text-[#05ABAD] text-2xl" />
                  </div>

                  <h4 className="font-semibold text-gray-700">
                    Seus animais aparecerão aqui
                  </h4>
                  <p className="text-sm text-gray-500 mt-2 max-w-sm mx-auto">
                    Cadastre seu primeiro animal para solicitar serviços e acompanhar
                    o histórico de atendimentos.
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {animais.map((animal) => (
                    <div
                      key={animal.id}
                      className="border border-gray-100 rounded-xl p-5 hover:border-[#BCE7E7] transition"
                    >
                      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                        <div className="flex items-start gap-4">
                          <div className="w-12 h-12 shrink-0 rounded-xl bg-[#E8F7F7] flex items-center justify-center">
                            <FiHeart className="text-[#05ABAD] text-xl" />
                          </div>

                          <div>
                            <h4 className="font-bold text-gray-800 text-base">
                              {animal.nome}
                            </h4>
                            <p className="text-sm text-[#05ABAD] font-medium mt-1">
                              {nomeEspecie(animal.especie)}
                              {animal.raca ? ` • ${animal.raca}` : ""}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center gap-2 sm:justify-end">
                          <button
                            onClick={() => navigate(`/animais/editar/${animal.id}`)}
                            title="Editar animal"
                            className="p-2 rounded-lg bg-[#E8F7F7] text-[#05ABAD] hover:bg-[#D5F0F0] transition cursor-pointer"
                          >
                            <FiEdit2 />
                          </button>

                          <button
                            onClick={() => {
                              setErroExclusao("");
                              setAnimalParaExcluir(animal);
                            }}
                            title="Excluir animal"
                            className="p-2 rounded-lg bg-red-50 text-red-500 hover:bg-red-100 transition cursor-pointer"
                          >
                            <FiTrash2 />
                          </button>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mt-5 pt-4 border-t border-gray-100">
                        <div>
                          <p className="text-xs text-gray-400 mb-1">Sexo</p>
                          <p className="text-sm font-medium text-gray-700">
                            {nomeSexo(animal.sexo)}
                          </p>
                        </div>

                        <div>
                          <p className="text-xs text-gray-400 mb-1">Porte</p>
                          <p className="text-sm font-medium text-gray-700">
                            {nomePorte(animal.porte)}
                          </p>
                        </div>

                        <div>
                          <p className="text-xs text-gray-400 mb-1">Cor</p>
                          <p className="text-sm font-medium text-gray-700">
                            {animal.cor || "Não informado"}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </section>

            <section>
              <h3 className="text-lg font-bold text-gray-800 mb-4">
                Acesso rápido
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm">
                  <div className="w-11 h-11 rounded-xl bg-[#E8F7F7] flex items-center justify-center mb-4">
                    <FiClipboard className="text-[#05ABAD] text-xl" />
                  </div>
                  <h4 className="font-bold text-gray-800">
                    Solicitações de serviços
                  </h4>
                  <p className="text-sm text-gray-500 mt-2">
                    Solicite castração, vacinação e outros serviços para seus animais.
                  </p>
                  <p className="text-xs text-[#05ABAD] font-semibold mt-4">
                    Em breve
                  </p>
                </div>

                <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm">
                  <div className="w-11 h-11 rounded-xl bg-orange-50 flex items-center justify-center mb-4">
                    <FiAlertCircle className="text-orange-500 text-xl" />
                  </div>
                  <h4 className="font-bold text-gray-800">
                    Registrar ocorrência
                  </h4>
                  <p className="text-sm text-gray-500 mt-2">
                    Comunique situações relacionadas a animais que precisam de atenção.
                  </p>
                  <p className="text-xs text-[#05ABAD] font-semibold mt-4">
                    Em breve
                  </p>
                </div>
              </div>
            </section>
          </div>

          <aside>
            <section className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <div className="flex flex-col items-center text-center mb-7">
                <div className="relative mb-4">
                  {usuario.fotoPerfilUrl ? (
                    <img
                      src={usuario.fotoPerfilUrl}
                      alt={`Foto de perfil de ${usuario.nome}`}
                      className="w-24 h-24 rounded-full object-cover border-4 border-[#E8F7F7] shadow-sm"
                    />
                  ) : (
                    <div className="w-24 h-24 rounded-full bg-[#E8F7F7] flex items-center justify-center border-4 border-white shadow-sm">
                      <FiUser className="text-[#05ABAD] text-4xl" />
                    </div>
                  )}

                  <button
                    type="button"
                    onClick={() => inputFotoRef.current?.click()}
                    disabled={fotoEmProcessamento}
                    title="Alterar foto de perfil"
                    className="absolute bottom-0 right-0 w-9 h-9 rounded-full bg-[#05ABAD] hover:bg-[#026B6D] text-white flex items-center justify-center border-2 border-white shadow transition cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {enviandoFoto ? (
                      <FiLoader className="animate-spin" />
                    ) : (
                      <FiCamera />
                    )}
                  </button>

                  <input
                    ref={inputFotoRef}
                    type="file"
                    accept="image/jpeg,image/png,image/webp"
                    onChange={selecionarFoto}
                    className="hidden"
                  />
                </div>

                <h3 className="font-bold text-gray-800 text-lg">Meu perfil</h3>
                <p className="text-xs text-gray-500 mt-1">Dados cadastrais</p>

                <button
                  type="button"
                  onClick={() => setEditandoPerfil(true)}
                  className="mt-4 inline-flex items-center justify-center gap-2 rounded-lg bg-[#05ABAD] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[#026B6D] cursor-pointer"
                >
                  <FiEdit2 />
                  Editar dados
                </button>

                <div className="flex flex-wrap items-center justify-center gap-2 mt-4">
                  <button
                    type="button"
                    onClick={() => inputFotoRef.current?.click()}
                    disabled={fotoEmProcessamento}
                    className="inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-[#E8F7F7] text-[#05ABAD] hover:bg-[#D5F0F0] text-xs font-semibold transition cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {enviandoFoto ? (
                      <>
                        <FiLoader className="animate-spin" />
                        Enviando...
                      </>
                    ) : (
                      <>
                        <FiCamera />
                        {usuario.fotoPerfilUrl ? "Alterar foto" : "Adicionar foto"}
                      </>
                    )}
                  </button>

                  {usuario.fotoPerfilUrl && (
                    <button
                      type="button"
                      onClick={removerFotoPerfil}
                      disabled={fotoEmProcessamento}
                      className="inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-red-50 text-red-500 hover:bg-red-100 text-xs font-semibold transition cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {excluindoFoto ? (
                        <>
                          <FiLoader className="animate-spin" />
                          Removendo...
                        </>
                      ) : (
                        <>
                          <FiX />
                          Remover foto
                        </>
                      )}
                    </button>
                  )}
                </div>

                <p className="text-xs text-gray-400 mt-3">
                  JPG, PNG ou WEBP. Máximo de 5 MB.
                </p>

                {erroFoto && (
                  <div className="w-full mt-4 bg-red-50 text-red-600 text-xs rounded-lg p-3 text-left">
                    {erroFoto}
                  </div>
                )}

                {sucessoFoto && (
                  <div className="w-full mt-4 bg-green-50 text-green-700 text-xs rounded-lg p-3 text-left">
                    {sucessoFoto}
                  </div>
                )}
              </div>

              <div className="border-t border-gray-100 pt-6 space-y-5">
                <div>
                  <p className="text-xs text-gray-400 mb-1">Nome completo</p>
                  <p className="text-sm font-medium text-gray-700">{usuario.nome}</p>
                </div>

                <div>
                  <p className="text-xs text-gray-400 mb-1">CPF</p>
                  <p className="text-sm font-medium text-gray-700">
                    {formatarCpf(tutor.cpf)}
                  </p>
                </div>

                <div>
                  <p className="text-xs text-gray-400 mb-1">Data de nascimento</p>
                  <p className="text-sm font-medium text-gray-700">
                    {formatarData(tutor.dataNascimento)}
                  </p>
                </div>

                <div className="flex items-start gap-3">
                  <FiMail className="text-[#05ABAD] mt-1 shrink-0" />
                  <div>
                    <p className="text-xs text-gray-400 mb-1">E-mail</p>
                    <p className="text-sm font-medium text-gray-700 break-all">
                      {usuario.email}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <FiPhone className="text-[#05ABAD] mt-1 shrink-0" />
                  <div>
                    <p className="text-xs text-gray-400 mb-1">Telefone</p>
                    <p className="text-sm font-medium text-gray-700">
                      {tutor.telefone || "Não informado"}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <FiMapPin className="text-[#05ABAD] mt-1 shrink-0" />
                  <div>
                    <p className="text-xs text-gray-400 mb-1">Endereço</p>
                    <p className="text-sm font-medium text-gray-700">
                      {tutor.endereco}, {tutor.numero}
                    </p>
                    <p className="text-sm text-gray-500">
                      {tutor.bairro} - {tutor.cidade}
                    </p>
                    <p className="text-sm text-gray-500">
                      CEP: {formatarCep(tutor.cep)}
                    </p>
                  </div>
                </div>
              </div>
            </section>
          </aside>
        </div>

        <footer className="text-center text-xs text-gray-400 mt-10 pb-4">
          Núcleo de Zoonoses — Prefeitura de Cajazeiras
        </footer>
      </main>

      {animalParaExcluir && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
          <div className="bg-white w-full max-w-md rounded-2xl shadow-xl p-6">
            <div className="w-12 h-12 rounded-full bg-red-50 flex items-center justify-center mb-4">
              <FiTrash2 className="text-red-500 text-xl" />
            </div>

            <h3 className="text-xl font-bold text-gray-800">
              Excluir animal?
            </h3>

            <p className="text-sm text-gray-500 mt-3">
              Tem certeza de que deseja excluir{" "}
              <strong>{animalParaExcluir.nome}</strong>?
              O animal deixará de aparecer na sua lista.
            </p>

            {erroExclusao && (
              <div className="mt-4 bg-red-50 text-red-600 text-sm rounded-lg p-3">
                {erroExclusao}
              </div>
            )}

            <div className="flex gap-3 mt-6">
              <button
                type="button"
                onClick={() => {
                  if (!excluindoAnimalId) {
                    setAnimalParaExcluir(null);
                    setErroExclusao("");
                  }
                }}
                disabled={!!excluindoAnimalId}
                className="flex-1 px-4 py-3 rounded-xl border border-gray-200 text-gray-600 font-semibold hover:bg-gray-50 disabled:opacity-50 cursor-pointer disabled:cursor-not-allowed"
              >
                Cancelar
              </button>

              <button
                type="button"
                onClick={confirmarExclusao}
                disabled={!!excluindoAnimalId}
                className="flex-1 px-4 py-3 rounded-xl bg-red-500 hover:bg-red-600 text-white font-semibold disabled:opacity-50 flex items-center justify-center gap-2 cursor-pointer disabled:cursor-not-allowed"
              >
                {excluindoAnimalId ? (
                  <>
                    <FiLoader className="animate-spin" />
                    Excluindo...
                  </>
                ) : (
                  "Sim, excluir"
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {editandoPerfil && (
        <EditTutorProfileModal
          dadosIniciais={{
            nome: usuario.nome,
            telefone: tutor.telefone || "",
            endereco: tutor.endereco || "",
            numero: tutor.numero || "",
            bairro: tutor.bairro || "",
            cidade: tutor.cidade || "",
            cep: tutor.cep || "",
          }}
          onClose={() => setEditandoPerfil(false)}
          onSave={salvarPerfilAtualizado}
        />
      )}
    </div>
  );
}
