"use client";

import { useState } from "react";
import { format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";
import { ControllerRenderProps } from "react-hook-form";
import { cn } from "@/lib/utils";
import type { FormData } from "./form-editor";
import { Button } from "../ui/button";
import { Calendar } from "../ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "../ui/popover";

interface DateFieldProps {
  field: ControllerRenderProps<FormData, keyof FormData>;
  id: string;
  required?: boolean;
  className: string;
  placeholder?: string;
  error?: boolean;
  minDate?: string;
  maxDate?: string;
  showTime?: boolean;
}

export function DateField({
  field,
  className,
  placeholder,
  error,
  minDate,
  maxDate,
  showTime = false,
}: DateFieldProps) {
  const { onChange, value } = field;
  const [isOpen, setIsOpen] = useState(false);

  const validateDate = (date: Date): string | null => {
    if (minDate && date < new Date(minDate)) {
      return `Date must be after ${format(new Date(minDate), "MMM dd, yyyy")}`;
    }
    if (maxDate && date > new Date(maxDate)) {
      return `Date must be before ${format(new Date(maxDate), "MMM dd, yyyy")}`;
    }
    return null;
  };

  const handleDateSelect = (selectedDate: Date | undefined) => {
    if (selectedDate) {
      const validationError = validateDate(selectedDate);
      if (validationError) {
         return;
      }
      
      if (showTime) {
        // For datetime, we need to handle time as well
        onChange(selectedDate);
      } else {
        // For date only, format as YYYY-MM-DD
        const formattedDate = format(selectedDate, "yyyy-MM-dd");
        onChange(formattedDate);
      }
      setIsOpen(false);
    }
  };

  const displayValue = value && typeof value === 'string' ? format(new Date(value), showTime ? "PPP p" : "PPP") : "";

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className={cn(
            "w-full justify-start text-left font-normal",
            !value && "text-muted-foreground",
            error && "border-destructive ring-destructive/20",
            className
          )}
          aria-invalid={error}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {displayValue || placeholder}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <Calendar
          mode="single"
          selected={value && typeof value === 'string' ? new Date(value) : undefined}
          onSelect={handleDateSelect}
          disabled={(date) => {
            if (minDate && date < new Date(minDate)) return true;
            if (maxDate && date > new Date(maxDate)) return true;
            return false;
          }}
          initialFocus
        />
      </PopoverContent>
    </Popover>
  );
}
