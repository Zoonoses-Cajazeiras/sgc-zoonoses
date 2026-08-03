"use client";
import { FiClock, FiMail, FiPhone, FiMapPin, FiArrowUp, FiUser } from "react-icons/fi";
import logoZoonoses from "../assets/images/logoZoonoses.svg";
import logoPrefeitura from "../assets/images/logoPrefeitura.png";

const profissionais = [
  {
    nome: "Emerson Victor Lucena Nunes",
    vinculo: "COMISSIONADO",
    cargo: "Coordenador(a)",
  },
  {
    nome: "Mikaelly Mangueira Fernandes",
    vinculo: "IGESPE",
    cargo: "Médica Veterinária",
  },
  {
    nome: "Werona de Oliveira Barbosa Fernandes",
    vinculo: "EFETIVO",
    cargo: "Médica Veterinária",
  },
];

export default function Footer() {
  const scrollToTop = () => window.scrollTo({ top: 0, behavior: "smooth" });

  return (
    <footer id="contato" className="bg-gray-100 scroll-mt-20">

      {/* Conteúdo principal */}
      <div className="max-w-6xl mx-auto px-8 py-8">
        <div className="flex flex-col md:flex-row gap-8 items-start">

          {/* Lado esquerdo */}
          <div className="flex flex-col gap-4 flex-1">

            {/* Horário */}
            <div>
              <h2 className="flex items-center gap-2 text-sm font-bold text-gray-800 mb-3">
                <FiClock className="text-[#05ABAD]" size={16} />
                HORÁRIO DE FUNCIONAMENTO
              </h2>
              <p className="text-sm font-semibold text-gray-700 mb-2">Segunda a Sexta</p>
              <div className="flex gap-4">
                <div className="flex items-center gap-2">
                  <span className="bg-[#05ABAD] text-white text-xs font-bold px-2 py-0.5 rounded">Manhã</span>
                  <span className="text-sm text-gray-600">07:00h às 11:00h</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="bg-orange-400 text-white text-xs font-bold px-2 py-0.5 rounded">Tarde</span>
                  <span className="text-sm text-gray-600">13:00h às 17:00h</span>
                </div>
              </div>
            </div>

            <hr className="border-gray-300" />

            {/* Profissionais */}
            <div>
              <h3 className="text-sm font-bold text-gray-800 mb-2">Profissionais</h3>
              <div className="flex flex-col md:flex-row gap-2">
                {profissionais.map((p, i) => (
                  <div
                    key={i}
                    className="flex items-center gap-2 bg-white rounded-lg px-3 py-2 border border-gray-200 flex-1"
                  >
                    <div className="bg-gray-100 p-1.5 rounded-full shrink-0">
                      <FiUser size={12} className="text-gray-400" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-gray-800 leading-snug">{p.nome}</p>
                      <p className="text-xs text-gray-600 mt-0.5">{p.vinculo} · {p.cargo}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <hr className="border-gray-300" />

            {/* Contato */}
            <div>
              <h3 className="text-sm font-bold text-gray-800 mb-2">Informações de contatos</h3>
              <div className="flex flex-col gap-1.5 text-gray-600">
                <div className="flex items-center gap-2">
                  <FiMail className="text-[#05ABAD] shrink-0" size={14} />
                  <span className="text-sm">czzoonoses@gmail.com</span>
                </div>
                <div className="flex items-center gap-2">
                  <FiPhone className="text-[#05ABAD] shrink-0" size={14} />
                  <span className="text-sm">(83) 97400-5661</span>
                </div>
                <div className="flex items-center gap-2">
                  <FiMapPin className="text-[#05ABAD] shrink-0" size={14} />
                  <span className="text-sm">RUA JOSÉ MOREIRA DE FIGUEIREDO, 00 - COCODÉ - CAJAZEIRAS</span>
                </div>
              </div>
            </div>

          </div>

          {/* Mapa */}
          <div className="w-full md:w-80 rounded-xl overflow-hidden shadow-md self-center ml-4">
            <iframe
              title="Localização Núcleo de Zoonoses"
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d990.2632878984704!2d-38.55537246128846!3d-6.884236862977725!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x7a47391428c9c9f%3A0xf51f49fdd8e91462!2sN%C3%BAcleo%20de%20Zoonoses!5e0!3m2!1spt-BR!2sbr!4v1782167944857!5m2!1spt-BR!2sbr"
              width="100%"
              height="260"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>

        </div>
      </div>

      {/* Faixa de logos */}
      <div className="border-t border-gray-300 bg-gray-200 py-5">
        <div className="max-w-6xl mx-auto px-8 flex items-center justify-center gap-8">
          <img src={logoZoonoses} alt="Núcleo de Zoonoses" className="h-10 object-contain" />
          <div className="w-px h-8 bg-gray-400" />
          <img src={logoPrefeitura} alt="Prefeitura de Cajazeiras" className="h-12 object-contain" />
        </div>
      </div>

      {/* Faixa de copyright */}
      <div className="bg-gray-800 py-3 relative">
        <div className="max-w-6xl mx-auto px-8 flex items-center justify-center">
          <p className="text-gray-400 text-xs text-center">
            © {new Date().getFullYear()} Núcleo de Zoonoses · Prefeitura de Cajazeiras. Todos os direitos reservados.
          </p>
        </div>
        <button
          onClick={scrollToTop}
          className="absolute right-8 top-1/2 -translate-y-1/2 bg-[#05ABAD] hover:bg-[#049a9c] text-white p-2 rounded-full transition-colors"
          aria-label="Voltar ao topo"
        >
          <FiArrowUp size={14} />
        </button>
      </div>

    </footer>
  );
}