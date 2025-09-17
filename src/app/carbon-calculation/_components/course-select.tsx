import { Card } from "@/components/ui/card";
import { CourseSelectProps } from "./types";
import Image from "next/image";
import { useState } from "react";

export function CourseSelect(props: CourseSelectProps) {
  const { options, selected, onSelect, getLabel } = props;

  const [error, setError] = useState<boolean>(false);

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
            <span className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center">
              {item.thumbnailUrl.startsWith("http") ? (
                <Image
                  src={!error ? item.thumbnailUrl : "/groot_logo.png"}
                  alt={item.title}
                  width={40}
                  height={40}
                  onError={() => setError(true)}
                />
              ) : (
                <>{item.thumbnailUrl}</>
              )}
            </span>
            <span className="text-xs">
              {getLabel ? getLabel(item) : item.title}
            </span>
          </div>
        </Card>
      ))}
    </div>
  );
}
