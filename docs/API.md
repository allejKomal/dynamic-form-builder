# API Reference

This document provides detailed API reference for all components and utilities in the Dynamic Form Builder.

## FormEditor Component

### Props

#### `fields: FieldConfig[]`
Array of field configurations that define the form structure.

**Required:** Yes

**Type:** `FieldConfig[]`

**Example:**
```tsx
const fields: FieldConfig[] = [
  {
    name: "email",
    label: "Email Address",
    type: "email",
    required: true
  }
];
```

#### `labelPosition?: "left" | "top"`
Controls the positioning of field labels.

**Default:** `"left"`

**Options:**
- `"left"` - Labels appear to the left of input fields
- `"top"` - Labels appear above input fields

#### `className?: string`
CSS classes applied to the outer container wrapper.

**Default:** `""`

**Example:**
```tsx
<FormEditor 
  fields={fields}
  className="bg-white rounded-lg shadow-md p-6"
/>
```

#### `formClassName?: string`
CSS classes applied to the form element.

**Default:** `""`

**Example:**
```tsx
<FormEditor 
  fields={fields}
  formClassName="space-y-6 grid grid-cols-2 gap-4"
/>
```

#### `showButtons?: boolean`
Whether to display the built-in submit and reset buttons.

**Default:** `true`

**Example:**
```tsx
<FormEditor 
  fields={fields}
  showButtons={false}
/>
```

#### `onSubmit?: (data: FormData) => void`
Custom submit handler function.

**Type:** `(data: FormData) => void`

**Example:**
```tsx
const handleSubmit = (data: Record<string, unknown>) => {
  console.log("Form submitted:", data);
  // Process form data
};

<FormEditor 
  fields={fields}
  onSubmit={handleSubmit}
/>
```

#### `onReset?: () => void`
Custom reset handler function.

**Type:** `() => void`

**Example:**
```tsx
const handleReset = () => {
  console.log("Form reset");
  // Additional reset logic
};

<FormEditor 
  fields={fields}
  onReset={handleReset}
/>
```

#### `submitButtonText?: string`
Text displayed on the submit button.

**Default:** `"Submit"`

#### `resetButtonText?: string`
Text displayed on the reset button.

**Default:** `"Reset Form"`

#### `children?: React.ReactNode`
Custom content rendered inside the form.

**Example:**
```tsx
<FormEditor fields={fields}>
  <div className="mt-6 p-4 bg-blue-50 rounded">
    <p className="text-blue-800">Additional information or custom components</p>
  </div>
</FormEditor>
```

## FormEditorRef Interface

### Methods

#### `form: UseFormReturn<FormData>`
Direct access to the React Hook Form instance.

**Type:** `UseFormReturn<FormData>`

**Usage:**
```tsx
const formRef = useRef<FormEditorRef>(null);

// Access form methods
const form = formRef.current?.form;
const errors = form?.formState.errors;
const isValid = form?.formState.isValid;
```

#### `submit(): void`
Programmatically submit the form.

**Returns:** `void`

**Usage:**
```tsx
const handleCustomSubmit = () => {
  formRef.current?.submit();
};
```

#### `reset(): void`
Programmatically reset the form to default values.

**Returns:** `void`

**Usage:**
```tsx
const handleReset = () => {
  formRef.current?.reset();
};
```

#### `getValues(): FormData`
Get current form values.

**Returns:** `FormData`

**Usage:**
```tsx
const currentValues = formRef.current?.getValues();
console.log("Current form values:", currentValues);
```

#### `setValue(name: keyof FormData, value: unknown): void`
Set the value of a specific field.

**Parameters:**
- `name: keyof FormData` - Field name
- `value: unknown` - New value

**Usage:**
```tsx
formRef.current?.setValue("email", "test@example.com");
formRef.current?.setValue("age", 25);
```

#### `clearErrors(): void`
Clear all validation errors.

**Returns:** `void`

**Usage:**
```tsx
formRef.current?.clearErrors();
```

## Field Configuration

### FieldConfig Interface

#### Basic Properties

##### `name: string`
Unique identifier for the field.

**Required:** Yes

**Example:** `"email"`, `"username"`, `"password"`

##### `label: string`
Display label for the field.

**Required:** Yes

**Example:** `"Email Address"`, `"Username"`, `"Password"`

##### `type: FieldType`
Type of the field component.

**Required:** Yes

**Type:** `FieldType`

**Options:**
- `"text"` - Text input
- `"email"` - Email input
- `"password"` - Password input
- `"number"` - Number input
- `"textarea"` - Textarea
- `"select"` - Select dropdown
- `"multi-select"` - Multi-select dropdown
- `"searchable-select"` - Searchable select
- `"checkbox"` - Checkbox
- `"date"` - Date picker
- `"file"` - File upload
- `"url"` - URL input

##### `required?: boolean`
Whether the field is required.

**Default:** `false`

##### `placeholder?: string`
Placeholder text for the field.

**Example:** `"Enter your email address"`

##### `className?: string`
Additional CSS classes for the field.

##### `defaultValue?: unknown`
Default value for the field.

**Example:**
```tsx
defaultValue: "test@example.com"  // For text/email fields
defaultValue: 25                  // For number fields
defaultValue: true                // For checkbox fields
defaultValue: ["option1"]         // For multi-select fields
```

#### Validation Properties

##### `requiredMessage?: string`
Custom message for required field validation.

**Example:** `"Email address is required"`

##### `disableError?: boolean`
Disable error display for this field.

**Default:** `false`

##### `disableErrorMessage?: boolean`
Disable error message display for this field.

**Default:** `false`

##### `customValidation?: (value: unknown) => boolean | Promise<boolean>`
Custom validation function.

**Type:** `(value: unknown) => boolean | Promise<boolean>`

**Example:**
```tsx
customValidation: (value) => {
  const str = String(value);
  return str.length >= 8 && /[A-Z]/.test(str);
}
```

##### `customValidationMessage?: string`
Custom message for validation errors.

**Example:** `"Password must be at least 8 characters with uppercase letter"`

#### Text Field Properties

##### `maxlength?: number`
Maximum character length.

**Example:** `50`

##### `maxlengthMessage?: string`
Custom message for maxlength validation.

**Example:** `"Maximum 50 characters allowed"`

##### `regex?: RegExp`
Regular expression for validation.

**Example:** `/^[a-zA-Z0-9_]+$/`

##### `regexMessage?: string`
Custom message for regex validation.

**Example:** `"Only letters, numbers, and underscores allowed"`

#### Number Field Properties

##### `min?: number`
Minimum value.

**Example:** `18`

##### `max?: number`
Maximum value.

**Example:** `120`

##### `minMessage?: string`
Custom message for minimum value validation.

**Example:** `"Must be at least 18"`

##### `maxMessage?: string`
Custom message for maximum value validation.

**Example:** `"Must be less than 120"`

#### Select Field Properties

##### `options?: SelectOption[]`
Array of select options.

**Type:** `SelectOption[]`

**Example:**
```tsx
options: [
  { value: "us", label: "United States" },
  { value: "ca", label: "Canada" }
]
```

##### `clearable?: boolean`
Whether the select can be cleared.

**Default:** `false`

##### `searchable?: boolean`
Whether the select is searchable (for multi-select).

**Default:** `false`

##### `maxSelections?: number`
Maximum number of selections (for multi-select).

**Example:** `5`

#### Checkbox Field Properties

##### `checkedValue?: unknown`
Value when checkbox is checked.

**Example:** `true`, `"yes"`, `"active"`

##### `uncheckedValue?: unknown`
Value when checkbox is unchecked.

**Example:** `false`, `"no"`, `"inactive"`

##### `labelPosition?: "left" | "right"`
Position of the checkbox label.

**Default:** `"left"`

#### Date Field Properties

##### `minDate?: string`
Minimum selectable date (ISO format).

**Example:** `"1900-01-01"`

##### `maxDate?: string`
Maximum selectable date (ISO format).

**Example:** `"2024-12-31"`

##### `showTime?: boolean`
Whether to show time picker.

**Default:** `false`

#### File Field Properties

##### `accept?: string`
Accepted file types.

**Example:** `"image/*"`, `".pdf,.doc,.docx"`

##### `multiple?: boolean`
Whether multiple files can be selected.

**Default:** `false`

##### `maxSize?: number`
Maximum file size in bytes.

**Example:** `5 * 1024 * 1024` (5MB)

##### `maxFiles?: number`
Maximum number of files.

**Example:** `5`

#### Password Field Properties

##### `defaultShowPassword?: boolean`
Whether password is visible by default.

**Default:** `false`

#### Custom Rendering

##### `renderComponent?: (props: CustomFieldProps) => React.ReactNode`
Custom component renderer.

**Type:** `(props: CustomFieldProps) => React.ReactNode`

**Example:**
```tsx
renderComponent: ({ field, fieldState, fieldConfig }) => (
  <div className="space-y-2">
    <input
      {...field}
      className="w-full px-3 py-2 border rounded"
      placeholder={fieldConfig.placeholder}
    />
    {fieldState.invalid && (
      <p className="text-red-500 text-sm">
        {fieldState.error?.message}
      </p>
    )}
  </div>
)
```

## SelectOption Interface

### Properties

#### `value: string`
Value of the option.

**Required:** Yes

#### `label: string`
Display label of the option.

**Required:** Yes

#### `disabled?: boolean`
Whether the option is disabled.

**Default:** `false`

**Example:**
```tsx
const options: SelectOption[] = [
  { value: "us", label: "United States" },
  { value: "ca", label: "Canada" },
  { value: "disabled", label: "Disabled Option", disabled: true }
];
```

## CustomFieldProps Interface

### Properties

#### `field: ControllerRenderProps<FormData, keyof FormData>`
React Hook Form field props.

**Type:** `ControllerRenderProps<FormData, keyof FormData>`

**Properties:**
- `onChange: (value: unknown) => void` - Field change handler
- `onBlur: () => void` - Field blur handler
- `value: unknown` - Current field value
- `name: string` - Field name

#### `fieldState: FieldState<FormData>`
React Hook Form field state.

**Type:** `FieldState<FormData>`

**Properties:**
- `invalid: boolean` - Whether field is invalid
- `error?: FieldError` - Field error object
- `isDirty: boolean` - Whether field has been modified
- `isTouched: boolean` - Whether field has been touched

#### `fieldConfig: FieldConfig`
Complete field configuration object.

**Type:** `FieldConfig`

## Field Components

### TextInput

Text input field component.

**Props:** `TextInputProps`

**Features:**
- Character length validation
- Regex pattern validation
- Real-time validation

### EmailInput

Email input field component.

**Props:** `EmailInputProps`

**Features:**
- Email format validation
- Real-time validation

### PasswordField

Password input field component.

**Props:** `PasswordFieldProps`

**Features:**
- Password visibility toggle
- Password strength requirements
- Custom validation support

### NumberInput

Number input field component.

**Props:** `NumberInputProps`

**Features:**
- Min/max value validation
- Step increment support
- Number format validation

### TextAreaInput

Textarea field component.

**Props:** `TextAreaInputProps`

**Features:**
- Character length validation
- Configurable rows
- Regex pattern validation

### SelectField

Select dropdown field component.

**Props:** `SelectFieldProps`

**Features:**
- Single selection
- Clearable option
- Custom styling

### MultiSelectField

Multi-select dropdown field component.

**Props:** `MultiSelectFieldProps`

**Features:**
- Multiple selections
- Search functionality
- Maximum selections limit
- Tag display

### SearchableSelectField

Searchable select field component.

**Props:** `SearchableSelectFieldProps`

**Features:**
- Search/filter options
- Single selection
- Clearable option

### CheckboxField

Checkbox field component.

**Props:** `CheckboxFieldProps`

**Features:**
- Custom checked/unchecked values
- Label positioning
- Boolean or custom value support

### DateField

Date picker field component.

**Props:** `DateFieldProps`

**Features:**
- Date range validation
- Time picker support
- Custom date formats

### FileField

File upload field component.

**Props:** `FileFieldProps`

**Features:**
- File type validation
- File size validation
- Multiple file support
- Drag and drop support

### UrlField

URL input field component.

**Props:** `UrlFieldProps`

**Features:**
- URL format validation
- Character length validation
- Real-time validation

## Validation

### Built-in Validation

The form builder includes built-in validation for all field types:

- **Required fields** - Non-empty validation
- **Email format** - RFC compliant email validation
- **URL format** - Valid URL format validation
- **Number ranges** - Min/max value validation
- **Character limits** - Maxlength validation
- **Regex patterns** - Custom pattern validation

### Custom Validation

Custom validation functions can be added to any field:

```tsx
{
  name: "password",
  type: "password",
  customValidation: async (value) => {
    // Async validation
    const response = await fetch('/api/validate-password', {
      method: 'POST',
      body: JSON.stringify({ password: value })
    });
    return response.ok;
  },
  customValidationMessage: "Password does not meet security requirements"
}
```

### Cross-Field Validation

Cross-field validation can be implemented using React Hook Form's validation methods:

```tsx
const formRef = useRef<FormEditorRef>(null);

const validatePasswords = () => {
  const values = formRef.current?.getValues();
  if (values?.password !== values?.confirmPassword) {
    formRef.current?.form.setError("confirmPassword", {
      type: "manual",
      message: "Passwords do not match"
    });
    return false;
  }
  return true;
};
```

## Styling

### CSS Classes

The form builder uses Tailwind CSS classes and can be customized:

#### Container Classes
- `className` - Outer container styling
- `formClassName` - Form element styling

#### Field Classes
- `className` - Individual field styling
- Built-in error states with `border-destructive` and `ring-destructive/20`

#### Label Classes
- `text-sm font-medium text-gray-700` - Default label styling
- `min-w-[200px] pt-2` - Left label styling
- `text-red-500` - Required field asterisk

### Custom Styling

```tsx
<FormEditor 
  fields={fields}
  className="bg-white rounded-lg shadow-md p-6"
  formClassName="space-y-6 grid grid-cols-1 md:grid-cols-2 gap-4"
  labelPosition="left"
/>
```

## Error Handling

### Error States

Fields automatically show error states when validation fails:

- Red border (`border-destructive`)
- Error ring (`ring-destructive/20`)
- Error message display

### Error Messages

Error messages are displayed below fields and can be customized:

- `requiredMessage` - Required field message
- `maxlengthMessage` - Character limit message
- `regexMessage` - Pattern validation message
- `customValidationMessage` - Custom validation message

### Error Clearing

Errors can be cleared programmatically:

```tsx
// Clear all errors
formRef.current?.clearErrors();

// Clear specific field error
formRef.current?.form.clearErrors("fieldName");
```
