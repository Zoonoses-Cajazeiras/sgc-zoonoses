import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FiEye, FiEyeOff } from "react-icons/fi";

import { login } from "../services/auth";
import patinhas from "../assets/patterns/patinhas.png";

function Login() {
    const navigate = useNavigate();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);

    async function handleLogin(e: React.FormEvent) {
        e.preventDefault();

        try {
            setLoading(true);

            await login(email, password);

            navigate("/admin");
        } catch (err) {
            console.error("Erro ao realizar login:", err);
            alert("E-mail ou senha inválidos");
        } finally {
            setLoading(false);
        }
    }

    return (
        <main className="min-h-screen relative overflow-hidden flex items-center justify-center bg-[#026B6D]">

            {/* Fundo de patinhas */}
            <div
                className="absolute inset-0 opacity-10"
                style={{
                    backgroundImage: `url(${patinhas})`,
                    backgroundRepeat: "repeat",
                    backgroundSize: "450px",
                }}
            />

            <div className="relative z-10">

                <form
                    onSubmit={handleLogin}
                    className="w-96 rounded-[30px] bg-[#05ABAD] shadow-2xl px-8 py-10 flex flex-col items-center"
                    noValidate
                >
                    <h1 className="text-3xl font-bold text-white">
                        Bem-vindo!
                    </h1>

                    <p className="text-white/80 text-sm mt-2 mb-8 text-center">
                        Área restrita aos servidores autorizados.
                    </p>

                    {/* Email */}
                    <div
                        className="
                            w-full
                            h-12
                            bg-white
                            rounded-full
                            border-2
                            border-transparent
                            flex
                            items-center
                            transition-all
                            duration-300
                            focus-within:border-white
                            focus-within:shadow-lg
                        "
                    >
                        <input
                            type="email"
                            placeholder="E-mail"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="
                                w-full
                                bg-transparent
                                px-5
                                text-gray-700
                                placeholder:text-gray-500
                                outline-none
                            "
                        />
                    </div>

                    {/* Senha */}
                    <div
                        className="
                            w-full
                            h-12
                            mt-5
                            bg-white
                            rounded-full
                            border-2
                            border-transparent
                            flex
                            items-center
                            transition-all
                            duration-300
                            focus-within:border-white
                            focus-within:shadow-lg
                        "
                    >
                        <input
                            type={showPassword ? "text" : "password"}
                            placeholder="Senha"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="
                                flex-1
                                bg-transparent
                                pl-5
                                text-gray-700
                                placeholder:text-gray-500
                                outline-none
                            "
                        />

                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="
                                pr-5
                                text-gray-500
                                hover:text-[#026B6D]
                                transition-colors
                                duration-300
                            "
                        >
                            {showPassword ? (
                                <FiEyeOff size={20} />
                            ) : (
                                <FiEye size={20} />
                            )}
                        </button>
                    </div>

                    {/* Entrar */}
                    <button
                        type="submit"
                        disabled={loading}
                        className="
                            mt-8
                            w-36
                            h-11
                            rounded-full
                            bg-white
                            text-[#026B6D]
                            font-bold
                            cursor-pointer
                            transition-all
                            duration-300
                            hover:-translate-y-1
                            hover:scale-105
                            hover:shadow-xl
                            disabled:opacity-60
                            disabled:cursor-not-allowed
                            disabled:hover:translate-y-0
                            disabled:hover:scale-100
                        "
                    >
                        {loading ? "Entrando..." : "Entrar"}
                    </button>

                    {/* Voltar */}
                    <Link
                        to="/"
                        className="
                            mt-6
                            text-sm
                            text-white
                            hover:underline
                            transition
                        "
                    >
                        ← Voltar para o início
                    </Link>
                </form>

            </div>
        </main>
    );
}

export default Login;