import { ControllerRenderProps } from "react-hook-form";
import { FormData } from "@/components/form-builder/form-editor";
import React from "react";

export type BaseFieldConfig = {
  name: string;
  label: string;
  placeholder?: string;
  required?: boolean;
  requiredMessage?: string;
  className?: string;
  customValidation?: (
    value: string | number
  ) => string | boolean | Promise<string | boolean>;
  customValidationMessage?: string;
  disableError?: boolean;
  disableErrorMessage?: boolean;
  renderComponent?: (props: {
    field: ControllerRenderProps<FormData, keyof FormData>;
    fieldState: {
      error?: {
        message?: string;
      };
      invalid: boolean;
      isDirty: boolean;
      isTouched: boolean;
    };
    fieldConfig: FieldConfig;
  }) => React.ReactNode;
};

export type TextFieldConfig = BaseFieldConfig & {
  type: "text";
  maxlength?: number;
  maxlengthMessage?: string;
  defaultValue?: string;
  regex?: RegExp;
  regexMessage?: string;
};

export type TextAreaFieldConfig = BaseFieldConfig & {
  type: "textarea";
  maxlength?: number;
  maxlengthMessage?: string;
  defaultValue?: string;
  regex?: RegExp;
  regexMessage?: string;
};

export type EmailFieldConfig = BaseFieldConfig & {
  type: "email";
  defaultValue?: string;
  regex?: RegExp;
  regexMessage?: string;
};

export type NumberFieldConfig = BaseFieldConfig & {
  type: "number";
  min?: number;
  max?: number;
  defaultValue?: number;
  minMessage?: string;
  maxMessage?: string;
};

export type PasswordFieldConfig = BaseFieldConfig & {
  type: "password";
  maxlength?: number;
  maxlengthMessage?: string;
  defaultValue?: string;
  regex?: RegExp;
  regexMessage?: string;
  defaultShowPassword?: boolean;
};

export type UrlFieldConfig = BaseFieldConfig & {
  type: "url";
  maxlength?: number;
  maxlengthMessage?: string;
  defaultValue?: string;
  regex?: RegExp;
  regexMessage?: string;
};

export type SelectOption = {
  value: string;
  label: string;
  disabled?: boolean;
};

export type SelectFieldConfig = BaseFieldConfig & {
  type: "select";
  options: SelectOption[];
  clearable?: boolean;
  defaultValue?: string;
};

export type MultiSelectFieldConfig = BaseFieldConfig & {
  type: "multi-select";
  options: SelectOption[];
  searchable?: boolean;
  maxSelections?: number;
  defaultValue?: string[];
};

export type SearchableSelectFieldConfig = BaseFieldConfig & {
  type: "searchable-select";
  options: SelectOption[];
  clearable?: boolean;
  defaultValue?: string;
};

export type CheckboxFieldConfig = BaseFieldConfig & {
  type: "checkbox";
  checkedValue?: string | number | boolean;
  uncheckedValue?: string | number | boolean;
  labelPosition?: "left" | "right";
  defaultValue?: boolean | string | number;
};

export type DateFieldConfig = BaseFieldConfig & {
  type: "date";
  minDate?: string;
  maxDate?: string;
  showTime?: boolean;
  defaultValue?: string;
};

export type FileFieldConfig = BaseFieldConfig & {
  type: "file";
  accept?: string;
  multiple?: boolean;
  maxSize?: number;
  maxFiles?: number;
  defaultValue?: File | File[] | null;
};

export type FieldConfig =
  | TextFieldConfig
  | EmailFieldConfig
  | NumberFieldConfig
  | TextAreaFieldConfig
  | PasswordFieldConfig
  | UrlFieldConfig
  | SelectFieldConfig
  | MultiSelectFieldConfig
  | SearchableSelectFieldConfig
  | CheckboxFieldConfig
  | DateFieldConfig
  | FileFieldConfig;
