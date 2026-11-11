
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  FiArrowLeft,
  FiHeart,
  FiLoader,
  FiSave,
  FiAlertCircle,
} from "react-icons/fi";
import { api } from "../services/api";
import { listarMeusAnimais } from "../services/animals";

type TipoIdade = "aproximada" | "nascimento";

export default function RegisterAnimal() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();

  const modoEdicao = Boolean(id);

  const [nome, setNome] = useState("");
  const [especie, setEspecie] = useState("CAO");
  const [sexo, setSexo] = useState("NAO_INFORMADO");
  const [raca, setRaca] = useState("");
  const [cor, setCor] = useState("");
  const [porte, setPorte] = useState("NAO_INFORMADO");
  const [tipoIdade, setTipoIdade] = useState<TipoIdade>("aproximada");
  const [dataNascimento, setDataNascimento] = useState("");
  const [idadeAproximada, setIdadeAproximada] = useState("");
  const [observacoes, setObservacoes] = useState("");

  const [carregando, setCarregando] = useState(false);
  const [carregandoDados, setCarregandoDados] = useState(modoEdicao);
  const [erro, setErro] = useState("");

  useEffect(() => {
    if (!id) return;

    async function carregarAnimal() {
      try {
        setCarregandoDados(true);
        setErro("");

        const animais = await listarMeusAnimais();
        const animal = animais.find((item) => item.id === id);

        if (!animal) {
          setErro("Animal não encontrado ou não pertence ao seu cadastro.");
          return;
        }

        setNome(animal.nome);
        setEspecie(animal.especie);
        setSexo(animal.sexo);
        setRaca(animal.raca || "");
        setCor(animal.cor || "");
        setPorte(animal.porte);
        setObservacoes(animal.observacoes || "");

        if (animal.dataNascimento) {
          setTipoIdade("nascimento");
          setDataNascimento(animal.dataNascimento.split("T")[0]);
          setIdadeAproximada("");
        } else {
          setTipoIdade("aproximada");
          setIdadeAproximada(
            animal.idadeAproximadaMeses !== null
              ? String(animal.idadeAproximadaMeses)
              : ""
          );
          setDataNascimento("");
        }
      } catch (error: any) {
        console.error("Erro ao carregar animal:", error);

        if (error.response?.status === 401) {
          setErro("Sua sessão expirou. Entre novamente.");
        } else {
          setErro("Não foi possível carregar os dados do animal.");
        }
      } finally {
        setCarregandoDados(false);
      }
    }

    carregarAnimal();
  }, [id]);

  async function salvarAnimal(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setErro("");

    if (!nome.trim()) {
      setErro("Informe o nome do animal.");
      return;
    }

    if (
      tipoIdade === "aproximada" &&
      idadeAproximada !== "" &&
      (!Number.isInteger(Number(idadeAproximada)) ||
        Number(idadeAproximada) < 0)
    ) {
      setErro("Informe uma idade válida em meses.");
      return;
    }

    if (tipoIdade === "nascimento" && !dataNascimento) {
      setErro("Informe a data de nascimento do animal.");
      return;
    }

    const dados = {
      nome: nome.trim(),
      especie,
      sexo,
      raca: raca.trim() || null,
      cor: cor.trim() || null,
      porte,
      observacoes: observacoes.trim() || null,

      // Ao editar, limpamos o campo que não está sendo utilizado.
      ...(modoEdicao
        ? {
            dataNascimento:
              tipoIdade === "nascimento" ? dataNascimento : null,
            idadeAproximadaMeses:
              tipoIdade === "aproximada" && idadeAproximada !== ""
                ? Number(idadeAproximada)
                : null,
          }
        : {
            dataNascimento:
              tipoIdade === "nascimento" ? dataNascimento : undefined,
            idadeAproximadaMeses:
              tipoIdade === "aproximada" && idadeAproximada !== ""
                ? Number(idadeAproximada)
                : undefined,
          }),
    };

    try {
      setCarregando(true);

      if (modoEdicao && id) {
        await api.patch(`/animals/${id}`, dados);
      } else {
        await api.post("/animals", dados);
      }

      navigate("/perfil", {
        state: {
          mensagem: modoEdicao
            ? "Animal atualizado com sucesso!"
            : "Animal cadastrado com sucesso!",
        },
      });
    } catch (error: any) {
      console.error("Erro ao salvar animal:", error);

      const mensagem = error.response?.data?.message;

      setErro(
        Array.isArray(mensagem)
          ? mensagem.join(" ")
          : mensagem || "Não foi possível salvar os dados. Tente novamente."
      );
    } finally {
      setCarregando(false);
    }
  }

  const estiloCampo =
    "w-full border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-700 outline-none focus:border-[#05ABAD] focus:ring-2 focus:ring-[#05ABAD]/10 transition bg-white";

  const estiloLabel = "block text-sm font-semibold text-gray-700 mb-2";

  if (carregandoDados) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#F5F8F8] text-[#026B6D]">
        <FiLoader className="animate-spin text-4xl mb-3" />
        <p className="font-medium">Carregando dados do animal...</p>
      </div>
    );
  }

  if (modoEdicao && erro && !nome) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F5F8F8] px-5">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 max-w-md w-full text-center">
          <FiAlertCircle className="text-red-500 text-4xl mx-auto mb-4" />
          <h2 className="text-xl font-bold text-gray-800 mb-2">
            Não foi possível carregar o animal
          </h2>
          <p className="text-sm text-gray-500 mb-6">{erro}</p>
          <button
            onClick={() => navigate("/perfil")}
            className="bg-[#05ABAD] hover:bg-[#026B6D] text-white px-6 py-3 rounded-xl font-semibold transition"
          >
            Voltar ao perfil
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
            type="button"
            onClick={() => navigate("/perfil")}
            className="flex items-center gap-2 text-gray-500 hover:text-[#05ABAD] transition text-sm font-medium"
          >
            <FiArrowLeft />
            Voltar ao perfil
          </button>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-5 py-8 md:py-10">
        <div className="mb-8">
          <p className="text-sm text-gray-500 mb-1">Área do cidadão</p>
          <h2 className="text-2xl md:text-3xl font-bold text-gray-800">
            {modoEdicao ? "Editar animal" : "Cadastrar animal"}
          </h2>
          <p className="text-gray-500 mt-2">
            {modoEdicao
              ? "Atualize as informações do animal cadastrado."
              : "Preencha as informações para adicionar um animal ao seu cadastro."}
          </p>
        </div>

        <form onSubmit={salvarAnimal} className="space-y-6">
          <section className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-11 h-11 rounded-xl bg-[#E8F7F7] flex items-center justify-center">
                <FiHeart className="text-[#05ABAD] text-xl" />
              </div>
              <div>
                <h3 className="font-bold text-gray-800">
                  Informações do animal
                </h3>
                <p className="text-xs text-gray-500">
                  Dados básicos de identificação
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="md:col-span-2">
                <label className={estiloLabel}>Nome do animal *</label>
                <input
                  required
                  maxLength={100}
                  value={nome}
                  onChange={(e) => setNome(e.target.value)}
                  placeholder="Ex.: Rex, Mel, Thor..."
                  className={estiloCampo}
                />
              </div>

              <div>
                <label className={estiloLabel}>Espécie *</label>
                <select
                  value={especie}
                  onChange={(e) => setEspecie(e.target.value)}
                  className={estiloCampo}
                >
                  <option value="CAO">Cachorro</option>
                  <option value="GATO">Gato</option>
                  <option value="OUTRA">Outro</option>
                </select>
              </div>

              <div>
                <label className={estiloLabel}>Sexo</label>
                <select
                  value={sexo}
                  onChange={(e) => setSexo(e.target.value)}
                  className={estiloCampo}
                >
                  <option value="NAO_INFORMADO">Não informado</option>
                  <option value="MACHO">Macho</option>
                  <option value="FEMEA">Fêmea</option>
                </select>
              </div>

              <div>
                <label className={estiloLabel}>Raça</label>
                <input
                  maxLength={100}
                  value={raca}
                  onChange={(e) => setRaca(e.target.value)}
                  placeholder="Ex.: Vira-lata, Labrador..."
                  className={estiloCampo}
                />
              </div>

              <div>
                <label className={estiloLabel}>Cor</label>
                <input
                  maxLength={80}
                  value={cor}
                  onChange={(e) => setCor(e.target.value)}
                  placeholder="Ex.: Caramelo, preto e branco..."
                  className={estiloCampo}
                />
              </div>

              <div>
                <label className={estiloLabel}>Porte</label>
                <select
                  value={porte}
                  onChange={(e) => setPorte(e.target.value)}
                  className={estiloCampo}
                >
                  <option value="NAO_INFORMADO">Não informado</option>
                  <option value="PEQUENO">Pequeno</option>
                  <option value="MEDIO">Médio</option>
                  <option value="GRANDE">Grande</option>
                </select>
              </div>
            </div>
          </section>

          <section className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-8">
            <h3 className="font-bold text-gray-800 mb-2">
              Idade do animal
            </h3>
            <p className="text-sm text-gray-500 mb-6">
              Informe a data de nascimento ou a idade aproximada.
            </p>

            <div className="flex flex-wrap gap-3 mb-6">
              <button
                type="button"
                onClick={() => setTipoIdade("aproximada")}
                className={`px-4 py-2 rounded-xl text-sm font-semibold border transition ${
                  tipoIdade === "aproximada"
                    ? "bg-[#E8F7F7] border-[#05ABAD] text-[#026B6D]"
                    : "border-gray-200 text-gray-500 hover:border-[#05ABAD]"
                }`}
              >
                Idade aproximada
              </button>

              <button
                type="button"
                onClick={() => setTipoIdade("nascimento")}
                className={`px-4 py-2 rounded-xl text-sm font-semibold border transition ${
                  tipoIdade === "nascimento"
                    ? "bg-[#E8F7F7] border-[#05ABAD] text-[#026B6D]"
                    : "border-gray-200 text-gray-500 hover:border-[#05ABAD]"
                }`}
              >
                Data de nascimento
              </button>
            </div>

            {tipoIdade === "aproximada" ? (
              <div className="max-w-sm">
                <label className={estiloLabel}>
                  Idade aproximada (em meses)
                </label>
                <input
                  type="number"
                  min="0"
                  step="1"
                  value={idadeAproximada}
                  onChange={(e) => setIdadeAproximada(e.target.value)}
                  placeholder="Ex.: 24"
                  className={estiloCampo}
                />
                <p className="text-xs text-gray-400 mt-2">
                  Exemplo: 24 meses correspondem a aproximadamente 2 anos.
                </p>
              </div>
            ) : (
              <div className="max-w-sm">
                <label className={estiloLabel}>Data de nascimento</label>
                <input
                  type="date"
                  max={new Date().toISOString().split("T")[0]}
                  value={dataNascimento}
                  onChange={(e) => setDataNascimento(e.target.value)}
                  className={estiloCampo}
                />
              </div>
            )}
          </section>

          <section className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-8">
            <h3 className="font-bold text-gray-800 mb-2">
              Informações adicionais
            </h3>
            <p className="text-sm text-gray-500 mb-5">
              Acrescente outras informações importantes, se desejar.
            </p>

            <label className={estiloLabel}>Observações</label>
            <textarea
              rows={4}
              value={observacoes}
              onChange={(e) => setObservacoes(e.target.value)}
              placeholder="Descreva características ou informações relevantes sobre o animal..."
              className={estiloCampo}
            />
          </section>

          {erro && (
            <div className="bg-red-50 border border-red-100 rounded-xl p-4 flex items-start gap-3">
              <FiAlertCircle className="text-red-500 text-xl shrink-0 mt-0.5" />
              <p className="text-sm text-red-600">{erro}</p>
            </div>
          )}

          <div className="flex flex-col-reverse sm:flex-row justify-end gap-3">
            <button
              type="button"
              onClick={() => navigate("/perfil")}
              className="px-6 py-3 rounded-xl border border-gray-200 text-gray-600 font-semibold text-sm hover:bg-gray-50 transition"
            >
              Cancelar
            </button>

            <button
              type="submit"
              disabled={carregando}
              className="flex items-center justify-center gap-2 px-7 py-3 rounded-xl bg-[#05ABAD] hover:bg-[#026B6D] disabled:opacity-60 text-white font-semibold text-sm transition"
            >
              {carregando ? (
                <>
                  <FiLoader className="animate-spin" />
                  {modoEdicao ? "Salvando..." : "Cadastrando..."}
                </>
              ) : (
                <>
                  <FiSave />
                  {modoEdicao ? "Salvar alterações" : "Cadastrar animal"}
                </>
              )}
            </button>
          </div>
        </form>

        <footer className="text-center text-xs text-gray-400 mt-10 pb-4">
          Núcleo de Zoonoses — Prefeitura de Cajazeiras
        </footer>
      </main>
    </div>
  );
}
