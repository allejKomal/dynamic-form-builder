import React from "react";
import { ControllerRenderProps } from "react-hook-form";
import { Button } from "../ui/button";
import { cn } from "@/lib/utils";
import {
  ArrayFieldConfig,
  ArrayItemConfig,
  TextFieldConfig,
  EmailFieldConfig,
  NumberFieldConfig,
  TextAreaFieldConfig,
  PasswordFieldConfig,
  UrlFieldConfig,
  SelectFieldConfig,
  MultiSelectFieldConfig,
  SearchableSelectFieldConfig,
  CheckboxFieldConfig,
  DateFieldConfig,
  FileFieldConfig,
} from "@/types/fields-type";
import { FormData } from "./form-editor";
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

interface ArrayFieldProps {
  field: ControllerRenderProps<FormData, keyof FormData>;
  fieldConfig: ArrayFieldConfig;
  className: string;
  error?: boolean;
  fieldState?: {
    error?: {
      message?: string;
    };
    invalid: boolean;
    isDirty: boolean;
    isTouched: boolean;
  };
}

export function ArrayField({
  field,
  fieldConfig,
  className,
  error,
  fieldState,
}: ArrayFieldProps) {
  const { onChange, value } = field;

  const arrayValue: (
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
  )[] = Array.isArray(value) ? value : [];

  const {
    itemType,
    itemConfig,
    minItems = 0,
    maxItems,
    addButtonText = "Add Item",
    removeButtonText = "Remove",
  } = fieldConfig;

  const addItem = () => {
    if (maxItems && arrayValue.length >= maxItems) return;

    const newItem = getDefaultValueForType(itemType, itemConfig);
    onChange([...arrayValue, newItem]);
  };

  const removeItem = (index: number) => {
    if (arrayValue.length <= minItems) return;

    const newValue = arrayValue.filter((_, i) => i !== index);
    onChange(newValue);
  };

  // Check if array has valid items (non-empty values)
  const hasValidItems = () => {
    return arrayValue.some((item) => {
      if (typeof item === "string") return item.trim() !== "";
      if (typeof item === "number") return item !== 0;
      if (typeof item === "boolean") return true;
      if (Array.isArray(item)) return item.length > 0;
      return item !== null && item !== undefined;
    });
  };

  const updateItem = (
    index: number,
    newValue:
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
  ) => {
    const newArray = [...arrayValue];
    newArray[index] = newValue;
    onChange(newArray);
  };

  const getDefaultValueForType = (type: string, config: ArrayItemConfig) => {
    switch (type) {
      case "text":
      case "textarea":
      case "email":
      case "password":
      case "url":
      case "date": {
        const textConfig = config as Omit<TextFieldConfig, "name" | "type">;
        return textConfig.defaultValue || "";
      }
      case "number": {
        const numberConfig = config as Omit<NumberFieldConfig, "name" | "type">;
        return numberConfig.defaultValue ?? 0;
      }
      case "select":
      case "searchable-select": {
        const selectConfig = config as Omit<SelectFieldConfig, "name" | "type">;
        return selectConfig.defaultValue || "";
      }
      case "multi-select": {
        const multiSelectConfig = config as Omit<
          MultiSelectFieldConfig,
          "name" | "type"
        >;
        return multiSelectConfig.defaultValue || [];
      }
      case "checkbox": {
        const checkboxConfig = config as Omit<
          CheckboxFieldConfig,
          "name" | "type"
        >;
        if (checkboxConfig.uncheckedValue !== undefined) {
          return checkboxConfig.defaultValue ?? checkboxConfig.uncheckedValue;
        }
        return checkboxConfig.defaultValue ?? false;
      }
      case "file": {
        const fileConfig = config as Omit<FileFieldConfig, "name" | "type">;
        return fileConfig.defaultValue || (fileConfig.multiple ? [] : null);
      }
      default:
        return "";
    }
  };

  const renderItemField = (
    itemValue:
      | string
      | number
      | boolean
      | string[]
      | number[]
      | boolean[]
      | File
      | File[]
      | null
      | undefined,
    index: number,
    error: boolean
  ) => {
    const itemField: ControllerRenderProps<FormData, keyof FormData> = {
      value: itemValue,
      onChange: (
        newValue:
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
      ) => updateItem(index, newValue),
      onBlur: () => {
        // Trigger validation when user leaves the field
        field.onBlur?.();
      },
      name: `${field.name}[${index}]` as keyof FormData,
      ref: () => {},
    };

    // Show errors for the entire array field when there are validation errors
    const hasItemError = error;

    const baseProps = {
      field: itemField,
      id: `${field.name}-${index}`,
      className: "w-full",
      error: hasItemError,
      fieldState: {
        error: {
          message: "",
        },
        invalid: error,
      },
      fieldConfig: itemConfig,
    };

    switch (itemType) {
      case "text": {
        const textConfig = itemConfig as Omit<TextFieldConfig, "name" | "type">;
        return (
          <TextInput
            {...baseProps}
            placeholder={textConfig.placeholder}
            maxLength={textConfig.maxlength}
            required={textConfig.required}
          />
        );
      }
      case "email": {
        const emailConfig = itemConfig as Omit<
          EmailFieldConfig,
          "name" | "type"
        >;
        return (
          <EmailInput
            {...baseProps}
            placeholder={emailConfig.placeholder}
            required={emailConfig.required}
          />
        );
      }
      case "number": {
        const numberConfig = itemConfig as Omit<
          NumberFieldConfig,
          "name" | "type"
        >;
        return (
          <NumberInput
            {...baseProps}
            placeholder={numberConfig.placeholder}
            min={numberConfig.min}
            max={numberConfig.max}
            required={numberConfig.required}
          />
        );
      }
      case "textarea": {
        const textareaConfig = itemConfig as Omit<
          TextAreaFieldConfig,
          "name" | "type"
        >;
        return (
          <TextAreaInput
            {...baseProps}
            placeholder={textareaConfig.placeholder}
            maxLength={textareaConfig.maxlength}
            required={textareaConfig.required}
          />
        );
      }
      case "password": {
        const passwordConfig = itemConfig as Omit<
          PasswordFieldConfig,
          "name" | "type"
        >;
        return (
          <PasswordField
            {...baseProps}
            placeholder={passwordConfig.placeholder}
            required={passwordConfig.required}
            defaultShowPassword={passwordConfig.defaultShowPassword}
          />
        );
      }
      case "url": {
        const urlConfig = itemConfig as Omit<UrlFieldConfig, "name" | "type">;
        return (
          <UrlField
            {...baseProps}
            placeholder={urlConfig.placeholder}
            required={urlConfig.required}
          />
        );
      }
      case "select": {
        const selectConfig = itemConfig as Omit<
          SelectFieldConfig,
          "name" | "type"
        >;
        return (
          <SelectField
            {...baseProps}
            placeholder={selectConfig.placeholder}
            options={selectConfig.options || []}
            clearable={selectConfig.clearable}
            required={selectConfig.required}
          />
        );
      }
      case "multi-select": {
        const multiSelectConfig = itemConfig as Omit<
          MultiSelectFieldConfig,
          "name" | "type"
        >;
        return (
          <MultiSelectField
            {...baseProps}
            placeholder={multiSelectConfig.placeholder}
            options={multiSelectConfig.options || []}
            searchable={multiSelectConfig.searchable}
            maxSelections={multiSelectConfig.maxSelections}
            required={multiSelectConfig.required}
          />
        );
      }
      case "searchable-select": {
        const searchableSelectConfig = itemConfig as Omit<
          SearchableSelectFieldConfig,
          "name" | "type"
        >;
        return (
          <SearchableSelectField
            {...baseProps}
            placeholder={searchableSelectConfig.placeholder}
            options={searchableSelectConfig.options || []}
            clearable={searchableSelectConfig.clearable}
            required={searchableSelectConfig.required}
          />
        );
      }
      case "checkbox": {
        const checkboxConfig = itemConfig as Omit<
          CheckboxFieldConfig,
          "name" | "type"
        >;
        return (
          <CheckboxField
            {...baseProps}
            checkedValue={checkboxConfig.checkedValue}
            uncheckedValue={checkboxConfig.uncheckedValue}
            labelPosition={checkboxConfig.labelPosition}
            label={checkboxConfig.label}
            required={checkboxConfig.required}
          />
        );
      }
      case "date": {
        const dateConfig = itemConfig as Omit<DateFieldConfig, "name" | "type">;
        return (
          <DateField
            {...baseProps}
            placeholder={dateConfig.placeholder}
            minDate={dateConfig.minDate}
            maxDate={dateConfig.maxDate}
            showTime={dateConfig.showTime}
            required={dateConfig.required}
          />
        );
      }
      case "file": {
        const fileConfig = itemConfig as Omit<FileFieldConfig, "name" | "type">;
        return (
          <FileField
            {...baseProps}
            accept={fileConfig.accept}
            multiple={fileConfig.multiple}
            maxSize={fileConfig.maxSize}
            maxFiles={fileConfig.maxFiles}
            required={fileConfig.required}
          />
        );
      }
      default:
        return <div>Unsupported field type: {itemType}</div>;
    }
  };

  return (
    <div className={cn("space-y-4", className)}>
      <div className={cn("space-y-3")}>
        {arrayValue.map((item, index) => (
          <div key={index} className={cn("flex items-start gap-3")}>
            <div className="flex-1">
              {renderItemField(
                item,
                index,
                error || fieldState?.invalid || false
              )}
            </div>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => removeItem(index)}
              disabled={arrayValue.length <= minItems}
            >
              {removeButtonText}
            </Button>
          </div>
        ))}
      </div>

      <Button
        type="button"
        variant="outline"
        onClick={addItem}
        disabled={maxItems ? arrayValue.length >= maxItems : false}
        className="w-full"
      >
        {addButtonText}
        {maxItems && ` (${arrayValue.length}/${maxItems})`}
      </Button>

      {/* Show validation error message */}
      {fieldState?.error?.message && (
        <p className="text-sm text-red-600 mt-2">{fieldState.error.message}</p>
      )}

      {maxItems && arrayValue.length >= maxItems && (
        <p className="text-sm text-gray-500 text-center">
          Maximum {maxItems} items allowed
        </p>
      )}

      {/* Show custom error for empty values when minItems is required */}
      {minItems > 0 && arrayValue.length > 0 && !hasValidItems() && (
        <p className="text-sm text-red-600 mt-2 text-center">
          At least {minItems} item{minItems > 1 ? "s" : ""} must have a value
        </p>
      )}
    </div>
  );
}
