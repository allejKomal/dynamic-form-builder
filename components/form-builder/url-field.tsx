import React, { useState } from "react";
import { Input } from "../ui/input";
import { ControllerRenderProps } from "react-hook-form";
import type { FormData } from "./form-editor";

interface UrlFieldProps {
  field: ControllerRenderProps<FormData, keyof FormData>;
  id: string;
  required?: boolean;
  className: string;
  placeholder?: string;
  error?: boolean;
  maxLength?: number;
}

// Enhanced URL validation regex
const URL_REGEX =
  /^https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)$/;

export function UrlField({
  field,
  id,
  required,
  className,
  placeholder,
  error,
  maxLength,
}: UrlFieldProps) {
  const { onChange, onBlur, value, name } = field;
  const [localError, setLocalError] = useState<string | null>(null);
  const [isValidating, setIsValidating] = useState(false);

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

    if (!URL_REGEX.test(val)) {
      return "Please enter a valid URL (must start with http:// or https://)";
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

  const handleBlur = async (e: React.FocusEvent<HTMLInputElement>) => {
    const urlValue = e.target.value.trim();

    if (urlValue) {
      setIsValidating(true);

      // Basic validation first
      const basicError = validateValue(urlValue);
      if (basicError) {
        setLocalError(basicError);
        setIsValidating(false);
        onBlur();
        return;
      }

      // Simulate async validation (e.g., checking if URL is accessible)
      try {
        // In a real app, you might make an actual request here
        await new Promise((resolve) => setTimeout(resolve, 500));

        // Additional custom validation
        if (urlValue.includes("localhost") || urlValue.includes("127.0.0.1")) {
          setLocalError("Please enter a public URL, not a localhost address");
        } else {
          setLocalError(null);
        }
        } catch {
          setLocalError(
            "Unable to validate URL. Please check if it's accessible."
          );
      } finally {
        setIsValidating(false);
      }
    } else {
      setLocalError(null);
    }

    onBlur();
  };

  const showError = error || localError;

  return (
    <div className="space-y-1">
      <div className="relative">
        <Input
          id={id}
          type="url"
          onChange={handleChange}
          onBlur={handleBlur}
          value={value}
          name={name as string}
          className={`${className} ${
            showError ? "border-destructive ring-destructive/20" : ""
          }`}
          placeholder={placeholder}
          maxLength={maxLength}
          aria-invalid={Boolean(showError)}
          aria-describedby={showError ? `${id}-error` : undefined}
        />
        {isValidating && (
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary"></div>
          </div>
        )}
      </div>
    </div>
  );
}
