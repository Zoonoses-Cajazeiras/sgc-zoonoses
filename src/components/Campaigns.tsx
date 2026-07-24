import { useEffect, useState } from "react";
import gato from "../assets/images/gato.png";

interface Campaign {
  id: string;
  title: string;
  description: string;
  status?: string;
  schedule?: string;
  location?: string;
  buttonText?: string;
}

export default function Campaigns() {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("http://localhost:3001/api/campaigns")
      .then((res) => res.json())
      .then((data) => {
        setCampaigns(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Erro ao buscar campanhas:", err);
        setLoading(false);
      });
  }, []);

  // Função que define as cores da pílula e da bolinha na Home
  const getStatusStyles = (status?: string) => {
    switch (status) {
      case "Agendamento prévio":
        return {
          badgeBg: "bg-amber-100 text-amber-800",
          dotBg: "bg-amber-500",
        };
      case "Encerrada":
        return {
          badgeBg: "bg-red-100 text-red-700",
          dotBg: "bg-red-500",
        };
      case "Em andamento":
      default:
        return {
          badgeBg: "bg-[#EAEFEF] text-[#026B6D]",
          dotBg: "bg-emerald-500",
        };
    }
  };

  return (
    <section
      id="campanhas"
      className="relative bg-[#F4F4F4] pt-12 pb-20 overflow-visible scroll-mt-20"
    >
      <div className="max-w-6xl mx-auto px-8">
        <h2 className="text-center text-4xl font-bold text-[#026B6D] mb-16">
          Campanhas em Andamento
        </h2>

        {loading ? (
          <p className="text-center text-gray-500">Carregando campanhas...</p>
        ) : campaigns.length === 0 ? (
          <p className="text-center text-gray-500">
            Nenhuma campanha ativa no momento.
          </p>
        ) : (
          <div className="grid md:grid-cols-2 gap-8 relative z-10">
            {campaigns.map((camp) => {
              const styles = getStatusStyles(camp.status);

              return (
                <div
                  key={camp.id}
                  className="bg-white rounded-3xl shadow-lg p-8 flex flex-col justify-between"
                >
                  <div>
                    <h3 className="text-2xl font-bold text-[#026B6D] mb-4">
                      {camp.title}
                    </h3>
                    <p className="text-gray-600 mb-4">{camp.description}</p>

                    {/* Tag de Status com cor dinâmica */}
                    <div
                      className={`${styles.badgeBg} rounded-xl px-4 py-2 inline-block text-xs font-semibold mb-4 transition-colors duration-300`}
                    >
                      <span
                        className={`inline-block w-2 h-2 rounded-full ${styles.dotBg} mr-2`}
                      ></span>
                      {camp.status || "Em andamento"}
                    </div>

                    <div className="space-y-1 text-xs text-gray-500">
                      <p>📅 {camp.schedule || "Todo sábado - 08h às 12h"}</p>
                      <p>📍 {camp.location || "Ponto de vacinação do seu bairro"}</p>
                    </div>
                  </div>

                  {camp.buttonText && (
                    <div className="mt-4 text-right">
                      <button className="bg-[#05ABAD] hover:bg-[#026B6D] text-white text-xs font-bold px-5 py-2 rounded-full transition">
                        {camp.buttonText}
                      </button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}

        <img
          src={gato}
          alt="Gato"
          className="
            absolute
            right-0
            bottom-0
            translate-x-1/3
            w-[380px]
            z-20
            pointer-events-none
            select-none
          "
        />
      </div>
    </section>
  );
}