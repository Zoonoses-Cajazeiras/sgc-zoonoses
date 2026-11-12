import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import patinhas from "../assets/patterns/patinhas.png";
import { getSession, logout } from "../services/auth";
import { formatCampaignDateTime } from "../utils/formatDate";
import {
  createCampaign,
  deleteCampaign,
  listAdminCampaigns,
  updateCampaign,
  type Campaign,
  type CampaignStatus,
} from "../services/campaigns";
import {
  getImpactStats,
  updateImpactStats,
  type ImpactStats,
} from "../services/stats";

function toDateTimeLocal(value: string | null): string {
  if (!value) return "";

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";

  const localDate = new Date(
    date.getTime() - date.getTimezoneOffset() * 60_000,
  );

  return localDate.toISOString().slice(0, 16);
}

export default function AdminDashboard() {
  const navigate = useNavigate();

  const [campaigns, setCampaigns] = useState<Campaign[]>([]);

  // Campos do formulário de nova campanha.
  const [newTitle, setNewTitle] = useState("");
  const [newDesc, setNewDesc] = useState("");
  const [newStatus, setNewStatus] =
    useState<CampaignStatus>("ativa");
  const [newSchedule, setNewSchedule] = useState("");
  const [newLocation, setNewLocation] = useState("");
  const [newButtonText, setNewButtonText] = useState("");

  // Campos do formulário de edição de campanha.
  const [editingCampaignId, setEditingCampaignId] =
    useState<string | null>(null);
  const [editTitle, setEditTitle] = useState("");
  const [editDesc, setEditDesc] = useState("");
  const [editStatus, setEditStatus] =
    useState<CampaignStatus>("ativa");
  const [editSchedule, setEditSchedule] = useState("");
  const [editLocation, setEditLocation] = useState("");
  const [editButtonText, setEditButtonText] = useState("");
  const [savingCampaign, setSavingCampaign] = useState(false);

  const [stats, setStats] = useState<ImpactStats | null>(null);
  const [message, setMessage] = useState("");

  useEffect(() => {
    async function carregarDashboard() {
      const session = await getSession();

      if (!session || session.user.papel !== "ADMIN") {
        await logout();
        navigate("/login");
        return;
      }

      try {
        const campaignData = await listAdminCampaigns();
        setCampaigns(campaignData);
      } catch (error) {
        console.error("Erro ao carregar campanhas:", error);
        setMessage("Não foi possível carregar as campanhas.");
      }

      // Carrega os indicadores pela API NestJS.
      try {
        const statsData = await getImpactStats();
        setStats(statsData);
      } catch (error) {
        console.error("Erro ao carregar estatísticas:", error);
        setMessage("Não foi possível carregar as estatísticas.");
      }
    }

    carregarDashboard();
  }, [navigate]);

  const handleAddCampaign = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!newTitle.trim() || !newDesc.trim()) {
      setMessage("Preencha o título e a descrição.");
      return;
    }

    try {
      const scheduleIso = newSchedule
        ? new Date(newSchedule).toISOString()
        : null;

      const added = await createCampaign({
        title: newTitle.trim(),
        description: newDesc.trim(),
        status: newStatus,
        schedule: scheduleIso,
        location: newLocation.trim() || null,
        buttonText: newButtonText.trim() || "Saiba mais",
      });

      setCampaigns((currentCampaigns) => [
        added,
        ...currentCampaigns,
      ]);

      setNewTitle("");
      setNewDesc("");
      setNewStatus("ativa");
      setNewSchedule("");
      setNewLocation("");
      setNewButtonText("");

      setMessage("Campanha adicionada com sucesso!");
    } catch (error) {
      console.error("Erro ao criar campanha:", error);

      if (error instanceof Error) {
        setMessage(`Erro ao adicionar: ${error.message}`);
      } else {
        setMessage("Erro ao adicionar a campanha.");
      }
    }
  };

  const handleStartEdit = (campaign: Campaign) => {
    setEditingCampaignId(campaign.id);
    setEditTitle(campaign.title);
    setEditDesc(campaign.description);
    setEditStatus(campaign.status);
    setEditSchedule(toDateTimeLocal(campaign.schedule));
    setEditLocation(campaign.location ?? "");
    setEditButtonText(campaign.buttonText ?? "Saiba mais");
    setMessage("");
  };

  const handleCancelEdit = () => {
    setEditingCampaignId(null);
    setEditTitle("");
    setEditDesc("");
    setEditStatus("ativa");
    setEditSchedule("");
    setEditLocation("");
    setEditButtonText("");
  };

  const handleSaveCampaignEdit = async (
    e: React.FormEvent<HTMLFormElement>,
  ) => {
    e.preventDefault();

    if (!editingCampaignId) return;

    if (!editTitle.trim() || !editDesc.trim()) {
      setMessage("Preencha o título e a descrição.");
      return;
    }

    try {
      setSavingCampaign(true);

      const updated = await updateCampaign(editingCampaignId, {
        title: editTitle.trim(),
        description: editDesc.trim(),
        status: editStatus,
        schedule: editSchedule
          ? new Date(editSchedule).toISOString()
          : null,
        location: editLocation.trim() || null,
        buttonText: editButtonText.trim() || "Saiba mais",
      });

      setCampaigns((currentCampaigns) =>
        currentCampaigns.map((campaign) =>
          campaign.id === updated.id ? updated : campaign,
        ),
      );

      handleCancelEdit();
      setMessage("Campanha atualizada com sucesso!");
    } catch (error) {
      console.error("Erro ao editar campanha:", error);

      if (error instanceof Error) {
        setMessage(`Erro ao atualizar campanha: ${error.message}`);
      } else {
        setMessage("Não foi possível atualizar a campanha.");
      }
    } finally {
      setSavingCampaign(false);
    }
  };

  const handleDeleteCampaign = async (id: string) => {
    try {
      await deleteCampaign(id);

      setCampaigns((currentCampaigns) =>
        currentCampaigns.filter(
          (campaign) => campaign.id !== id,
        ),
      );

      if (editingCampaignId === id) {
        handleCancelEdit();
      }

      setMessage("Campanha removida com sucesso!");
    } catch (error) {
      console.error("Erro ao remover campanha:", error);
      setMessage("Não foi possível remover a campanha.");
    }
  };

  const handleSaveStats = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!stats) {
      setMessage("As estatísticas ainda não foram carregadas.");
      return;
    }

    try {
      const updated = await updateImpactStats(stats.id, {
        vaccinated: stats.vaccinated,
        castrations: stats.castrations,
        tests: stats.tests,
        sheltered: stats.sheltered,
        citizens: stats.citizens,
      });

      setStats(updated);
      setMessage("Estatísticas atualizadas com sucesso!");
    } catch (error) {
      console.error("Erro ao atualizar estatísticas:", error);

      if (error instanceof Error) {
        setMessage(`Erro ao atualizar: ${error.message}`);
      } else {
        setMessage("Não foi possível atualizar as estatísticas.");
      }
    }
  };

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  return (
    <main className="min-h-screen bg-[#026B6D] py-10 px-4">
      {/* Fundo de patinhas */}
      <div
        className="absolute inset-0 opacity-10"
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
            <h1 className="text-2xl font-bold text-white">
              Painel do Administrador
            </h1>
            <p className="text-white/80 text-sm">
              Gerencie o conteúdo do portal Zoonoses
            </p>
          </div>

          <div className="flex gap-4 items-center">
            <Link
              to="/"
              className="text-white text-sm hover:underline cursor-pointer"
            >
              Ver Site
            </Link>

            <button
              type="button"
              onClick={handleLogout}
              className="bg-white text-[#026B6D] px-4 py-2 rounded-full font-bold text-sm hover:bg-gray-100 transition cursor-pointer"
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
          <h2 className="text-xl font-bold mb-4">
            Gerenciar Campanhas
          </h2>

          <form
            onSubmit={handleAddCampaign}
            className="space-y-4 mb-6"
          >
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-white/90 mb-1">
                  Título
                </label>
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
                <label className="block text-xs font-bold text-white/90 mb-1">
                  Status da Campanha
                </label>
                <select
                  value={newStatus}
                  onChange={(e) =>
                    setNewStatus(e.target.value as CampaignStatus)
                  }
                  className="w-full h-11 bg-white rounded-full px-5 text-gray-700 outline-none text-sm cursor-pointer"
                >
                  <option value="ativa">Ativa</option>
                  <option value="rascunho">Rascunho</option>
                  <option value="encerrada">Encerrada</option>
                </select>
              </div>

              <div className="md:col-span-2">
                <label className="block text-xs font-bold text-white/90 mb-1">
                  Descrição
                </label>
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
                <label className="block text-xs font-bold text-white/90 mb-1">
                  Data / Horário
                </label>
                <input
                  type="datetime-local"
                  value={newSchedule}
                  onChange={(e) => setNewSchedule(e.target.value)}
                  className="w-full h-11 bg-white rounded-full px-5 text-gray-700 outline-none text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-white/90 mb-1">
                  Local
                </label>
                <input
                  type="text"
                  placeholder="Ex: Centro de Zoonoses de Cajazeiras"
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
                  placeholder="Ex: Agendar"
                  value={newButtonText}
                  onChange={(e) => setNewButtonText(e.target.value)}
                  className="w-full h-11 bg-white rounded-full px-5 text-gray-700 outline-none placeholder:text-gray-400 text-sm"
                />
              </div>
            </div>

            <button
              type="submit"
              className="h-11 px-6 rounded-full bg-white text-[#026B6D] font-bold hover:bg-gray-100 transition cursor-pointer"
            >
              + Adicionar Campanha
            </button>
          </form>

          {/* Lista de Campanhas */}
          <h3 className="text-md font-bold text-white mb-4">
            Campanhas
          </h3>

          <div className="space-y-3">
            {campaigns.length === 0 && (
              <div className="bg-white/90 text-[#026B6D] p-4 rounded-2xl text-sm">
                Nenhuma campanha cadastrada.
              </div>
            )}

            {campaigns.map((camp) => {
              const isRascunho = camp.status === "rascunho";
              const isEncerrada = camp.status === "encerrada";

              const statusLabel = {
                ativa: "Ativa",
                encerrada: "Encerrada",
                rascunho: "Rascunho",
              }[camp.status];

              const badgeClass = isRascunho
                ? "bg-amber-100 text-amber-800"
                : isEncerrada
                  ? "bg-red-100 text-red-700"
                  : "bg-[#EAEFEF] text-[#026B6D]";

              const formattedSchedule = formatCampaignDateTime(
                camp.schedule,
              );

              return (
                <div
                  key={camp.id}
                  className="bg-white p-4 rounded-2xl text-gray-800 shadow"
                >
                  <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-2 mb-1">
                        <h4 className="font-bold text-[#026B6D] text-base">
                          {camp.title}
                        </h4>

                        <span
                          className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full ${badgeClass}`}
                        >
                          {statusLabel}
                        </span>
                      </div>

                      <p className="text-xs text-gray-600 mb-1">
                        {camp.description}
                      </p>

                      <p className="text-[11px] text-gray-400">
                        📅 {formattedSchedule} | 📍 {camp.location ?? "Local não informado"}
                      </p>
                    </div>

                    <div className="flex gap-2 self-end md:self-auto shrink-0">
                      <button
                        type="button"
                        onClick={() => handleStartEdit(camp)}
                        className="bg-[#026B6D] hover:bg-[#014f51] text-white px-4 py-1.5 rounded-full text-xs font-bold transition cursor-pointer"
                      >
                        Editar
                      </button>

                      <button
                        type="button"
                        onClick={() => handleDeleteCampaign(camp.id)}
                        className="bg-red-500 hover:bg-red-600 text-white px-4 py-1.5 rounded-full text-xs font-bold transition cursor-pointer"
                      >
                        Excluir
                      </button>
                    </div>
                  </div>

                  {editingCampaignId === camp.id && (
                    <form
                      onSubmit={handleSaveCampaignEdit}
                      className="mt-5 pt-5 border-t border-gray-200 grid md:grid-cols-2 gap-4"
                    >
                      <div>
                        <label className="block text-xs font-bold mb-1">
                          Título
                        </label>
                        <input
                          type="text"
                          value={editTitle}
                          onChange={(e) => setEditTitle(e.target.value)}
                          maxLength={180}
                          required
                          className="w-full h-11 bg-gray-50 border border-gray-200 rounded-xl px-4 text-gray-700 outline-none focus:border-[#026B6D]"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold mb-1">
                          Status da campanha
                        </label>
                        <select
                          value={editStatus}
                          onChange={(e) =>
                            setEditStatus(e.target.value as CampaignStatus)
                          }
                          className="w-full h-11 bg-gray-50 border border-gray-200 rounded-xl px-4 text-gray-700 outline-none cursor-pointer"
                        >
                          <option value="ativa">Ativa</option>
                          <option value="rascunho">Rascunho</option>
                          <option value="encerrada">Encerrada</option>
                        </select>
                      </div>

                      <div className="md:col-span-2">
                        <label className="block text-xs font-bold mb-1">
                          Descrição
                        </label>
                        <textarea
                          value={editDesc}
                          onChange={(e) => setEditDesc(e.target.value)}
                          maxLength={5000}
                          required
                          rows={3}
                          className="w-full bg-gray-50 border border-gray-200 rounded-xl p-4 text-gray-700 outline-none focus:border-[#026B6D] resize-y"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold mb-1">
                          Data / horário
                        </label>
                        <input
                          type="datetime-local"
                          value={editSchedule}
                          onChange={(e) => setEditSchedule(e.target.value)}
                          className="w-full h-11 bg-gray-50 border border-gray-200 rounded-xl px-4 text-gray-700 outline-none"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold mb-1">
                          Local
                        </label>
                        <input
                          type="text"
                          value={editLocation}
                          onChange={(e) => setEditLocation(e.target.value)}
                          maxLength={180}
                          className="w-full h-11 bg-gray-50 border border-gray-200 rounded-xl px-4 text-gray-700 outline-none"
                        />
                      </div>

                      <div className="md:col-span-2">
                        <label className="block text-xs font-bold mb-1">
                          Texto do botão
                        </label>
                        <input
                          type="text"
                          value={editButtonText}
                          onChange={(e) => setEditButtonText(e.target.value)}
                          maxLength={80}
                          placeholder="Saiba mais"
                          className="w-full h-11 bg-gray-50 border border-gray-200 rounded-xl px-4 text-gray-700 outline-none"
                        />
                      </div>

                      <div className="md:col-span-2 flex flex-wrap gap-3">
                        <button
                          type="submit"
                          disabled={savingCampaign}
                          className="h-10 px-6 rounded-full bg-[#026B6D] text-white font-bold text-sm hover:bg-[#014f51] transition cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
                        >
                          {savingCampaign ? "Salvando..." : "Salvar edição"}
                        </button>

                        <button
                          type="button"
                          onClick={handleCancelEdit}
                          disabled={savingCampaign}
                          className="h-10 px-6 rounded-full border border-gray-300 text-gray-700 font-bold text-sm hover:bg-gray-100 transition cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
                        >
                          Cancelar
                        </button>
                      </div>
                    </form>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Gerenciar Estatísticas */}
        <div className="bg-[#05ABAD] p-8 rounded-[30px] shadow-xl text-white">
          <h2 className="text-xl font-bold mb-4">
            Atualizar Números de Impacto
          </h2>

          {stats ? (
            <form
              onSubmit={handleSaveStats}
              className="grid grid-cols-2 md:grid-cols-3 gap-4"
            >
              <div>
                <label className="block text-xs text-white/80 mb-1">
                  Vacinados
                </label>
                <input
                  type="number"
                  min="0"
                  step="1"
                  value={stats.vaccinated}
                  onChange={(e) =>
                    setStats({
                      ...stats,
                      vaccinated: Number(e.target.value),
                    })
                  }
                  className="w-full h-10 bg-white rounded-full px-4 text-gray-700 outline-none"
                />
              </div>

              <div>
                <label className="block text-xs text-white/80 mb-1">
                  Castrações
                </label>
                <input
                  type="number"
                  min="0"
                  step="1"
                  value={stats.castrations}
                  onChange={(e) =>
                    setStats({
                      ...stats,
                      castrations: Number(e.target.value),
                    })
                  }
                  className="w-full h-10 bg-white rounded-full px-4 text-gray-700 outline-none"
                />
              </div>

              <div>
                <label className="block text-xs text-white/80 mb-1">
                  Testes
                </label>
                <input
                  type="number"
                  min="0"
                  step="1"
                  value={stats.tests}
                  onChange={(e) =>
                    setStats({
                      ...stats,
                      tests: Number(e.target.value),
                    })
                  }
                  className="w-full h-10 bg-white rounded-full px-4 text-gray-700 outline-none"
                />
              </div>

              <div>
                <label className="block text-xs text-white/80 mb-1">
                  Acolhidos
                </label>
                <input
                  type="number"
                  min="0"
                  step="1"
                  value={stats.sheltered}
                  onChange={(e) =>
                    setStats({
                      ...stats,
                      sheltered: Number(e.target.value),
                    })
                  }
                  className="w-full h-10 bg-white rounded-full px-4 text-gray-700 outline-none"
                />
              </div>

              <div>
                <label className="block text-xs text-white/80 mb-1">
                  Cidadãos Atendidos
                </label>
                <input
                  type="number"
                  min="0"
                  step="1"
                  value={stats.citizens}
                  onChange={(e) =>
                    setStats({
                      ...stats,
                      citizens: Number(e.target.value),
                    })
                  }
                  className="w-full h-10 bg-white rounded-full px-4 text-gray-700 outline-none"
                />
              </div>

              <div className="col-span-2 md:col-span-3 mt-4">
                <button
                  type="submit"
                  className="h-11 px-8 rounded-full bg-white text-[#026B6D] font-bold hover:bg-gray-100 transition cursor-pointer"
                >
                  Salvar Alterações
                </button>
              </div>
            </form>
          ) : (
            <div className="bg-white/15 rounded-2xl p-5 text-center">
              <p className="text-white/90 text-sm">
                Carregando estatísticas...
              </p>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
