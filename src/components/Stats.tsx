import { useEffect, useState } from "react";

interface ImpactStats {
  vaccinated: number;
  castrations: number;
  tests: number;
  sheltered: number;
  citizens: number;
}

export default function Stats() {
  const [stats, setStats] = useState<ImpactStats>({
    vaccinated: 0,
    castrations: 0,
    tests: 0,
    sheltered: 0,
    citizens: 0,
  });

  useEffect(() => {
    fetch("http://localhost:3001/api/stats")
      .then((res) => res.json())
      .then((data) => setStats(data))
      .catch((err) => console.error("Erro ao buscar estatísticas:", err));
  }, []);

  return (
    <section className="bg-[#F4F4F4] py-10">
      <div className="max-w-6xl mx-auto px-8">
        <p className="text-xs font-bold tracking-wider text-gray-500 uppercase mb-1">
          Nosso Impacto
        </p>
        <h3 className="text-2xl font-bold text-[#026B6D] mb-8">
          Números que representam cuidado
        </h3>

        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 text-center">
          <div className="bg-[#EAF4F4] p-6 rounded-2xl">
            <span className="text-3xl font-extrabold text-[#026B6D]">
              {stats.vaccinated.toLocaleString("pt-BR")}+
            </span>
            <p className="text-xs text-gray-600 mt-2">Animals vacinados contra raiva</p>
          </div>

          <div className="bg-[#EAF4F4] p-6 rounded-2xl">
            <span className="text-3xl font-extrabold text-[#026B6D]">
              {stats.castrations.toLocaleString("pt-BR")}+
            </span>
            <p className="text-xs text-gray-600 mt-2">Castrações realizadas</p>
          </div>

          <div className="bg-[#EAF4F4] p-6 rounded-2xl">
            <span className="text-3xl font-extrabold text-[#026B6D]">
              {stats.tests.toLocaleString("pt-BR")}+
            </span>
            <p className="text-xs text-gray-600 mt-2">Testes de leishmaniose</p>
          </div>

          <div className="bg-[#EAF4F4] p-6 rounded-2xl">
            <span className="text-3xl font-extrabold text-[#026B6D]">
              {stats.sheltered.toLocaleString("pt-BR")}+
            </span>
            <p className="text-xs text-gray-600 mt-2">Animais acolhidos</p>
          </div>

          <div className="bg-[#EAF4F4] p-6 rounded-2xl">
            <span className="text-3xl font-extrabold text-[#026B6D]">
              {stats.citizens.toLocaleString("pt-BR")}+
            </span>
            <p className="text-xs text-gray-600 mt-2">Cidadãos atendidos</p>
          </div>
        </div>
      </div>
    </section>
  );
}