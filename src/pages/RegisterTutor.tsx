
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { registerTutor } from "../services/auth";
import patinhas from "../assets/patterns/patinhas.png";

function RegisterTutor() {
    const navigate = useNavigate();

    const [form, setForm] = useState({
        nome: "",
        email: "",
        password: "",
        cpf: "",
        telefone: "",
        endereco: "",
        numero: "",
        bairro: "",
        cidade: "",
        cep: "",
        dataNascimento: "",
    });

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
        const { name, value } = e.target;

        setForm((prev) => ({
            ...prev,
            [name]: value,
        }));
    }

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setError("");

        try {
            setLoading(true);

            const response = await registerTutor(form);

            navigate("/verificar-email", {
                state: {
                    email: response.email,
                    codigoTeste: response.codigoTeste,
                },
            });
        } catch (err: any) {
            console.error("Erro ao cadastrar tutor:", err);

            const message = err.response?.data?.message;

            setError(
                Array.isArray(message)
                    ? message.join("\n")
                    : message || "Não foi possível realizar o cadastro. Verifique os dados e tente novamente."
            );
        } finally {
            setLoading(false);
        }
    }

    const inputClass = `
        w-full h-12 rounded-xl bg-white px-4
        text-gray-700 placeholder:text-gray-400
        outline-none border-2 border-transparent
        focus:border-[#026B6D] transition
    `;

    return (
        <main className="min-h-screen relative overflow-hidden bg-[#026B6D] py-10 px-4">

            <div
                className="absolute inset-0 opacity-10"
                style={{
                    backgroundImage: `url(${patinhas})`,
                    backgroundRepeat: "repeat",
                    backgroundSize: "450px",
                }}
            />

            <div className="relative z-10 max-w-3xl mx-auto">

                <form
                    onSubmit={handleSubmit}
                    className="bg-[#05ABAD] rounded-[30px] shadow-2xl p-6 sm:p-10"
                >
                    <div className="text-center mb-8">
                        <h1 className="text-3xl font-bold text-white">
                            Cadastro de Tutor
                        </h1>

                        <p className="text-white/80 text-sm mt-2">
                            Preencha seus dados para criar sua conta.
                        </p>
                    </div>

                    {error && (
                        <div className="bg-red-100 text-red-700 rounded-xl p-3 mb-6 text-sm whitespace-pre-line">
                            {error}
                        </div>
                    )}

                    <h2 className="text-white font-bold text-lg mb-4">
                        Dados pessoais
                    </h2>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

                        <input
                            name="nome"
                            placeholder="Nome completo"
                            value={form.nome}
                            onChange={handleChange}
                            className={`${inputClass} sm:col-span-2`}
                            required
                        />

                        <input
                            name="cpf"
                            placeholder="CPF (somente números)"
                            value={form.cpf}
                            onChange={handleChange}
                            maxLength={11}
                            className={inputClass}
                            required
                        />

                        <input
                            name="telefone"
                            placeholder="Telefone"
                            value={form.telefone}
                            onChange={handleChange}
                            className={inputClass}
                            required
                        />

                        <input
                            type="date"
                            name="dataNascimento"
                            value={form.dataNascimento}
                            onChange={handleChange}
                            className={inputClass}
                            required
                        />

                        <input
                            type="email"
                            name="email"
                            placeholder="E-mail"
                            value={form.email}
                            onChange={handleChange}
                            className={inputClass}
                            required
                        />

                        <input
                            type="password"
                            name="password"
                            placeholder="Crie uma senha"
                            value={form.password}
                            onChange={handleChange}
                            className={`${inputClass} sm:col-span-2`}
                            required
                        />

                    </div>

                    <h2 className="text-white font-bold text-lg mt-8 mb-4">
                        Endereço
                    </h2>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

                        <input
                            name="endereco"
                            placeholder="Rua / Avenida"
                            value={form.endereco}
                            onChange={handleChange}
                            className="sm:col-span-2 w-full h-12 rounded-xl bg-white px-4 text-gray-700 outline-none border-2 border-transparent focus:border-[#026B6D]"
                            required
                        />

                        <input
                            name="numero"
                            placeholder="Número"
                            value={form.numero}
                            onChange={handleChange}
                            className={inputClass}
                            required
                        />

                        <input
                            name="bairro"
                            placeholder="Bairro"
                            value={form.bairro}
                            onChange={handleChange}
                            className={inputClass}
                            required
                        />

                        <input
                            name="cidade"
                            placeholder="Cidade"
                            value={form.cidade}
                            onChange={handleChange}
                            className={inputClass}
                            required
                        />

                        <input
                            name="cep"
                            placeholder="CEP (somente números)"
                            value={form.cep}
                            onChange={handleChange}
                            maxLength={8}
                            className={inputClass}
                            required
                        />

                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="
                            w-full h-12 mt-8 rounded-full
                            bg-white text-[#026B6D] font-bold
                            hover:-translate-y-1 hover:shadow-xl
                            transition-all duration-300
                            disabled:opacity-60 disabled:cursor-not-allowed
                        "
                    >
                        {loading ? "Cadastrando..." : "Criar minha conta"}
                    </button>

                    <p className="text-center text-white text-sm mt-6">
                        Já possui uma conta?{" "}
                        <Link
                            to="/login"
                            className="font-bold hover:underline"
                        >
                            Entrar
                        </Link>
                    </p>

                </form>
            </div>
        </main>
    );
}

export default RegisterTutor;
