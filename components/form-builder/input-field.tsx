// TextInput.tsx
import React, { useState } from "react";
import { Input } from "../ui/input";
import { ControllerRenderProps } from "react-hook-form";
import type { FormData } from "./form-editor";

interface TextInputProps {
  field: ControllerRenderProps<FormData, keyof FormData>;
  id: string;
  required?: boolean;
  className: string;
  maxLength?: number;
  placeholder?: string;
  error?: boolean;
  type?: string;
  regex?: RegExp;
  regexMessage?: string;
}

export function TextInput({
  field,
  id,
  required,
  className,
  maxLength,
  placeholder,
  error,
  type = "text",
  regex,
  regexMessage,
}: TextInputProps) {
  const { onChange, onBlur, value, name } = field;
  const [localError, setLocalError] = useState<string | null>(null);

  const validateValue = (val: string): string | null => {
    if (val === "" || val === null || val === undefined) {
      if (required) {
        return "This field is required";
      }
      return null;
    }

    if (maxLength && val.length > maxLength) {
      return `Maximum length is ${maxLength} characters`;
    }

    if (regex && !regex.test(val)) {
      return regexMessage || "Invalid format";
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
    onBlur();
  };

  const showError = error || localError;

  return (
    <div className="space-y-1">
      <Input
        id={id}
        type={type}
        onChange={handleChange}
        onBlur={handleBlur}
        value={typeof value === 'string' ? value : ""}
        name={name as string}
        className={`${className} ${
          showError ? "border-destructive ring-destructive/20" : ""
        }`}
        maxLength={maxLength}
        placeholder={placeholder}
        aria-invalid={Boolean(showError)}
        aria-describedby={showError ? `${id}-error` : undefined}
      />
    </div>
  );
}
