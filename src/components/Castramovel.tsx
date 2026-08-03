import {
  FiClipboard,
  FiCalendar,
  FiArrowRight,
  FiCheckCircle,
  FiActivity,
  FiUsers
} from "react-icons/fi";

import castramovelBg from "../assets/images/castramovelBg.png";
import { FaWhatsapp } from "react-icons/fa";

export default function Castramovel() {
  return (
    <section
      id="castramovel"
      className="bg-gradient-to-b from-[#F7FBFB] to-white pt-12 pb-14 scroll-mt-24"
    >

      <img
        src={castramovelBg}
        alt=""
        className="hidden xl:block absolute right-10 bottom-10 w-[380px] opacity-10 pointer-events-none select-none"
      />
      <div className="max-w-6xl mx-auto px-8">

        {/* Título */}

        <h2 className="text-4xl font-bold text-center text-[#05ABAD]">
          Castramóvel
        </h2>

        <p className="max-w-5xl mx-auto text-center text-[#0D6C73] text-xl mt-8 leading-relaxed">
          O Castramóvel é uma iniciativa do Núcleo de Zoonoses de Cajazeiras que
          leva serviços de castração para diferentes regiões do município,
          contribuindo para o controle populacional de cães e gatos, prevenção de
          doenças e melhoria da qualidade de vida dos animais e de seus tutores.
        </p>

        {/* Cards */}

        <div className="grid gap-8 md:grid-cols-2 mt-14">

          <div className="
                    bg-white
                    rounded-3xl
                    p-9
                    shadow-lg
                    border border-[#05ABAD]/90
                    transition-all
                    duration-300
                    hover:-translate-y-3
                  
                    ">

            <div className="w-12 h-12 rounded-full bg-[#05ABAD]/10 flex items-center justify-center mb-4">
              <FiActivity
                size={24}
                className="text-[#05ABAD]"
              />
            </div>

            <h3 className="text-[#05ABAD] text-xl font-bold mb-2">
              Como funciona?
            </h3>

            <p className="text-[#0D6C73] leading-7 text-base">
              O atendimento é realizado mediante agendamento prévio, de acordo
              com a programação divulgada pelo Núcleo de Zoonoses.

              Os animais passam por uma avaliação inicial para verificar se
              estão aptos ao procedimento cirúrgico.

              Após a castração, os tutores recebem orientações sobre os
              cuidados necessários durante a recuperação.
            </p>

          </div>

          <div className="
                    bg-white
                    rounded-3xl
                    p-9
                    shadow-lg
                    border border-[#05ABAD]/90
                    transition-all
                    duration-300
                    hover:-translate-y-3
              
                    ">


            <div className="w-12 h-12 rounded-full bg-[#05ABAD]/10 flex items-center justify-center mb-4">
              <FiUsers
                size={24}
                className="text-[#05ABAD]"
              />
            </div>

            <h3 className="text-[#05ABAD] text-xl font-bold mb-2">
              Quem pode participar?
            </h3>

            <p className="text-[#0D6C73] leading-7 text-base">
              O programa é destinado a tutores residentes em Cajazeiras,
              protetores independentes e responsáveis por animais em situação de
              vulnerabilidade.

              Os critérios de participação podem variar conforme cada campanha
              ou etapa de atendimento.
            </p>

          </div>

        </div>

        {/* Segunda linha */}

        <div className="grid gap-8 md:grid-cols-2 mt-14">

          {/* Documentação */}

          <div>
            <div className="flex justify-center mb-0">
              <div className="bg-[#0B7A7A] rounded-full px-5 py-1 inline-flex items-center gap-4">
                <FiClipboard
                  size={22}
                  className="text-white"
                />

                <h3 className="text-white text-2xl font-semibold">
                  Documentação necessária
                </h3>
              </div>
            </div>

            <div className="mt-6 flex flex-col ml-10 gap-4">

              <div className="flex items-center gap-3 text-[#0D6C73]">
                <FiCheckCircle
                  size={20}
                  className="text-[#05ABAD] flex-shrink-0"
                />
                <span>Documento oficial com foto (RG ou CNH);</span>
              </div>

              <div className="flex items-center gap-3 text-[#0D6C73]">
                <FiCheckCircle
                  size={20}
                  className="text-[#05ABAD] flex-shrink-0"
                />
                <span>Comprovante de residência atualizado;</span>
              </div>

              <div className="flex items-center gap-3 text-[#0D6C73]">
                <FiCheckCircle
                  size={20}
                  className="text-[#05ABAD] flex-shrink-0"
                />
                <span>Informações básicas sobre o animal (idade, sexo e espécie).</span>
              </div>

            </div>

            <p
              className="
      mt-6
      text-sm
      text-gray-500
      italic
      max-w-md
      mx-auto
    "
            >
              Documentações adicionais poderão ser solicitadas conforme as regras de
              cada campanha.
            </p>
          </div>

          {/* Agenda */}

          <div>

            <div className="flex justify-center mb-0">
              <div className="bg-[#0B7A7A] rounded-full px-5 py-1 inline-flex items-center gap-4">

                <FiCalendar
                  size={22}
                  className="text-white"
                />

                <h3 className="text-white text-2xl font-semibold">
                  Agenda de atendimentos
                </h3>

              </div>
            </div>

            <p
              className="
      mt-6
      mx-auto
      max-w-md
      text-base
      text-[#0D6C73]
      leading-7
      lg:ml-11
    "
            >
              A programação do Castramóvel é divulgada periodicamente pelos canais
              oficiais da Prefeitura e do Núcleo de Zoonoses. Fique atento às datas,
              locais e orientações para garantir a participação do seu animal.
            </p>

            <p
              className="
      mt-2
      mx-auto
      max-w-md
      text-base
      text-[#0D6C73]
      leading-7
      lg:ml-11
    "
            >
              Acompanhe nossas redes sociais e canais de comunicação para consultar a
              agenda atualizada e realizar seu agendamento.
            </p>

          </div>

        </div>

        {/* Botão */}
        <div className="flex justify-center mt-16">
          <button
            className="
              bg-[#05ABAD]
              text-white
              rounded-xl
              px-8
              py-4
              flex
              items-center
              gap-3
              font-semibold
              cursor-pointer
              transition-all
              duration-300
              hover:-translate-y-0.5
              hover:shadow-[0_6px_20px_rgba(5,171,173,0.4)]
              will-change-transform backface-hidden
            "
          >
            <FaWhatsapp size={22} />
            Agendar Castração
            <FiArrowRight />
          </button>
        </div>

      </div>
    </section>
  );
}