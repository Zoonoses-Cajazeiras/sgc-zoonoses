import { useState } from "react";
import { Link } from "react-router-dom";

import {
    solicitarRecuperacaoSenha,
    redefinirSenha,
} from "../services/auth";

import patinhas from "../assets/patterns/patinhas.png";

function ForgotPassword() {
    const [etapa, setEtapa] = useState<1 | 2>(1);

    const [email, setEmail] = useState("");
    const [cpf, setCpf] = useState("");
    const [codigo, setCodigo] = useState("");
    const [novaSenha, setNovaSenha] = useState("");
    const [confirmarSenha, setConfirmarSenha] = useState("");

    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");

    function obterMensagemErro(err: any, mensagemPadrao: string) {
        const backendMessage = err.response?.data?.message;

        return Array.isArray(backendMessage)
            ? backendMessage.join("\n")
            : backendMessage || mensagemPadrao;
    }

    async function handleSolicitarCodigo(e: React.FormEvent) {
        e.preventDefault();

        setError("");
        setMessage("");

        try {
            setLoading(true);

            const response = await solicitarRecuperacaoSenha(email);

            setMessage(
                response.message ||
                "Se o endereço estiver cadastrado, você receberá um código de recuperação."
            );

            setEtapa(2);

        } catch (err: any) {
            console.error("Erro ao solicitar recuperação:", err);

            setError(
                obterMensagemErro(
                    err,
                    "Não foi possível solicitar a recuperação de senha."
                )
            );
        } finally {
            setLoading(false);
        }
    }

    async function handleRedefinirSenha(e: React.FormEvent) {
        e.preventDefault();

        setError("");
        setMessage("");

        if (cpf.replace(/\D/g, "").length !== 11) {
            setError("Informe um CPF válido com 11 números.");
            return;
        }

        if (novaSenha.length < 8) {
            setError("A nova senha deve possuir pelo menos 8 caracteres.");
            return;
        }

        if (novaSenha !== confirmarSenha) {
            setError("As senhas informadas não coincidem.");
            return;
        }

        try {
            setLoading(true);

            const response = await redefinirSenha(
                email,
                cpf,
                codigo,
                novaSenha,
            );

            setMessage(
                response.message || "Senha redefinida com sucesso!"
            );

            setTimeout(() => {
                window.location.href = "/login";
            }, 1800);

        } catch (err: any) {
            console.error("Erro ao redefinir senha:", err);

            setError(
                obterMensagemErro(
                    err,
                    "Não foi possível redefinir sua senha."
                )
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
                    onSubmit={
                        etapa === 1
                            ? handleSolicitarCodigo
                            : handleRedefinirSenha
                    }
                    className="rounded-[30px] bg-[#05ABAD] shadow-2xl px-8 py-10 flex flex-col items-center"
                >
                    <div className="text-4xl mb-4">
                        {etapa === 1 ? "🔑" : "🔒"}
                    </div>

                    <h1 className="text-2xl font-bold text-white text-center">
                        {etapa === 1
                            ? "Esqueceu sua senha?"
                            : "Redefinir senha"}
                    </h1>

                    <p className="text-white/85 text-sm mt-3 mb-7 text-center">
                        {etapa === 1
                            ? "Informe o e-mail associado à sua conta. Enviaremos um código para você recuperar seu acesso."
                            : `Enviamos um código de recuperação para ${email}. Informe o código, seu CPF e escolha uma nova senha.`}
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

                    {etapa === 1 ? (
                        <input
                            type="email"
                            placeholder="Seu e-mail"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full h-12 rounded-full bg-white px-5 text-gray-700 outline-none focus:ring-2 focus:ring-[#026B6D]"
                            required
                        />
                    ) : (
                        <>
                            <input
                                type="text"
                                inputMode="numeric"
                                placeholder="Código de 6 dígitos"
                                value={codigo}
                                onChange={(e) =>
                                    setCodigo(
                                        e.target.value.replace(/\D/g, "").slice(0, 6)
                                    )
                                }
                                maxLength={6}
                                className="w-full h-12 rounded-full bg-white px-5 text-gray-700 text-center tracking-[0.4em] text-lg outline-none focus:ring-2 focus:ring-[#026B6D]"
                                required
                            />

                            <input
                                type="text"
                                inputMode="numeric"
                                placeholder="CPF cadastrado"
                                value={cpf}
                                onChange={(e) =>
                                    setCpf(
                                        e.target.value.replace(/\D/g, "").slice(0, 11)
                                    )
                                }
                                maxLength={11}
                                className="w-full h-12 mt-4 rounded-full bg-white px-5 text-gray-700 outline-none focus:ring-2 focus:ring-[#026B6D]"
                                required
                            />

                            <input
                                type="password"
                                placeholder="Nova senha"
                                value={novaSenha}
                                onChange={(e) => setNovaSenha(e.target.value)}
                                maxLength={128}
                                className="w-full h-12 mt-4 rounded-full bg-white px-5 text-gray-700 outline-none focus:ring-2 focus:ring-[#026B6D]"
                                required
                            />

                            <input
                                type="password"
                                placeholder="Confirme a nova senha"
                                value={confirmarSenha}
                                onChange={(e) => setConfirmarSenha(e.target.value)}
                                maxLength={128}
                                className="w-full h-12 mt-4 rounded-full bg-white px-5 text-gray-700 outline-none focus:ring-2 focus:ring-[#026B6D]"
                                required
                            />

                            <p className="text-white/80 text-xs mt-3 text-center">
                                A senha deve possuir pelo menos 8 caracteres.
                            </p>
                        </>
                    )}

                    <button
                        type="submit"
                        disabled={
                            loading ||
                            (etapa === 2 && (
                                codigo.length !== 6 ||
                                cpf.length !== 11
                            ))
                        }
                        className="
                            mt-7 w-full h-12 rounded-full
                            bg-white text-[#026B6D] font-bold cursor-pointer
                            hover:-translate-y-1 hover:shadow-xl
                            transition-all duration-300
                            disabled:opacity-60 disabled:cursor-not-allowed
                        "
                    >
                        {loading
                            ? "Aguarde..."
                            : etapa === 1
                                ? "Enviar código"
                                : "Redefinir senha"}
                    </button>

                    {etapa === 2 && (
                        <button
                            type="button"
                            onClick={() => {
                                setEtapa(1);
                                setCpf("");
                                setCodigo("");
                                setNovaSenha("");
                                setConfirmarSenha("");
                                setError("");
                                setMessage("");
                            }}
                            className="mt-5 text-sm text-white hover:underline"
                        >
                            Voltar e alterar e-mail
                        </button>
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

export default ForgotPassword;
