import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";

interface Campaign {
  id: string;
  title: string;
  description: string;
  status: string;
  schedule: string;
  location: string;
  buttonText?: string;
}

interface ImpactStats {
  vaccinated: number;
  castrations: number;
  tests: number;
  sheltered: number;
  citizens: number;
}

export default function AdminDashboard() {
  const navigate = useNavigate();

  const [campaigns, setCampaigns] = useState<Campaign[]>([]);

  // Campos do formulário de campanha
  const [newTitle, setNewTitle] = useState("");
  const [newDesc, setNewDesc] = useState("");
  const [newStatus, setNewStatus] = useState("");
  const [newSchedule, setNewSchedule] = useState("");
  const [newLocation, setNewLocation] = useState("");
  const [newButtonText, setNewButtonText] = useState("");

  const [stats, setStats] = useState<ImpactStats>({
    vaccinated: 0,
    castrations: 0,
    tests: 0,
    sheltered: 0,
    citizens: 0,
  });

  const [message, setMessage] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("admin_token");
    if (!token) {
      navigate("/login");
      return;
    }

    fetch("http://localhost:3001/api/campaigns")
      .then((res) => res.json())
      .then((data) => setCampaigns(data));

    fetch("http://localhost:3001/api/stats")
      .then((res) => res.json())
      .then((data) => setStats(data));
  }, [navigate]);

  const handleAddCampaign = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle || !newDesc) return;

    const res = await fetch("http://localhost:3001/api/campaigns", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
         title: newTitle, 
         description: newDesc,
         status: newStatus,
         schedule: newSchedule,
         location: newLocation,
         buttonText: newButtonText || null,
      }),
    });

    if (res.ok) {
      const added = await res.json();
      setCampaigns([...campaigns, added]);
      setNewTitle("");
      setNewDesc("");
      setNewStatus("");
      setNewSchedule("");
      setNewLocation("");
      setNewButtonText("");
      setMessage("Campanha adicionada com sucesso!");
    }
  };

  const handleDeleteCampaign = async (id: string) => {
    const res = await fetch(`http://localhost:3001/api/campaigns/${id}`, {
      method: "DELETE",
    });

    if (res.ok) {
      setCampaigns(campaigns.filter((c) => c.id !== id));
      setMessage("Campanha removida!");
    }
  };

  const handleSaveStats = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await fetch("http://localhost:3001/api/stats", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(stats),
    });

    if (res.ok) {
      setMessage("Estatísticas atualizadas com sucesso!");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("admin_token");
    navigate("/login");
  };

  return (
    <main className="min-h-screen bg-[#F4F4F4] py-10 px-4">

      <div className="relative z-10 max-w-4xl mx-auto space-y-8">
        {/* Cabeçalho */}
        <div className="flex justify-between items-center bg-[#05ABAD] p-6 rounded-[30px] shadow-xl">
          <div>
            <h1 className="text-2xl font-bold text-white">Painel do Administrador</h1>
            <p className="text-white/80 text-sm">Gerencie o conteúdo do portal Zoonoses</p>
          </div>
          <div className="flex gap-4 items-center">
            <Link to="/" className="text-white text-sm hover:underline">
              Ver Site
            </Link>
            <button
              onClick={handleLogout}
              className="bg-white text-[#026B6D] px-4 py-2 rounded-full font-bold text-sm hover:bg-gray-100 transition"
            >
              Sair
            </button>
          </div>
        </div>

        {message && (
          <div className="bg-white/90 text-[#026B6D] font-bold p-4 rounded-2xl text-center shadow">
            {message}
          </div>
        )}

        {/* Gerenciar Campanhas */}
        <div className="bg-[#05ABAD] p-8 rounded-[30px] shadow-xl text-white">
          <h2 className="text-xl font-bold mb-4">Gerenciar Campanhas</h2>

          <form onSubmit={handleAddCampaign} className="space-y-4 mb-6">
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-white/90 mb-1">Título</label>
                <input
                  type="text"
                  placeholder="Ex: Campanha Antirrábica 2026"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full h-11 bg-white rounded-full px-5 text-gray-700 outline-none placeholder:text-gray-400 text-sm"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-white/90 mb-1">Status da Campanha</label>
                <select
                  value={newStatus}
                  onChange={(e) => setNewStatus(e.target.value)}
                  className="w-full h-11 bg-white rounded-full px-5 text-gray-700 outline-none text-sm cursor-pointer"
                >
                  <option value="Em andamento">Em andamento</option>
                  <option value="Agendamento prévio">Agendamento prévio</option>
                  <option value="Encerrada">Encerrada</option>
                </select>
              </div>

              <div className="md:col-span-2">
                <label className="block text-xs font-bold text-white/90 mb-1">Descrição</label>
                <input
                  type="text"
                  placeholder="Ex: Vacinação gratuita para cães e gatos em todos os bairros."
                  value={newDesc}
                  onChange={(e) => setNewDesc(e.target.value)}
                  className="w-full h-11 bg-white rounded-full px-5 text-gray-700 outline-none placeholder:text-gray-400 text-sm"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-white/90 mb-1">Data / Horário</label>
                <input
                  type="text"
                  placeholder="Ex: Todo sábado - 08h às 12h"
                  value={newSchedule}
                  onChange={(e) => setNewSchedule(e.target.value)}
                  className="w-full h-11 bg-white rounded-full px-5 text-gray-700 outline-none placeholder:text-gray-400 text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-white/90 mb-1">Local</label>
                <input
                  type="text"
                  placeholder="Ex: Ponto de vacinação do seu bairro"
                  value={newLocation}
                  onChange={(e) => setNewLocation(e.target.value)}
                  className="w-full h-11 bg-white rounded-full px-5 text-gray-700 outline-none placeholder:text-gray-400 text-sm"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-xs font-bold text-white/90 mb-1">
                  Texto do Botão de Ação (Opcional)
                </label>
                <input
                  type="text"
                  placeholder="Ex: Agendar (deixe em branco para não exibir botão)"
                  value={newButtonText}
                  onChange={(e) => setNewButtonText(e.target.value)}
                  className="w-full h-11 bg-white rounded-full px-5 text-gray-700 outline-none placeholder:text-gray-400 text-sm"
                />
              </div>
            </div>

            <button
              type="submit"
              className="h-11 px-6 rounded-full bg-white text-[#026B6D] font-bold hover:bg-gray-100 transition"
            >
              + Adicionar Campanha
            </button>
          </form>

          {/* Lista de Campanhas */}
          <h3 className="text-md font-bold text-white mb-4">Campanhas Ativas</h3>
          <div className="space-y-3">
            {campaigns.map((camp) => {
              const isAgendamento = camp.status === "Agendamento prévio";
              const isEncerrada = camp.status === "Encerrada";

              // Define as cores do badge dinamicamente
              const badgeClass = isAgendamento
                ? "bg-amber-100 text-amber-800"
                : isEncerrada
                ? "bg-red-100 text-red-700"
                : "bg-[#EAEFEF] text-[#026B6D]";

              return (
                <div
                  key={camp.id}
                  className="flex flex-col md:flex-row justify-between items-start md:items-center bg-white p-4 rounded-2xl text-gray-800 gap-4 shadow"
                >
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-bold text-[#026B6D] text-base">{camp.title}</h4>
                      <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full ${badgeClass}`}>
                        {camp.status}
                      </span>
                    </div>
                    <p className="text-xs text-gray-600 mb-1">{camp.description}</p>
                    <p className="text-[11px] text-gray-400">
                      📅 {camp.schedule} | 📍 {camp.location}
                    </p>
                  </div>
                  <button
                    onClick={() => handleDeleteCampaign(camp.id)}
                    className="bg-red-500 hover:bg-red-600 text-white px-4 py-1.5 rounded-full text-xs font-bold transition self-end md:self-auto"
                  >
                    Excluir
                  </button>
                </div>
              );
            })}
          </div>
        </div>

        {/* Gerenciar Estatísticas */}
        <div className="bg-[#05ABAD] p-8 rounded-[30px] shadow-xl text-white">
          <h2 className="text-xl font-bold mb-4">Atualizar Números de Impacto</h2>

          <form onSubmit={handleSaveStats} className="grid grid-cols-2 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs text-white/80 mb-1">Vacinados</label>
              <input
                type="number"
                value={stats.vaccinated}
                onChange={(e) =>
                  setStats({ ...stats, vaccinated: Number(e.target.value) })
                }
                className="w-full h-10 bg-white rounded-full px-4 text-gray-700 outline-none"
              />
            </div>

            <div>
              <label className="block text-xs text-white/80 mb-1">Castrações</label>
              <input
                type="number"
                value={stats.castrations}
                onChange={(e) =>
                  setStats({ ...stats, castrations: Number(e.target.value) })
                }
                className="w-full h-10 bg-white rounded-full px-4 text-gray-700 outline-none"
              />
            </div>

            <div>
              <label className="block text-xs text-white/80 mb-1">Testes</label>
              <input
                type="number"
                value={stats.tests}
                onChange={(e) => setStats({ ...stats, tests: Number(e.target.value) })}
                className="w-full h-10 bg-white rounded-full px-4 text-gray-700 outline-none"
              />
            </div>

            <div>
              <label className="block text-xs text-white/80 mb-1">Acolhidos</label>
              <input
                type="number"
                value={stats.sheltered}
                onChange={(e) =>
                  setStats({ ...stats, sheltered: Number(e.target.value) })
                }
                className="w-full h-10 bg-white rounded-full px-4 text-gray-700 outline-none"
              />
            </div>

            <div>
              <label className="block text-xs text-white/80 mb-1">Cidadãos Atendidos</label>
              <input
                type="number"
                value={stats.citizens}
                onChange={(e) =>
                  setStats({ ...stats, citizens: Number(e.target.value) })
                }
                className="w-full h-10 bg-white rounded-full px-4 text-gray-700 outline-none"
              />
            </div>

            <div className="col-span-2 md:col-span-3 mt-4">
              <button
                type="submit"
                className="h-11 px-8 rounded-full bg-white text-[#026B6D] font-bold hover:bg-gray-100 transition"
              >
                Salvar Alterações
              </button>
            </div>
          </form>
        </div>
      </div>
    </main>
  );
}