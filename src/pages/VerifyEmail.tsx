
import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";

import {
    verificarEmail,
    reenviarCodigoVerificacao,
    alterarEmailVerificacao,
} from "../services/auth";

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

    const [cpf, setCpf] = useState("");
    const [novoEmail, setNovoEmail] = useState("");

    const [mostrarCorrecao, setMostrarCorrecao] = useState(false);

    const [loading, setLoading] = useState(false);
    const [loadingReenvio, setLoadingReenvio] = useState(false);
    const [loadingCorrecao, setLoadingCorrecao] = useState(false);

    const [message, setMessage] = useState("");
    const [error, setError] = useState("");

    function obterMensagemErro(err: any, mensagemPadrao: string) {
        const backendMessage = err.response?.data?.message;

        return Array.isArray(backendMessage)
            ? backendMessage.join("\n")
            : backendMessage || mensagemPadrao;
    }

    async function handleVerify(e: React.FormEvent) {
        e.preventDefault();

        setError("");
        setMessage("");

        try {
            setLoading(true);

            const response = await verificarEmail(email, codigo);

            setMessage(
                response.message || "E-mail confirmado com sucesso!"
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

            setError(
                obterMensagemErro(
                    err,
                    "Não foi possível confirmar o e-mail."
                )
            );
        } finally {
            setLoading(false);
        }
    }

    async function handleResend() {
        setError("");
        setMessage("");

        try {
            setLoadingReenvio(true);

            const response = await reenviarCodigoVerificacao(email);

            setMessage(
                response.message || "Um novo código foi enviado para seu e-mail."
            );

            setCodigo("");

        } catch (err: any) {
            console.error("Erro ao reenviar código:", err);

            setError(
                obterMensagemErro(
                    err,
                    "Não foi possível reenviar o código."
                )
            );
        } finally {
            setLoadingReenvio(false);
        }
    }

    async function handleChangeEmail() {
        setError("");
        setMessage("");

        if (!cpf.trim() || !novoEmail.trim()) {
            setError("Informe seu CPF e o novo e-mail.");
            return;
        }

        if (novoEmail.trim().toLowerCase() === email.trim().toLowerCase()) {
            setError("O novo e-mail deve ser diferente do e-mail atual.");
            return;
        }

        if (cpf.replace(/\D/g, "").length !== 11) {
            setError("Informe um CPF válido com 11 números.");
            return;
        }

        try {
            setLoadingCorrecao(true);

            const response = await alterarEmailVerificacao(
                email,
                cpf,
                novoEmail,
            );

            const emailAtualizado =
                response.email || novoEmail.trim().toLowerCase();

            setEmail(emailAtualizado);
            setCodigo("");
            setCpf("");
            setNovoEmail("");
            setMostrarCorrecao(false);

            setMessage(
                response.message ||
                `O código de verificação foi enviado para ${emailAtualizado}.`
            );

        } catch (err: any) {
            console.error("Erro ao corrigir e-mail:", err);

            setError(
                obterMensagemErro(
                    err,
                    "Não foi possível alterar o e-mail."
                )
            );
        } finally {
            setLoadingCorrecao(false);
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
                        <div className="w-full bg-red-100 text-red-700 rounded-xl p-3 mb-4 text-sm text-center whitespace-pre-line">
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
                        onChange={(e) =>
                            setCodigo(e.target.value.replace(/\D/g, "").slice(0, 6))
                        }
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
                            bg-white text-[#026B6D] font-bold cursor-pointer
                            hover:-translate-y-1 hover:shadow-xl
                            transition-all duration-300
                            disabled:opacity-60 disabled:cursor-not-allowed
                        "
                    >
                        {loading ? "Verificando..." : "Confirmar e-mail"}
                    </button>

                    <button
                        type="button"
                        onClick={handleResend}
                        disabled={loadingReenvio || loading}
                        className="mt-5 text-sm text-white font-semibold hover:underline disabled:opacity-60 disabled:cursor-not-allowed"
                    >
                        {loadingReenvio ? "Enviando código..." : "Não recebeu o código? Reenviar"}
                    </button>

                    <button
                        type="button"
                        onClick={() => {
                            setMostrarCorrecao(!mostrarCorrecao);
                            setError("");
                            setMessage("");
                        }}
                        className="mt-3 text-sm text-white hover:underline"
                    >
                        {mostrarCorrecao
                            ? "Cancelar correção de e-mail"
                            : "Digitou o e-mail errado? Corrigir"}
                    </button>

                    {mostrarCorrecao && (
                        <div className="w-full mt-5 pt-5 border-t border-white/30 flex flex-col">

                            <h2 className="text-lg font-bold text-white text-center">
                                Corrigir endereço de e-mail
                            </h2>

                            <p className="text-white/85 text-xs mt-2 mb-4 text-center">
                                Informe seu CPF e o endereço correto. Enviaremos um novo código para ele.
                            </p>

                            <input
                                type="text"
                                inputMode="numeric"
                                placeholder="CPF cadastrado"
                                value={cpf}
                                onChange={(e) =>
                                    setCpf(e.target.value.replace(/\D/g, "").slice(0, 11))
                                }
                                maxLength={11}
                                className="w-full h-12 rounded-full bg-white px-5 text-gray-700 outline-none focus:ring-2 focus:ring-[#026B6D]"
                            />

                            <input
                                type="email"
                                placeholder="Novo endereço de e-mail"
                                value={novoEmail}
                                onChange={(e) => setNovoEmail(e.target.value)}
                                className="w-full h-12 mt-4 rounded-full bg-white px-5 text-gray-700 outline-none focus:ring-2 focus:ring-[#026B6D]"
                            />

                            <button
                                type="button"
                                onClick={handleChangeEmail}
                                disabled={loadingCorrecao}
                                className="
                                    mt-5 w-full h-12 rounded-full
                                    bg-[#026B6D] text-white font-bold cursor-pointer
                                    hover:-translate-y-1 hover:shadow-xl
                                    transition-all duration-300
                                    disabled:opacity-60 disabled:cursor-not-allowed
                                "
                            >
                                {loadingCorrecao
                                    ? "Atualizando..."
                                    : "Atualizar e-mail"}
                            </button>
                        </div>
                    )}

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
