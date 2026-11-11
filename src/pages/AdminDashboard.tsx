
import { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  FiUsers,
  FiLogOut,
  FiGlobe,
  FiHeart,
  FiClipboard,
  FiCalendar,
  FiBarChart2,
  FiBell,
} from "react-icons/fi";

import { getSession, logout } from "../services/auth";

export default function AdminDashboard() {
  const navigate = useNavigate();

  useEffect(() => {
    async function verificarAcesso() {
      const session = await getSession();

      if (!session || session.user.papel !== "ADMIN") {
        await logout();
        navigate("/login");
      }
    }

    verificarAcesso();
  }, [navigate]);

  async function handleLogout() {
    await logout();
    navigate("/login");
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

          <div className="flex items-center gap-5">
            <Link
              to="/"
              className="flex items-center gap-2 text-gray-500 hover:text-[#026B6D] transition text-sm font-medium cursor-pointer"
            >
              <FiGlobe />
              <span className="hidden sm:inline">Ver site</span>
            </Link>

            <button
              type="button"
              onClick={handleLogout}
              className="flex items-center gap-2 text-gray-500 hover:text-red-500 transition text-sm font-medium cursor-pointer"
            >
              <FiLogOut />
              <span>Sair</span>
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-5 py-8 md:py-10">
        <section className="mb-8">
          <p className="text-sm text-[#05ABAD] font-semibold mb-1">
            Área administrativa
          </p>

          <h2 className="text-2xl md:text-3xl font-bold text-gray-800">
            Painel do Administrador
          </h2>

          <p className="text-gray-500 mt-2">
            Gerencie os cadastros, campanhas e serviços do Núcleo de Zoonoses.
          </p>
        </section>

        <section className="mb-8">
          <div className="mb-5">
            <h3 className="text-lg font-bold text-gray-800">
              Gerenciamento
            </h3>

            <p className="text-sm text-gray-500 mt-1">
              Selecione uma área para acessar suas funcionalidades.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Link
              to="/admin/campanhas"
              className="group bg-white border border-gray-100 rounded-2xl p-6 shadow-sm hover:shadow-md hover:border-[#BCE7E7] transition duration-200 cursor-pointer"
            >
              <div className="w-12 h-12 rounded-xl bg-[#E2F7F7] flex items-center justify-center mb-5">
                <FiBell className="text-[#026B6D] text-xl" />
              </div>

              <h4 className="font-bold text-gray-800 text-lg">
                Gerenciar campanhas
              </h4>

              <p className="text-sm text-gray-500 mt-2 leading-relaxed">
                Cadastre, edite e remova campanhas. Atualize também os
                números de impacto apresentados no portal.
              </p>

              <span className="inline-flex items-center gap-2 mt-5 text-sm font-semibold text-[#05ABAD] group-hover:text-[#026B6D] transition">
                Acessar campanhas
                <span>→</span>
              </span>
            </Link>

            <Link
              to="/admin/tutores"
              className="group bg-white border border-gray-100 rounded-2xl p-6 shadow-sm hover:shadow-md hover:border-[#BCE7E7] transition duration-200 cursor-pointer"
            >
              <div className="w-12 h-12 rounded-xl bg-[#E2F7F7] flex items-center justify-center mb-5">
                <FiUsers className="text-[#026B6D] text-xl" />
              </div>

              <h4 className="font-bold text-gray-800 text-lg">
                Gerenciar tutores
              </h4>

              <p className="text-sm text-gray-500 mt-2 leading-relaxed">
                Pesquise tutores cadastrados, consulte seus dados e
                visualize os animais vinculados a cada cadastro.
              </p>

              <span className="inline-flex items-center gap-2 mt-5 text-sm font-semibold text-[#05ABAD] group-hover:text-[#026B6D] transition">
                Acessar tutores
                <span>→</span>
              </span>
            </Link>
          </div>
        </section>

        <section>
          <div className="mb-5">
            <h3 className="text-lg font-bold text-gray-800">
              Funcionalidades futuras
            </h3>

            <p className="text-sm text-gray-500 mt-1">
              Outras ferramentas que farão parte da administração do sistema.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm">
              <div className="w-11 h-11 rounded-xl bg-[#E2F7F7] flex items-center justify-center mb-4">
                <FiClipboard className="text-[#026B6D] text-xl" />
              </div>

              <h4 className="font-bold text-gray-800">
                Solicitações de serviços
              </h4>

              <p className="text-sm text-gray-500 mt-2">
                Consulte e gerencie os pedidos enviados pelos tutores.
              </p>

              <p className="text-xs text-[#05ABAD] font-semibold mt-4">
                Em breve
              </p>
            </div>

            <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm">
              <div className="w-11 h-11 rounded-xl bg-[#E2F7F7] flex items-center justify-center mb-4">
                <FiHeart className="text-[#026B6D] text-xl" />
              </div>

              <h4 className="font-bold text-gray-800">
                Ocorrências
              </h4>

              <p className="text-sm text-gray-500 mt-2">
                Analise e acompanhe as ocorrências registradas pelos cidadãos.
              </p>

              <p className="text-xs text-[#05ABAD] font-semibold mt-4">
                Em breve
              </p>
            </div>

            <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm">
              <div className="w-11 h-11 rounded-xl bg-[#E2F7F7] flex items-center justify-center mb-4">
                <FiCalendar className="text-[#026B6D] text-xl" />
              </div>

              <h4 className="font-bold text-gray-800">
                Agendamentos
              </h4>

              <p className="text-sm text-gray-500 mt-2">
                Organize datas, horários, locais e equipes de atendimento.
              </p>

              <p className="text-xs text-[#05ABAD] font-semibold mt-4">
                Em breve
              </p>
            </div>

            <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm">
              <div className="w-11 h-11 rounded-xl bg-[#E2F7F7] flex items-center justify-center mb-4">
                <FiBarChart2 className="text-[#026B6D] text-xl" />
              </div>

              <h4 className="font-bold text-gray-800">
                Relatórios
              </h4>

              <p className="text-sm text-gray-500 mt-2">
                Consulte indicadores e dados sobre os atendimentos realizados.
              </p>

              <p className="text-xs text-[#05ABAD] font-semibold mt-4">
                Em breve
              </p>
            </div>

            <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm">
              <div className="w-11 h-11 rounded-xl bg-[#E2F7F7] flex items-center justify-center mb-4">
                <FiHeart className="text-[#026B6D] text-xl" />
              </div>

              <h4 className="font-bold text-gray-800">
                Animais cadastrados
              </h4>

              <p className="text-sm text-gray-500 mt-2">
                Acompanhe os registros de animais vinculados aos tutores.
              </p>

              <p className="text-xs text-[#05ABAD] font-semibold mt-4">
                Em breve
              </p>
            </div>
          </div>
        </section>

        <footer className="text-center text-xs text-gray-400 mt-10 pb-4">
          Sistema de Gestão do Núcleo de Zoonoses — Prefeitura de Cajazeiras
        </footer>
      </main>
    </div>
  );
}
