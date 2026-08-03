import patinha from "../assets/icons/marcadorPatinha.svg";

interface ServiceItemProps {
  text: string;
  textColor?: string;
}

export default function ServiceItem({
  text,
  textColor = "text-[#026B6D]",
}: ServiceItemProps) {
  return (
    <li className="flex items-start gap-2">
      <img
        src={patinha}
        alt=""
        className="w-10 h-5 mt-1 flex-shrink-0"
      />

      <span className={textColor}>
        {text}
      </span>
    </li>
  );
}