"use client";

import * as React from "react";
import { Calendar as CalendarIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

interface DatePickerProps {
  value: {
    from: Date | undefined;
    to: Date | undefined;
  };
  onChange: (value: { from: Date | undefined; to: Date | undefined }) => void;
}

export function DatePicker({ value, onChange }: DatePickerProps) {
  const isDateRangeEmpty = value.from === undefined && value.to === undefined;

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          data-empty={isDateRangeEmpty}
          className="data-[empty=true]:text-muted-foreground w-[280px] justify-start text-left font-normal"
        >
          <CalendarIcon />
          {isDateRangeEmpty ? (
            <span>기간을 선택해주세요</span>
          ) : (
            <span>
              {value.from?.toLocaleDateString()} ~{" "}
              {value.to?.toLocaleDateString()}
            </span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0">
        <Calendar
          mode="range"
          selected={value}
          onSelect={(range) => {
            onChange({ from: range?.from, to: range?.to });
          }}
        />
      </PopoverContent>
    </Popover>
  );
}
