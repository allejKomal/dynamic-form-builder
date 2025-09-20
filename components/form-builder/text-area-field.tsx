// TextAreaInput.tsx
import React, { useState } from "react";
import { ControllerRenderProps } from "react-hook-form";
import type { FormData } from "./form-editor";
import { Textarea } from "../ui/textarea";

interface TextAreaInputProps {
  field: ControllerRenderProps<FormData, keyof FormData>;
  id: string;
  required?: boolean;
  className: string;
  maxLength?: number;
  placeholder?: string;
  error?: boolean;
  rows?: number;
  regex?: RegExp;
  regexMessage?: string;
}

export function TextAreaInput({
  field,
  id,
  required,
  className,
  maxLength,
  placeholder,
  error,
  rows,
  regex,
  regexMessage,
}: TextAreaInputProps) {
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

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newValue = e.target.value;
    onChange(newValue);

    // Clear local error when user starts typing
    if (localError) {
      setLocalError(null);
    }
  };

  const handleBlur = (e: React.FocusEvent<HTMLTextAreaElement>) => {
    const validationError = validateValue(e.target.value);
    setLocalError(validationError);
    onBlur();
  };

  const showError = error || localError;

  return (
    <div className="space-y-1">
      <Textarea
        id={id}
        onChange={handleChange}
        onBlur={handleBlur}
        value={typeof value === 'string' ? value : ""}
        name={name as string}
        className={`${className} ${
          showError ? "border-destructive ring-destructive/20" : ""
        }`}
        maxLength={maxLength}
        placeholder={placeholder}
        rows={rows}
        aria-invalid={Boolean(showError)}
        aria-describedby={showError ? `${id}-error` : undefined}
      />
    </div>
  );
}
