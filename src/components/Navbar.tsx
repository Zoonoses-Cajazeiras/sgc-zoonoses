import logo from "../assets/icons/pata-grande-icon.png";
import { Link } from "react-router-dom"
import { FiLogIn, FiMenu, FiX } from "react-icons/fi";
import { useState } from "react";

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  return (
    <>
    <header className="fixed top-0 left-0 w-full h-24 bg-[#05ABAD] shadow-lg z-50">

      <div className="max-w-7xl mx-auto h-full flex items-center justify-between px-5 md:px-8">

        {/* Logo */}

        <a href="#hero" className="hover:text-slate-200 transition">

          <div className="flex items-center gap-3 md:gap-4">

            <img
              src={logo}
              alt="Logo"
              className="h-10 md:h-12 w-auto"
            />

            <div>

              <h1 className="text-white text-lg md:text-2xl font-bold leading-none">
                Núcleo de Zoonoses
              </h1>

              <p className="text-white/90 text-xs md:text-sm">
                Prefeitura de Cajazeiras
              </p>

            </div>

          </div>

        </a>

        {/* Desktop */}

        <nav className="hidden lg:flex items-center gap-12">

          <ul className="flex items-center gap-8 text-white font-medium">

            <li><a href="#sobre" className="nav-link">Sobre</a></li>

            <li><a href="#servicos" className="nav-link">Serviços</a></li>

            <li><a href="#campanhas" className="nav-link">Campanhas</a></li>

            <li><a href="#castramovel" className="nav-link">Castramóvel</a></li>

            <li><a href="#faq" className="nav-link">Dúvidas</a></li>

            <li><a href="#contato" className="nav-link">Contato</a></li>

          </ul>

          <Link
            to="/login"
            className="login-button flex items-center gap-2"
          >
            <FiLogIn size={18} />
            Login
          </Link>

        </nav>

        {/* Botão Mobile */}

        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="lg:hidden text-white"
        >

          {menuOpen ? (
            <FiX size={30} />
          ) : (
            <FiMenu size={30} />
          )}

        </button>

      </div>

    </header>
    {menuOpen && (

    <div className="fixed top-24 left-0 w-full bg-[#05ABAD] shadow-xl lg:hidden z-40">

        <nav className="flex flex-col items-center py-8 gap-6 text-white font-medium">

            <a href="#sobre" onClick={() => setMenuOpen(false)}>Sobre</a>

            <a href="#servicos" onClick={() => setMenuOpen(false)}>Serviços</a>

            <a href="#campanhas" onClick={() => setMenuOpen(false)}>Campanhas</a>

            <a href="#castramovel" onClick={() => setMenuOpen(false)}>Castramóvel</a>

            <a href="#faq" onClick={() => setMenuOpen(false)}>Dúvidas</a>

            <a href="#contato" onClick={() => setMenuOpen(false)}>Contato</a>

            <Link
                to="/login"
                onClick={() => setMenuOpen(false)}
                className="login-button flex items-center gap-2 mt-3"
            >
                <FiLogIn size={18} />
                Login
            </Link>

        </nav>

    </div>

)}
</>
  );
}