import cachorroHero from "../assets/images/cachorro2.png";

export default function Hero() {
  return (
    <section
      id="hero"
      className="
        relative
        overflow-hidden
        bg-white
        scroll-mt-20
        min-h-[calc(100vh-88px)]
      "
    >
      {/* Conteúdo */}
      <div
        className="
          relative
          z-20
          max-w-7xl
          mx-auto
          px-6
          sm:px-8
          min-h-[calc(100vh-88px)]
          flex
          items-center
          py-16
          lg:py-0
        "
      >
        <div
          className="
            w-full
            max-w-xl
            sm:max-w-2xl
            text-center
            lg:text-left
          "
        >
          <span
            className="
              inline-block
              px-4
              py-2
              rounded-full
              bg-[#05ABAD]/10
              text-[#026B6D]
              text-sm
              sm:text-base
              font-medium
              mb-6
            "
          >
            Saúde Pública e Bem-Estar Animal
          </span>

          <h1
            className="
              text-4xl
              sm:text-5xl
              lg:text-6xl
              font-bold
              text-[#026B6D]
              leading-[1.15]
              lg:leading-[1.20]
              tracking-[-0.02em]
            "
          >
            Protegendo a saúde animal e humana em Cajazeiras
          </h1>

          <p
            className="
              mt-6
              sm:mt-7
              text-base
              sm:text-lg
              lg:text-[1.50rem]
              font-normal
              text-[#026B6D]
              leading-[1.5]
              lg:leading-[1.4]
            "
          >
            Controle de zoonoses, castração, vacinação, prevenção
            <span className="hidden sm:inline">
              <br />
            </span>{" "}
            e bem-estar animal.
          </p>

          <button
            className="
              mt-8
              bg-[#05ABAD]
              text-white
              px-8
              py-4
              rounded-xl
              font-semibold
              cursor-pointer
              transition-all
              duration-300
              hover:shadow-[0_6px_20px_rgba(5,171,173,0.4)]
              hover:-translate-y-0.5
            "
          >
            Fale Conosco
          </button>
        </div>
      </div>

      {/* Cachorro */}
      <div
        className="
          hidden
          lg:block
          absolute
          top-0
          right-0
          h-full
          w-[68%]
          xl:w-[72%]
          z-10
        "
      >
        <img
          src={cachorroHero}
          alt="Cachorro"
          className="
            w-full
            h-full
            object-cover
            object-center
          "
        />

        {/* Fade */}
        <div
          className="
            absolute
            inset-0
            bg-gradient-to-r
            from-white
            via-white/20
            to-transparent
          "
        />
      </div>
    </section>
  );
}