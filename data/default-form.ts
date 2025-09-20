import { FieldConfig } from "@/types/fields-type";

export const defaultFields: FieldConfig[] = [
  {
    name: "email",
    label: "Email",
    type: "email",
    required: true,
    placeholder: "Enter your email address",
    defaultValue: "test@test.com",
    requiredMessage: "Email address is required",
  },
  {
    name: "username",
    label: "Username",
    type: "text",
    required: true,
    maxlength: 10,
    placeholder: "Enter username (max 10 characters)",
    regex: /^[a-zA-Z0-9_]+$/,
    requiredMessage: "Please provide a username",
    maxlengthMessage: "Username cannot exceed 10 characters",
    regexMessage: "Username can only contain letters, numbers, and underscores",
  },
  {
    name: "phone",
    label: "Phone Number",
    type: "text",
    required: true,
    placeholder: "Enter phone number (e.g., +1234567890)",
    regex: /^\+?[\d\s\-\(\)]+$/,
    requiredMessage: "Phone number is mandatory",
    regexMessage: "Please enter a valid phone number format",
  },
  {
    name: "quantity",
    label: "Quantity",
    type: "number",
    required: true,
    min: 1,
    max: 100,
    requiredMessage: "Quantity is required",
    minMessage: "Minimum quantity is 1",
    maxMessage: "Maximum quantity is 100",
  },
  {
    name: "quantityarea",
    label: "Description",
    type: "textarea",
    required: true,
    maxlength: 200,
    placeholder: "Enter description (max 200 characters)",
    regex: /^[a-zA-Z0-9\s\.,!?\-]+$/,
    requiredMessage: "Description is required",
    maxlengthMessage: "Description must be 200 characters or less",
    regexMessage: "Description contains invalid characters",
  },
  {
    name: "age",
    label: "Age",
    type: "number",
    required: true,
    min: 18,
    max: 120,
    placeholder: "Enter your age",
    requiredMessage: "Age is required",
    minMessage: "You must be at least 18 years old",
    maxMessage: "Age cannot exceed 120 years",
    customValidation: (
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
    ) => {
      if (typeof value !== "string" && typeof value !== "number")
        return "Please enter a valid age";
      const numValue = typeof value === "string" ? parseFloat(value) : value;
      if (isNaN(numValue)) return "Please enter a valid age";
      if (numValue < 0) return "Age cannot be negative";
      if (numValue < 18) return "You must be at least 18 years old to register";
      if (numValue > 120) return "Please enter a realistic age";
      if (numValue > 65) return "Senior discount available!";
      return true;
    },
    customValidationMessage: "Age validation failed",
  },
  {
    name: "website",
    label: "Website URL",
    type: "url",
    required: false,
    placeholder: "Enter your website URL (optional)",
    requiredMessage: "Website URL is required",
    customValidation: async (
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
    ) => {
      if (typeof value !== "string" && typeof value !== "number") return true;
      const strValue = String(value);
      if (!strValue) return true; // Optional field

      // Simulate async validation (e.g., checking if URL is accessible)
      return new Promise((resolve) => {
        setTimeout(() => {
          // Additional custom validation beyond basic URL format
          if (
            strValue.includes("localhost") ||
            strValue.includes("127.0.0.1")
          ) {
            resolve("Please enter a public URL, not a localhost address");
          } else {
            resolve(true);
          }
        }, 100);
      });
    },
    customValidationMessage: "URL validation failed",
  },
  {
    name: "portfolio",
    label: "Portfolio URL",
    type: "url",
    required: true,
    placeholder: "https://yourportfolio.com",
    requiredMessage: "Portfolio URL is required",
    maxlength: 200,
    maxlengthMessage: "Portfolio URL must be 200 characters or less",
  },
  {
    name: "country",
    label: "Country",
    type: "select",
    required: true,
    placeholder: "Select your country",
    requiredMessage: "Please select a country",
    options: [
      { value: "us", label: "United States" },
      { value: "ca", label: "Canada" },
      { value: "uk", label: "United Kingdom" },
      { value: "au", label: "Australia" },
      { value: "de", label: "Germany" },
      { value: "fr", label: "France" },
      { value: "jp", label: "Japan" },
      { value: "in", label: "India" },
    ],
    clearable: true,
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
      { value: "php", label: "PHP" },
    ],
  },
  {
    name: "experience",
    label: "Experience Level",
    type: "searchable-select",
    required: true,
    placeholder: "Select your experience level",
    requiredMessage: "Please select your experience level",
    clearable: true,
    options: [
      { value: "junior", label: "Junior (0-2 years)" },
      { value: "mid", label: "Mid-level (2-5 years)" },
      { value: "senior", label: "Senior (5-10 years)" },
      { value: "lead", label: "Lead (10+ years)" },
    ],
  },
  {
    name: "terms",
    label: "I agree to the terms and conditions",
    type: "checkbox",
    required: true,
    requiredMessage: "You must agree to the terms and conditions",
    checkedValue: true,
    uncheckedValue: false,
    labelPosition: "right",
  },
  {
    name: "newsletter",
    label: "Subscribe to newsletter",
    type: "checkbox",
    required: false,
    checkedValue: "subscribed",
    uncheckedValue: "unsubscribed",
    labelPosition: "right",
    defaultValue: "unsubscribed",
  },
  {
    name: "birthDate",
    label: "Birth Date",
    type: "date",
    required: true,
    placeholder: "Select your birth date",
    requiredMessage: "Birth date is required",
    maxDate: new Date().toISOString().split("T")[0], // Today's date
  },
  {
    name: "appointmentTime",
    label: "Appointment Time",
    type: "date",
    required: false,
    placeholder: "Select appointment date and time",
    showTime: true,
    minDate: new Date().toISOString().split("T")[0], // Today's date
  },
  {
    name: "profilePicture",
    label: "Profile Picture",
    type: "file",
    required: false,
    accept: "image/*",
    maxSize: 5 * 1024 * 1024, // 5MB
  },
  {
    name: "documents",
    label: "Supporting Documents",
    type: "file",
    required: true,
    multiple: true,
    accept: ".pdf,.doc,.docx",
    maxFiles: 5,
    maxSize: 10 * 1024 * 1024, // 10MB
    requiredMessage: "Please upload at least one document",
  },
  {
    name: "notes",
    label: "Internal Notes",
    type: "textarea",
    required: false,
    placeholder: "Internal notes (no validation, no error messages)",
    disableError: true,
    disableErrorMessage: true,
  },
  {
    name: "comments",
    label: "Comments",
    type: "text",
    required: true,
    placeholder: "Comments (no validation, but shows red border on error)",
    disableError: false,
    disableErrorMessage: true,
  },
  {
    name: "customField",
    label: "Custom Field",
    type: "text",
    required: true,
    placeholder: "This field uses a custom render component",
    renderComponent: ({ field, fieldState, fieldConfig }) => {
      const React = require("react");
      return React.createElement(
        "div",
        { className: "space-y-2" },
        React.createElement("input", {
          ...field,
          className: `w-full px-3 py-2 border rounded-md ${
            fieldState.invalid ? "border-red-500" : "border-gray-300"
          }`,
          placeholder: fieldConfig.placeholder,
        }),
        fieldState.invalid &&
          fieldState.error &&
          React.createElement(
            "p",
            { className: "text-red-500 text-sm" },
            fieldState.error.message
          ),
        React.createElement(
          "div",
          { className: "text-xs text-gray-500" },
          "Custom rendered field with additional info"
        )
      );
    },
  },
  {
    name: "password",
    label: "Password",
    type: "password",
    required: true,
    placeholder: "Enter a strong password",
    requiredMessage: "Password is required",
    defaultShowPassword: true,
    customValidation: (
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
    ) => {
      if (typeof value !== "string" && typeof value !== "number")
        return "Password is required";
      const strValue = String(value);
      if (!strValue) return "Password is required";

      const hasUpperCase = /[A-Z]/.test(strValue);
      const hasLowerCase = /[a-z]/.test(strValue);
      const hasNumbers = /\d/.test(strValue);
      const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(strValue);
      const isLongEnough = strValue.length >= 8;

      if (!isLongEnough) return "Password must be at least 8 characters long";
      if (!hasUpperCase)
        return "Password must contain at least one uppercase letter";
      if (!hasLowerCase)
        return "Password must contain at least one lowercase letter";
      if (!hasNumbers) return "Password must contain at least one number";
      if (!hasSpecialChar)
        return "Password must contain at least one special character";

      return true;
    },
    customValidationMessage: "Password does not meet security requirements",
  },
  {
    name: "hobbies",
    label: "Hobbies",
    type: "array",
    required: false,
    itemType: "text",
    itemConfig: {
      label: "Hobby",
      placeholder: "Enter a hobby",
      required: true,
    },
    minItems: 0,
    maxItems: 5,
    addButtonText: "Add Hobby",
    removeButtonText: "Remove",
    defaultValue: ["Reading", "Gaming"],
  },
  {
    name: "contactNumbers",
    label: "Contact Numbers",
    type: "array",
    required: true,
    itemType: "text",
    itemConfig: {
      label: "Phone Number",
      placeholder: "Enter phone number",
      required: true,
      regex: /^\+?[\d\s\-\(\)]+$/,
      regexMessage: "Please enter a valid phone number format",
    },
    minItems: 2,
    maxItems: 3,
    addButtonText: "Add Number",
    removeButtonText: "Remove",
    requiredMessage: "At least one contact number is required",
    minItemsMessage: "Please provide at least 2 contact numbers",
    maxItemsMessage: "Maximum 3 contact numbers allowed",
    defaultValue: [],
  },
  {
    name: "skills",
    label: "Technical Skills",
    type: "array",
    required: false,
    itemType: "select",
    itemConfig: {
      label: "Skill",
      placeholder: "Select a skill",
      required: true,
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
        { value: "php", label: "PHP" },
      ],
      clearable: true,
    },
    minItems: 0,
    maxItems: 10,
    addButtonText: "Add Skill",
    removeButtonText: "Remove",
  },
  {
    name: "workExperience",
    label: "Work Experience",
    type: "array",
    required: true,
    itemType: "textarea",
    itemConfig: {
      label: "Experience Description",
      placeholder: "Describe your work experience",
      required: true,
      maxlength: 500,
      maxlengthMessage: "Experience description must be 500 characters or less",
    },
    minItems: 1,
    maxItems: 5,
    addButtonText: "Add Experience",
    removeButtonText: "Remove",
    requiredMessage: "At least one work experience is required",
    minItemsMessage: "Please provide at least one work experience",
    maxItemsMessage: "Maximum 5 work experiences allowed",
    defaultValue: [], // Start with empty array to trigger validation
  },
];
