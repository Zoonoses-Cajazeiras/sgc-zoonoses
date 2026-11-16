
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  FiArrowLeft,
  FiCalendar,
  FiEdit2,
  FiHeart,
  FiInfo,
  FiLoader,
  FiMapPin,
  FiAlertCircle,
} from "react-icons/fi";
import { listarMeusAnimais } from "../services/animals";
import type { Animal } from "../services/animals";

export default function AnimalDetails() {
  const navigate = useNavigate();
  const { id } = useParams();

  const [animal, setAnimal] = useState<Animal | null>(null);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState("");

  useEffect(() => {
    async function carregarAnimal() {
      try {
        setCarregando(true);
        setErro("");

        const animais = await listarMeusAnimais();
        const encontrado = animais.find((item) => item.id === id);

        if (!encontrado) {
          setErro("Animal não encontrado ou não pertence ao seu cadastro.");
          return;
        }

        setAnimal(encontrado);
      } catch (error) {
        console.error("Erro ao carregar animal:", error);
        setErro("Não foi possível carregar os dados do animal.");
      } finally {
        setCarregando(false);
      }
    }

    carregarAnimal();
  }, [id]);

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

  function formatarData(data: string | null) {
    if (!data) return "Não informado";

    return new Date(`${data.split("T")[0]}T00:00:00`).toLocaleDateString(
      "pt-BR",
    );
  }

  function formatarIdade(meses: number | null) {
    if (meses === null || meses === undefined) return "Não informada";

    if (meses < 12) {
      return `${meses} ${meses === 1 ? "mês" : "meses"}`;
    }

    const anos = Math.floor(meses / 12);
    const mesesRestantes = meses % 12;

    if (mesesRestantes === 0) {
      return `${anos} ${anos === 1 ? "ano" : "anos"}`;
    }

    return `${anos} ${anos === 1 ? "ano" : "anos"} e ${mesesRestantes} ${
      mesesRestantes === 1 ? "mês" : "meses"
    }`;
  }

  if (carregando) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#F5F8F8] text-[#026B6D]">
        <FiLoader className="animate-spin text-4xl mb-3" />
        <p className="font-medium">Carregando perfil do animal...</p>
      </div>
    );
  }

  if (erro || !animal) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F5F8F8] px-4">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 max-w-md w-full text-center">
          <FiAlertCircle className="text-red-500 text-4xl mx-auto mb-4" />

          <h2 className="text-xl font-bold text-gray-800 mb-2">
            Não foi possível abrir o perfil
          </h2>

          <p className="text-gray-500 mb-6">{erro}</p>

          <button
            onClick={() => navigate("/perfil")}
            className="bg-[#05ABAD] hover:bg-[#026B6D] text-white px-6 py-3 rounded-xl font-semibold transition cursor-pointer"
          >
            Voltar para meu perfil
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F5F8F8]">
      <header className="bg-white border-b border-gray-100">
        <div className="max-w-5xl mx-auto px-5 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-[#026B6D]">
              Núcleo de Zoonoses
            </h1>
            <p className="text-xs text-gray-500">
              Prefeitura de Cajazeiras
            </p>
          </div>

          <button
            onClick={() => navigate("/perfil")}
            className="flex items-center gap-2 text-gray-500 hover:text-[#05ABAD] transition text-sm font-medium cursor-pointer"
          >
            <FiArrowLeft />
            Voltar
          </button>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-5 py-8 md:py-10">
        <button
          onClick={() => navigate("/perfil")}
          className="inline-flex items-center gap-2 text-sm font-semibold text-[#05ABAD] hover:text-[#026B6D] mb-6 transition cursor-pointer"
        >
          <FiArrowLeft />
          Meus animais
        </button>

        <section className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="h-32 bg-gradient-to-r from-[#026B6D] to-[#05ABAD]" />

          <div className="px-6 pb-7 md:px-8">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 -mt-16">
              <div className="w-32 h-32 rounded-2xl border-4 border-white bg-[#E8F7F7] shadow-sm overflow-hidden flex items-center justify-center">
                {animal.fotoUrl ? (
                  <img
                    src={animal.fotoUrl}
                    alt={`Foto de ${animal.nome}`}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <FiHeart className="text-[#05ABAD] text-5xl" />
                )}
              </div>

              <button
                onClick={() => navigate(`/animais/editar/${animal.id}`)}
                className="inline-flex items-center justify-center gap-2 bg-[#05ABAD] hover:bg-[#026B6D] text-white px-5 py-3 rounded-xl font-semibold text-sm transition cursor-pointer"
              >
                <FiEdit2 />
                Editar animal
              </button>
            </div>

            <div className="mt-5">
              <h2 className="text-2xl md:text-3xl font-bold text-gray-800">
                {animal.nome}
              </h2>

              <p className="text-[#05ABAD] font-medium mt-1">
                {nomeEspecie(animal.especie)}
                {animal.raca ? ` • ${animal.raca}` : ""}
              </p>
            </div>

            <div className="mt-8">
              <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
                <FiInfo className="text-[#05ABAD]" />
                Informações do animal
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                <div className="bg-[#F5F8F8] rounded-xl p-4">
                  <p className="text-xs text-gray-400 mb-1">Espécie</p>
                  <p className="font-semibold text-gray-700">
                    {nomeEspecie(animal.especie)}
                  </p>
                </div>

                <div className="bg-[#F5F8F8] rounded-xl p-4">
                  <p className="text-xs text-gray-400 mb-1">Raça</p>
                  <p className="font-semibold text-gray-700">
                    {animal.raca || "Não informada"}
                  </p>
                </div>

                <div className="bg-[#F5F8F8] rounded-xl p-4">
                  <p className="text-xs text-gray-400 mb-1">Sexo</p>
                  <p className="font-semibold text-gray-700">
                    {nomeSexo(animal.sexo)}
                  </p>
                </div>

                <div className="bg-[#F5F8F8] rounded-xl p-4">
                  <p className="text-xs text-gray-400 mb-1">Porte</p>
                  <p className="font-semibold text-gray-700">
                    {nomePorte(animal.porte)}
                  </p>
                </div>

                <div className="bg-[#F5F8F8] rounded-xl p-4">
                  <p className="text-xs text-gray-400 mb-1">Cor</p>
                  <p className="font-semibold text-gray-700">
                    {animal.cor || "Não informada"}
                  </p>
                </div>

                <div className="bg-[#F5F8F8] rounded-xl p-4">
                  <p className="text-xs text-gray-400 mb-1">Idade aproximada</p>
                  <p className="font-semibold text-gray-700">
                    {formatarIdade(animal.idadeAproximadaMeses)}
                  </p>
                </div>

                <div className="bg-[#F5F8F8] rounded-xl p-4 sm:col-span-2 lg:col-span-3">
                  <p className="text-xs text-gray-400 mb-1 flex items-center gap-2">
                    <FiCalendar />
                    Data de nascimento
                  </p>
                  <p className="font-semibold text-gray-700">
                    {formatarData(animal.dataNascimento)}
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-8">
              <h3 className="font-bold text-gray-800 mb-3 flex items-center gap-2">
                <FiMapPin className="text-[#05ABAD]" />
                Observações
              </h3>

              <div className="bg-[#F5F8F8] rounded-xl p-5">
                <p className="text-sm text-gray-600 whitespace-pre-wrap">
                  {animal.observacoes || "Nenhuma observação cadastrada."}
                </p>
              </div>
            </div>
          </div>
        </section>

        <footer className="text-center text-xs text-gray-400 mt-10 pb-4">
          Núcleo de Zoonoses — Prefeitura de Cajazeiras
        </footer>
      </main>
    </div>
  );
}
