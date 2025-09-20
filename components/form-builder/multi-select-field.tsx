import React, { useState } from "react";
import { ControllerRenderProps } from "react-hook-form";
import { cn } from "@/lib/utils";
import type { FormData } from "./form-editor";
import { Button } from "../ui/button";
import { Checkbox } from "../ui/checkbox";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "../ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";

interface SelectOption {
  value: string;
  label: string;
  disabled?: boolean;
}

interface MultiSelectFieldProps {
  field: ControllerRenderProps<FormData, keyof FormData>;
  id: string;
  required?: boolean;
  className: string;
  placeholder?: string;
  error?: boolean;
  options: SelectOption[];
  searchable?: boolean;
  maxSelections?: number;
}

export function MultiSelectField({
  field,
  className,
  placeholder,
  error,
  options,
  searchable = true,
  maxSelections,
}: MultiSelectFieldProps) {
  const { onChange, value } = field;
  const [open, setOpen] = useState(false);
  const [searchValue, setSearchValue] = useState("");

  const selectedValues = Array.isArray(value) ? value : [];
  const selectedOptions = options.filter((option) =>
    selectedValues.includes(option.value)
  );

  const handleSelect = (optionValue: string) => {
    const newValues = selectedValues.includes(optionValue)
      ? selectedValues.filter((v) => v !== optionValue)
      : [...selectedValues, optionValue];

    if (!maxSelections || newValues.length <= maxSelections) {
      onChange(newValues);
    } else {
      // Show warning when limit is reached
      setSearchValue(`Maximum ${maxSelections} selections allowed`);
      setTimeout(() => setSearchValue(""), 2000);
    }
  };


  const filteredOptions = searchable
    ? options.filter((option) =>
        option.label.toLowerCase().includes(searchValue.toLowerCase())
      )
    : options;

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          id={field.name}
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className={cn(
            "w-full justify-between min-h-9 h-auto",
            error && "border-destructive ring-destructive/20",
            className
          )}
          aria-invalid={error}
        >
          <div className="flex flex-wrap gap-1 flex-1">
            {selectedOptions.length > 0 ? (
              selectedOptions.map((option) => (
                <span
                  key={option.value}
                  className="bg-primary/10 text-primary px-2 py-1 rounded text-xs"
                >
                  {option.label}
                </span>
              ))
            ) : (
              <span className="text-muted-foreground">
                {placeholder || "Select options..."}
              </span>
            )}
            {maxSelections && (
              <span className="text-xs text-muted-foreground ml-auto">
                {selectedValues.length}/{maxSelections}
              </span>
            )}
          </div>
        </Button>
      </PopoverTrigger>
      <PopoverContent
        className="w-[var(--radix-popover-trigger-width)] p-0"
        align="start"
      >
        <Command>
          {searchable && (
            <CommandInput
              placeholder="Search options..."
              value={searchValue}
              onValueChange={setSearchValue}
            />
          )}
          <CommandList>
            <CommandEmpty>No options found.</CommandEmpty>
            <CommandGroup>
              {filteredOptions.map((option) => {
                const isSelected = selectedValues.includes(option.value);
                const isDisabled =
                  option.disabled ||
                  (!isSelected &&
                    maxSelections &&
                    selectedValues.length >= maxSelections);

                return (
                  <CommandItem
                    key={option.value}
                    value={option.value}
                    onSelect={() => handleSelect(option.value)}
                    disabled={Boolean(isDisabled)}
                    className="cursor-pointer"
                  >
                    <Checkbox
                      checked={isSelected}
                      className="mr-2"
                      disabled={Boolean(isDisabled)}
                    />
                    {option.label}
                  </CommandItem>
                );
              })}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
