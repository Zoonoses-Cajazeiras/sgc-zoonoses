import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import patinhas from "../assets/patterns/patinhas.png";

interface Campaign {
  id: string;
  title: string;
  description: string;
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
  const [newTitle, setNewTitle] = useState("");
  const [newDesc, setNewDesc] = useState("");

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
      body: JSON.stringify({ title: newTitle, description: newDesc }),
    });

    if (res.ok) {
      const added = await res.json();
      setCampaigns([...campaigns, added]);
      setNewTitle("");
      setNewDesc("");
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
    <main className="min-h-screen relative overflow-y-auto bg-[#026B6D] py-10 px-4">
      {/* Fundo de patinhas */}
      <div
        className="absolute inset-0 opacity-10 pointer-events-none"
        style={{
          backgroundImage: `url(${patinhas})`,
          backgroundRepeat: "repeat",
          backgroundSize: "450px",
        }}
      />

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
              <input
                type="text"
                placeholder="Título da Campanha"
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                className="w-full h-12 bg-white rounded-full px-5 text-gray-700 outline-none placeholder:text-gray-400"
                required
              />
              <input
                type="text"
                placeholder="Descrição resumida"
                value={newDesc}
                onChange={(e) => setNewDesc(e.target.value)}
                className="w-full h-12 bg-white rounded-full px-5 text-gray-700 outline-none placeholder:text-gray-400"
                required
              />
            </div>
            <button
              type="submit"
              className="h-11 px-6 rounded-full bg-white text-[#026B6D] font-bold hover:bg-gray-100 transition"
            >
              + Adicionar Campanha
            </button>
          </form>

          <div className="space-y-3">
            {campaigns.map((camp) => (
              <div
                key={camp.id}
                className="flex justify-between items-center bg-white/10 p-4 rounded-2xl border border-white/20"
              >
                <div>
                  <h4 className="font-bold text-white">{camp.title}</h4>
                  <p className="text-sm text-white/80">{camp.description}</p>
                </div>
                <button
                  onClick={() => handleDeleteCampaign(camp.id)}
                  className="bg-red-500/80 hover:bg-red-600 text-white px-3 py-1 rounded-full text-xs font-bold transition"
                >
                  Excluir
                </button>
              </div>
            ))}
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