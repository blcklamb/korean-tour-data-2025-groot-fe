import { Card } from "@/components/ui/card";
import { IconX } from "@tabler/icons-react";
import dayjs from "dayjs";

interface AccommodationItemProps {
  checkInDate: string;
  checkOutDate: string;
  typeLabel: string;
  onDelete: () => void;
}

export const AccommodationItem = ({
  checkInDate,
  checkOutDate,
  typeLabel,
  onDelete,
}: AccommodationItemProps) => {
  return (
    <Card className="p-3 bg-slate-50">
      <div className="flex justify-between items-center">
        <div className="flex flex-col gap-2">
          <div className="flex gap-2">
            <span>{dayjs(checkInDate).format("YYYY-MM-DD")}</span>~
            <span>{dayjs(checkOutDate).format("YYYY-MM-DD")}</span>
          </div>
          <span className="font-semibold">{typeLabel}</span>
        </div>
        <button onClick={onDelete} className="p-1 hover:bg-slate-200 rounded">
          <IconX size={16} className="text-red-500" />
        </button>
      </div>
    </Card>
  );
};
