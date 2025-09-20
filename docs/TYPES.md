# Type Definitions

This document provides comprehensive type definitions for the Dynamic Form Builder.

## Core Types

### FormData
```typescript
export type FormData = Record<string, unknown>;
```

### FieldType
```typescript
export type FieldType = 
  | "text" 
  | "email" 
  | "password" 
  | "number" 
  | "textarea" 
  | "select" 
  | "multi-select" 
  | "searchable-select" 
  | "checkbox" 
  | "date" 
  | "file" 
  | "url";
```

### SelectOption
```typescript
export interface SelectOption {
  value: string;
  label: string;
  disabled?: boolean;
}
```

## Field Configuration

### FieldConfig
```typescript
export interface FieldConfig {
  // Basic field properties
  name: string;
  label: string;
  type: FieldType;
  required?: boolean;
  placeholder?: string;
  className?: string;
  defaultValue?: unknown;
  
  // Validation messages
  requiredMessage?: string;
  disableError?: boolean;
  disableErrorMessage?: boolean;
  
  // Custom rendering
  renderComponent?: (props: CustomFieldProps) => React.ReactNode;
  
  // Text field properties
  maxlength?: number;
  maxlengthMessage?: string;
  regex?: RegExp;
  regexMessage?: string;
  
  // Number field properties
  min?: number;
  max?: number;
  minMessage?: string;
  maxMessage?: string;
  
  // Select field properties
  options?: SelectOption[];
  clearable?: boolean;
  searchable?: boolean;
  maxSelections?: number;
  
  // Checkbox field properties
  checkedValue?: unknown;
  uncheckedValue?: unknown;
  labelPosition?: "left" | "right";
  
  // Date field properties
  minDate?: string;
  maxDate?: string;
  showTime?: boolean;
  
  // File field properties
  accept?: string;
  multiple?: boolean;
  maxSize?: number;
  maxFiles?: number;
  
  // Password field properties
  defaultShowPassword?: boolean;
  
  // Custom validation
  customValidation?: (value: unknown) => boolean | Promise<boolean>;
  customValidationMessage?: string;
}
```

## Form Editor Types

### FormEditorProps
```typescript
export interface FormEditorProps {
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
```

### FormEditorRef
```typescript
export interface FormEditorRef {
  form: UseFormReturn<FormData>;
  submit: () => void;
  reset: () => void;
  getValues: () => FormData;
  setValue: (name: keyof FormData, value: unknown) => void;
  clearErrors: () => void;
}
```

## Field Component Props

### Base Field Props
```typescript
export interface BaseFieldProps {
  field: ControllerRenderProps<FormData, keyof FormData>;
  id: string;
  required?: boolean;
  className: string;
  error?: boolean;
}
```

### Text Field Props
```typescript
export interface TextInputProps extends BaseFieldProps {
  placeholder?: string;
  maxLength?: number;
  type?: string;
  regex?: RegExp;
  regexMessage?: string;
}
```

### Email Field Props
```typescript
export interface EmailInputProps extends BaseFieldProps {
  placeholder?: string;
}
```

### Password Field Props
```typescript
export interface PasswordFieldProps extends BaseFieldProps {
  placeholder?: string;
  defaultShowPassword?: boolean;
}
```

### Number Field Props
```typescript
export interface NumberInputProps extends BaseFieldProps {
  min?: number;
  max?: number;
  step?: number;
}
```

### Select Field Props
```typescript
export interface SelectFieldProps extends BaseFieldProps {
  placeholder?: string;
  options: SelectOption[];
  clearable?: boolean;
}
```

### Multi-Select Field Props
```typescript
export interface MultiSelectFieldProps extends BaseFieldProps {
  placeholder?: string;
  options: SelectOption[];
  searchable?: boolean;
  maxSelections?: number;
}
```

### Searchable Select Field Props
```typescript
export interface SearchableSelectFieldProps extends BaseFieldProps {
  placeholder?: string;
  options: SelectOption[];
  clearable?: boolean;
}
```

### Checkbox Field Props
```typescript
export interface CheckboxFieldProps extends BaseFieldProps {
  checkedValue?: unknown;
  uncheckedValue?: unknown;
  labelPosition?: "left" | "right";
  label: string;
}
```

### Date Field Props
```typescript
export interface DateFieldProps extends BaseFieldProps {
  placeholder?: string;
  minDate?: string;
  maxDate?: string;
  showTime?: boolean;
}
```

### File Field Props
```typescript
export interface FileFieldProps extends BaseFieldProps {
  accept?: string;
  multiple?: boolean;
  maxSize?: number;
  maxFiles?: number;
}
```

### URL Field Props
```typescript
export interface UrlFieldProps extends BaseFieldProps {
  placeholder?: string;
  maxLength?: number;
}
```

### Text Area Field Props
```typescript
export interface TextAreaInputProps extends BaseFieldProps {
  placeholder?: string;
  maxLength?: number;
  rows?: number;
}
```

## Custom Field Props

### CustomFieldProps
```typescript
export interface CustomFieldProps {
  field: ControllerRenderProps<FormData, keyof FormData>;
  fieldState: FieldState<FormData>;
  fieldConfig: FieldConfig;
}
```

## Validation Types

### Password Requirements
```typescript
export interface PasswordRequirement {
  label: string;
  test: (password: string) => boolean;
}
```

## Utility Types

### Form Validation Mode
```typescript
type ValidationMode = 
  | "onChange"
  | "onBlur"
  | "onSubmit"
  | "onTouched"
  | "all"
  | undefined;
```

## Usage Examples

### Creating a Field Configuration
```typescript
const textField: FieldConfig = {
  name: "username",
  label: "Username",
  type: "text",
  required: true,
  placeholder: "Enter username",
  maxlength: 50,
  regex: /^[a-zA-Z0-9_]+$/,
  regexMessage: "Only letters, numbers, and underscores allowed"
};
```

### Using FormEditorRef
```typescript
const formRef = useRef<FormEditorRef>(null);

// Get form values
const values = formRef.current?.getValues();

// Set a field value
formRef.current?.setValue("email", "test@example.com");

// Submit the form
formRef.current?.submit();

// Reset the form
formRef.current?.reset();

// Clear validation errors
formRef.current?.clearErrors();
```

### Custom Field Renderer
```typescript
const customField: FieldConfig = {
  name: "customField",
  label: "Custom Field",
  type: "text",
  required: true,
  renderComponent: ({ field, fieldState, fieldConfig }) => (
    <div className="space-y-2">
      <input
        {...field}
        className={`w-full px-3 py-2 border rounded ${
          fieldState.invalid ? 'border-red-500' : 'border-gray-300'
        }`}
        placeholder={fieldConfig.placeholder}
      />
      {fieldState.invalid && (
        <p className="text-red-500 text-sm">{fieldState.error?.message}</p>
      )}
    </div>
  )
};
```
