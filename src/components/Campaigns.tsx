import { useEffect, useState } from "react";
import gato from "../assets/images/gato.png";

interface Campaign {
  id: string;
  title: string;
  description: string;
}

export default function Campaigns() {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Busca as campanhas do nosso backend
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
        ) : (
          <div className="grid md:grid-cols-2 gap-8">
            {campaigns.map((camp) => (
              <div key={camp.id} className="bg-white rounded-3xl shadow-lg p-8">
                <h3 className="text-2xl font-bold text-[#026B6D] mb-4">
                  {camp.title}
                </h3>
                <p className="text-gray-600">{camp.description}</p>
              </div>
            ))}
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