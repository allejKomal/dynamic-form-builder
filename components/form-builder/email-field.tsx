// EmailInput.tsx
import React, { useState } from "react";
import { Input } from "../ui/input";
import { ControllerRenderProps } from "react-hook-form";
import type { FormData } from "./form-editor";

interface EmailInputProps {
  field: ControllerRenderProps<FormData, keyof FormData>;
  id: string;
  required?: boolean;
  className: string;
  placeholder?: string;
  error?: boolean;
}

// Enhanced email validation regex
const EMAIL_REGEX = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;

export function EmailInput({
  field,
  id,
  required,
  className,
  placeholder,
  error,
}: EmailInputProps) {
  const { onChange, onBlur, value, name } = field;
  const [isValidating, setIsValidating] = useState(false);
  const [localError, setLocalError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    onChange(newValue);
    
    // Clear local error when user starts typing
    if (localError) {
      setLocalError(null);
    }
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    const emailValue = e.target.value.trim();
    
    if (emailValue && !EMAIL_REGEX.test(emailValue)) {
      setLocalError("Please enter a valid email address");
    } else {
      setLocalError(null);
    }
    
    onBlur(e);
  };

  const showError = error || localError;
  const errorMessage = localError || (error ? "Invalid email format" : "");

  return (
    <div className="space-y-1">
      <Input
        id={id}
        type="email"
        onChange={handleChange}
        onBlur={handleBlur}
        value={value}
        name={name as string}
        className={`${className} ${showError ? 'border-destructive ring-destructive/20' : ''}`}
        placeholder={placeholder}
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
