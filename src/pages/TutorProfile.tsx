
import { useEffect, useState } from "react";
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
} from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import{api} from "../services/api";
import { logout } from "../services/auth";

interface Usuario {
  id: string;
  nome: string;
  email: string;
  papel: string;
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

  const [perfil, setPerfil] = useState<PerfilResponse | null>(null);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState("");

  useEffect(() => {
    async function carregarPerfil() {
      try {
        const response = await api.get<PerfilResponse>("/auth/profile");
        setPerfil(response.data);
      } catch (error: any) {
        console.error("Erro ao carregar perfil:", error);

        if (error.response?.status === 401) {
          setErro("Sua sessão expirou ou não foi possível acessar seu perfil. Entre novamente.");
        } else {
          setErro("Não foi possível carregar seus dados. Tente novamente.");
        }
      } finally {
        setCarregando(false);
      }
    }

    carregarPerfil();
  }, []);

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
            className="bg-[#05ABAD] hover:bg-[#026B6D] text-white px-6 py-3 rounded-xl font-semibold transition"
          >
            Ir para o login
          </button>
        </div>
      </div>
    );
  }

  const { usuario, tutor } = perfil;

  return (
    <div className="min-h-screen bg-[#F5F8F8]">
      {/* Cabeçalho */}
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
            className="flex items-center gap-2 text-gray-500 hover:text-red-500 transition text-sm font-medium"
          >
            <FiLogOut />
            <span className="hidden sm:inline">Sair</span>
          </button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-5 py-8 md:py-10">
        {/* Saudação */}
        <section className="mb-8">
          <p className="text-sm text-gray-500 mb-1">Área do cidadão</p>
          <h2 className="text-2xl md:text-3xl font-bold text-gray-800">
            Olá, {usuario.nome.split(" ")[0]}!
          </h2>
          <p className="text-gray-500 mt-2">
            Acompanhe seus animais e os serviços solicitados ao Núcleo de Zoonoses.
          </p>
        </section>

        {/* Conteúdo principal */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Coluna principal */}
          <div className="lg:col-span-2 space-y-6">
            {/* Animais */}
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
                  className="flex items-center justify-center gap-2 bg-[#05ABAD] hover:bg-[#026B6D] text-white px-5 py-3 rounded-xl font-semibold text-sm transition"
                >
                  <FiPlus />
                  Cadastrar animal
                </button>
              </div>

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
            </section>

            {/* Atalhos */}
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

          {/* Dados do tutor */}
          <aside>
            <section className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 rounded-full bg-[#E8F7F7] flex items-center justify-center">
                  <FiUser className="text-[#05ABAD] text-xl" />
                </div>
                <div>
                  <h3 className="font-bold text-gray-800">Meu perfil</h3>
                  <p className="text-xs text-gray-500">Dados cadastrais</p>
                </div>
              </div>

              <div className="space-y-5">
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
                  <FiMail className="text-[#05ABAD] mt-1" />
                  <div>
                    <p className="text-xs text-gray-400 mb-1">E-mail</p>
                    <p className="text-sm font-medium text-gray-700 break-all">
                      {usuario.email}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <FiPhone className="text-[#05ABAD] mt-1" />
                  <div>
                    <p className="text-xs text-gray-400 mb-1">Telefone</p>
                    <p className="text-sm font-medium text-gray-700">
                      {tutor.telefone || "Não informado"}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <FiMapPin className="text-[#05ABAD] mt-1" />
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
    </div>
  );
}
