import React from "react";
import { ControllerRenderProps } from "react-hook-form";
import { cn } from "@/lib/utils";
import type { FormData } from "./form-editor";
import { Checkbox } from "../ui/checkbox";
import { Label } from "../ui/label";

interface CheckboxFieldProps {
  field: ControllerRenderProps<FormData, keyof FormData>;
  id: string;
  required?: boolean;
  className: string;
  error?: boolean;
  checkedValue?: string | number | boolean;
  uncheckedValue?: string | number | boolean;
  labelPosition?: "left" | "right";
  label?: string;
}

export function CheckboxField({
  field,
  id,
  required,
  className,
  error,
  checkedValue = true,
  uncheckedValue = false,
  labelPosition = "right",
  label,
}: CheckboxFieldProps) {
  const { onChange, onBlur, value, name } = field;

  const handleCheckedChange = (checked: boolean) => {
    onChange(checked ? checkedValue : uncheckedValue);
  };

  const isChecked = Boolean(value === checkedValue);

  return (
    <div className={cn("flex items-center space-x-2", className)}>
      {label && labelPosition === "left" && (
        <Label htmlFor={id} className="text-sm font-medium">
          {label} {required && "*"}
        </Label>
      )}
      <Checkbox
        id={id}
        name={name as string}
        checked={isChecked}
        onCheckedChange={handleCheckedChange}
        onBlur={onBlur}
        required={required}
        className={cn(
          error && "border-destructive ring-destructive/20"
        )}
        aria-invalid={error}
      />
      {label && labelPosition === "right" && (
        <Label htmlFor={id} className="text-sm font-medium">
          {label} {required && "*"}
        </Label>
      )}
    </div>
  );
}
