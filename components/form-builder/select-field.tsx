import React, { useState } from "react";
import { ControllerRenderProps } from "react-hook-form";
import { cn } from "@/lib/utils";
import type { FormData } from "./form-editor";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";

interface SelectOption {
  value: string;
  label: string;
  disabled?: boolean;
}

interface SelectFieldProps {
  field: ControllerRenderProps<FormData, keyof FormData>;
  id: string;
  required?: boolean;
  className: string;
  placeholder?: string;
  error?: boolean;
  options: SelectOption[];
  clearable?: boolean;
}

export function SelectField({
  field,
  id,
  required,
  className,
  placeholder,
  error,
  options,
  clearable = false,
}: SelectFieldProps) {
  const { onChange, onBlur, value } = field;
  const [localError, setLocalError] = useState<string | null>(null);

  const handleValueChange = (newValue: string) => {
    // Handle clear selection special value
    const actualValue = newValue === "__clear__" ? "" : newValue;
    onChange(actualValue);

    // Clear local error when user makes a selection
    if (localError) {
      setLocalError(null);
    }
  };

  const handleBlur = () => {
    // Only validate on blur if field is required and no value is selected
    if (required && (!value || value === "")) {
      setLocalError("Please select an option");
    } else {
      setLocalError(null);
    }
    onBlur();
  };

  const showError = error || localError;

  return (
    <div className="space-y-1">
      <Select
        value={typeof value === 'string' ? value : undefined}
        onValueChange={handleValueChange}
        onOpenChange={(open) => {
          if (!open) {
            handleBlur();
          }
        }}
      >
        <SelectTrigger
          className={cn(
            className,
            showError && "border-destructive ring-destructive/20"
          )}
          aria-invalid={Boolean(showError)}
          aria-describedby={showError ? `${id}-error` : undefined}
        >
          <SelectValue placeholder={placeholder || "Select an option..."} />
        </SelectTrigger>
        <SelectContent>
          {clearable && (
            <SelectItem value="__clear__">
              <span className="text-muted-foreground">Clear selection</span>
            </SelectItem>
          )}
          {options.map((option) => (
            <SelectItem
              key={option.value}
              value={option.value}
              disabled={option.disabled}
            >
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
