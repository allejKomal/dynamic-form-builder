import React from "react";
import { useForm, ControllerRenderProps } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Button } from "../ui/button";
import { TextInput } from "./input-field";
import { EmailInput } from "./email-field";
import { NumberInput } from "./number-field";
import { TextAreaInput } from "./text-area-field";
import { PasswordField } from "./password-field";
import { UrlField } from "./url-field";
import { SelectField } from "./select-field";
import { MultiSelectField } from "./multi-select-field";
import { SearchableSelectField } from "./searchable-select-field";
import { CheckboxField } from "./checkbox-field";
import { DateField } from "./date-field";
import { FileField } from "./file-field";
import { cn } from "@/lib/utils";

const validateOn:
  | "onChange"
  | "onBlur"
  | "onSubmit"
  | "onTouched"
  | "all"
  | undefined = "onBlur";

const baseClass = "w-[300px]";

type BaseFieldConfig = {
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

type TextFieldConfig = BaseFieldConfig & {
  type: "text";
  maxlength?: number;
  maxlengthMessage?: string;
  defaultValue?: string;
  regex?: RegExp;
  regexMessage?: string;
};

type TextAreaFieldConfig = BaseFieldConfig & {
  type: "textarea";
  maxlength?: number;
  maxlengthMessage?: string;
  defaultValue?: string;
  regex?: RegExp;
  regexMessage?: string;
};

type EmailFieldConfig = BaseFieldConfig & {
  type: "email";
  defaultValue?: string;
  regex?: RegExp;
  regexMessage?: string;
};

type NumberFieldConfig = BaseFieldConfig & {
  type: "number";
  min?: number;
  max?: number;
  defaultValue?: number;
  minMessage?: string;
  maxMessage?: string;
};

type PasswordFieldConfig = BaseFieldConfig & {
  type: "password";
  maxlength?: number;
  maxlengthMessage?: string;
  defaultValue?: string;
  regex?: RegExp;
  regexMessage?: string;
  defaultShowPassword?: boolean;
};

type UrlFieldConfig = BaseFieldConfig & {
  type: "url";
  maxlength?: number;
  maxlengthMessage?: string;
  defaultValue?: string;
  regex?: RegExp;
  regexMessage?: string;
};

type SelectOption = {
  value: string;
  label: string;
  disabled?: boolean;
};

type SelectFieldConfig = BaseFieldConfig & {
  type: "select";
  options: SelectOption[];
  clearable?: boolean;
  defaultValue?: string;
};

type MultiSelectFieldConfig = BaseFieldConfig & {
  type: "multi-select";
  options: SelectOption[];
  searchable?: boolean;
  maxSelections?: number;
  defaultValue?: string[];
};

type SearchableSelectFieldConfig = BaseFieldConfig & {
  type: "searchable-select";
  options: SelectOption[];
  clearable?: boolean;
  defaultValue?: string;
};

type CheckboxFieldConfig = BaseFieldConfig & {
  type: "checkbox";
  checkedValue?: string | number | boolean;
  uncheckedValue?: string | number | boolean;
  labelPosition?: "left" | "right";
  defaultValue?: boolean | string | number;
};

type DateFieldConfig = BaseFieldConfig & {
  type: "date";
  minDate?: string;
  maxDate?: string;
  showTime?: boolean;
  defaultValue?: string;
};

type FileFieldConfig = BaseFieldConfig & {
  type: "file";
  accept?: string;
  multiple?: boolean;
  maxSize?: number;
  maxFiles?: number;
  defaultValue?: File | File[] | null;
};

type FieldConfig =
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

const fields: readonly FieldConfig[] = [
  {
    name: "email",
    label: "Email",
    type: "email",
    required: true,
    placeholder: "Enter your email address",
    defaultValue: "test@test.com",
    requiredMessage: "Email address is required",
  },
  {
    name: "username",
    label: "Username",
    type: "text",
    required: true,
    maxlength: 10,
    placeholder: "Enter username (max 10 characters)",
    regex: /^[a-zA-Z0-9_]+$/,
    requiredMessage: "Please provide a username",
    maxlengthMessage: "Username cannot exceed 10 characters",
    regexMessage: "Username can only contain letters, numbers, and underscores",
  },
  {
    name: "phone",
    label: "Phone Number",
    type: "text",
    required: true,
    placeholder: "Enter phone number (e.g., +1234567890)",
    regex: /^\+?[\d\s\-\(\)]+$/,
    requiredMessage: "Phone number is mandatory",
    regexMessage: "Please enter a valid phone number format",
  },
  {
    name: "quantity",
    label: "Quantity",
    type: "number",
    required: true,
    min: 1,
    max: 100,
    requiredMessage: "Quantity is required",
    minMessage: "Minimum quantity is 1",
    maxMessage: "Maximum quantity is 100",
  },
  {
    name: "quantityarea",
    label: "Description",
    type: "textarea",
    required: true,
    maxlength: 200,
    placeholder: "Enter description (max 200 characters)",
    regex: /^[a-zA-Z0-9\s\.,!?\-]+$/,
    requiredMessage: "Description is required",
    maxlengthMessage: "Description must be 200 characters or less",
    regexMessage: "Description contains invalid characters",
  },
  {
    name: "age",
    label: "Age",
    type: "number",
    required: true,
    min: 18,
    max: 120,
    placeholder: "Enter your age",
    requiredMessage: "Age is required",
    minMessage: "You must be at least 18 years old",
    maxMessage: "Age cannot exceed 120 years",
    customValidation: (value: string | number) => {
      const numValue = typeof value === "string" ? parseFloat(value) : value;
      if (isNaN(numValue)) return "Please enter a valid age";
      if (numValue < 0) return "Age cannot be negative";
      if (numValue < 18) return "You must be at least 18 years old to register";
      if (numValue > 120) return "Please enter a realistic age";
      if (numValue > 65) return "Senior discount available!";
      return true;
    },
    customValidationMessage: "Age validation failed",
  },
  {
    name: "website",
    label: "Website URL",
    type: "url",
    required: false,
    placeholder: "Enter your website URL (optional)",
    requiredMessage: "Website URL is required",
    customValidation: async (value: string | number) => {
      const strValue = String(value);
      if (!strValue) return true; // Optional field

      // Simulate async validation (e.g., checking if URL is accessible)
      return new Promise((resolve) => {
        setTimeout(() => {
          // Additional custom validation beyond basic URL format
          if (
            strValue.includes("localhost") ||
            strValue.includes("127.0.0.1")
          ) {
            resolve("Please enter a public URL, not a localhost address");
          } else {
            resolve(true);
          }
        }, 100);
      });
    },
    customValidationMessage: "URL validation failed",
  },
  {
    name: "portfolio",
    label: "Portfolio URL",
    type: "url",
    required: true,
    placeholder: "https://yourportfolio.com",
    requiredMessage: "Portfolio URL is required",
    maxlength: 200,
    maxlengthMessage: "Portfolio URL must be 200 characters or less",
  },
  {
    name: "country",
    label: "Country",
    type: "select",
    required: true,
    placeholder: "Select your country",
    requiredMessage: "Please select a country",
    options: [
      { value: "us", label: "United States" },
      { value: "ca", label: "Canada" },
      { value: "uk", label: "United Kingdom" },
      { value: "au", label: "Australia" },
      { value: "de", label: "Germany" },
      { value: "fr", label: "France" },
      { value: "jp", label: "Japan" },
      { value: "in", label: "India" },
    ],
    clearable: true,
  },
  {
    name: "skills",
    label: "Skills",
    type: "multi-select",
    required: false,
    placeholder: "Select your skills",
    searchable: true,
    maxSelections: 5,
    options: [
      { value: "javascript", label: "JavaScript" },
      { value: "typescript", label: "TypeScript" },
      { value: "react", label: "React" },
      { value: "vue", label: "Vue.js" },
      { value: "angular", label: "Angular" },
      { value: "node", label: "Node.js" },
      { value: "python", label: "Python" },
      { value: "java", label: "Java" },
      { value: "csharp", label: "C#" },
      { value: "php", label: "PHP" },
    ],
  },
  {
    name: "experience",
    label: "Experience Level",
    type: "searchable-select",
    required: true,
    placeholder: "Select your experience level",
    requiredMessage: "Please select your experience level",
    clearable: true,
    options: [
      { value: "junior", label: "Junior (0-2 years)" },
      { value: "mid", label: "Mid-level (2-5 years)" },
      { value: "senior", label: "Senior (5-10 years)" },
      { value: "lead", label: "Lead (10+ years)" },
    ],
  },
  {
    name: "terms",
    label: "I agree to the terms and conditions",
    type: "checkbox",
    required: true,
    requiredMessage: "You must agree to the terms and conditions",
    checkedValue: true,
    uncheckedValue: false,
    labelPosition: "right",
  },
  {
    name: "newsletter",
    label: "Subscribe to newsletter",
    type: "checkbox",
    required: false,
    checkedValue: "subscribed",
    uncheckedValue: "unsubscribed",
    labelPosition: "right",
    defaultValue: "unsubscribed",
  },
  {
    name: "birthDate",
    label: "Birth Date",
    type: "date",
    required: true,
    placeholder: "Select your birth date",
    requiredMessage: "Birth date is required",
    maxDate: new Date().toISOString().split("T")[0], // Today's date
  },
  {
    name: "appointmentTime",
    label: "Appointment Time",
    type: "date",
    required: false,
    placeholder: "Select appointment date and time",
    showTime: true,
    minDate: new Date().toISOString().split("T")[0], // Today's date
  },
  {
    name: "profilePicture",
    label: "Profile Picture",
    type: "file",
    required: false,
    accept: "image/*",
    maxSize: 5 * 1024 * 1024, // 5MB
  },
  {
    name: "documents",
    label: "Supporting Documents",
    type: "file",
    required: true,
    multiple: true,
    accept: ".pdf,.doc,.docx",
    maxFiles: 5,
    maxSize: 10 * 1024 * 1024, // 10MB
    requiredMessage: "Please upload at least one document",
  },
  {
    name: "notes",
    label: "Internal Notes",
    type: "textarea",
    required: false,
    placeholder: "Internal notes (no validation, no error messages)",
    disableError: true,
    disableErrorMessage: true,
  },
  {
    name: "comments",
    label: "Comments",
    type: "text",
    required: true,
    placeholder: "Comments (no validation, but shows red border on error)",
    disableError: false,
    disableErrorMessage: true,
  },
  {
    name: "customField",
    label: "Custom Field",
    type: "text",
    required: true,
    placeholder: "This field uses a custom render component",
    renderComponent: ({ field, fieldState, fieldConfig }) => (
      <div className="space-y-2">
        <input
          {...field}
          className={`w-full px-3 py-2 border rounded-md ${
            fieldState.invalid ? "border-red-500" : "border-gray-300"
          }`}
          placeholder={fieldConfig.placeholder}
        />
        {fieldState.invalid && fieldState.error && (
          <p className="text-red-500 text-sm">{fieldState.error.message}</p>
        )}
        <div className="text-xs text-gray-500">
          Custom rendered field with additional info
        </div>
      </div>
    ),
  },
  {
    name: "password",
    label: "Password",
    type: "password",
    required: true,
    placeholder: "Enter a strong password",
    requiredMessage: "Password is required",
    defaultShowPassword: true,
    customValidation: (value: string | number) => {
      const strValue = String(value);
      if (!strValue) return "Password is required";

      const hasUpperCase = /[A-Z]/.test(strValue);
      const hasLowerCase = /[a-z]/.test(strValue);
      const hasNumbers = /\d/.test(strValue);
      const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(strValue);
      const isLongEnough = strValue.length >= 8;

      if (!isLongEnough) return "Password must be at least 8 characters long";
      if (!hasUpperCase)
        return "Password must contain at least one uppercase letter";
      if (!hasLowerCase)
        return "Password must contain at least one lowercase letter";
      if (!hasNumbers) return "Password must contain at least one number";
      if (!hasSpecialChar)
        return "Password must contain at least one special character";

      return true;
    },
    customValidationMessage: "Password does not meet security requirements",
  },
];

export type FormData = Record<string, any>;

export default function SimpleFormBuilder() {
  const schemaShape: Record<string, yup.AnySchema> = {};

  fields.forEach((field) => {
    let validator: yup.AnySchema;

    // Skip validation if disableError is true
    if (field.disableError) {
      validator = yup.mixed();
      schemaShape[field.name] = validator;
      return;
    }

    switch (field.type) {
      case "email":
        validator = yup
          .string()
          .email(`${field.label} must be a valid email address`);
        if (field.required) {
          validator = validator.required(
            field.requiredMessage || `${field.label} is required`
          );
        }
        if (field.regex) {
          validator = (validator as yup.StringSchema).matches(
            field.regex,
            field.regexMessage || `${field.label} format is invalid`
          );
        }
        break;

      case "text":
        validator = yup.string();
        if (field.required) {
          validator = validator.required(
            field.requiredMessage || `${field.label} is required`
          );
        }
        if (field.maxlength) {
          validator = (validator as yup.StringSchema).max(
            field.maxlength,
            field.maxlengthMessage ||
            `${field.label} must be at most ${field.maxlength} characters`
          );
        }
        if (field.regex) {
          validator = (validator as yup.StringSchema).matches(
            field.regex,
            field.regexMessage || `${field.label} format is invalid`
          );
        }
        break;

      case "textarea":
        validator = yup.string();
        if (field.required) {
          validator = validator.required(
            field.requiredMessage || `${field.label} is required`
          );
        }
        if (field.maxlength) {
          validator = (validator as yup.StringSchema).max(
            field.maxlength,
            field.maxlengthMessage ||
              `${field.label} must be at most ${field.maxlength} characters`
          );
        }
        if (field.regex) {
          validator = (validator as yup.StringSchema).matches(
            field.regex,
            field.regexMessage || `${field.label} format is invalid`
          );
        }
        break;

      case "password":
        validator = yup.string();
        if (field.required) {
          validator = validator.required(
            field.requiredMessage || `${field.label} is required`
          );
        }
        if (field.maxlength) {
          validator = (validator as yup.StringSchema).max(
            field.maxlength,
            field.maxlengthMessage ||
              `${field.label} must be at most ${field.maxlength} characters`
          );
        }
        if (field.regex) {
          validator = (validator as yup.StringSchema).matches(
            field.regex,
            field.regexMessage || `${field.label} format is invalid`
          );
        }
        break;

      case "url":
        validator = yup.string().url(`${field.label} must be a valid URL`);
        if (field.required) {
          validator = validator.required(
            field.requiredMessage || `${field.label} is required`
          );
        }
        if (field.maxlength) {
          validator = (validator as yup.StringSchema).max(
            field.maxlength,
            field.maxlengthMessage ||
            `${field.label} must be at most ${field.maxlength} characters`
          );
        }
        if (field.regex) {
          validator = (validator as yup.StringSchema).matches(
            field.regex,
            field.regexMessage || `${field.label} format is invalid`
          );
        }
        break;

      case "select":
        validator = yup.string();
        if (field.required) {
          validator = validator.required(
            field.requiredMessage || `${field.label} is required`
          );
        }
        break;

      case "multi-select":
        validator = yup.array().of(yup.string());
        if (field.required) {
          validator = validator.required(
            field.requiredMessage || `${field.label} is required`
          );
        }
        break;

      case "searchable-select":
        validator = yup.string();
        if (field.required) {
          validator = validator.required(
            field.requiredMessage || `${field.label} is required`
          );
        }
        break;

      case "checkbox":
        // For checkbox fields, we need to handle custom values
        if (field.checkedValue !== undefined && field.uncheckedValue !== undefined) {
          // Custom values - validate against the checked value
          validator = yup.mixed().oneOf([field.checkedValue, field.uncheckedValue]);
          if (field.required) {
            validator = validator.oneOf([field.checkedValue], field.requiredMessage || `${field.label} is required`);
          }
        } else {
          // Default boolean validation
          validator = yup.boolean();
          if (field.required) {
            validator = validator.oneOf([true], field.requiredMessage || `${field.label} is required`);
          }
        }
        break;

      case "date":
        validator = yup.string();
        if (field.required) {
          validator = validator.required(
            field.requiredMessage || `${field.label} is required`
          );
        }
        if (field.minDate) {
          validator = (validator as yup.StringSchema).test(
            'min-date',
            `${field.label} must be on or after ${field.minDate}`,
            function(value) {
              if (!value) return true; // Allow empty values
              return new Date(value) >= new Date(field.minDate!);
            }
          );
        }
        if (field.maxDate) {
          validator = (validator as yup.StringSchema).test(
            'max-date',
            `${field.label} must be on or before ${field.maxDate}`,
            function(value) {
              if (!value) return true; // Allow empty values
              return new Date(value) <= new Date(field.maxDate!);
            }
          );
        }
        break;

      case "file":
        if (field.multiple) {
          validator = yup.array().of(yup.mixed());
        } else {
          validator = yup.mixed();
        }
        if (field.required) {
          validator = validator.required(
            field.requiredMessage || `${field.label} is required`
          );
        }
        break;

      case "number":
        validator = yup.number().typeError(`${field.label} must be a number`);
        if (field.required) {
          validator = validator.required(
            field.requiredMessage || `${field.label} is required`
          );
        }
        if (typeof field.min === "number") {
          validator = (validator as yup.NumberSchema).min(
            field.min,
            field.minMessage || `${field.label} must be at least ${field.min}`
          );
        }
        if (typeof field.max === "number") {
          validator = (validator as yup.NumberSchema).max(
            field.max,
            field.maxMessage || `${field.label} must be at most ${field.max}`
          );
        }
        break;

      default:
        validator = yup.mixed();
    }

    // Add custom validation if provided
    if (field.customValidation) {
      validator = validator.test(
        "custom-validation",
        field.customValidationMessage || `${field.label} is invalid`,
        async function (value) {
          try {
            const result = await field.customValidation!(value);
            return result === true || result === "";
          } catch (error) {
            return false;
          }
        }
      );
    }

    schemaShape[field.name] = validator;
  });

  const generateDefaultValues = () => {
    const defaultValues: FormData = {};

    fields.forEach((field) => {
      switch (field.type) {
        case "text":
        case "textarea":
        case "email":
        case "password":
        case "url":
        case "date":
          defaultValues[field.name] = field.defaultValue || "";
          break;
        case "select":
        case "searchable-select":
          defaultValues[field.name] = field.defaultValue || "";
          break;
        case "multi-select":
          defaultValues[field.name] = field.defaultValue || [];
          break;
        case "checkbox":
          // For checkbox fields with custom values, use uncheckedValue as default
          if (field.uncheckedValue !== undefined) {
            defaultValues[field.name] = field.defaultValue ?? field.uncheckedValue;
          } else {
            defaultValues[field.name] = field.defaultValue ?? false;
          }
          break;
        case "file":
          defaultValues[field.name] =
            field.defaultValue || (field.multiple ? [] : null);
          break;
        case "number":
          defaultValues[field.name] = field.defaultValue ?? 0;
          break;
      }
    });

    return defaultValues;
  };

  const schema = yup.object().shape(schemaShape) as yup.ObjectSchema<FormData>;

  const form = useForm<FormData>({
    resolver: yupResolver(schema),
    defaultValues: generateDefaultValues(),
    mode: validateOn, // Changed to onChange for real-time validation
  });

  const handleReset = () => {
    // Ask for confirmation before resetting
    if (window.confirm("Are you sure you want to reset the form? All changes will be lost.")) {
      // Clear all validation errors and reset to default values
      form.reset(generateDefaultValues());
      form.clearErrors();
    }
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit((data) => {
          console.log("Form submitted:", data);
        })}
        noValidate
        className="space-y-4"
      >
        {fields.map((field) => {
          const { name, label, type, required } = field;

          return (
            <FormField
              key={name}
              control={form.control}
              name={name as keyof FormData}
              // Remove rules prop to avoid conflicts with schema
              render={({ field: formField, fieldState }) => (
                <FormItem className="flex gap-5 items-start">
                  <FormLabel className="min-w-[100px]" htmlFor={name}>
                    {label} {required && "*"}
                  </FormLabel>
                  <div className="flex-1">
                    <FormControl>
                      <div key={name}>
                        {field.renderComponent ? (
                          field.renderComponent({
                            field: formField,
                            fieldState,
                            fieldConfig: field,
                          })
                        ) : (
                          <>
                        {type === "text" && (
                          <TextInput
                            id={name}
                            field={formField}
                                placeholder={field.placeholder}
                                maxLength={field.maxlength}
                                className={cn(baseClass, field.className)}
                                error={!!fieldState.error}
                          />
                        )}
                        {type === "email" && (
                          <EmailInput
                            id={name}
                            field={formField}
                                placeholder={field.placeholder}
                                className={cn(baseClass, field.className)}
                                error={!!fieldState.error}
                          />
                        )}
                        {type === "number" && (
                          <NumberInput
                            id={name}
                            field={formField}
                            min={field.min}
                            max={field.max}
                                className={cn(baseClass, field.className)}
                                error={!!fieldState.error}
                          />
                        )}
                        {type === "textarea" && (
                          <TextAreaInput
                            id={name}
                            field={formField}
                                placeholder={field.placeholder}
                                maxLength={field.maxlength}
                                className={cn(baseClass, field.className)}
                                error={!!fieldState.error}
                              />
                            )}
                            {type === "password" && (
                              <PasswordField
                                id={name}
                                field={formField}
                                placeholder={field.placeholder}
                                className={cn(baseClass, field.className)}
                                error={!!fieldState.error}
                                defaultShowPassword={field.defaultShowPassword}
                              />
                            )}
                            {type === "url" && (
                              <UrlField
                                id={name}
                                field={formField}
                                placeholder={field.placeholder}
                                className={cn(baseClass, field.className)}
                                error={!!fieldState.error}
                              />
                            )}
                        {type === "select" && (
                          <SelectField
                            id={name}
                            field={formField}
                            placeholder={field.placeholder}
                            className={cn(baseClass, field.className)}
                            error={!!fieldState.error}
                            options={field.options}
                            clearable={field.clearable}
                          />
                        )}
                        {type === "multi-select" && (
                          <MultiSelectField
                            id={name}
                            field={formField}
                            placeholder={field.placeholder}
                            className={cn(baseClass, field.className)}
                            error={!!fieldState.error}
                            options={field.options}
                            searchable={field.searchable}
                            maxSelections={field.maxSelections}
                          />
                        )}
                        {type === "searchable-select" && (
                          <SearchableSelectField
                            id={name}
                            field={formField}
                            placeholder={field.placeholder}
                            className={cn(baseClass, field.className)}
                            error={!!fieldState.error}
                            options={field.options}
                            clearable={field.clearable}
                          />
                        )}
                            {type === "checkbox" && (
                              <CheckboxField
                                id={name}
                                field={formField}
                                className={cn(baseClass, field.className)}
                                error={!!fieldState.error}
                                checkedValue={field.checkedValue}
                                uncheckedValue={field.uncheckedValue}
                                labelPosition={field.labelPosition}
                                label={label}
                              />
                            )}
                            {type === "date" && (
                              <DateField
                                id={name}
                                field={formField}
                                placeholder={field.placeholder}
                                className={cn(baseClass, field.className)}
                                error={!!fieldState.error}
                                minDate={field.minDate}
                                maxDate={field.maxDate}
                                showTime={field.showTime}
                              />
                            )}
                            {type === "file" && (
                              <FileField
                                id={name}
                                field={formField}
                                className={cn(baseClass, field.className)}
                                error={!!fieldState.error}
                                accept={field.accept}
                                multiple={field.multiple}
                                maxSize={field.maxSize}
                                maxFiles={field.maxFiles}
                              />
                            )}
                          </>
                        )}
                      </div>
                    </FormControl>
                    {!field.disableErrorMessage && !field.renderComponent && (
                    <FormMessage />
                    )}
                  </div>
                </FormItem>
              )}
            />
          );
        })}
        <div className="flex gap-2 pt-4 border-t">
          <Button type="submit">Submit</Button>
          <Button 
            type="button" 
            variant="outline" 
            onClick={handleReset}
            className="text-muted-foreground hover:text-foreground"
          >
            Reset Form
          </Button>
        </div>
      </form>
    </Form>
  );
}
