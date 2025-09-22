import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useCallback, useMemo } from "react";
import { FieldConfig } from "@/types/fields-type";

export type FormData = Record<
  string,
  | string
  | number
  | boolean
  | string[]
  | number[]
  | boolean[]
  | File
  | File[]
  | null
  | undefined
>;

interface UseFormStateOptions {
  fields: FieldConfig[];
  onSubmit?: (data: FormData) => void;
  onReset?: () => void;
  validationMode?: "onChange" | "onBlur" | "onSubmit" | "onTouched" | "all";
  initialValues?: FormData;
}

export function useFormState({
  fields,
  onSubmit,
  onReset,
  validationMode = "all",
  initialValues,
}: UseFormStateOptions) {
  // Generate validation schema
  const schema = useMemo(() => {
    const schemaShape: Record<string, yup.Schema<unknown>> = {};

    fields.forEach((field) => {
      let validator: yup.Schema<unknown>;

      if (field.disableError) {
        validator = yup.mixed();
        schemaShape[field.name] = validator;
        return;
      }

      // Basic validation logic (simplified version of the original)
      switch (field.type) {
        case "email":
          validator = yup
            .string()
            .email(`${field.label} must be a valid email address`);
          break;
        case "text":
        case "textarea":
        case "password":
          validator = yup.string();
          break;
        case "url":
          validator = yup.string().url(`${field.label} must be a valid URL`);
          break;
        case "select":
        case "searchable-select":
          validator = yup.string();
          break;
        case "multi-select":
          validator = yup.array().of(yup.string());
          break;
        case "checkbox":
          validator = yup.boolean();
          break;
        case "date":
          validator = yup.string();
          break;
        case "file":
          if (field.multiple) {
            validator = yup.array().of(yup.mixed());
          } else {
            validator = yup.mixed().nullable();
          }
          break;
        case "number":
          validator = yup.number().typeError(`${field.label} must be a number`);
          break;
        case "array":
          validator = yup.array();
          break;
        default:
          validator = yup.mixed();
      }

      // Add required validation
      if (field.required) {
        validator = validator.required(
          field.requiredMessage || `${field.label} is required`
        );
      }

      // Add custom validation
      if (field.customValidation) {
        validator = validator.test(
          "custom-validation",
          field.customValidationMessage || `${field.label} is invalid`,
          async function (value) {
            try {
              const result = await field.customValidation!(
                value as
                  | string
                  | number
                  | boolean
                  | string[]
                  | number[]
                  | boolean[]
                  | File
                  | File[]
                  | null
                  | undefined
              );
              return result === true || result === "";
            } catch {
              return false;
            }
          }
        );
      }

      schemaShape[field.name] = validator;
    });

    return yup.object().shape(schemaShape) as yup.ObjectSchema<FormData>;
  }, [fields]);

  // Generate default values
  const defaultValues = useMemo(() => {
    if (initialValues) return initialValues;

    const values: FormData = {};
    fields.forEach((field) => {
      switch (field.type) {
        case "text":
        case "textarea":
        case "email":
        case "password":
        case "url":
        case "date":
          values[field.name] = field.defaultValue || "";
          break;
        case "select":
        case "searchable-select":
          values[field.name] = field.defaultValue || "";
          break;
        case "multi-select":
          values[field.name] = field.defaultValue || [];
          break;
        case "checkbox":
          values[field.name] = field.defaultValue ?? false;
          break;
        case "file":
          values[field.name] =
            field.defaultValue || (field.multiple ? [] : null);
          break;
        case "number":
          values[field.name] = field.defaultValue ?? undefined;
          break;
        case "array":
          values[field.name] =
            (field.defaultValue as string[] | number[] | boolean[]) || [];
          break;
      }
    });
    return values;
  }, [fields, initialValues]);

  const form = useForm<FormData>({
    resolver: yupResolver(schema),
    defaultValues,
    mode: validationMode,
  });

  const handleSubmit = useCallback(
    (data: FormData) => {
      onSubmit?.(data);
    },
    [onSubmit]
  );

  const handleReset = useCallback(() => {
    form.reset(defaultValues);
    form.clearErrors();
    onReset?.();
  }, [form, defaultValues, onReset]);

  return {
    form,
    handleSubmit,
    handleReset,
    values: form.watch(),
    isValid: form.formState.isValid,
    isSubmitting: form.formState.isSubmitting,
    isDirty: form.formState.isDirty,
    errors: form.formState.errors,
  };
}
