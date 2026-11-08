
import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { api } from "../services/api";
import patinhas from "../assets/patterns/patinhas.png";

interface LocationState {
    email?: string;
    codigoTeste?: string;
}

function VerifyEmail() {
    const location = useLocation();
    const navigate = useNavigate();

    const state = location.state as LocationState | null;

    const [email, setEmail] = useState(state?.email || "");
    const [codigo, setCodigo] = useState("");
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");

    async function handleVerify(e: React.FormEvent) {
        e.preventDefault();

        setError("");
        setMessage("");

        try {
            setLoading(true);

            const { data } = await api.post("/auth/verify-email", {
                email: email.trim().toLowerCase(),
                codigo: codigo.trim(),
            });

            setMessage(
                data.message || "E-mail confirmado com sucesso!"
            );

            setTimeout(() => {
                navigate("/login", {
                    state: {
                        email: email.trim().toLowerCase(),
                        verified: true,
                    },
                });
            }, 1800);

        } catch (err: any) {
            console.error("Erro ao verificar e-mail:", err);

            const backendMessage = err.response?.data?.message;

            setError(
                Array.isArray(backendMessage)
                    ? backendMessage.join("\n")
                    : backendMessage || "Não foi possível confirmar o e-mail."
            );
        } finally {
            setLoading(false);
        }
    }

    return (
        <main className="min-h-screen relative overflow-hidden flex items-center justify-center bg-[#026B6D] px-4 py-10">

            <div
                className="absolute inset-0 opacity-10"
                style={{
                    backgroundImage: `url(${patinhas})`,
                    backgroundRepeat: "repeat",
                    backgroundSize: "450px",
                }}
            />

            <div className="relative z-10 w-full max-w-md">

                <form
                    onSubmit={handleVerify}
                    className="rounded-[30px] bg-[#05ABAD] shadow-2xl px-8 py-10 flex flex-col items-center"
                >
                    <div className="text-4xl mb-4">
                        ✉
                    </div>

                    <h1 className="text-2xl font-bold text-white text-center">
                        Confirme seu e-mail
                    </h1>

                    <p className="text-white/85 text-sm mt-3 mb-7 text-center">
                        Enviamos um código de verificação para o endereço informado no cadastro.
                        Digite-o abaixo para ativar sua conta.
                    </p>

                    {error && (
                        <div className="w-full bg-red-100 text-red-700 rounded-xl p-3 mb-4 text-sm text-center">
                            {error}
                        </div>
                    )}

                    {message && (
                        <div className="w-full bg-green-100 text-green-800 rounded-xl p-3 mb-4 text-sm text-center">
                            {message}
                        </div>
                    )}

                    <input
                        type="email"
                        placeholder="Seu e-mail"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full h-12 rounded-full bg-white px-5 text-gray-700 outline-none focus:ring-2 focus:ring-[#026B6D]"
                        required
                    />

                    <input
                        type="text"
                        inputMode="numeric"
                        placeholder="Código de 6 dígitos"
                        value={codigo}
                        onChange={(e) => setCodigo(e.target.value.replace(/\D/g, "").slice(0, 6))}
                        maxLength={6}
                        className="w-full h-12 mt-4 rounded-full bg-white px-5 text-gray-700 text-center tracking-[0.4em] text-lg outline-none focus:ring-2 focus:ring-[#026B6D]"
                        required
                    />

                    {import.meta.env.DEV && state?.codigoTeste && (
                        <p className="text-white text-sm mt-4 text-center">
                            Código para teste:{" "}
                            <strong>{state.codigoTeste}</strong>
                        </p>
                    )}

                    <button
                        type="submit"
                        disabled={loading || codigo.length !== 6}
                        className="
                            mt-7 w-full h-12 rounded-full
                            bg-white text-[#026B6D] font-bold
                            hover:-translate-y-1 hover:shadow-xl
                            transition-all duration-300
                            disabled:opacity-60 disabled:cursor-not-allowed
                        "
                    >
                        {loading ? "Verificando..." : "Confirmar e-mail"}
                    </button>

                    <Link
                        to="/login"
                        className="mt-6 text-sm text-white hover:underline"
                    >
                        Voltar para o login
                    </Link>
                </form>
            </div>
        </main>
    );
}

export default VerifyEmail;
