"use client";
import { useState, useRef, useEffect } from "react";
import { ChevronDown } from "lucide-react";
import { FiDollarSign, FiAlertTriangle, FiHeart, FiDroplet } from "react-icons/fi";

const faqsLeft = [
  {
    index: 0,
    icon: FiDollarSign,
    question: "O serviço é gratuito?",
    answer:
      "Sim. Os serviços oferecidos pelo Castramóvel são gratuitos, conforme os critérios e vagas disponíveis em cada campanha.",
  },
  {
    index: 2,
    icon: FiAlertTriangle,
    question: "Como denunciar maus-tratos?",
    answer:
      "As denúncias podem ser realizadas diretamente junto ao Núcleo de Zoonoses, por telefone ou presencialmente.",
  },
];

const faqsRight = [
  {
    index: 1,
    icon: FiHeart,
    question: "Posso levar meu animal?",
    answer:
      "Sim, desde que ele atenda aos requisitos informados para o atendimento e esteja devidamente acompanhado por um responsável.",
  },
  {
    index: 3,
    icon: FiDroplet,
    question: "Como solicitar vacinação?",
    answer:
      "Entre em contato com o Núcleo de Zoonoses para obter informações sobre campanhas, locais e datas de vacinação disponíveis.",
  },
];

const FaqCard = ({
  item,
  isOpen,
  onToggle,
}: {
  item: typeof faqsLeft[0];
  isOpen: boolean;
  onToggle: () => void;
}) => {
  const Icon = item.icon;
  const contentRef = useRef<HTMLDivElement>(null);
  const [height, setHeight] = useState(0);

  useEffect(() => {
    if (contentRef.current) {
      setHeight(isOpen ? contentRef.current.scrollHeight : 0);
    }
  }, [isOpen]);

  return (
    <div className="bg-white/10 rounded-xl border border-white/20">
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between px-6 py-4 text-left cursor-pointer"
      >
        <span className="flex items-center gap-3 font-bold text-white">
          <span className="bg-white/20 p-1.5 rounded-lg shrink-0">
            <Icon size={16} className="text-white" />
          </span>
          {item.question}
        </span>
        <ChevronDown
          className={`text-white shrink-0 ml-4 transition-transform duration-300 ${
            isOpen ? "rotate-180" : ""
          }`}
          size={20}
        />
      </button>

      <div
        style={{ height, overflow: "hidden", transition: "height 0.3s ease" }}
      >
        <div ref={contentRef} className="px-6 pb-5 text-white/90 leading-relaxed">
          {item.answer}
        </div>
      </div>
    </div>
  );
};

export default function Faq() {
  const [openIndexes, setOpenIndexes] = useState<Set<number>>(new Set());

  const toggle = (index: number) => {
    setOpenIndexes((prev) => {
      const next = new Set(prev);
      next.has(index) ? next.delete(index) : next.add(index);
      return next;
    });
  };

  return (
    <section id="faq" className="bg-[#05ABAD] pt-12 pb-16 scroll-mt-20">
      <div className="max-w-6xl mx-auto px-8">
        <h2 className="text-center text-3xl font-bold text-white mb-12">
          Perguntas Frequentes
        </h2>

        <div className="flex gap-8 text-white">
          <div className="flex flex-col gap-4 flex-1">
            {faqsLeft.map((item) => (
              <FaqCard
                key={item.index}
                item={item}
                isOpen={openIndexes.has(item.index)}
                onToggle={() => toggle(item.index)}
              />
            ))}
          </div>
          <div className="flex flex-col gap-4 flex-1">
            {faqsRight.map((item) => (
              <FaqCard
                key={item.index}
                item={item}
                isOpen={openIndexes.has(item.index)}
                onToggle={() => toggle(item.index)}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}