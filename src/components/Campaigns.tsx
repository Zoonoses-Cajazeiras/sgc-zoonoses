import gato from "../assets/images/gato.png";

export default function Campaigns() {
    return (
        <section id="campanhas"
            className="relative bg-[#F4F4F4] pt-12 pb-20 overflow-visible scroll-mt-20">

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
                <img
                    src={gato}
                    alt="Gato"
                    className="
              absolute
              right-0
              bottom-0
              translate-x-1/3
              w-[380px]
              z-20
              pointer-events-none
              select-none
            "
                />
            </div>

        </section>
    );
}