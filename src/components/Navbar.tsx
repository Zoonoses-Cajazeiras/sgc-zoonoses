import logo from "../assets/icons/pata-grande-icon.png";
import { Link } from "react-router-dom"

export default function Navbar() {
  return (
    <header className="fixed top-0 left-0 w-full h-20 bg-[#05ABAD] shadow-lg z-50">
      <div className="max-w-7xl mx-auto h-full flex items-center justify-between px-8">
        <a href="#hero" className="hover:text-slate-200 transition">
          <div className="flex items-center gap-4">

            <img
              src={logo}
              alt="Logo Núcleo de Zoonoses"
              className="h-12 w-auto"
            />


            <div>
              <h1 className="text-white text-2xl font-bold leading-none">
                Núcleo de Zoonoses
              </h1>

              <p className="text-white/90 text-sm">
                Prefeitura de Cajazeiras
              </p>
            </div>

          </div>
        </a>

        <nav>
          <ul className="flex gap-8 text-white font-medium">
            <li>
              <a href="#sobre" className="nav-link" >
                Sobre
              </a>
            </li>

            <li>
              <a href="#servicos" className="nav-link">
                Serviços
              </a>
            </li>

            <li>
              <a href="#campanhas" className="nav-link">
                Campanhas
              </a>
            </li>

            <li>
              <a href="#castramovel" className="nav-link">
                Castramóvel
              </a>
            </li>

            <li>
              <a href="#faq" className="nav-link">
                Dúvidas
              </a>
            </li>

            <li>
              <a href="#contato" className="nav-link">
                Contato
              </a>
            </li>

            <li>
              <Link to="/login" className="nav-link">
                Login
              </Link>
            </li>
          </ul>
        </nav>

      </div>
    </header >
  );
}