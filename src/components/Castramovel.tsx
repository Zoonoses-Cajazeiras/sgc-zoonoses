export default function Castramovel() {
  return (
    <section
      id="castramovel"
      className="bg-white py-16"
    >
      <div className="max-w-5xl mx-auto px-8">

        <h2 className="text-center text-4xl font-bold text-[#05ABAD] mb-5">
          Castramóvel
        </h2>

        <p className="text-center text-gray-600 max-w-4xl mx-auto mb-12">
          O Castramóvel leva serviços de castração para diferentes regiões do município.
        </p>

        <div className="grid md:grid-cols-2 gap-8">

          <div className="bg-gray-100 rounded-2xl p-5">
            <h3 className="font-bold text-[#05ABAD] mb-3">
              Como funciona?
            </h3>
            <p>
              Atendimento mediante agendamento prévio e avaliação veterinária.
            </p>
          </div>

          <div className="bg-gray-100 rounded-2xl p-6">
            <h3 className="font-bold text-[#05ABAD] mb-3">
              Quem pode participar?
            </h3>
            <p>
              Tutores residentes no município conforme os critérios da campanha.
            </p>
          </div>

        </div>
      </div>
    </section>
  );
}