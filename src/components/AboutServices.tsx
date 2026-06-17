import cachorroCard from "../assets/images/cachorro1.png";
import patinhas from "../assets/patterns/patinhas.png";
import gato from "../assets/images/gato.png";

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

        <div className="max-w-6xl mx-auto px-8 text-center relative z-10">

          <span className="inline-block px-5 py-2 rounded-full bg-[#05ABAD] text-white font-medium mb-6">
            Sobre Nós
          </span>

          <h2 className="text-4xl font-bold text-[#026B6D] mb-6">
            Compromisso com a saúde pública e o bem-estar animal
          </h2>

          <p className="max-w-4xl mx-auto text-lg text-gray-600 leading-relaxed">
            O Núcleo de Zoonoses de Cajazeiras atua na prevenção e controle de doenças, proteção animal e promoção da saúde pública. 
            Por meio de ações educativas, vacinação, castração, vigilância epidemiológica e atendimento à população, trabalhamos diariamente para construir uma cidade mais segura, saudável e comprometida com o bem-estar de todos. Nossa missão é unir saúde, responsabilidade e cuidado,
             fortalecendo a convivência harmoniosa entre pessoas, animais e meio ambiente.
          </p>

        </div>

      </div>

      {/* SERVIÇOS */}
      <div
        id="servicos"
        className="relative bg-[#05ABAD] pt-36 pb-24"
      >

        <div className="max-w-6xl mx-auto px-8">

          <h2 className="text-center text-4xl font-bold text-white mb-20">
            Serviços Prestados
          </h2>

          <div className="grid md:grid-cols-2 gap-10">

            {/* CARD CASTRAÇÃO */}
            <div className="relative">

              <img
                src={cachorroCard}
                alt="Cachorro"
                className="
                  absolute
                  -top-52
                  left-1/2
                  -translate-x-1/2
                  w-80
                  z-20
                "
              />

              <div
                className="
                  bg-white
                  rounded-3xl
                  shadow-xl
                  p-8
                  pt-28
                  h-full
                  relative
                  z-10
                "
              >
                <h3 className="text-2xl font-bold text-[#026B6D] mb-4">
                  Castração Animal
                </h3>

                <p className="text-gray-600 leading-relaxed">
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
              "
            >
              <h3 className="text-2xl font-bold text-white mb-4">
                Vacinação Antirrábica
              </h3>

              <p className="text-white/90 leading-relaxed">
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

        <img
             src={gato}
              alt="Gato"
              className="
                   absolute
                    right-[-60px]
                    bottom-[-10px]
                    w-60
                    z-20
                  "
        />

      </div>

    </div>

  </div>

    </section>
  );
}