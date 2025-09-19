import React from "react";
import { ControllerRenderProps } from "react-hook-form";
import { cn } from "@/lib/utils";
import type { FormData } from "./form-editor";
import { Button } from "../ui/button";
import { Upload, X } from "lucide-react";

interface FileFieldProps {
  field: ControllerRenderProps<FormData, keyof FormData>;
  id: string;
  required?: boolean;
  className: string;
  error?: boolean;
  accept?: string;
  multiple?: boolean;
  maxSize?: number;
  maxFiles?: number;
}

export function FileField({
  field,
  id,
  required,
  className,
  error,
  accept,
  multiple = false,
  maxSize,
  maxFiles,
}: FileFieldProps) {
  const { onChange, onBlur, name } = field;

  const validateFiles = (files: FileList | File[]): string | null => {
    const fileArray = Array.from(files);
    
    if (maxFiles && fileArray.length > maxFiles) {
      return `Maximum ${maxFiles} files allowed`;
    }
    
    for (const file of fileArray) {
      if (maxSize && file.size > maxSize) {
        return `File "${file.name}" is too large. Maximum size is ${Math.round(maxSize / 1024 / 1024)}MB`;
      }
    }
    
    return null;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      const validationError = validateFiles(files);
      if (validationError) {
        // Show error but don't prevent file selection
        alert(validationError);
        return;
      }
      
      if (multiple) {
        onChange(Array.from(files));
      } else {
        onChange(files[0] || null);
      }
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();

    const files = e.dataTransfer.files;
    if (files) {
      const validationError = validateFiles(files);
      if (validationError) {
        alert(validationError);
        return;
      }
      
      if (multiple) {
        onChange(Array.from(files));
      } else {
        onChange(files[0] || null);
      }
    }
  };

  const handleRemove = (index: number) => {
    if (multiple && Array.isArray(field.value)) {
      const newFiles = field.value.filter((_, i) => i !== index);
      onChange(newFiles);
    } else {
      onChange(null);
    }
  };

  const files = multiple ? (Array.isArray(field.value) ? field.value : []) : (field.value ? [field.value] : []);

  return (
    <div className="space-y-4">
      <div
        className={cn(
          "relative border-2 border-dashed border-input rounded-lg p-6 text-center hover:border-primary transition-colors",
          error && "border-destructive",
          className
        )}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
      >
        <input
          id={id}
          type="file"
          name={name as string}
          onChange={handleChange}
          onBlur={onBlur}
          required={required}
          accept={accept}
          multiple={multiple}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          aria-invalid={error}
        />
        <div className="space-y-2">
          <Upload className="mx-auto h-8 w-8 text-muted-foreground" />
          <div className="text-sm text-muted-foreground">
            {multiple
              ? "Click to upload files or drag and drop"
              : "Click to upload file or drag and drop"}
          </div>
          <div className="text-xs text-muted-foreground">
            {accept && `Accepted formats: ${accept}`}
            {maxSize && ` • Max size: ${Math.round(maxSize / 1024)}KB`}
            {maxFiles && multiple && ` • Max files: ${maxFiles}`}
          </div>
        </div>
      </div>
      
      {files.length > 0 && (
        <div className="space-y-2">
          <div className="text-sm font-medium">Selected files:</div>
          {files.map((file, index) => (
            <div
              key={index}
              className="flex items-center justify-between p-2 border rounded-md"
            >
              <span className="text-sm truncate">{file.name}</span>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => handleRemove(index)}
                className="h-6 w-6 p-0"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
