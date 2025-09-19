// NumberInput.tsx
import React, { useState } from "react";
import { Input } from "../ui/input";
import { ControllerRenderProps } from "react-hook-form";
import type { FormData } from "./form-editor";

interface NumberInputProps {
  field: ControllerRenderProps<FormData, keyof FormData>;
  id: string;
  min?: number;
  max?: number;
  required?: boolean;
  className: string;
  error?: boolean;
  step?: number;
}

export function NumberInput({
  field,
  id,
  min,
  max,
  required,
  className,
  error,
  step
}: NumberInputProps) {
  const { onChange, onBlur, value, name } = field;
  const [localError, setLocalError] = useState<string | null>(null);

  const validateValue = (val: string | number): string | null => {
    const numValue = typeof val === 'string' ? parseFloat(val) : val;
    
    if (val === '' || val === null || val === undefined) {
      if (required) {
        return "This field is required";
      }
      return null;
    }

    if (isNaN(numValue)) {
      return "Please enter a valid number";
    }

    if (min !== undefined && numValue < min) {
      return `Value must be at least ${min}`;
    }

    if (max !== undefined && numValue > max) {
      return `Value must be no more than ${max}`;
    }

    return null;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    onChange(newValue);
    
    // Clear local error when user starts typing
    if (localError) {
      setLocalError(null);
    }
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    const validationError = validateValue(e.target.value);
    setLocalError(validationError);
    onBlur(e);
  };

  const showError = error || localError;
  const errorMessage = localError || (error ? "Invalid number" : "");

  return (
    <div className="space-y-1">
      <Input
        id={id}
        type="number"
        min={min}
        max={max}
        step={step}
        onChange={handleChange}
        onBlur={handleBlur}
        value={value}
        name={name as string}
        className={`${className} ${showError ? 'border-destructive ring-destructive/20' : ''}`}
        aria-invalid={showError}
        aria-describedby={showError ? `${id}-error` : undefined}
      />
      {showError && (
        <p id={`${id}-error`} className="text-sm text-destructive">
          {errorMessage}
        </p>
      )}
    </div>
  );
}
