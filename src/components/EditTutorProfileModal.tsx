
import { useState, type FormEvent } from "react";
import type { UpdateTutorProfileData } from "../services/auth";

interface EditTutorProfileModalProps {
  dadosIniciais: UpdateTutorProfileData;
  onClose: () => void;
  onSave: (dados: UpdateTutorProfileData) => Promise<void>;
}

export default function EditTutorProfileModal({
  dadosIniciais,
  onClose,
  onSave,
}: EditTutorProfileModalProps) {
  const [dados, setDados] = useState<UpdateTutorProfileData>({
    ...dadosIniciais,
  });

  const [salvando, setSalvando] = useState(false);
  const [erro, setErro] = useState("");

  function atualizarCampo(
    campo: keyof UpdateTutorProfileData,
    valor: string,
  ) {
    setDados((anterior) => ({
      ...anterior,
      [campo]: valor,
    }));
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setErro("");

    const cepLimpo = dados.cep.replace(/\D/g, "");

    if (dados.nome.trim().length < 3) {
      setErro("Informe um nome com pelo menos 3 caracteres.");
      return;
    }

    if (cepLimpo.length !== 8) {
      setErro("O CEP deve conter exatamente 8 números.");
      return;
    }

    try {
      setSalvando(true);

      await onSave({
        ...dados,
        nome: dados.nome.trim(),
        telefone: dados.telefone.trim(),
        endereco: dados.endereco.trim(),
        numero: dados.numero.trim(),
        bairro: dados.bairro.trim(),
        cidade: dados.cidade.trim(),
        cep: cepLimpo,
      });
    } catch (error: any) {
      setErro(
        error?.response?.data?.message ||
          "Não foi possível atualizar seus dados. Tente novamente.",
      );
    } finally {
      setSalvando(false);
    }
  }

  const campos = [
    { label: "Nome completo", campo: "nome", tipo: "text" },
    { label: "Telefone", campo: "telefone", tipo: "tel" },
    { label: "Endereço", campo: "endereco", tipo: "text" },
    { label: "Número", campo: "numero", tipo: "text" },
    { label: "Bairro", campo: "bairro", tipo: "text" },
    { label: "Cidade", campo: "cidade", tipo: "text" },
    { label: "CEP", campo: "cep", tipo: "text" },
  ] as const;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4"
      onClick={onClose}
    >
      <div
        className="w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl bg-white p-6 shadow-xl"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-gray-800">
              Editar meus dados
            </h2>
            <p className="mt-1 text-sm text-gray-500">
              Atualize suas informações pessoais.
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            disabled={salvando}
            className="cursor-pointer rounded-full p-2 text-gray-500 transition hover:bg-gray-100 hover:text-gray-800 disabled:cursor-not-allowed"
            aria-label="Fechar"
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {campos.map(({ label, campo, tipo }) => (
              <div
                key={campo}
                className={campo === "nome" || campo === "endereco" ? "sm:col-span-2" : ""}
              >
                <label
                  htmlFor={campo}
                  className="mb-1.5 block text-sm font-medium text-gray-700"
                >
                  {label}
                </label>

                <input
                  id={campo}
                  type={tipo}
                  value={dados[campo]}
                  onChange={(event) =>
                    atualizarCampo(campo, event.target.value)
                  }
                  required
                  maxLength={campo === "nome" ? 120 : campo === "telefone" ? 30 : campo === "endereco" ? 180 : campo === "numero" ? 20 : campo === "bairro" || campo === "cidade" ? 100 : 8}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm text-gray-800 outline-none transition focus:border-[#05ABAD] focus:ring-2 focus:ring-[#05ABAD]/20"
                />
              </div>
            ))}
          </div>

          <div className="mt-5 rounded-lg bg-gray-50 p-4">
            <p className="text-sm font-medium text-gray-700">
              Dados não editáveis
            </p>
            <p className="mt-1 text-xs text-gray-500">
              CPF, data de nascimento e e-mail permanecem disponíveis apenas
              para consulta.
            </p>
          </div>

          {erro && (
            <div className="mt-4 rounded-lg bg-red-50 p-3 text-sm text-red-600">
              {erro}
            </div>
          )}

          <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
            <button
              type="button"
              onClick={onClose}
              disabled={salvando}
              className="cursor-pointer rounded-lg border border-gray-300 px-5 py-2.5 text-sm font-semibold text-gray-700 transition hover:bg-gray-50 disabled:cursor-not-allowed"
            >
              Cancelar
            </button>

            <button
              type="submit"
              disabled={salvando}
              className="cursor-pointer rounded-lg bg-[#05ABAD] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#026B6D] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {salvando ? "Salvando..." : "Salvar alterações"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
