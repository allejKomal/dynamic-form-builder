import React, { createContext, useContext, ReactNode } from 'react';

// Field component registry type
type FieldComponent = React.ComponentType<Record<string, unknown>>;

interface FormBuilderContextType {
  // Register a custom field component
  registerField: (type: string, component: FieldComponent) => void;
  // Get a field component by type
  getFieldComponent: (type: string) => FieldComponent | null;
  // Check if a field type is registered
  hasFieldType: (type: string) => boolean;
  // Get all registered field types
  getRegisteredTypes: () => string[];
}

const FormBuilderContext = createContext<FormBuilderContextType | null>(null);

interface FormBuilderProviderProps {
  children: ReactNode;
  customFields?: Record<string, FieldComponent>;
}

export function FormBuilderProvider({ children, customFields = {} }: FormBuilderProviderProps) {
  const fieldRegistry = new Map<string, FieldComponent>();

  // Register custom fields
  Object.entries(customFields).forEach(([type, component]) => {
    fieldRegistry.set(type, component);
  });

  const registerField = (type: string, component: FieldComponent) => {
    fieldRegistry.set(type, component);
  };

  const getFieldComponent = (type: string): FieldComponent | null => {
    return fieldRegistry.get(type) || null;
  };

  const hasFieldType = (type: string): boolean => {
    return fieldRegistry.has(type);
  };

  const getRegisteredTypes = (): string[] => {
    return Array.from(fieldRegistry.keys());
  };

  const value: FormBuilderContextType = {
    registerField,
    getFieldComponent,
    hasFieldType,
    getRegisteredTypes,
  };

  return (
    <FormBuilderContext.Provider value={value}>
      {children}
    </FormBuilderContext.Provider>
  );
}

export function useFormBuilder() {
  const context = useContext(FormBuilderContext);
  if (!context) {
    throw new Error('useFormBuilder must be used within a FormBuilderProvider');
  }
  return context;
}