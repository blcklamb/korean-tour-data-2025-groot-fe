import { Card } from "@/components/ui/card";
import { TransportSelectProps } from "./types";

export function TransportSelect(props: TransportSelectProps) {
  const { options, selected, onSelect, getIcon, getLabel } = props;
  return (
    <div className="grid grid-cols-3 gap-2">
      {options.map((item) => (
        <Card
          key={item.id}
          className={`cursor-pointer hover:bg-gray-100 transition-colors p-3 ${
            item.value && selected?.value && item.value === selected.value
              ? "bg-eco-green-100 border-eco-green-600"
              : ""
          }`}
          onClick={() => onSelect(item)}
        >
          <div className="flex flex-col justify-center items-center gap-2 h-full">
            <span>{getIcon ? getIcon(item) : item.icon}</span>
            <span className="text-xs text-center">
              {getLabel ? getLabel(item) : item.label || item.value}
            </span>
          </div>
        </Card>
      ))}
    </div>
  );
}
