import React, { forwardRef, useImperativeHandle } from "react";
import { useForm, UseFormReturn } from "react-hook-form";
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
import { defaultFields as fields } from "@/data/default-form";
import { FieldConfig } from "@/types/fields-type";

const validateOn:
  | "onChange"
  | "onBlur"
  | "onSubmit"
  | "onTouched"
  | "all"
  | undefined = "onBlur";

const baseClass = "w-full";

export type FormData = Record<string, any>;

export interface FormEditorRef {
  form: UseFormReturn<FormData>;
  submit: () => void;
  reset: () => void;
  getValues: () => FormData;
  setValue: (name: keyof FormData, value: unknown) => void;
  clearErrors: () => void;
}

interface FormEditorProps {
  fields: FieldConfig[];
  labelPosition?: "left" | "top";
  className?: string;
  formClassName?: string;
  showButtons?: boolean;
  onSubmit?: (data: FormData) => void;
  onReset?: () => void;
  submitButtonText?: string;
  resetButtonText?: string;
  children?: React.ReactNode;
}

const SimpleFormBuilder = forwardRef<FormEditorRef, FormEditorProps>(
  (
    {
      fields,
      labelPosition = "left",
      className = "",
      formClassName = "",
      showButtons = true,
      onSubmit,
      onReset,
      submitButtonText = "Submit",
      resetButtonText = "Reset Form",
      children,
    },
    ref
  ) => {
    const schemaShape: Record<string, yup.AnySchema> = {};

    fields.forEach((field) => {
      let validator: yup.AnySchema;

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
          if (
            field.checkedValue !== undefined &&
            field.uncheckedValue !== undefined
          ) {
            // Custom values - validate against the checked value
            validator = yup
              .mixed()
              .oneOf([field.checkedValue, field.uncheckedValue]);
            if (field.required) {
              validator = validator.oneOf(
                [field.checkedValue],
                field.requiredMessage || `${field.label} is required`
              );
            }
          } else {
            // Default boolean validation
            validator = yup.boolean();
            if (field.required) {
              validator = validator.oneOf(
                [true],
                field.requiredMessage || `${field.label} is required`
              );
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
              "min-date",
              `${field.label} must be on or after ${field.minDate}`,
              function (value) {
                if (!value) return true; // Allow empty values
                return new Date(value) >= new Date(field.minDate!);
              }
            );
          }
          if (field.maxDate) {
            validator = (validator as yup.StringSchema).test(
              "max-date",
              `${field.label} must be on or before ${field.maxDate}`,
              function (value) {
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
            } catch {
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
              defaultValues[field.name] =
                field.defaultValue ?? field.uncheckedValue;
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

    const schema = yup
      .object()
      .shape(schemaShape) as yup.ObjectSchema<FormData>;

    const form = useForm<FormData>({
      resolver: yupResolver(schema),
      defaultValues: generateDefaultValues(),
      mode: validateOn, // Changed to onChange for real-time validation
    });

    useImperativeHandle(ref, () => ({
      form,
      submit: () => form.handleSubmit(handleSubmit)(),
      reset: () => {
        form.reset(generateDefaultValues());
        form.clearErrors();
        onReset?.();
      },
      getValues: () => form.getValues(),
       setValue: (name: keyof FormData, value: unknown) =>
         form.setValue(name, value),
      clearErrors: () => form.clearErrors(),
    }));

    const handleReset = () => {
      if (
        window.confirm(
          "Are you sure you want to reset the form? All changes will be lost."
        )
      ) {
        form.reset(generateDefaultValues());
        form.clearErrors();
        // Call custom onReset if provided
        onReset?.();
      }
    };

    const handleSubmit = (data: FormData) => {
      if (onSubmit) {
        onSubmit(data);
      } else {
        console.log("Form submitted:", data);
      }
    };

    return (
      <div className={className}>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            noValidate
            className={`space-y-6 ${formClassName}`}
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
                    <FormItem
                      className={
                        labelPosition === "left"
                          ? "flex gap-5 items-start"
                          : "space-y-2"
                      }
                    >
                      <FormLabel
                        htmlFor={name}
                        className={`text-sm font-medium text-gray-700 ${
                          labelPosition === "left" ? "min-w-[200px] pt-2" : ""
                        }`}
                      >
                        {label}{" "}
                        {required && <span className="text-red-500">*</span>}
                      </FormLabel>
                      <div className={labelPosition === "left" ? "flex-1" : ""}>
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
                                    defaultShowPassword={
                                      field.defaultShowPassword
                                    }
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
                        {!field.disableErrorMessage &&
                          !field.renderComponent && <FormMessage />}
                      </div>
                    </FormItem>
                  )}
                />
              );
            })}
            {showButtons && (
              <div className="flex justify-center gap-4 pt-6 border-t border-gray-200">
                <Button type="submit" className="px-8">
                  {submitButtonText}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleReset}
                  className="px-8"
                >
                  {resetButtonText}
                </Button>
              </div>
            )}
            {children}
          </form>
        </Form>
      </div>
    );
  }
);

SimpleFormBuilder.displayName = "SimpleFormBuilder";

export default SimpleFormBuilder;
