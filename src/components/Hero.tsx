import cachorroHero from "../assets/images/cachorro2.png";

export default function Hero() {
  return (
    <section id="hero" className="relative h-[calc(100vh-88px)] overflow-hidden bg-white scroll-mt-20">

      {/* Conteúdo */}
      <div className="max-w-7xl mx-auto px-8 h-full flex items-center relative z-20">

        <div className="max-w-2xl">

          <span className="inline-block px-4 py-2 rounded-full bg-[#05ABAD]/10 text-[#026B6D] font-medium mb-6">
            Saúde Pública e Bem-Estar Animal
          </span>

          <h1 className="text-5xl lg:text-6xl font-bold text-[#026B6D] leading-[1.20] tracking-[-0.02em]">
            Protegendo a saúde animal e humana em Cajazeiras
          </h1>

          <p className="mt-7 lg:text-[1.50rem] font-normal text-md text-[#026B6D] leading-[1.4]">
            Controle de zoonoses, castração, vacinação, prevenção
            <br />
            e bem-estar animal.
          </p>

          <button className="mt-8 bg-[#05ABAD] text-white px-8 py-4 rounded-xl font-semibold cursor-pointer transition-all duration-300 hover:shadow-[0_6px_20px_rgba(5,171,173,0.4)] hover:-translate-y-0.5">
            Fale Conosco
          </button>

        </div>
      </div>

      {/* Cachorro */}
      <div className="absolute top-0 right-0 h-full w-[%85] z-10">

        <img
          src={cachorroHero}
          alt="Cachorro"
          className="w-full h-full object-cover object-center"
        />

        {/* Fade mais suave */}
        <div
          className="
            absolute
            inset-0
            bg-gradient-to-r
            from-white
            via-white/18
            to-transparent
          "
        />

      </div>

    </section>
  );
}