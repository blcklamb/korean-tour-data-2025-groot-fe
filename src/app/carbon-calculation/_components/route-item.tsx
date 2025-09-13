import { Card } from "@/components/ui/card";
import { IconX } from "@tabler/icons-react";
import { RouteItemProps } from "./types";

export const RouteItem = (props: RouteItemProps) => {
  const {
    departureCityName,
    arrivalCityName,
    courseName,
    transportIcon,
    onDelete,
  } = props;
  return (
    <Card className="p-3 bg-slate-50">
      <div className="flex justify-between items-center">
        <div className="flex flex-col gap-2 items-center">
          <div className="flex gap-2 items-center">
            <span className="text-xl">{transportIcon}</span>
            {!courseName ? (
              <div className="flex gap-2">
                <span>{departureCityName}</span>→<span>{arrivalCityName}</span>
              </div>
            ) : (
              <span>{courseName}</span>
            )}
          </div>
        </div>
        <button onClick={onDelete} className="p-1 hover:bg-slate-200 rounded">
          <IconX size={16} className="text-red-500" />
        </button>
      </div>
    </Card>
  );
};
