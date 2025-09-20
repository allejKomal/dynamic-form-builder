import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { ArrayFieldConfig } from "@/types/fields-type";
import SimpleFormBuilder from "@/components/form-builder/form-editor";

describe('Array Field Tests (type: "array")', () => {
  const getDefaultArrayField = (
    overrides: Partial<ArrayFieldConfig> = {}
  ): ArrayFieldConfig[] => [
    {
      name: "items",
      label: "Items",
      type: "array",
      itemType: "text",
      itemConfig: {
        placeholder: "Enter item",
        required: true,
        maxlength: 50,
        label: "Item",
      },
      minItems: 1,
      maxItems: 5,
      addButtonText: "Add Item",
      removeButtonText: "Remove",
      required: true,
      requiredMessage: "At least one item is required",
      ...overrides,
    },
  ];

  describe("Basic Rendering", () => {
    test("renders array field with label", () => {
      render(<SimpleFormBuilder fields={getDefaultArrayField()} />);
      expect(screen.getByText("Items")).toBeInTheDocument();
      expect(screen.getByText(/Add Item/)).toBeInTheDocument();
    });

    test("renders with custom button texts", () => {
      render(
        <SimpleFormBuilder
          fields={getDefaultArrayField({
            addButtonText: "Add New Item",
            removeButtonText: "Delete",
          })}
        />
      );
      expect(screen.getByText(/Add New Item/)).toBeInTheDocument();
    });

    test("shows required indicator", () => {
      render(<SimpleFormBuilder fields={getDefaultArrayField()} />);
      expect(screen.getByText("*")).toBeInTheDocument();
    });
  });

  describe("Adding Items", () => {
    test("adds new item when add button is clicked", async () => {
      render(<SimpleFormBuilder fields={getDefaultArrayField()} />);

      const addButton = screen.getByText(/Add Item/);
      fireEvent.click(addButton);

      await waitFor(() => {
        expect(screen.getByPlaceholderText("Enter item")).toBeInTheDocument();
      });
    });

    test("adds multiple items", async () => {
      render(<SimpleFormBuilder fields={getDefaultArrayField()} />);

      const addButton = screen.getByText(/Add Item/);
      fireEvent.click(addButton);
      fireEvent.click(addButton);

      await waitFor(() => {
        const inputs = screen.getAllByPlaceholderText("Enter item");
        expect(inputs).toHaveLength(2);
      });
    });

    test("respects maxItems limit", async () => {
      render(
        <SimpleFormBuilder fields={getDefaultArrayField({ maxItems: 2 })} />
      );

      const addButton = screen.getByText(/Add Item/);
      fireEvent.click(addButton);
      fireEvent.click(addButton);
      fireEvent.click(addButton); // This should not add a third item

      await waitFor(() => {
        const inputs = screen.getAllByPlaceholderText("Enter item");
        expect(inputs).toHaveLength(2);
      });

      expect(addButton).toBeDisabled();
    });

    test("shows max items message when limit reached", async () => {
      render(
        <SimpleFormBuilder fields={getDefaultArrayField({ maxItems: 1 })} />
      );

      const addButton = screen.getByText(/Add Item/);
      fireEvent.click(addButton);

      await waitFor(() => {
        expect(screen.getByText("Maximum 1 items allowed")).toBeInTheDocument();
      });
    });
  });

  describe("Removing Items", () => {
    test("removes item when remove button is clicked", async () => {
      render(
        <SimpleFormBuilder 
          fields={getDefaultArrayField({ minItems: 0 })} 
        />
      );

      const addButton = screen.getByText(/Add Item/);
      fireEvent.click(addButton);

      await waitFor(() => {
        expect(screen.getByPlaceholderText("Enter item")).toBeInTheDocument();
      });

      const removeButton = screen.getByText("Remove");
      fireEvent.click(removeButton);

      await waitFor(() => {
        expect(
          screen.queryByPlaceholderText("Enter item")
        ).not.toBeInTheDocument();
      });
    });

    test("respects minItems limit", async () => {
      render(
        <SimpleFormBuilder fields={getDefaultArrayField({ minItems: 1 })} />
      );

      const addButton = screen.getByText(/Add Item/);
      fireEvent.click(addButton);

      await waitFor(() => {
        const removeButton = screen.getByText("Remove");
        expect(removeButton).toBeDisabled();
      });
    });

    test("enables remove button when above minItems", async () => {
      render(
        <SimpleFormBuilder fields={getDefaultArrayField({ minItems: 1 })} />
      );

      const addButton = screen.getByText(/Add Item/);
      fireEvent.click(addButton);
      fireEvent.click(addButton);

      await waitFor(() => {
        const removeButtons = screen.getAllByText("Remove");
        expect(removeButtons[0]).toBeEnabled();
        expect(removeButtons[1]).toBeEnabled();
      });
    });
  });

  describe("Different Item Types", () => {
    test("renders text input items", async () => {
      render(<SimpleFormBuilder fields={getDefaultArrayField()} />);

      const addButton = screen.getByText(/Add Item/);
      fireEvent.click(addButton);

      await waitFor(() => {
        const input = screen.getByPlaceholderText("Enter item");
        expect(input).toHaveAttribute("type", "text");
      });
    });

    test("renders email input items", async () => {
      render(
        <SimpleFormBuilder
          fields={getDefaultArrayField({
            itemType: "email",
            itemConfig: {
              placeholder: "Enter email",
              required: true,
              label: "Email",
            },
          })}
        />
      );

      const addButton = screen.getByText(/Add Item/);
      fireEvent.click(addButton);

      await waitFor(() => {
        const input = screen.getByPlaceholderText("Enter email");
        expect(input).toHaveAttribute("type", "email");
      });
    });

    test("renders number input items", async () => {
      render(
        <SimpleFormBuilder
          fields={getDefaultArrayField({
            itemType: "number",
            itemConfig: {
              placeholder: "Enter number",
              min: 0,
              max: 100,
              label: "Number",
            },
          })}
        />
      );

      const addButton = screen.getByText(/Add Item/);
      fireEvent.click(addButton);

      await waitFor(() => {
        const input = screen.getByPlaceholderText("Enter number");
        expect(input).toHaveAttribute("type", "number");
      });
    });

    test("renders textarea items", async () => {
      render(
        <SimpleFormBuilder
          fields={getDefaultArrayField({
            itemType: "textarea",
            itemConfig: {
              placeholder: "Enter description",
              maxlength: 200,
              label: "Description",
            },
          })}
        />
      );

      const addButton = screen.getByText(/Add Item/);
      fireEvent.click(addButton);

      await waitFor(() => {
        const textarea = screen.getByPlaceholderText("Enter description");
        expect(textarea.tagName).toBe("TEXTAREA");
      });
    });

    test("renders select items", async () => {
      render(
        <SimpleFormBuilder
          fields={getDefaultArrayField({
            itemType: "select",
            itemConfig: {
              placeholder: "Choose option",
              options: [
                { value: "option1", label: "Option 1" },
                { value: "option2", label: "Option 2" },
              ],
              label: "Option",
            },
          })}
        />
      );

      const addButton = screen.getByText(/Add Item/);
      fireEvent.click(addButton);

      await waitFor(() => {
        expect(screen.getByText("Choose option")).toBeInTheDocument();
      });
    });

    test("renders checkbox items", async () => {
      render(
        <SimpleFormBuilder
          fields={getDefaultArrayField({
            itemType: "checkbox",
            itemConfig: {
              label: "Check this",
              checkedValue: "yes",
              uncheckedValue: "no",
            },
          })}
        />
      );

      const addButton = screen.getByText(/Add Item/);
      fireEvent.click(addButton);

      await waitFor(() => {
        expect(screen.getByText("Check this")).toBeInTheDocument();
      });
    });

    test("renders date items", async () => {
      render(
        <SimpleFormBuilder
          fields={getDefaultArrayField({
            itemType: "date",
            itemConfig: {
              placeholder: "Select date",
              minDate: "2023-01-01",
              maxDate: "2024-12-31",
              label: "Date",
            },
          })}
        />
      );

      const addButton = screen.getByText(/Add Item/);
      fireEvent.click(addButton);

      await waitFor(() => {
        expect(screen.getByText("Select date")).toBeInTheDocument();
      });
    });
  });

  describe("Form Interaction", () => {
    test("updates form values when items are added and modified", async () => {
      const onSubmit = jest.fn();
      render(
        <SimpleFormBuilder
          fields={getDefaultArrayField()}
          onSubmit={onSubmit}
        />
      );

      const addButton = screen.getByText(/Add Item/);
      fireEvent.click(addButton);

      await waitFor(() => {
        const input = screen.getByPlaceholderText("Enter item");
        fireEvent.change(input, { target: { value: "Test item" } });
      });

      const submitButton = screen.getByText("Submit");
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(onSubmit).toHaveBeenCalledWith({
          items: ["Test item"],
        });
      });
    });

    test("validates required array field", async () => {
      render(<SimpleFormBuilder fields={getDefaultArrayField()} />);

      const submitButton = screen.getByText("Submit");
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(
          screen.getByText(/must have at least.*item/i)
        ).toBeInTheDocument();
      });
    });

    test("validates minItems constraint", async () => {
      render(
        <SimpleFormBuilder
          fields={getDefaultArrayField({
            minItems: 2,
            minItemsMessage: "At least 2 items required",
          })}
        />
      );

      const addButton = screen.getByText(/Add Item/);
      fireEvent.click(addButton);

      await waitFor(() => {
        const input = screen.getByPlaceholderText("Enter item");
        fireEvent.change(input, { target: { value: "One item" } });
      });

      const submitButton = screen.getByText("Submit");
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(
          screen.getByText(/at least.*2.*item.*required/i)
        ).toBeInTheDocument();
      });
    });

    test("validates maxItems constraint", async () => {
      render(
        <SimpleFormBuilder
          fields={getDefaultArrayField({
            maxItems: 1,
            maxItemsMessage: "Maximum 1 item allowed",
          })}
        />
      );

      const addButton = screen.getByText(/Add Item/);
      fireEvent.click(addButton);
      fireEvent.click(addButton);

      await waitFor(() => {
        const input = screen.getByPlaceholderText("Enter item");
        fireEvent.change(input, { target: { value: "First item" } });
      });

      const submitButton = screen.getByText("Submit");
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(
          screen.getByText(/maximum.*1.*item/i)
        ).toBeInTheDocument();
      });
    });
  });

  describe("Error States", () => {
    test("shows error styling when field has errors", async () => {
      render(<SimpleFormBuilder fields={getDefaultArrayField()} />);

      const submitButton = screen.getByText("Submit");
      fireEvent.click(submitButton);

      await waitFor(() => {
        const errorMessage = screen.getByText(/must have at least.*item/i);
        expect(errorMessage).toBeInTheDocument();
      });
    });

    test("shows error styling for individual items", async () => {
      render(
        <SimpleFormBuilder
          fields={getDefaultArrayField({
            itemType: "email",
            itemConfig: {
              placeholder: "Enter email",
              required: true,
              label: "Email",
            },
          })}
        />
      );

      const addButton = screen.getByText(/Add Item/);
      fireEvent.click(addButton);

      await waitFor(() => {
        const input = screen.getByPlaceholderText("Enter email");
        fireEvent.change(input, { target: { value: "invalid-email" } });
        fireEvent.blur(input);
      });

      await waitFor(() => {
        const input = screen.getByPlaceholderText("Enter email");
        expect(input).toHaveClass("border-destructive", "ring-destructive/20");
      });
    });
  });

  describe("Accessibility", () => {
    test("has proper ARIA attributes", async () => {
      render(<SimpleFormBuilder fields={getDefaultArrayField()} />);

      const addButton = screen.getByText(/Add Item/);
      fireEvent.click(addButton);

      await waitFor(() => {
        const input = screen.getByPlaceholderText("Enter item");
        expect(input).toHaveAttribute("name", "items[0]");
        expect(input).toHaveAttribute("id", "items-0");
      });
    });

    test("remove buttons have proper accessibility", async () => {
      render(<SimpleFormBuilder fields={getDefaultArrayField()} />);

      const addButton = screen.getByText(/Add Item/);
      fireEvent.click(addButton);

      await waitFor(() => {
        const removeButton = screen.getByText("Remove");
        expect(removeButton).toHaveAttribute("type", "button");
      });
    });
  });

  describe("Edge Cases", () => {
    test("handles empty array gracefully", () => {
      render(<SimpleFormBuilder fields={getDefaultArrayField()} />);
      expect(screen.getByText(/Add Item/)).toBeInTheDocument();
    });

    test("handles undefined value gracefully", () => {
      const fields = getDefaultArrayField();
      // Simulate undefined value by not providing default
      render(<SimpleFormBuilder fields={fields} />);
      expect(screen.getByText(/Add Item/)).toBeInTheDocument();
    });

    test("handles rapid add/remove operations", async () => {
      render(<SimpleFormBuilder fields={getDefaultArrayField()} />);

      const addButton = screen.getByText(/Add Item/);

      // Rapidly add multiple items
      fireEvent.click(addButton);
      fireEvent.click(addButton);
      fireEvent.click(addButton);

      await waitFor(() => {
        const inputs = screen.getAllByPlaceholderText("Enter item");
        expect(inputs).toHaveLength(3);
      });

      // Rapidly remove items
      const removeButtons = screen.getAllByText("Remove");
      fireEvent.click(removeButtons[0]);
      fireEvent.click(removeButtons[1]);

      await waitFor(() => {
        const remainingInputs = screen.getAllByPlaceholderText("Enter item");
        expect(remainingInputs).toHaveLength(1);
      });
    });

    test("handles different item configurations", async () => {
      render(
        <SimpleFormBuilder
          fields={getDefaultArrayField({
            itemType: "text",
            itemConfig: {
              placeholder: "Custom placeholder",
              maxlength: 10,
              required: false,
              label: "Custom",
            },
          })}
        />
      );

      const addButton = screen.getByText(/Add Item/);
      fireEvent.click(addButton);

      await waitFor(() => {
        const input = screen.getByPlaceholderText("Custom placeholder");
        expect(input).toHaveAttribute("maxLength", "10");
      });
    });
  });

  describe("Form Reset", () => {
    test("resets array field to empty state", async () => {
      const formRef = React.createRef<any>();
      render(
        <SimpleFormBuilder ref={formRef} fields={getDefaultArrayField()} />
      );

      const addButton = screen.getByText(/Add Item/);
      fireEvent.click(addButton);

      await waitFor(() => {
        expect(screen.getByPlaceholderText("Enter item")).toBeInTheDocument();
      });

      const resetButton = screen.getByText("Reset Form");
      fireEvent.click(resetButton);

      await waitFor(() => {
        expect(
          screen.queryByPlaceholderText("Enter item")
        ).not.toBeInTheDocument();
      });
    });
  });
});
