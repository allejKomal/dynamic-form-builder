"use client";

import React, { useState } from "react";
import { EyeIcon, EyeOffIcon, Check, X } from "lucide-react";
import { ControllerRenderProps } from "react-hook-form";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { FormData } from "./form-editor";
import { cn } from "@/lib/utils";

interface PasswordFieldProps {
  field: ControllerRenderProps<FormData, keyof FormData>;
  id: string;
  required?: boolean;
  className: string;
  placeholder?: string;
  error?: boolean;
  defaultShowPassword?: boolean;
}

interface PasswordRequirement {
  label: string;
  test: (password: string) => boolean;
}

const PASSWORD_REQUIREMENTS: PasswordRequirement[] = [
  { label: "At least 8 characters", test: (pwd) => pwd.length >= 8 },
  { label: "One uppercase letter", test: (pwd) => /[A-Z]/.test(pwd) },
  { label: "One lowercase letter", test: (pwd) => /[a-z]/.test(pwd) },
  { label: "One number", test: (pwd) => /\d/.test(pwd) },
  {
    label: "One special character",
    test: (pwd) => /[!@#$%^&*(),.?":{}|<>]/.test(pwd),
  },
];

export function PasswordField({
  field,
  id,
  required,
  className,
  placeholder,
  error,
  defaultShowPassword = false,
}: PasswordFieldProps) {
  const [showPassword, setShowPassword] = useState(defaultShowPassword);
  const [localError, setLocalError] = useState<string | null>(null);
  const { onChange, onBlur, value, name } = field;

  const validatePassword = (password: string): string | null => {
    if (!password) {
      if (required) {
        return "Password is required";
      }
      return null;
    }

    const failedRequirements = PASSWORD_REQUIREMENTS.filter(
      (req) => !req.test(password)
    );
    if (failedRequirements.length > 0) {
      return `Password must meet all requirements`;
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
    const validationError = validatePassword(e.target.value);
    setLocalError(validationError);
    onBlur();
  };

  const showError = error || localError;

  const getRequirementStatus = (requirement: PasswordRequirement) => {
    if (!value) return null;
    return requirement.test(value);
  };

  return (
    <div className="space-y-2">
      <div className="relative w-full">
        <Input
          id={id}
          type={showPassword ? "text" : "password"}
          placeholder={placeholder}
          onChange={handleChange}
          onBlur={handleBlur}
          value={value}
          name={name as string}
          className={cn(
            "pr-10 w-full",
            className,
            showError && "border-destructive ring-destructive/20"
          )}
          aria-invalid={Boolean(showError)}
          aria-describedby={showError ? `${id}-error` : undefined}
        />
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="absolute right-2 top-1/2 transform -translate-y-1/2 h-8 w-8 p-0 hover:bg-transparent"
          onClick={() => setShowPassword(!showPassword)}
          disabled={!value}
        >
          {showPassword ? (
            <EyeIcon className="h-4 w-4" aria-hidden="true" />
          ) : (
            <EyeOffIcon className="h-4 w-4" aria-hidden="true" />
          )}
          <span className="sr-only">
            {showPassword ? "Hide password" : "Show password"}
          </span>
        </Button>
      </div>

      {value && (
        <div className="space-y-1">
          <p className="text-sm font-medium text-gray-700">
            Password requirements:
          </p>
          <div className="space-y-1">
            {PASSWORD_REQUIREMENTS.map((requirement, index) => {
              const isValid = getRequirementStatus(requirement);
              return (
                <div
                  key={index}
                  className="flex items-center space-x-2 text-sm"
                >
                  {isValid ? (
                    <Check className="h-4 w-4 text-green-500" />
                  ) : (
                    <X className="h-4 w-4 text-gray-400" />
                  )}
                  <span
                    className={isValid ? "text-green-700" : "text-gray-500"}
                  >
                    {requirement.label}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
