import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FiEye, FiEyeOff } from "react-icons/fi";


import patinhas from "../assets/patterns/patinhas.png";

function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    try {
      const response = await fetch("http://localhost:3001/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: email, password }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        localStorage.setItem("admin_token", data.token);
        navigate("/admin");
      } else {
        setError(data.message || "Credenciais inválidas.");
      }
    } catch (err) {
      setError("Erro ao conectar com o servidor.");
    }
  };

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

                {/* Gato */}
                

                {/* Card */}
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

                    {error && (
                      <div className="w-full bg-red-500/20 border border-red-200 text-white text-xs text-center p-2 rounded-xl mb-4">
                        {error}
                      </div>
                    )}

                    {/* Email */}
                    <div
                        className="
                            w-full
                            h-12
                            bg-[#FFFF]
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
                            bg-[#FFFF]
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

                    {/* Botão */}
                    <button
                        type="submit"
                        className="
                            mt-8
                            w-36
                            h-11
                            rounded-full
                            bg-[#FFFF]
                            text-[#026B6D]
                            font-bold
                            cursor-pointer
                            transition-all
                            duration-300
                            hover:bg-white
                            hover:-translate-y-1
                            hover:scale-105
                            hover:shadow-xl
                        "
                    >
                        Entrar
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