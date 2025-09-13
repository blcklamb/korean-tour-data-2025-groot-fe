import { Card } from "@/components/ui/card";
import { CourseSelectProps } from "./types";

export function CourseSelect(props: CourseSelectProps) {
  const { options, selected, onSelect, getIcon, getLabel } = props;
  return (
    <div className="flex flex-col gap-2">
      {options.map((item) => (
        <Card
          key={item.id}
          className={`cursor-pointer p-1 transition-colors ${
            selected?.value && item.value === selected.value
              ? "bg-eco-green-100 border-eco-green-600"
              : ""
          }`}
          onClick={() => onSelect(item)}
        >
          <div className="flex items-center gap-2 h-full">
            <span>{getIcon ? getIcon(item) : item.thumbnailUrl}</span>
            <span className="text-xs">
              {getLabel ? getLabel(item) : item.title}
            </span>
          </div>
        </Card>
      ))}
    </div>
  );
}
