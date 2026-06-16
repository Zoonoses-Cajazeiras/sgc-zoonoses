import {useState} from "react";
import logoImg from "../assets/images/cachorro1.png"
import {Link} from "react-router-dom";

function Login(){

    const [email,setEmail] = useState("");
    const [password,setPassword] = useState("");

    return (
        <>
        <main className=" h-screen w-screen flex flex-col justify-center items-center">
                <img className="login-form-logo w-60 absolute top-1 " src={logoImg} alt="cachorro" />
                <form className="login-form bg-[#05ABAD] w-96 h-80 rounded-4xl flex flex-col justify-center items-center gap-8" noValidate>
                    <h1 className="login-form-title font-bold text-white text-3xl">Bem vindo!</h1>
                <div className="wrap-input h-8 w-72 flex items-center bg-amber-50 rounded-3xl">
                    <input
                            className={email !== "" ? "has-val input" : "input"}
                            placeholder="email"
                            type="email"
                            value={email}
                            onChange={e => setEmail(e.target.value)}
                    />
                </div>
                <div className="wrap-input h-8 w-72 bg-amber-50 flex items-center rounded-3xl">
                    <input
                            className={password !== "" ? "has-val input" : "input"}
                            placeholder="senha"
                            type="password"
                            value={password}
                            onChange={e => setPassword(e.target.value)}
                    />
                </div>

                    <div className="container-login-form-btn">
                        <button className="login-form-btn w-28 h-10 font-bold bg-amber-50 rounded-4xl text-[#05ABAD]">Entrar</button>
                    </div>

                    <Link className="text-white" to="/">voltar</Link>
                </form>
            </main>
        </>
    )
}

export default Login;