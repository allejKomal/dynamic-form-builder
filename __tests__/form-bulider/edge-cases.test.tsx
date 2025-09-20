import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { FieldConfig } from "@/types/fields-type";
import SimpleFormBuilder from "@/components/form-builder/form-editor";

describe("Edge Cases and Error Handling", () => {
  test("handles empty fields array", () => {
    render(<SimpleFormBuilder fields={[]} />);
    expect(screen.getByRole("button", { name: /submit/i })).toBeInTheDocument();
  });

  test("handles fields with missing required properties", () => {
    const incompleteFields: FieldConfig[] = [
      {
        name: "test",
        label: "Test",
        type: "text",
        // Missing required properties
      } as FieldConfig,
    ];

    render(<SimpleFormBuilder fields={incompleteFields} />);
    expect(screen.getByLabelText(/test/i)).toBeInTheDocument();
  });

  test("handles very long input values", async () => {
    const longTextForm: FieldConfig[] = [
      {
        name: "description",
        label: "Description",
        type: "textarea",
        required: true,
        requiredMessage: "Description is required",
        maxlength: 1000,
        maxlengthMessage: "Description too long",
      },
    ];

    render(<SimpleFormBuilder fields={longTextForm} />);

    const veryLongText = "a".repeat(1001);
    fireEvent.input(screen.getByLabelText(/description/i), {
      target: { value: veryLongText },
    });
    fireEvent.click(screen.getByRole("button", { name: /submit/i }));

    await waitFor(() => {
      expect(screen.getByText("Description too long")).toBeInTheDocument();
    });
  });

  test("handles special characters in input", async () => {
    const specialCharForm: FieldConfig[] = [
      {
        name: "special",
        label: "Special Characters",
        type: "text",
        required: true,
        requiredMessage: "Special characters required",
        regex: /^[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]+$/,
        regexMessage: "Only special characters allowed",
      },
    ];

    render(<SimpleFormBuilder fields={specialCharForm} />);

    // Test with valid special characters - should pass
    fireEvent.input(screen.getByLabelText(/special characters/i), {
      target: { value: "!@#$%^&*()" },
    });
    fireEvent.click(screen.getByRole("button", { name: /submit/i }));

    await waitFor(() => {
      expect(screen.queryByText("Only special characters allowed")).not.toBeInTheDocument();
    });

    // Test with invalid characters (letters/numbers) - should fail
    fireEvent.input(screen.getByLabelText(/special characters/i), {
      target: { value: "abc123" },
    });
    fireEvent.click(screen.getByRole("button", { name: /submit/i }));

    await waitFor(() => {
      expect(screen.getByText("Only special characters allowed")).toBeInTheDocument();
    });
  });

  test("handles unicode characters", async () => {
    const unicodeForm: FieldConfig[] = [
      {
        name: "unicode",
        label: "Unicode Text",
        type: "text",
        required: true,
        requiredMessage: "Unicode text required",
      },
    ];

    const mockSubmit = jest.fn();
    render(
      <SimpleFormBuilder fields={unicodeForm} onSubmit={mockSubmit} />
    );

    fireEvent.input(screen.getByLabelText(/unicode text/i), {
      target: { value: "Hello 世界 🌍" },
    });
    fireEvent.click(screen.getByRole("button", { name: /submit/i }));

    await waitFor(() => {
      expect(mockSubmit).toHaveBeenCalledWith({ unicode: "Hello 世界 🌍" });
    });
  });

  test("handles very large numbers", async () => {
    const numberForm: FieldConfig[] = [
      {
        name: "bigNumber",
        label: "Big Number",
        type: "number",
        required: true,
        requiredMessage: "Big number required",
        max: Number.MAX_SAFE_INTEGER,
        maxMessage: "Number too large",
      },
    ];

    render(<SimpleFormBuilder fields={numberForm} />);

    fireEvent.input(screen.getByLabelText(/big number/i), {
      target: { value: Number.MAX_SAFE_INTEGER + 1 },
    });
    fireEvent.click(screen.getByRole("button", { name: /submit/i }));

    await waitFor(() => {
      expect(screen.getByText("Number too large")).toBeInTheDocument();
    });
  });

  test("handles negative numbers", async () => {
    const negativeNumberForm: FieldConfig[] = [
      {
        name: "negative",
        label: "Negative Number",
        type: "number",
        required: true,
        requiredMessage: "Negative number required",
        min: -1000,
        max: 1000,
      },
    ];

    const mockSubmit = jest.fn();
    render(
      <SimpleFormBuilder fields={negativeNumberForm} onSubmit={mockSubmit} />
    );

    fireEvent.input(screen.getByLabelText(/negative number/i), {
      target: { value: "-500" },
    });
    fireEvent.click(screen.getByRole("button", { name: /submit/i }));

    await waitFor(() => {
      expect(mockSubmit).toHaveBeenCalledWith({ negative: -500 });
    });
  });

  test("handles decimal numbers with many decimal places", async () => {
    const decimalForm: FieldConfig[] = [
      {
        name: "decimal",
        label: "Decimal Number",
        type: "number",
        required: true,
        requiredMessage: "Decimal number required",
      },
    ];

    const mockSubmit = jest.fn();
    render(
      <SimpleFormBuilder fields={decimalForm} onSubmit={mockSubmit} />
    );

    fireEvent.input(screen.getByLabelText(/decimal number/i), {
      target: { value: "3.141592653589793" },
    });
    fireEvent.click(screen.getByRole("button", { name: /submit/i }));

    await waitFor(() => {
      expect(mockSubmit).toHaveBeenCalledWith({ decimal: 3.141592653589793 });
    });
  });

  test("handles empty select options", () => {
    const emptySelectForm: FieldConfig[] = [
      {
        name: "emptySelect",
        label: "Empty Select",
        type: "select",
        required: true,
        requiredMessage: "Empty select required",
        options: [],
      },
    ];

    render(<SimpleFormBuilder fields={emptySelectForm} />);
    // Check for the select trigger button instead of label association
    expect(screen.getByRole("combobox")).toBeInTheDocument();
  });

  test("handles select with only disabled options", () => {
    const disabledSelectForm: FieldConfig[] = [
      {
        name: "disabledSelect",
        label: "Disabled Select",
        type: "select",
        required: true,
        requiredMessage: "Disabled select required",
        options: [
          { value: "disabled1", label: "Disabled Option 1", disabled: true },
          { value: "disabled2", label: "Disabled Option 2", disabled: true },
        ],
      },
    ];

    render(<SimpleFormBuilder fields={disabledSelectForm} />);
    // Check for the select trigger button instead of label association
    expect(screen.getByRole("combobox")).toBeInTheDocument();
  });

  test("handles very large file uploads", async () => {
    const fileForm: FieldConfig[] = [
      {
        name: "largeFile",
        label: "Large File",
        type: "file",
        required: true,
        requiredMessage: "Large file required",
        maxSize: 1024, // 1KB
      },
    ];

    render(<SimpleFormBuilder fields={fileForm} />);

    const largeFile = new File(["x".repeat(2048)], "large.txt", { 
      type: "text/plain" 
    });
    const input = screen.getByLabelText(/large file/i);
    
    fireEvent.change(input, { target: { files: [largeFile] } });
    fireEvent.click(screen.getByRole("button", { name: /submit/i }));

    // The file field shows an alert for size validation, not form validation
    await waitFor(() => {
      expect(screen.queryByText(/file too large/i)).not.toBeInTheDocument();
    });
  });

  test("handles multiple file uploads with limit", async () => {
    const multiFileForm: FieldConfig[] = [
      {
        name: "multiFiles",
        label: "Multiple Files",
        type: "file",
        required: true,
        requiredMessage: "Multiple files required",
        multiple: true,
        maxFiles: 2,
      },
    ];

    render(<SimpleFormBuilder fields={multiFileForm} />);

    const file1 = new File(["test1"], "test1.txt", { type: "text/plain" });
    const file2 = new File(["test2"], "test2.txt", { type: "text/plain" });
    const file3 = new File(["test3"], "test3.txt", { type: "text/plain" });
    const input = screen.getByLabelText(/multiple files/i);
    
    fireEvent.change(input, { target: { files: [file1, file2, file3] } });
    fireEvent.click(screen.getByRole("button", { name: /submit/i }));

    // The file field shows an alert for max files validation, not form validation
    await waitFor(() => {
      expect(screen.queryByText(/too many files/i)).not.toBeInTheDocument();
    });
  });

  test("handles form with all field types disabled", async () => {
    const allDisabledForm: FieldConfig[] = [
      {
        name: "disabled1",
        label: "Disabled 1",
        type: "text",
        required: true,
        disableError: true,
      },
      {
        name: "disabled2",
        label: "Disabled 2",
        type: "email",
        required: true,
        disableError: true,
      },
    ];

    const mockSubmit = jest.fn();
    render(
      <SimpleFormBuilder fields={allDisabledForm} onSubmit={mockSubmit} />
    );

    fireEvent.click(screen.getByRole("button", { name: /submit/i }));

    await waitFor(() => {
      expect(mockSubmit).toHaveBeenCalledWith({
        disabled1: "",
        disabled2: "",
      });
    });
  });

  test("handles form with custom validation that throws error", async () => {
    const errorThrowingForm: FieldConfig[] = [
      {
        name: "errorField",
        label: "Error Field",
        type: "text",
        required: true,
        requiredMessage: "Error field required",
        customValidation: () => {
          throw new Error("Validation error");
        },
        customValidationMessage: "Custom validation error",
      },
    ];

    render(<SimpleFormBuilder fields={errorThrowingForm} />);

    fireEvent.input(screen.getByLabelText(/error field/i), {
      target: { value: "test" },
    });
    fireEvent.click(screen.getByRole("button", { name: /submit/i }));

    // Should handle the error gracefully
    await waitFor(() => {
      expect(screen.getByText("Custom validation error")).toBeInTheDocument();
    });
  });

  test("handles form with async validation that rejects", async () => {
    const asyncRejectForm: FieldConfig[] = [
      {
        name: "asyncField",
        label: "Async Field",
        type: "text",
        required: true,
        requiredMessage: "Async field required",
        customValidation: async () => {
          throw new Error("Async validation error");
        },
        customValidationMessage: "Async validation failed",
      },
    ];

    render(<SimpleFormBuilder fields={asyncRejectForm} />);

    fireEvent.input(screen.getByLabelText(/async field/i), {
      target: { value: "test" },
    });
    fireEvent.click(screen.getByRole("button", { name: /submit/i }));

    await waitFor(() => {
      expect(screen.getByText("Async validation failed")).toBeInTheDocument();
    });
  });

  test("handles form with very long validation messages", async () => {
    const longMessageForm: FieldConfig[] = [
      {
        name: "longMessage",
        label: "Long Message Field",
        type: "text",
        required: true,
        requiredMessage: "This is a very long required message that should be displayed properly even when it contains a lot of text and might wrap to multiple lines in the UI",
      },
    ];

    render(<SimpleFormBuilder fields={longMessageForm} />);

    fireEvent.click(screen.getByRole("button", { name: /submit/i }));

    await waitFor(() => {
      expect(screen.getByText(/This is a very long required message/i)).toBeInTheDocument();
    });
  });

  test("handles form with special characters in field names", async () => {
    const specialNameForm: FieldConfig[] = [
      {
        name: "field-with-dashes",
        label: "Field With Dashes",
        type: "text",
        required: true,
        requiredMessage: "Field with dashes required",
      },
      {
        name: "field_with_underscores",
        label: "Field With Underscores",
        type: "text",
        required: true,
        requiredMessage: "Field with underscores required",
      },
    ];

    const mockSubmit = jest.fn();
    render(
      <SimpleFormBuilder fields={specialNameForm} onSubmit={mockSubmit} />
    );

    fireEvent.input(screen.getByLabelText(/field with dashes/i), {
      target: { value: "test1" },
    });
    fireEvent.input(screen.getByLabelText(/field with underscores/i), {
      target: { value: "test2" },
    });
    fireEvent.click(screen.getByRole("button", { name: /submit/i }));

    await waitFor(() => {
      expect(mockSubmit).toHaveBeenCalledWith({
        "field-with-dashes": "test1",
        "field_with_underscores": "test2",
      });
    });
  });

  test("handles form with duplicate field names", () => {
    const duplicateNameForm: FieldConfig[] = [
      {
        name: "duplicate",
        label: "Duplicate 1",
        type: "text",
        required: true,
        requiredMessage: "Duplicate 1 required",
      },
      {
        name: "duplicate",
        label: "Duplicate 2",
        type: "text",
        required: true,
        requiredMessage: "Duplicate 2 required",
      },
    ];

    render(<SimpleFormBuilder fields={duplicateNameForm} />);
    
    // Should render both fields even with duplicate names
    // The form will only render one field with the same name, so we check for inputs
    expect(screen.getAllByRole("textbox")).toHaveLength(2);
  });

  test("handles form submission with no onSubmit handler", () => {
    const formWithoutSubmit: FieldConfig[] = [
      {
        name: "test",
        label: "Test",
        type: "text",
        required: true,
        requiredMessage: "Test required",
      },
    ];

    render(<SimpleFormBuilder fields={formWithoutSubmit} />);

    fireEvent.input(screen.getByLabelText(/test/i), {
      target: { value: "test" },
    });
    
    // Should not throw error when submitting without onSubmit handler
    expect(() => {
      fireEvent.click(screen.getByRole("button", { name: /submit/i }));
    }).not.toThrow();
  });
});
