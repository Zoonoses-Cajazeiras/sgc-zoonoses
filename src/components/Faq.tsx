export default function Faq() {
  return (
    <section
      id="faq"
      className="bg-[#05ABAD] py-12"
    >
      <div className="max-w-6xl mx-auto px-8">

        <h2 className="text-center text-3xl font-bold text-white mb-12">
          Perguntas Frequentes
        </h2>

        <div className="grid md:grid-cols-2 gap-8 text-white">

          <div>
            <h3 className="font-bold mb-2">
              O serviço é gratuito?
            </h3>
            <p>
              Sim, conforme os critérios das campanhas.
            </p>
          </div>

          <div>
            <h3 className="font-bold mb-2">
              Posso levar meu animal?
            </h3>
            <p>
              Sim, desde que esteja dentro dos requisitos.
            </p>
          </div>

          <div>
            <h3 className="font-bold mb-2">
              Como denunciar maus-tratos?
            </h3>
            <p>
              Entre em contato com o Núcleo de Zoonoses.
            </p>
          </div>

          <div>
            <h3 className="font-bold mb-2">
              Como solicitar vacinação?
            </h3>
            <p>
              Consulte o calendário das campanhas.
            </p>
          </div>

        </div>
      </div>
    </section>
  );
}