# Installation & Setup

This guide will help you install and set up the Dynamic Form Builder in your React project.

## Prerequisites

Before installing the Dynamic Form Builder, ensure you have the following:

- **Node.js** 18.0 or higher
- **React** 18.0 or higher
- **TypeScript** 5.0 or higher (recommended)
- **npm** or **yarn** package manager

## Installation

### 1. Install Core Dependencies

The Dynamic Form Builder requires several peer dependencies. Install them first:

```bash
# Using npm
npm install react-hook-form @hookform/resolvers yup

# Using yarn
yarn add react-hook-form @hookform/resolvers yup
```

### 2. Install UI Dependencies

Install the required UI component libraries:

```bash
# Using npm
npm install @radix-ui/react-select @radix-ui/react-checkbox @radix-ui/react-dialog @radix-ui/react-popover @radix-ui/react-label @radix-ui/react-slot

# Using yarn
yarn add @radix-ui/react-select @radix-ui/react-checkbox @radix-ui/react-dialog @radix-ui/react-popover @radix-ui/react-label @radix-ui/react-slot
```

### 3. Install Additional Dependencies

Install utility libraries and icons:

```bash
# Using npm
npm install lucide-react class-variance-authority clsx tailwind-merge cmdk date-fns react-day-picker

# Using yarn
yarn add lucide-react class-variance-authority clsx tailwind-merge cmdk date-fns react-day-picker
```

### 4. Install TypeScript Types (if using TypeScript)

```bash
# Using npm
npm install --save-dev @types/react @types/react-dom @types/node

# Using yarn
yarn add -D @types/react @types/react-dom @types/node
```

## Project Setup

### 1. Copy Component Files

Copy the following files to your project:

```
src/components/
├── form-builder/
│   ├── form-editor.tsx
│   ├── input-field.tsx
│   ├── email-field.tsx
│   ├── password-field.tsx
│   ├── number-field.tsx
│   ├── text-area-field.tsx
│   ├── select-field.tsx
│   ├── multi-select-field.tsx
│   ├── searchable-select-field.tsx
│   ├── checkbox-field.tsx
│   ├── date-field.tsx
│   ├── file-field.tsx
│   └── url-field.tsx
├── ui/
│   ├── button.tsx
│   ├── calendar.tsx
│   ├── checkbox.tsx
│   ├── command.tsx
│   ├── dialog.tsx
│   ├── form.tsx
│   ├── input.tsx
│   ├── label.tsx
│   ├── popover.tsx
│   ├── select.tsx
│   └── textarea.tsx
└── utils.ts
```

### 2. Copy Type Definitions

Copy the type definitions:

```
src/types/
└── fields-type.ts
```

### 3. Install Tailwind CSS

If you haven't already, install and configure Tailwind CSS:

```bash
# Using npm
npm install -D tailwindcss postcss autoprefixer

# Using yarn
yarn add -D tailwindcss postcss autoprefixer
```

Initialize Tailwind:

```bash
npx tailwindcss init -p
```

Update your `tailwind.config.js`:

```javascript
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
    },
  },
  plugins: [],
}
```

### 4. Add CSS Variables

Add the following CSS variables to your global CSS file:

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  :root {
    --background: 0 0% 100%;
    --foreground: 222.2 84% 4.9%;
    --card: 0 0% 100%;
    --card-foreground: 222.2 84% 4.9%;
    --popover: 0 0% 100%;
    --popover-foreground: 222.2 84% 4.9%;
    --primary: 222.2 47.4% 11.2%;
    --primary-foreground: 210 40% 98%;
    --secondary: 210 40% 96%;
    --secondary-foreground: 222.2 47.4% 11.2%;
    --muted: 210 40% 96%;
    --muted-foreground: 215.4 16.3% 46.9%;
    --accent: 210 40% 96%;
    --accent-foreground: 222.2 47.4% 11.2%;
    --destructive: 0 84.2% 60.2%;
    --destructive-foreground: 210 40% 98%;
    --border: 214.3 31.8% 91.4%;
    --input: 214.3 31.8% 91.4%;
    --ring: 222.2 84% 4.9%;
    --radius: 0.5rem;
  }

  .dark {
    --background: 222.2 84% 4.9%;
    --foreground: 210 40% 98%;
    --card: 222.2 84% 4.9%;
    --card-foreground: 210 40% 98%;
    --popover: 222.2 84% 4.9%;
    --popover-foreground: 210 40% 98%;
    --primary: 210 40% 98%;
    --primary-foreground: 222.2 47.4% 11.2%;
    --secondary: 217.2 32.6% 17.5%;
    --secondary-foreground: 210 40% 98%;
    --muted: 217.2 32.6% 17.5%;
    --muted-foreground: 215 20.2% 65.1%;
    --accent: 217.2 32.6% 17.5%;
    --accent-foreground: 210 40% 98%;
    --destructive: 0 62.8% 30.6%;
    --destructive-foreground: 210 40% 98%;
    --border: 217.2 32.6% 17.5%;
    --input: 217.2 32.6% 17.5%;
    --ring: 212.7 26.8% 83.9%;
  }
}

@layer base {
  * {
    @apply border-border;
  }
  body {
    @apply bg-background text-foreground;
  }
}
```

## Next.js Setup

### 1. Install Next.js (if not already installed)

```bash
# Using npm
npx create-next-app@latest my-app --typescript --tailwind --eslint --app

# Using yarn
yarn create next-app my-app --typescript --tailwind --eslint --app
```

### 2. Configure Next.js

Update your `next.config.js`:

```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    turbo: {
      rules: {
        '*.svg': {
          loaders: ['@svgr/webpack'],
          as: '*.js',
        },
      },
    },
  },
}

module.exports = nextConfig
```

### 3. Update tsconfig.json

Ensure your `tsconfig.json` includes the necessary paths:

```json
{
  "compilerOptions": {
    "target": "es5",
    "lib": ["dom", "dom.iterable", "es6"],
    "allowJs": true,
    "skipLibCheck": true,
    "strict": true,
    "noEmit": true,
    "esModuleInterop": true,
    "module": "esnext",
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "preserve",
    "incremental": true,
    "plugins": [
      {
        "name": "next"
      }
    ],
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"]
    }
  },
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts"],
  "exclude": ["node_modules"]
}
```

## Vite Setup

### 1. Create Vite Project

```bash
# Using npm
npm create vite@latest my-app -- --template react-ts

# Using yarn
yarn create vite my-app --template react-ts
```

### 2. Install Dependencies

```bash
cd my-app
npm install
# or
yarn install
```

### 3. Configure Vite

Update your `vite.config.ts`:

```typescript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
})
```

## Create React App Setup

### 1. Create CRA Project

```bash
# Using npm
npx create-react-app my-app --template typescript

# Using yarn
yarn create react-app my-app --template typescript
```

### 2. Install Dependencies

```bash
cd my-app
npm install
# or
yarn install
```

### 3. Configure Path Aliases

Update your `tsconfig.json`:

```json
{
  "compilerOptions": {
    "baseUrl": "src",
    "paths": {
      "@/*": ["*"]
    }
  }
}
```

## Basic Usage

### 1. Create a Simple Form

Create a new file `src/components/MyForm.tsx`:

```tsx
import { useRef } from "react";
import FormEditor, { FormEditorRef } from "@/components/form-builder/form-editor";
import { FieldConfig } from "@/types/fields-type";

const fields: FieldConfig[] = [
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
  }
];

export default function MyForm() {
  const formRef = useRef<FormEditorRef>(null);

  const handleSubmit = (data: Record<string, unknown>) => {
    console.log("Form submitted:", data);
  };

  return (
    <div className="max-w-md mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">My Form</h1>
      <FormEditor 
        fields={fields}
        onSubmit={handleSubmit}
        labelPosition="top"
      />
    </div>
  );
}
```

### 2. Use in Your App

Update your `src/App.tsx` (or `src/app/page.tsx` for Next.js):

```tsx
import MyForm from "./components/MyForm";

function App() {
  return (
    <div className="min-h-screen bg-gray-50 py-10">
      <MyForm />
    </div>
  );
}

export default App;
```

## Troubleshooting

### Common Issues

#### 1. Module Resolution Errors

If you encounter module resolution errors, ensure your `tsconfig.json` has the correct path aliases:

```json
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"]
    }
  }
}
```

#### 2. CSS Not Loading

Make sure you have imported Tailwind CSS in your main CSS file:

```css
@tailwind base;
@tailwind components;
@tailwind utilities;
```

#### 3. TypeScript Errors

Ensure all type definitions are properly imported:

```tsx
import { FieldConfig } from "@/types/fields-type";
import { FormEditorRef } from "@/components/form-builder/form-editor";
```

#### 4. Missing Dependencies

If you encounter missing dependency errors, install the required packages:

```bash
npm install react-hook-form @hookform/resolvers yup lucide-react
```

### Getting Help

If you encounter issues not covered in this guide:

1. Check the [API Reference](./API.md) for detailed component documentation
2. Review the [Examples](./EXAMPLES.md) for usage patterns
3. Check the [Type Definitions](./TYPES.md) for TypeScript support
4. Open an issue on the GitHub repository

## Next Steps

Once you have the Dynamic Form Builder installed and working:

1. Explore the [Examples](./EXAMPLES.md) for different use cases
2. Read the [API Reference](./API.md) for detailed component documentation
3. Check the [Type Definitions](./TYPES.md) for TypeScript support
4. Customize the styling to match your design system
5. Add custom field components for your specific needs

Happy coding! 🚀
