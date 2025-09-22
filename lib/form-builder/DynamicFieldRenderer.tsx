import React from 'react';
import { ControllerRenderProps, ControllerFieldState } from 'react-hook-form';
import { FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { FieldConfig } from '@/types/fields-type';
import { FormData } from './useFormState';
import { useFormBuilder } from './FormBuilderContext';
import { cn } from '@/lib/utils';

interface DynamicFieldRendererProps {
  field: FieldConfig;
  formField: ControllerRenderProps<FormData, keyof FormData>;
  fieldState: ControllerFieldState;
  labelPosition: 'left' | 'top';
  className?: string;
}

export function DynamicFieldRenderer({
  field,
  formField,
  fieldState,
  labelPosition,
  className,
}: DynamicFieldRendererProps) {
  const { getFieldComponent, hasFieldType } = useFormBuilder();

  // Check if field type is registered
  if (!hasFieldType(field.type)) {
    console.warn(`Field type "${field.type}" is not registered. Please register it using FormBuilderProvider.`);
    return (
      <FormItem className={cn(labelPosition === 'left' ? 'flex gap-5 items-start' : 'space-y-2', className)}>
        <FormLabel htmlFor={field.name} className={cn(labelPosition === 'left' ? 'min-w-[200px] pt-2' : '')}>
          {field.label} {field.required && <span className="text-red-500">*</span>}
        </FormLabel>
        <div className={labelPosition === 'left' ? 'flex-1' : ''}>
          <p className="text-red-500 text-sm">Error: Unknown field type &quot;{field.type}&quot;</p>
        </div>
      </FormItem>
    );
  }

  // Get the field component from context
  const FieldComponent = getFieldComponent(field.type);
  
  if (!FieldComponent) {
    return (
      <FormItem className={cn(labelPosition === 'left' ? 'flex gap-5 items-start' : 'space-y-2', className)}>
        <FormLabel htmlFor={field.name} className={cn(labelPosition === 'left' ? 'min-w-[200px] pt-2' : '')}>
          {field.label} {field.required && <span className="text-red-500">*</span>}
        </FormLabel>
        <div className={labelPosition === 'left' ? 'flex-1' : ''}>
          <p className="text-red-500 text-sm">Error: Field component not found for type &quot;{field.type}&quot;</p>
        </div>
      </FormItem>
    );
  }

  return (
    <FormItem className={cn(labelPosition === 'left' ? 'flex gap-5 items-start' : 'space-y-2', className)}>
      <FormLabel htmlFor={field.name} className={cn(labelPosition === 'left' ? 'min-w-[200px] pt-2' : '')}>
        {field.label} {field.required && <span className="text-red-500">*</span>}
      </FormLabel>
      <div className={labelPosition === 'left' ? 'flex-1' : ''}>
        <FormControl>
          <FieldComponent
            field={formField}
            fieldState={fieldState}
            fieldConfig={field}
            error={!!fieldState.error}
            className={className}
            {...field} // Pass all field config props to the component
          />
        </FormControl>
        {!field.disableErrorMessage && <FormMessage />}
      </div>
    </FormItem>
  );
}
