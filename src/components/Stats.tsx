import { useEffect, useState } from "react";
import {
  getImpactStats,
  type ImpactStats,
} from "../services/stats";

export default function Stats() {
  const [stats, setStats] = useState<ImpactStats | null>(null);

  useEffect(() => {
    async function carregarEstatisticas() {
      try {
        const data = await getImpactStats();
        setStats(data);
      } catch (error) {
        console.error(
          "Erro ao carregar estatísticas do Supabase:",
          error
        );
      }
    }

    carregarEstatisticas();
  }, []);

  return (
    <section className="bg-[#F4F4F4] pt-4 pb-16">
      <div className="max-w-6xl mx-auto px-8">
        <p className="text-xs font-bold tracking-wider text-gray-400 uppercase mb-1">
          NOSSO IMPACTO
        </p>
        <h3 className="text-2xl font-bold text-[#026B6D] mb-8">
          Números que representam cuidado
        </h3>

 <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          {/* Vacinações */}
          <div className="bg-[#EAEFEF] p-5 rounded-2xl flex flex-col justify-between border border-emerald-50">
            <span className="text-2xl mb-2">💉</span>
            <div>
              <span className="text-2xl font-extrabold text-[#026B6D]">
                {(stats?.vaccinated ?? 0).toLocaleString("pt-BR")}
              </span>
              <span className="text-2xl font-bold text-orange-500 ml-1">+</span>
            </div>
            <p className="text-[11px] text-gray-500 mt-1 leading-tight">
              Animais vacinados contra raiva
            </p>
          </div>

          {/* Castrações */}
          <div className="bg-[#EAEFEF] p-5 rounded-2xl flex flex-col justify-between border border-emerald-50">
            <span className="text-2xl mb-2">🐾</span>
            <div>
              <span className="text-2xl font-extrabold text-[#026B6D]">
                {(stats?.castrations ?? 0).toLocaleString("pt-BR")}
              </span>
              <span className="text-2xl font-bold text-orange-500 ml-1">+</span>
            </div>
            <p className="text-[11px] text-gray-500 mt-1 leading-tight">
              Castrações realizadas
            </p>
          </div>

          {/* Testes */}
          <div className="bg-[#EAEFEF] p-5 rounded-2xl flex flex-col justify-between border border-emerald-50">
            <span className="text-2xl mb-2">🧬</span>
            <div>
              <span className="text-2xl font-extrabold text-[#026B6D]">
                {(stats?.tests ?? 0).toLocaleString("pt-BR")}
              </span>
              <span className="text-2xl font-bold text-orange-500 ml-1">+</span>
            </div>
            <p className="text-[11px] text-gray-500 mt-1 leading-tight">
              Testes de leishmaniose
            </p>
          </div>

          {/* Acolhidos */}
          <div className="bg-[#EAEFEF] p-5 rounded-2xl flex flex-col justify-between border border-emerald-50">
            <span className="text-2xl mb-2">🏠</span>
            <div>
              <span className="text-2xl font-extrabold text-[#026B6D]">
                {(stats?.sheltered ?? 0).toLocaleString("pt-BR")}
              </span>
              <span className="text-2xl font-bold text-orange-500 ml-1">+</span>
            </div>
            <p className="text-[11px] text-gray-500 mt-1 leading-tight">
              Animais acolhidos e encaminhados
            </p>
          </div>

          {/* Cidadãos */}
          <div className="bg-[#EAEFEF] p-5 rounded-2xl flex flex-col justify-between border border-emerald-50">
            <span className="text-2xl mb-2">👥</span>
            <div>
              <span className="text-2xl font-extrabold text-[#026B6D]">
                {(stats?.citizens ?? 0).toLocaleString("pt-BR")}
              </span>
              <span className="text-2xl font-bold text-orange-500 ml-1">+</span>
            </div>
            <p className="text-[11px] text-gray-500 mt-1 leading-tight">
              Cidadãos atendidos
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
