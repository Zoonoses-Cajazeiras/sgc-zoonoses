import { PawPrint } from "lucide-react";

export default function Navbar() {
  return (
    <header className="fixed top-0 left-0 w-full bg-[#05ABAD] shadow-lg z-50">
      <div className="max-w-7xl mx-auto flex items-center justify-between px-8 py-4">

        {/* Logo */}
        <div className="flex items-center gap-4">
          <div className="bg-white p-2 rounded-full">
            <PawPrint
              size={42}
              className="text-[#05ABAD]"
              strokeWidth={2.5}
            />
          </div>

          <div>
            <h1 className="text-white text-3xl font-bold leading-none">
              Núcleo de Zoonoses
            </h1>

            <p className="text-white/90 text-sm tracking-wider">
              Prefeitura de Cajazeiras
            </p>
          </div>
        </div>

        {/* Menu */}
        <nav>
          <ul className="flex gap-8 text-white font-medium">
            <li>
              <a href="#sobre" className="hover:text-slate-200 transition">
                Sobre
              </a>
            </li>

            <li>
              <a href="#servicos" className="hover:text-slate-200 transition">
                Serviços
              </a>
            </li>

            <li>
              <a href="#castramovel" className="hover:text-slate-200 transition">
                Castramóvel
              </a>
            </li>

            <li>
              <a href="#faq" className="hover:text-slate-200 transition">
                Dúvidas
              </a>
            </li>

            <li>
              <a href="#contato" className="hover:text-slate-200 transition">
                Contato
              </a>
            </li>
          </ul>
        </nav>

      </div>
    </header>
  );
}