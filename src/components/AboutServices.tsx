import cachorro from "../assets/images/cachorro1.png";
import gato from "../assets/images/gato.png";
import patinhas from "../assets/patterns/patinhas.png";
import castracao from "../assets/icons/castracao.svg";
import seringa from "../assets/icons/seringa.svg";

export default function AboutServices() {
  return (
    <section className="relative">

      {/* SOBRE NÓS */}
      <div
        id="sobre"
        className="relative bg-white py-24 overflow-hidden"
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
      <div
        id="servicos"
        className="relative pt-20 pb-24 overflow-visible"
        style={{
          background:
            "linear-gradient(135deg, #17C7CC 0%, #026B6D 100%)",
        }}
      >

        <div className="max-w-7xl mx-auto px-8">

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
              shadow-xl
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

                <p className="text-lg text-gray-600 leading-relaxed">
                  Programa de castração voltado ao controle populacional
                  de cães e gatos, promovendo saúde, bem-estar e
                  responsabilidade com os animais.
                </p>

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

              <p className="text-lg text-white/90 leading-relaxed">
                Campanhas periódicas de vacinação para prevenção da
                raiva, protegendo animais e a população contra uma das
                zoonoses mais importantes.
              </p>

            </div>

          </div>

        </div>

      </div>

      {/* CAMPANHAS */}
      <div
        id="campanhas"
        className="relative bg-[#F4F4F4] py-24 overflow-visible">

        <div className="max-w-6xl mx-auto px-8">

          <h2 className="text-center text-4xl font-bold text-[#026B6D] mb-16">
            Campanhas em Andamento
          </h2>

          <div className="grid md:grid-cols-2 gap-8">

            <div className="bg-white rounded-3xl shadow-lg p-8">
              <h3 className="text-2xl font-bold text-[#026B6D] mb-4">
                Campanha Antirrábica 2026
              </h3>

              <p className="text-gray-600">
                Vacinação gratuita para cães e gatos.
              </p>
            </div>

            <div className="bg-white rounded-3xl shadow-lg p-8">
              <h3 className="text-2xl font-bold text-[#026B6D] mb-4">
                Controle de Leishmaniose
              </h3>

              <p className="text-gray-600">
                Testagem e monitoramento epidemiológico.
              </p>
            </div>

          </div>
        </div>
        <img
              src={gato}
              alt="Gato"
              className="
              absolute
              right-0
              bottom-0
              translate-x-1/3
              w-[360px]
              z-20
              pointer-events-none
              select-none
            "
            />
      </div>

    </section>
  );
}