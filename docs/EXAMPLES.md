# Examples

This document provides comprehensive examples of how to use the Dynamic Form Builder in various scenarios.

## Basic Examples

### Simple Contact Form

```tsx
import { useRef } from "react";
import FormEditor, { FormEditorRef } from "@/components/form-builder/form-editor";
import { FieldConfig } from "@/types/fields-type";

const contactFields: FieldConfig[] = [
  {
    name: "name",
    label: "Full Name",
    type: "text",
    required: true,
    placeholder: "Enter your full name",
    maxlength: 100
  },
  {
    name: "email",
    label: "Email Address",
    type: "email",
    required: true,
    placeholder: "Enter your email address",
    requiredMessage: "Email address is required"
  },
  {
    name: "phone",
    label: "Phone Number",
    type: "text",
    required: false,
    placeholder: "Enter your phone number",
    regex: /^\+?[\d\s\-\(\)]+$/,
    regexMessage: "Please enter a valid phone number"
  },
  {
    name: "message",
    label: "Message",
    type: "textarea",
    required: true,
    placeholder: "Enter your message",
    maxlength: 1000,
    rows: 5
  }
];

function ContactForm() {
  const formRef = useRef<FormEditorRef>(null);

  const handleSubmit = (data: Record<string, unknown>) => {
    console.log("Contact form submitted:", data);
    // Send data to your API
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Contact Us</h1>
      <FormEditor 
        fields={contactFields}
        onSubmit={handleSubmit}
        labelPosition="top"
        className="bg-white rounded-lg shadow-md p-6"
      />
    </div>
  );
}
```

### User Registration Form

```tsx
const registrationFields: FieldConfig[] = [
  {
    name: "username",
    label: "Username",
    type: "text",
    required: true,
    placeholder: "Choose a username",
    maxlength: 20,
    regex: /^[a-zA-Z0-9_]+$/,
    regexMessage: "Username can only contain letters, numbers, and underscores"
  },
  {
    name: "email",
    label: "Email Address",
    type: "email",
    required: true,
    placeholder: "Enter your email",
    requiredMessage: "Email is required for account verification"
  },
  {
    name: "password",
    label: "Password",
    type: "password",
    required: true,
    placeholder: "Create a strong password",
    customValidation: (value) => {
      const str = String(value);
      const hasUpperCase = /[A-Z]/.test(str);
      const hasLowerCase = /[a-z]/.test(str);
      const hasNumbers = /\d/.test(str);
      const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(str);
      const isLongEnough = str.length >= 8;
      
      return hasUpperCase && hasLowerCase && hasNumbers && hasSpecialChar && isLongEnough;
    },
    customValidationMessage: "Password must be at least 8 characters with uppercase, lowercase, number, and special character"
  },
  {
    name: "confirmPassword",
    label: "Confirm Password",
    type: "password",
    required: true,
    placeholder: "Confirm your password"
  },
  {
    name: "country",
    label: "Country",
    type: "select",
    required: true,
    placeholder: "Select your country",
    options: [
      { value: "us", label: "United States" },
      { value: "ca", label: "Canada" },
      { value: "uk", label: "United Kingdom" },
      { value: "au", label: "Australia" },
      { value: "de", label: "Germany" },
      { value: "fr", label: "France" },
      { value: "jp", label: "Japan" },
      { value: "in", label: "India" }
    ]
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
      { value: "php", label: "PHP" }
    ]
  },
  {
    name: "birthDate",
    label: "Date of Birth",
    type: "date",
    required: true,
    placeholder: "Select your birth date",
    maxDate: new Date().toISOString().split("T")[0]
  },
  {
    name: "avatar",
    label: "Profile Picture",
    type: "file",
    required: false,
    accept: "image/*",
    multiple: false,
    maxSize: 5 * 1024 * 1024, // 5MB
    maxFiles: 1
  },
  {
    name: "terms",
    label: "I agree to the Terms and Conditions",
    type: "checkbox",
    required: true,
    checkedValue: true,
    uncheckedValue: false,
    labelPosition: "right"
  },
  {
    name: "newsletter",
    label: "Subscribe to newsletter",
    type: "checkbox",
    required: false,
    checkedValue: "subscribed",
    uncheckedValue: "unsubscribed",
    labelPosition: "right",
    defaultValue: "unsubscribed"
  }
];

function RegistrationForm() {
  const formRef = useRef<FormEditorRef>(null);

  const handleSubmit = async (data: Record<string, unknown>) => {
    try {
      // Validate password confirmation
      if (data.password !== data.confirmPassword) {
        formRef.current?.form.setError("confirmPassword", {
          type: "manual",
          message: "Passwords do not match"
        });
        return;
      }

      // Send registration data to API
      const response = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data)
      });

      if (response.ok) {
        alert("Registration successful!");
        formRef.current?.reset();
      } else {
        throw new Error("Registration failed");
      }
    } catch (error) {
      console.error("Registration error:", error);
      alert("Registration failed. Please try again.");
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-8 text-center">Create Account</h1>
      <FormEditor 
        ref={formRef}
        fields={registrationFields}
        onSubmit={handleSubmit}
        labelPosition="left"
        className="bg-white rounded-lg shadow-lg p-8"
        formClassName="grid grid-cols-1 md:grid-cols-2 gap-6"
      />
    </div>
  );
}
```

## Advanced Examples

### Survey Form with Conditional Fields

```tsx
const surveyFields: FieldConfig[] = [
  {
    name: "name",
    label: "Name",
    type: "text",
    required: true,
    placeholder: "Enter your name"
  },
  {
    name: "email",
    label: "Email",
    type: "email",
    required: true,
    placeholder: "Enter your email"
  },
  {
    name: "age",
    label: "Age",
    type: "number",
    required: true,
    min: 18,
    max: 100,
    placeholder: "Enter your age"
  },
  {
    name: "experience",
    label: "Experience Level",
    type: "select",
    required: true,
    placeholder: "Select your experience level",
    options: [
      { value: "beginner", label: "Beginner (0-1 years)" },
      { value: "intermediate", label: "Intermediate (1-3 years)" },
      { value: "advanced", label: "Advanced (3-5 years)" },
      { value: "expert", label: "Expert (5+ years)" }
    ]
  },
  {
    name: "programmingLanguages",
    label: "Programming Languages",
    type: "multi-select",
    required: true,
    placeholder: "Select languages you know",
    searchable: true,
    maxSelections: 10,
    options: [
      { value: "javascript", label: "JavaScript" },
      { value: "typescript", label: "TypeScript" },
      { value: "python", label: "Python" },
      { value: "java", label: "Java" },
      { value: "csharp", label: "C#" },
      { value: "cpp", label: "C++" },
      { value: "go", label: "Go" },
      { value: "rust", label: "Rust" },
      { value: "php", label: "PHP" },
      { value: "ruby", label: "Ruby" }
    ]
  },
  {
    name: "frameworks",
    label: "Frameworks & Libraries",
    type: "multi-select",
    required: false,
    placeholder: "Select frameworks you've used",
    searchable: true,
    maxSelections: 8,
    options: [
      { value: "react", label: "React" },
      { value: "vue", label: "Vue.js" },
      { value: "angular", label: "Angular" },
      { value: "svelte", label: "Svelte" },
      { value: "next", label: "Next.js" },
      { value: "nuxt", label: "Nuxt.js" },
      { value: "express", label: "Express.js" },
      { value: "django", label: "Django" },
      { value: "rails", label: "Ruby on Rails" },
      { value: "spring", label: "Spring Boot" }
    ]
  },
  {
    name: "satisfaction",
    label: "How satisfied are you with your current development tools?",
    type: "select",
    required: true,
    placeholder: "Select satisfaction level",
    options: [
      { value: "very-satisfied", label: "Very Satisfied" },
      { value: "satisfied", label: "Satisfied" },
      { value: "neutral", label: "Neutral" },
      { value: "dissatisfied", label: "Dissatisfied" },
      { value: "very-dissatisfied", label: "Very Dissatisfied" }
    ]
  },
  {
    name: "feedback",
    label: "Additional Feedback",
    type: "textarea",
    required: false,
    placeholder: "Share any additional thoughts or suggestions",
    maxlength: 2000,
    rows: 6
  },
  {
    name: "newsletter",
    label: "Subscribe to our developer newsletter",
    type: "checkbox",
    required: false,
    checkedValue: true,
    uncheckedValue: false,
    labelPosition: "right"
  }
];

function SurveyForm() {
  const formRef = useRef<FormEditorRef>(null);

  const handleSubmit = (data: Record<string, unknown>) => {
    console.log("Survey submitted:", data);
    // Process survey data
    alert("Thank you for your feedback!");
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold mb-4">Developer Survey</h1>
        <p className="text-gray-600">
          Help us understand the developer community better
        </p>
      </div>
      
      <FormEditor 
        ref={formRef}
        fields={surveyFields}
        onSubmit={handleSubmit}
        labelPosition="left"
        className="bg-white rounded-lg shadow-lg p-8"
        formClassName="space-y-8"
      />
    </div>
  );
}
```

### Product Configuration Form

```tsx
const productConfigFields: FieldConfig[] = [
  {
    name: "productName",
    label: "Product Name",
    type: "text",
    required: true,
    placeholder: "Enter product name",
    maxlength: 100
  },
  {
    name: "description",
    label: "Description",
    type: "textarea",
    required: true,
    placeholder: "Describe your product",
    maxlength: 500,
    rows: 4
  },
  {
    name: "category",
    label: "Category",
    type: "searchable-select",
    required: true,
    placeholder: "Search and select category",
    clearable: true,
    options: [
      { value: "electronics", label: "Electronics" },
      { value: "clothing", label: "Clothing" },
      { value: "books", label: "Books" },
      { value: "home", label: "Home & Garden" },
      { value: "sports", label: "Sports & Outdoors" },
      { value: "beauty", label: "Beauty & Health" },
      { value: "toys", label: "Toys & Games" },
      { value: "automotive", label: "Automotive" }
    ]
  },
  {
    name: "price",
    label: "Price",
    type: "number",
    required: true,
    min: 0,
    step: 0.01,
    placeholder: "Enter price"
  },
  {
    name: "quantity",
    label: "Initial Quantity",
    type: "number",
    required: true,
    min: 0,
    placeholder: "Enter initial stock quantity"
  },
  {
    name: "tags",
    label: "Tags",
    type: "multi-select",
    required: false,
    placeholder: "Add tags to help customers find your product",
    searchable: true,
    maxSelections: 10,
    options: [
      { value: "new", label: "New" },
      { value: "sale", label: "On Sale" },
      { value: "bestseller", label: "Bestseller" },
      { value: "eco-friendly", label: "Eco-Friendly" },
      { value: "premium", label: "Premium" },
      { value: "budget", label: "Budget" },
      { value: "limited", label: "Limited Edition" }
    ]
  },
  {
    name: "launchDate",
    label: "Launch Date",
    type: "date",
    required: true,
    placeholder: "Select launch date",
    minDate: new Date().toISOString().split("T")[0]
  },
  {
    name: "images",
    label: "Product Images",
    type: "file",
    required: true,
    accept: "image/*",
    multiple: true,
    maxFiles: 5,
    maxSize: 10 * 1024 * 1024, // 10MB
  },
  {
    name: "isActive",
    label: "Make product active immediately",
    type: "checkbox",
    required: false,
    checkedValue: true,
    uncheckedValue: false,
    labelPosition: "right"
  }
];

function ProductConfigForm() {
  const formRef = useRef<FormEditorRef>(null);

  const handleSubmit = async (data: Record<string, unknown>) => {
    try {
      // Validate business rules
      if (data.price && Number(data.price) <= 0) {
        formRef.current?.form.setError("price", {
          type: "manual",
          message: "Price must be greater than 0"
        });
        return;
      }

      if (data.quantity && Number(data.quantity) < 0) {
        formRef.current?.form.setError("quantity", {
          type: "manual",
          message: "Quantity cannot be negative"
        });
        return;
      }

      // Submit to API
      const response = await fetch("/api/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data)
      });

      if (response.ok) {
        alert("Product created successfully!");
        formRef.current?.reset();
      } else {
        throw new Error("Failed to create product");
      }
    } catch (error) {
      console.error("Product creation error:", error);
      alert("Failed to create product. Please try again.");
    }
  };

  const handleSaveDraft = () => {
    const values = formRef.current?.getValues();
    console.log("Saving draft:", values);
    // Save as draft
    alert("Draft saved!");
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Create New Product</h1>
        <div className="flex gap-4">
          <button
            onClick={handleSaveDraft}
            className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
          >
            Save Draft
          </button>
        </div>
      </div>

      <FormEditor 
        ref={formRef}
        fields={productConfigFields}
        onSubmit={handleSubmit}
        labelPosition="left"
        className="bg-white rounded-lg shadow-lg p-8"
        formClassName="space-y-6"
        showButtons={false}
      />
      
      <div className="flex justify-end gap-4 mt-8">
        <button
          onClick={() => formRef.current?.reset()}
          className="px-6 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
        >
          Reset
        </button>
        <button
          onClick={() => formRef.current?.submit()}
          className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
        >
          Create Product
        </button>
      </div>
    </div>
  );
}
```

## Custom Field Examples

### Custom Rich Text Editor

```tsx
const customRichTextField: FieldConfig = {
  name: "content",
  label: "Content",
  type: "textarea",
  required: true,
  renderComponent: ({ field, fieldState, fieldConfig }) => (
    <div className="space-y-2">
      <div className="border border-gray-300 rounded-md min-h-[200px] p-4">
        <div
          contentEditable
          className="outline-none"
          onInput={(e) => field.onChange(e.currentTarget.innerHTML)}
          dangerouslySetInnerHTML={{ __html: field.value || "" }}
          placeholder={fieldConfig.placeholder}
        />
      </div>
      {fieldState.invalid && (
        <p className="text-red-500 text-sm">{fieldState.error?.message}</p>
      )}
    </div>
  )
};
```

### Custom Color Picker

```tsx
const customColorField: FieldConfig = {
  name: "themeColor",
  label: "Theme Color",
  type: "text",
  required: true,
  renderComponent: ({ field, fieldState }) => (
    <div className="space-y-2">
      <div className="flex items-center gap-4">
        <input
          type="color"
          value={field.value || "#000000"}
          onChange={(e) => field.onChange(e.target.value)}
          className="w-12 h-10 border border-gray-300 rounded cursor-pointer"
        />
        <input
          type="text"
          value={field.value || ""}
          onChange={(e) => field.onChange(e.target.value)}
          placeholder="#000000"
          className="flex-1 px-3 py-2 border border-gray-300 rounded-md"
        />
      </div>
      {fieldState.invalid && (
        <p className="text-red-500 text-sm">{fieldState.error?.message}</p>
      )}
    </div>
  )
};
```

### Custom Rating Component

```tsx
const customRatingField: FieldConfig = {
  name: "rating",
  label: "Rating",
  type: "number",
  required: true,
  renderComponent: ({ field, fieldState }) => {
    const [rating, setRating] = useState(Number(field.value) || 0);

    const handleRatingChange = (newRating: number) => {
      setRating(newRating);
      field.onChange(newRating);
    };

    return (
      <div className="space-y-2">
        <div className="flex gap-1">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              type="button"
              onClick={() => handleRatingChange(star)}
              className={`text-2xl ${
                star <= rating ? "text-yellow-400" : "text-gray-300"
              } hover:text-yellow-400 transition-colors`}
            >
              ★
            </button>
          ))}
        </div>
        <p className="text-sm text-gray-600">
          {rating > 0 ? `${rating} star${rating > 1 ? 's' : ''}` : 'No rating selected'}
        </p>
        {fieldState.invalid && (
          <p className="text-red-500 text-sm">{fieldState.error?.message}</p>
        )}
      </div>
    );
  }
};
```

## Form Validation Examples

### Cross-Field Validation

```tsx
const passwordFields: FieldConfig[] = [
  {
    name: "password",
    label: "Password",
    type: "password",
    required: true,
    placeholder: "Enter password"
  },
  {
    name: "confirmPassword",
    label: "Confirm Password",
    type: "password",
    required: true,
    placeholder: "Confirm password",
    customValidation: (value, context) => {
      const password = context.parent?.password;
      return value === password;
    },
    customValidationMessage: "Passwords do not match"
  }
];
```

### Async Validation

```tsx
const emailField: FieldConfig = {
  name: "email",
  label: "Email",
  type: "email",
  required: true,
  customValidation: async (value) => {
    // Check if email is already taken
    const response = await fetch(`/api/check-email?email=${value}`);
    const data = await response.json();
    return !data.exists;
  },
  customValidationMessage: "This email is already registered"
};
```

## Layout Examples

### Two-Column Layout

```tsx
<FormEditor 
  fields={fields}
  labelPosition="left"
  formClassName="grid grid-cols-1 md:grid-cols-2 gap-6"
  className="max-w-6xl mx-auto"
/>
```

### Card-Based Layout

```tsx
<FormEditor 
  fields={fields}
  labelPosition="top"
  formClassName="space-y-8"
  className="max-w-4xl mx-auto"
  children={
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div className="bg-gray-50 p-6 rounded-lg">
        <h3 className="font-semibold mb-4">Personal Information</h3>
        {/* Personal fields */}
      </div>
      <div className="bg-gray-50 p-6 rounded-lg">
        <h3 className="font-semibold mb-4">Contact Information</h3>
        {/* Contact fields */}
      </div>
    </div>
  }
/>
```

These examples demonstrate the flexibility and power of the Dynamic Form Builder in various real-world scenarios.
