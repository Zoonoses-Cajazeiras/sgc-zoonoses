import cachorro from "../assets/images/cachorro1.png";
import patinhas from "../assets/patterns/patinhas.png";
import castracao from "../assets/icons/castracao.svg";
import seringa from "../assets/icons/seringa.svg";
import teste from "../assets/icons/teste.svg";
import ServiceItem from "./ServiceItem";
import medicacao from "../assets/icons/medicacao.svg";
import vigilancia from "../assets/icons/vigilancia.svg";
import procedimentos from "../assets/icons/procedimentos.svg";
import cruzD from "../assets/icons/cruzD.svg";
import cruzE from "../assets/icons/cruzE.svg";

export default function AboutServices() {
  return (
    <section id="sobre" className="scroll-mt-20">

      {/* SOBRE NÓS */}
      <div className="relative bg-white py-16 overflow-hidden"
      >
        {/* Fundo de patinhas */}
        <div
          className="absolute inset-0 z-0"
          style={{
            backgroundImage: `url(${patinhas})`,
            backgroundRepeat: "repeat",
            backgroundSize: "1000px",
          }}
        />

        <div className="max-w-7xl mx-auto px-8 text-center relative z-10">

          <span className="inline-block px-8 py-3 rounded-full bg-[#05ABAD] text-white text-3xl font-semibold mb-10">
            Sobre Nós
          </span>

          <p className="mx-auto max-w-[1400px] text-[22px] leading-9 text-[#026B6D] font-normal">
            O Núcleo de Zoonoses de Cajazeiras atua na prevenção e controle de doenças, proteção animal e promoção da saúde pública. Por meio de ações educativas, vacinação, castração, vigilância epidemiológica e atendimento à população, trabalhamos diariamente para construir uma cidade mais segura, saudável e comprometida com o bem-estar de todos. Nossa missão é unir saúde, responsabilidade e cuidado, fortalecendo a convivência harmoniosa entre pessoas, animais e meio ambiente.
          </p>

        </div>
      </div>

      {/* SERVIÇOS */}
      <section
        id="servicos"
        className="relative pt-20 pb-24 overflow-visible scroll-mt-34"
        style={{
          background:
            "linear-gradient(135deg, #17C7CC 0%, #026B6D 100%)",
        }}
      >

        {/* Cruz Superior Direita (cuzD) */}
        <img
          src={cruzD}
          alt="Cruz Decorativa Direita"
          className="absolute -top-14 -right-25 w-[320px] h-auto opacity-20 pointer-events-none z-0"
        />

        {/* Cruz Inferior Esquerda (cuzE) */}
        <img
          src={cruzE}
          alt="Cruz Decorativa Esquerda"
          className="absolute -bottom-12 -left-16 w-[280px] h-auto opacity-20 pointer-events-none z-0"
        />

        {/* NOVA: Cruz Superior Esquerda (cuzE) */}
        <img
          src={cruzE}
          alt="Cruz Decorativa Superior Esquerda"
          className="absolute -top -1 -left-24 w-[280px] h-auto opacity-20 pointer-events-none z-0"
        />

        {/* NOVA: Cruz Inferior Direita (cuzD) */}
        <img
          src={cruzD}
          alt="Cruz Decorativa Inferior Direita"
          className="absolute -bottom-25 -right-40 w-[500px] h-auto opacity-20 pointer-events-none z-0"
        />

        <div className="max-w-6xl mx-auto px-8">

          <h2 className="text-center text-4xl font-bold text-white mb-14">
            Serviços Prestados
          </h2>

          <div className="grid md:grid-cols-2 gap-16 items-start">

            {/* CARD CASTRAÇÃO */}
            <div className="relative">

              <img
                src={cachorro}
                alt="Cachorro"
                className="
                  absolute
                  left-1/2
                  -translate-x-1/2
                  -top-[264px]
                  w-[390px]
                  z-20
                  pointer-events-none
                "
              />

              <div
                className="
              bg-white
              rounded-3xl
              shadow-lg
              p-8
              min-h-[270px]
              relative
              z-10
              "
              >
                <div className="flex items-center gap-4 mb-5">
                  <img
                    src={castracao}
                    alt="Castração"
                    className="w-11 h-11 object-contain flex-shrink-0"
                  />

                  <h3 className="text-2xl font-bold text-[#026B6D]">
                    Castração Animal
                  </h3>
                </div>

                <ul className="space-y-3 text-[#026B6D]">

                  <ServiceItem text="Controle populacional de cães e gatos." />
                  <ServiceItem text="Prevenção de doenças reprodutivas." />
                  <ServiceItem text="Promoção do bem-estar animal." />
                  <ServiceItem text="Agendamento realizado pelo Núcleo." />

                </ul>

              </div>

            </div>

            {/* CARD VACINAÇÃO */}
            <div
              className="
              bg-[#026B6D]/80
              backdrop-blur-sm
              rounded-3xl
              shadow-xl
              p-8
              min-h-[270px]
              "
            >

              <div className="flex items-center gap-4 mb-5">
                <img
                  src={seringa}
                  alt="Seringa"
                  className="w-12 h-12 object-contain"
                />

                <h3 className="text-2xl font-bold text-white">
                  Vacinação Antirrábica
                </h3>
              </div>

              <ul className="space-y-3">

                <ServiceItem
                  text="Vacinação gratuita contra a raiva."
                  textColor="text-white/90"
                />

                <ServiceItem
                  text="Campanhas periódicas em toda a cidade."
                  textColor="text-white/90"
                />

                <ServiceItem
                  text="Proteção para cães, gatos e população."
                  textColor="text-white/90"
                />

                <ServiceItem
                  text="Monitoramento da doença no município."
                  textColor="text-white/90"
                />

              </ul>

            </div>

            {/* CARD TESTE LEISHMANIOSE */}
            <div
              className="
              bg-[#026B6D]/80
              backdrop-blur-sm
              rounded-3xl
              shadow-xl
              p-8
              min-h-[270px]
              "
            >

              <div className="flex items-center gap-4 mb-5">
                <img
                  src={teste}
                  alt="Seringa"
                  className="w-12 h-12 object-contain"
                />

                <h3 className="text-2xl font-bold text-white">
                  Testes de Leishmaniase
                </h3>
              </div>

              <ul className="space-y-3">

                <ServiceItem
                  text="Diagnóstico rápido em cães."
                  textColor="text-white/90"
                />

                <ServiceItem
                  text="Controle e monitoramento epidemiológico."
                  textColor="text-white/90"
                />

              </ul>

            </div>

            {/* CARD AVALIACAO E MEDICACAO */}

            <div className="relative">

              <div
                className="
              bg-white
              rounded-3xl
              shadow-xl
              p-8
              min-h-[270px]
              relative
              z-10
              "
              >
                <div className="flex items-center gap-4 mb-5">
                  <img
                    src={medicacao}
                    alt="Medicação"
                    className="w-11 h-11 object-contain flex-shrink-0"
                  />

                  <h3 className="text-2xl font-bold text-[#026B6D]">
                    Avaliação e Medicação
                  </h3>
                </div>

                <ul className="space-y-3 text-[#026B6D]">

                  <ServiceItem text="Atendimento veterinário." />
                  <ServiceItem text="Prescrição de medicações." />

                </ul>

              </div>

            </div>

            {/* VIGILANCIA DE ZOONOSES */}

            <div className="relative">

              <div
                className="
              bg-white
              rounded-3xl
              shadow-xl
              p-8
              min-h-[270px]
              relative
              z-10
              "
              >
                <div className="flex items-center gap-4 mb-5">
                  <img
                    src={vigilancia}
                    alt="Medicação"
                    className="w-11 h-11 object-contain flex-shrink-0"
                  />

                  <h3 className="text-2xl font-bold text-[#026B6D]">
                    Vigilância de Zoonoses
                  </h3>
                </div>

                <ul className="space-y-3 text-[#026B6D]">

                  <ServiceItem text="Controle de doenças." />
                  <ServiceItem text="Ações preventivas." />
                  <ServiceItem text="Educação em saúde." />

                </ul>

              </div>

            </div>

            {/* CARD PROCEDIMENTOS ESPECIFICOS */}
            <div
              className="
              bg-[#026B6D]/80
              backdrop-blur-sm
              rounded-3xl
              shadow-xl
              p-8
              min-h-[270px]
              "
            >

              <div className="flex items-center gap-4 mb-5">
                <img
                  src={procedimentos}
                  alt="Seringa"
                  className="w-12 h-12 object-contain"
                />

                <h3 className="text-2xl font-bold text-white">
                  Procedimentos Específicos
                </h3>
              </div>

              <ul className="space-y-3">

                <ServiceItem
                  text="Eutanásia."
                  textColor="text-white/90"
                />

                <ServiceItem
                  text="Recolhimento de animais."
                  textColor="text-white/90"
                />
                <ServiceItem
                  text="Atendimento a animais vítimas de maus-tratos."
                  textColor="text-white/90"
                />

              </ul>

            </div>

          </div>

        </div>

      </section>

    </section>
  );
}