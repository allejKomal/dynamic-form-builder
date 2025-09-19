export interface FieldConfigBase {
  name: string;
  label: string;
  type: FieldType;
  placeholder?: string;
  defaultValue?: string | number;
  required?: boolean;
  maxLength?: number; // for strings
  min?: number; // for numbers
  max?: number; // for numbers
}

export type FieldConfig = FieldConfigBase;

type FieldType = "text" | "email" | "number" | "password";
