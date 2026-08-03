import cachorroHero from "../assets/images/cachorro2.png";

export default function Hero() {
  return (
    <section id="hero" className="relative overflow-hidden bg-white scroll-mt-20 lg:h-[calc(100vh-88px)]">

      {/* Conteúdo */}
      <div className="max-w-7xl mx-auto px-6 py-20 lg:px-8 min-h-[60vh] lg:min-h-[calc(100vh-88px)] flex flex-col lg:flex-row justify-center lg:justify-start items-center lg:items-start relative z-20 gap-10">

        <div className="w-full lg:w-1/2 max-w-2xl lg:max-w-3xl text-center lg:text-left">

          <span className="inline-block px-4 py-2 rounded-full bg-[#05ABAD]/10 text-[#026B6D] font-medium mb-6">
            Saúde Pública e Bem-Estar Animal
          </span>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-[#026B6D] leading-[1.15] sm:leading-[1.12] tracking-[-0.02em]">
            Protegendo a saúde animal e humana em Cajazeiras
          </h1>

          <p className="mt-7 text-base sm:text-lg lg:text-xl font-normal text-[#026B6D] leading-8">
            Controle de zoonoses, castração, vacinação, prevenção
            <br />
            e bem-estar animal.
          </p>

          <button className="mt-8 w-full sm:w-auto bg-[#05ABAD] text-white px-8 py-4 rounded-xl font-semibold cursor-pointer transition-all duration-300 hover:shadow-[0_6px_20px_rgba(5,171,173,0.4)] hover:-translate-y-0.5">
            Fale Conosco
          </button>

        </div>
      </div>

      {/* Cachorro */}
      <div className="hidden lg:block absolute inset-y-0 right-0 w-[55%] z-10">

        <img
          src={cachorroHero}
          alt="Cachorro"
          className="w-full h-full object-cover object-center"
        />

        <div
          className="
            absolute
            inset-0
            bg-gradient-to-r
            from-white
            via-white/60
            to-transparent
          "
        />

      </div>

    </section>
  );
}