import React, {
  forwardRef,
  useImperativeHandle,
  useState,
  useEffect,
} from "react";
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
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "../ui/sheet";
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
import { ArrayField } from "./array-field";
import { cn } from "@/lib/utils";
import { FieldConfig } from "@/types/fields-type";
import { generateDefaultValues } from "@/utils/generate-default";
import { Tabs, TabsContent, TabsTrigger, TabsList } from "../ui/tabs";
import { ResetDialog } from "../reset-dialog";
import { toast } from "sonner";

const baseClass = "w-full";

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

export interface FormEditorRef {
  form: UseFormReturn<FormData>;
  submit: () => void;
  reset: () => void;
  getValues: () => FormData;
  setValue: (
    name: keyof FormData,
    value:
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
  ) => void;
  clearErrors: () => void;
  getSchema: () => yup.ObjectSchema<FormData>;
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
  validateOn?: "onChange" | "onBlur" | "onSubmit" | "onTouched" | "all";
  showMetadata?: boolean;
  metadataOptions?: {
    showSchema?: boolean;
    showFieldConfig?: boolean;
    showFormState?: boolean;
    showCurrentValues?: boolean;
    showErrors?: boolean;
    showDirtyFields?: boolean;
    showTouchedFields?: boolean;
  };
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
      validateOn = "all",
      showMetadata = false,
      metadataOptions = {
        showSchema: true,
        showFieldConfig: true,
        showFormState: true,
        showCurrentValues: true,
        showErrors: true,
        showDirtyFields: true,
        showTouchedFields: true,
      },
    },
    ref
  ) => {
    const schemaShape: Record<string, yup.Schema<unknown>> = {};

    fields.forEach((field) => {
      let validator: yup.Schema<unknown>;

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
            validator = yup.mixed().nullable();
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
          } else {
            validator = validator.nullable();
          }
          // Apply min/max validation only if the value is not null/undefined
          if (typeof field.min === "number") {
            validator = (validator as yup.NumberSchema).test(
              "min",
              field.minMessage ||
                `${field.label} must be at least ${field.min}`,
              function (value) {
                if (value == null || value === undefined) return true; // Skip min validation for null/undefined
                // If custom validation exists, let it handle the validation
                if (field.customValidation) return true;
                return value >= field.min!;
              }
            );
          }
          if (typeof field.max === "number") {
            validator = (validator as yup.NumberSchema).test(
              "max",
              field.maxMessage || `${field.label} must be at most ${field.max}`,
              function (value) {
                if (value == null || value === undefined) return true; // Skip max validation for null/undefined
                // If custom validation exists, let it handle the validation
                if (field.customValidation) return true;
                return value <= field.max!;
              }
            );
          }
          break;

        case "array":
          validator = yup.array();
          if (field.required) {
            validator = validator.required(
              field.requiredMessage || `${field.label} is required`
            );
          }
          if (field.minItems !== undefined) {
            validator = (validator as yup.ArraySchema<unknown[], unknown>).min(
              field.minItems,
              field.minItemsMessage ||
                `${field.label} must have at least ${field.minItems} items`
            );
          }
          if (field.maxItems !== undefined) {
            validator = (validator as yup.ArraySchema<unknown[], unknown>).max(
              field.maxItems,
              field.maxItemsMessage ||
                `${field.label} must have at most ${field.maxItems} items`
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

    const schema = yup
      .object()
      .shape(schemaShape) as yup.ObjectSchema<FormData>;

    const form = useForm<FormData>({
      resolver: yupResolver(schema),
      defaultValues: generateDefaultValues(fields) as FormData,
      mode: validateOn,
    });

    // Metadata state for debugging/development
    const [formMetadata, setFormMetadata] = useState<{
      values: FormData;
      errors: Record<string, string | string[]>;
      dirtyFields: Record<string, boolean | boolean[]>;
      touchedFields: Record<string, boolean | boolean[]>;
      isValid: boolean;
      isDirty: boolean;
      isSubmitted: boolean;
      isValidating: boolean;
      submitCount: number;
      schema: { describe: () => unknown } | null;
    }>({
      values: {},
      errors: {},
      dirtyFields: {},
      touchedFields: {},
      isValid: false,
      isDirty: false,
      isSubmitted: false,
      isValidating: false,
      submitCount: 0,
      schema: null,
    });

    // Update metadata periodically when showMetadata is true
    useEffect(() => {
      if (!showMetadata) return;

      const interval = setInterval(() => {
        setFormMetadata({
          values: form.getValues(),
          errors: form.formState.errors as unknown as Record<
            string,
            string | string[]
          >,
          dirtyFields: form.formState.dirtyFields as Record<
            string,
            boolean | boolean[]
          >,
          touchedFields: form.formState.touchedFields as Record<
            string,
            boolean | boolean[]
          >,
          isValid: form.formState.isValid,
          isDirty: form.formState.isDirty,
          isSubmitted: form.formState.isSubmitted,
          isValidating: form.formState.isValidating,
          submitCount: form.formState.submitCount,
          schema: schema as { describe: () => unknown } | null,
        });
      }, 100);

      return () => clearInterval(interval);
    }, [showMetadata, form, schema]);

    useImperativeHandle(ref, () => ({
      form,
      submit: () => form.handleSubmit(handleSubmit)(),
      reset: () => {
        form.reset(generateDefaultValues(fields) as FormData);
        form.clearErrors();
        onReset?.();
      },
      getValues: () => form.getValues(),
      setValue: (
        name: keyof FormData,
        value:
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
      ) => form.setValue(name, value),
      clearErrors: () => form.clearErrors(),
      getSchema: () => schema,
    }));

    const handleReset = () => {
      const defaultValues = generateDefaultValues(fields) as FormData;
      // Reset form with default values and clear all errors
      form.reset(defaultValues, {
        keepDefaultValues: true,
        keepValues: false,
        keepDirty: false,
        keepIsSubmitted: false,
        keepIsValid: false,
        keepTouched: false,
        keepIsValidating: false,
        keepSubmitCount: false,
      });
      onReset?.();
    };

    const handleSubmit = (data: FormData) => {
      // First, manually validate array fields
      const arrayFields = fields.filter((field) => field.type === "array");
      arrayFields.forEach((field) => {
        const value = data[field.name];
        const arrayValue = Array.isArray(value) ? value : [];

        // Check minItems validation
        if (
          field.minItems !== undefined &&
          arrayValue.length < field.minItems
        ) {
          form.setError(field.name as keyof FormData, {
            type: "manual",
            message:
              field.minItemsMessage ||
              `${field.label} must have at least ${field.minItems} items`,
          });
        }

        // Check maxItems validation
        if (
          field.maxItems !== undefined &&
          arrayValue.length > field.maxItems
        ) {
          form.setError(field.name as keyof FormData, {
            type: "manual",
            message:
              field.maxItemsMessage ||
              `${field.label} must have at most ${field.maxItems} items`,
          });
        }

        // Check required validation
        if (field.required && arrayValue.length === 0) {
          form.setError(field.name as keyof FormData, {
            type: "manual",
            message: field.requiredMessage || `${field.label} is required`,
          });
        }
      });

      // Trigger validation for all fields to show errors
      const validationPromises = fields.map((field) =>
        form.trigger(field.name as keyof FormData)
      );

      Promise.all(validationPromises).then(() => {
        // Check if form is valid after validation
        const errors = form.formState.errors;
        const hasErrors = Object.keys(errors).length > 0;

        if (hasErrors) {
          // Form has validation errors, they should now be visible
          console.log("Form validation errors:", errors);
          return;
        }

        toast.success("Form submitted successfully");

        if (onSubmit) {
          onSubmit(data);
        } else {
          console.log("Form submitted:", data);
        }
      });
    };

    return (
      <>
        <Sheet>
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
                          className={cn(
                            labelPosition === "left"
                              ? "flex gap-5 items-start"
                              : "space-y-2",
                            className
                          )}
                        >
                          <FormLabel
                            htmlFor={name}
                            className={`text-sm font-medium text-gray-700 ${
                              labelPosition === "left"
                                ? "min-w-[200px] pt-2"
                                : ""
                            }`}
                          >
                            {label}{" "}
                            {required && (
                              <span className="text-red-500">*</span>
                            )}
                          </FormLabel>
                          <div
                            className={labelPosition === "left" ? "flex-1" : ""}
                          >
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
                                        className={cn(
                                          baseClass,
                                          field.className
                                        )}
                                        error={!!fieldState.error}
                                      />
                                    )}
                                    {type === "email" && (
                                      <EmailInput
                                        id={name}
                                        field={formField}
                                        placeholder={field.placeholder}
                                        className={cn(
                                          baseClass,
                                          field.className
                                        )}
                                        error={!!fieldState.error}
                                      />
                                    )}
                                    {type === "number" && (
                                      <NumberInput
                                        id={name}
                                        field={formField}
                                        min={field.min}
                                        max={field.max}
                                        placeholder={field.placeholder}
                                        className={cn(
                                          baseClass,
                                          field.className
                                        )}
                                        error={!!fieldState.error}
                                      />
                                    )}
                                    {type === "textarea" && (
                                      <TextAreaInput
                                        id={name}
                                        field={formField}
                                        placeholder={field.placeholder}
                                        maxLength={field.maxlength}
                                        className={cn(
                                          baseClass,
                                          field.className
                                        )}
                                        error={!!fieldState.error}
                                      />
                                    )}
                                    {type === "password" && (
                                      <PasswordField
                                        id={name}
                                        field={formField}
                                        placeholder={field.placeholder}
                                        className={cn(
                                          baseClass,
                                          field.className
                                        )}
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
                                        className={cn(
                                          baseClass,
                                          field.className
                                        )}
                                        error={!!fieldState.error}
                                      />
                                    )}
                                    {type === "select" && (
                                      <SelectField
                                        id={name}
                                        field={formField}
                                        required={required}
                                        placeholder={field.placeholder}
                                        className={cn(
                                          baseClass,
                                          field.className
                                        )}
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
                                        className={cn(
                                          baseClass,
                                          field.className
                                        )}
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
                                        className={cn(
                                          baseClass,
                                          field.className
                                        )}
                                        error={!!fieldState.error}
                                        options={field.options}
                                        clearable={field.clearable}
                                      />
                                    )}
                                    {type === "checkbox" && (
                                      <CheckboxField
                                        id={name}
                                        field={formField}
                                        className={cn(
                                          baseClass,
                                          field.className
                                        )}
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
                                        className={cn(
                                          baseClass,
                                          field.className
                                        )}
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
                                        className={cn(
                                          baseClass,
                                          field.className
                                        )}
                                        error={!!fieldState.error}
                                        accept={field.accept}
                                        multiple={field.multiple}
                                        maxSize={field.maxSize}
                                        maxFiles={field.maxFiles}
                                      />
                                    )}
                                    {type === "array" && (
                                      <ArrayField
                                        field={formField}
                                        fieldConfig={field}
                                        className={cn(
                                          baseClass,
                                          field.className
                                        )}
                                        error={!!fieldState.error}
                                        fieldState={fieldState}
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
                    <ResetDialog
                      onReset={handleReset}
                      buttonText={resetButtonText}
                    />
                    {showMetadata && (
                      <SheetTrigger asChild>
                        <Button
                          type="button"
                          variant="secondary"
                          className="px-8"
                        >
                          📊 Debug Info
                        </Button>
                      </SheetTrigger>
                    )}
                  </div>
                )}
                {children}
              </form>
            </Form>
          </div>

          {showMetadata && (
            <SheetContent
              side="right"
              className="min-w-[900px] px-4 flex flex-col h-full"
            >
              <SheetHeader className="flex-shrink-0">
                <SheetTitle>Form Metadata</SheetTitle>
                <SheetDescription>
                  Debug information about form state, validation, and schema
                </SheetDescription>
              </SheetHeader>

              <Tabs
                defaultValue="schema"
                className="flex-1 flex flex-col min-h-0"
              >
                <TabsList className="flex-shrink-0">
                  <TabsTrigger value="schema">Schema</TabsTrigger>
                  <TabsTrigger value="fieldConfig">Field Config</TabsTrigger>
                  <TabsTrigger value="formState">Form State</TabsTrigger>
                  <TabsTrigger value="currentValues">
                    Current Values
                  </TabsTrigger>
                  <TabsTrigger value="errors">Errors</TabsTrigger>
                  <TabsTrigger value="dirtyFields">Dirty Fields</TabsTrigger>
                  <TabsTrigger value="touchedFields">
                    Touched Fields
                  </TabsTrigger>
                </TabsList>
                <TabsContent value="schema" className="flex-1 min-h-0">
                  <div className="h-full flex flex-col">
                    <div className="p-4 border-b flex-shrink-0">
                      <h3 className="text-lg font-semibold">
                        Yup Validation Schema
                      </h3>
                    </div>
                    <div className="flex-1 p-4 overflow-auto min-h-0">
                      {formMetadata.schema ? (
                        <pre className="text-xs bg-gray-50 p-3 rounded">
                          {JSON.stringify(
                            formMetadata.schema.describe(),
                            null,
                            2
                          )}
                        </pre>
                      ) : (
                        <div className="text-sm text-gray-500">
                          Schema not available yet
                        </div>
                      )}
                    </div>
                  </div>
                </TabsContent>
                <TabsContent value="fieldConfig" className="flex-1 min-h-0">
                  <div className="h-full flex flex-col">
                    <div className="p-4 border-b flex-shrink-0">
                      <h3 className="text-lg font-semibold">
                        Field Configuration
                      </h3>
                    </div>
                    <div className="flex-1 p-4 overflow-auto min-h-0">
                      <pre className="text-xs bg-gray-50 p-3 rounded">
                        {JSON.stringify(fields, null, 2)}
                      </pre>
                    </div>
                  </div>
                </TabsContent>
                <TabsContent value="formState" className="flex-1 min-h-0">
                  <div className="h-full flex flex-col">
                    <div className="p-4 border-b flex-shrink-0">
                      <h3 className="text-lg font-semibold">Form State</h3>
                    </div>
                    <div className="flex-1 p-4 overflow-auto min-h-0">
                      <pre className="text-xs bg-gray-50 p-3 rounded">
                        {JSON.stringify(formMetadata, null, 2)}
                      </pre>
                    </div>
                  </div>
                </TabsContent>
                <TabsContent value="currentValues" className="flex-1 min-h-0">
                  <div className="h-full flex flex-col">
                    <div className="p-4 border-b flex-shrink-0">
                      <h3 className="text-lg font-semibold">Current Values</h3>
                    </div>
                    <div className="flex-1 p-4 overflow-auto min-h-0">
                      <pre className="text-xs bg-gray-50 p-3 rounded">
                        {JSON.stringify(formMetadata.values, null, 2)}
                      </pre>
                    </div>
                  </div>
                </TabsContent>
                <TabsContent value="errors" className="flex-1 min-h-0">
                  <div className="h-full flex flex-col">
                    <div className="p-4 border-b flex-shrink-0">
                      <h3 className="text-lg font-semibold">
                        Validation Errors
                      </h3>
                    </div>
                    <div className="flex-1 p-4 overflow-auto min-h-0">
                      <pre className="text-xs bg-gray-50 p-3 rounded">
                        {JSON.stringify(formMetadata.errors, null, 2)}
                      </pre>
                    </div>
                  </div>
                </TabsContent>
                <TabsContent value="dirtyFields" className="flex-1 min-h-0">
                  <div className="h-full flex flex-col">
                    <div className="p-4 border-b flex-shrink-0">
                      <h3 className="text-lg font-semibold">Dirty Fields</h3>
                    </div>
                    <div className="flex-1 p-4 overflow-auto min-h-0">
                      <pre className="text-xs bg-gray-50 p-3 rounded">
                        {JSON.stringify(formMetadata.dirtyFields, null, 2)}
                      </pre>
                    </div>
                  </div>
                </TabsContent>
                <TabsContent value="touchedFields" className="flex-1 min-h-0">
                  <div className="h-full flex flex-col">
                    <div className="p-4 border-b flex-shrink-0">
                      <h3 className="text-lg font-semibold">Touched Fields</h3>
                    </div>
                    <div className="flex-1 p-4 overflow-auto min-h-0">
                      <pre className="text-xs bg-gray-50 p-3 rounded">
                        {JSON.stringify(formMetadata.touchedFields, null, 2)}
                      </pre>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </SheetContent>
          )}
        </Sheet>
      </>
    );
  }
);

SimpleFormBuilder.displayName = "SimpleFormBuilder";

export default SimpleFormBuilder;
