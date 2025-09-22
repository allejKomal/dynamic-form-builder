import { FieldConfig } from "@/types/fields-type";

export const generateDefaultValues = (fields: FieldConfig[]) => {
  const defaultValues: Record<string, unknown> = {};

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
        defaultValues[field.name] = field.defaultValue ?? undefined;
        break;
      case "array":
        defaultValues[field.name] =
          (field.defaultValue as string[] | number[] | boolean[]) || [];
        break;
    }
  });

  return defaultValues;
};
