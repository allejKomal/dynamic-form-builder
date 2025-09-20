# Dynamic Form Builder

A powerful, modular React form builder component built with TypeScript, React Hook Form, and Yup validation. Inspired by Plate.js architecture, it provides complete control over form behavior and styling.

## ✨ Features

- 🎯 **Modular Architecture** - Plate.js-inspired design with external control
- 🔧 **TypeScript Support** - Full type safety and IntelliSense
- 📝 **Multiple Field Types** - Text, Email, Password, Number, Select, Multi-select, Date, File, and more
- 🎨 **Flexible Styling** - Customizable layouts and themes
- ✅ **Built-in Validation** - Yup schema validation with custom rules
- 🎮 **External Control** - Ref-based methods for programmatic control
- 📱 **Responsive Design** - Works on all screen sizes
- 🎛️ **Label Positioning** - Left or top label alignment
- 🔄 **Real-time Validation** - Instant feedback on user input
- 🎪 **Custom Components** - Support for custom field renderers

## 🚀 Quick Start

### Installation

```bash
npm install react-hook-form @hookform/resolvers yup
npm install lucide-react
npm install @radix-ui/react-select @radix-ui/react-checkbox @radix-ui/react-dialog
```

### Basic Usage

```tsx
import FormEditor, { FormEditorRef } from "@/components/form-builder/form-editor";
import { defaultFields } from "@/data/default-form";

function MyForm() {
  const formRef = useRef<FormEditorRef>(null);

  const handleSubmit = (data: Record<string, unknown>) => {
    console.log("Form submitted:", data);
  };

  return (
    <FormEditor 
      fields={defaultFields} 
      onSubmit={handleSubmit}
      labelPosition="top"
    />
  );
}
```

## 📚 API Reference

### FormEditor Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `fields` | `FieldConfig[]` | - | Array of field configurations |
| `labelPosition` | `"left" \| "top"` | `"left"` | Label positioning |
| `className` | `string` | `""` | Outer container styling |
| `formClassName` | `string` | `""` | Form element styling |
| `showButtons` | `boolean` | `true` | Show built-in submit/reset buttons |
| `onSubmit` | `(data: FormData) => void` | - | Custom submit handler |
| `onReset` | `() => void` | - | Custom reset handler |
| `submitButtonText` | `string` | `"Submit"` | Submit button text |
| `resetButtonText` | `string` | `"Reset Form"` | Reset button text |
| `children` | `React.ReactNode` | - | Custom content inside form |

### FormEditorRef Methods

| Method | Type | Description |
|--------|------|-------------|
| `form` | `UseFormReturn<FormData>` | Direct access to React Hook Form instance |
| `submit()` | `() => void` | Programmatically submit the form |
| `reset()` | `() => void` | Programmatically reset the form |
| `getValues()` | `() => FormData` | Get current form values |
| `setValue(name, value)` | `(name: keyof FormData, value: unknown) => void` | Set specific field value |
| `clearErrors()` | `() => void` | Clear all validation errors |

## 🎛️ Field Types

### Text Field
```tsx
{
  name: "username",
  label: "Username",
  type: "text",
  required: true,
  placeholder: "Enter username",
  maxlength: 50,
  regex: /^[a-zA-Z0-9_]+$/,
  regexMessage: "Only letters, numbers, and underscores allowed"
}
```

### Email Field
```tsx
{
  name: "email",
  label: "Email Address",
  type: "email",
  required: true,
  placeholder: "Enter your email",
  requiredMessage: "Email is required"
}
```

### Password Field
```tsx
{
  name: "password",
  label: "Password",
  type: "password",
  required: true,
  placeholder: "Enter password",
  defaultShowPassword: false,
  customValidation: (value) => {
    // Custom password validation logic
    return value.length >= 8;
  }
}
```

### Number Field
```tsx
{
  name: "age",
  label: "Age",
  type: "number",
  required: true,
  min: 18,
  max: 120,
  minMessage: "Must be at least 18",
  maxMessage: "Must be less than 120"
}
```

### Select Field
```tsx
{
  name: "country",
  label: "Country",
  type: "select",
  required: true,
  placeholder: "Select country",
  clearable: true,
  options: [
    { value: "us", label: "United States" },
    { value: "ca", label: "Canada" },
    { value: "uk", label: "United Kingdom" }
  ]
}
```

### Multi-Select Field
```tsx
{
  name: "skills",
  label: "Skills",
  type: "multi-select",
  required: false,
  placeholder: "Select skills",
  searchable: true,
  maxSelections: 5,
  options: [
    { value: "js", label: "JavaScript" },
    { value: "ts", label: "TypeScript" },
    { value: "react", label: "React" }
  ]
}
```

### Checkbox Field
```tsx
{
  name: "terms",
  label: "I agree to the terms",
  type: "checkbox",
  required: true,
  checkedValue: true,
  uncheckedValue: false,
  labelPosition: "right"
}
```

### Date Field
```tsx
{
  name: "birthDate",
  label: "Birth Date",
  type: "date",
  required: true,
  placeholder: "Select date",
  minDate: "1900-01-01",
  maxDate: "2024-12-31",
  showTime: false
}
```

### File Field
```tsx
{
  name: "avatar",
  label: "Profile Picture",
  type: "file",
  required: false,
  accept: "image/*",
  multiple: false,
  maxSize: 5 * 1024 * 1024, // 5MB
  maxFiles: 1
}
```

## 🎨 Styling & Layout

### Label Positioning

```tsx
// Top labels (default)
<FormEditor 
  fields={fields} 
  labelPosition="top"
/>

// Left labels
<FormEditor 
  fields={fields} 
  labelPosition="left"
/>
```

### Custom Styling

```tsx
<FormEditor 
  fields={fields}
  className="bg-gray-100 p-6 rounded-lg"
  formClassName="space-y-8 grid grid-cols-2 gap-4"
  labelPosition="left"
/>
```

## 🎮 Advanced Usage

### External Control

```tsx
import { useRef } from "react";
import FormEditor, { FormEditorRef } from "@/components/form-builder/form-editor";

function AdvancedForm() {
  const formRef = useRef<FormEditorRef>(null);

  const handleCustomSubmit = () => {
    const values = formRef.current?.getValues();
    if (values?.email) {
      formRef.current?.submit();
    }
  };

  return (
    <div>
      <FormEditor 
        ref={formRef}
        fields={fields}
        showButtons={false}
        onSubmit={handleCustomSubmit}
      />
      
      <div className="flex gap-4 mt-4">
        <button onClick={handleCustomSubmit}>Submit</button>
        <button onClick={() => formRef.current?.reset()}>Reset</button>
      </div>
    </div>
  );
}
```

## 🎯 Examples

### Simple Contact Form

```tsx
const contactFields: FieldConfig[] = [
  {
    name: "name",
    label: "Full Name",
    type: "text",
    required: true,
    placeholder: "Enter your full name"
  },
  {
    name: "email",
    label: "Email",
    type: "email",
    required: true,
    placeholder: "Enter your email"
  },
  {
    name: "message",
    label: "Message",
    type: "textarea",
    required: true,
    placeholder: "Enter your message",
    maxlength: 1000
  }
];
```

## 🏗️ Architecture

### Component Structure

```
components/form-builder/
├── form-editor.tsx          # Main form component
├── input-field.tsx          # Text input component
├── email-field.tsx          # Email input component
├── password-field.tsx       # Password input component
├── number-field.tsx         # Number input component
├── text-area-field.tsx      # Textarea component
├── select-field.tsx         # Select dropdown component
├── multi-select-field.tsx   # Multi-select component
├── searchable-select-field.tsx # Searchable select component
├── checkbox-field.tsx       # Checkbox component
├── date-field.tsx           # Date picker component
├── file-field.tsx           # File upload component
└── url-field.tsx            # URL input component
```

## 🔧 Development

### Prerequisites

- Node.js 18+
- React 18+
- TypeScript 5+

### Setup

```bash
# Clone the repository
git clone <repository-url>
cd dynamic-form-builder

# Install dependencies
npm install

# Start development server
npm run dev
```

### Building

```bash
# Build for production
npm run build

# Type checking
npm run type-check

# Linting
npm run lint
```

## 📝 License

MIT License - see LICENSE file for details.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 🐛 Issues

Please report issues on the GitHub issues page.

## 📞 Support

For support and questions, please open an issue or contact the maintainers.

---

Built with ❤️ using React, TypeScript, and modern web technologies.