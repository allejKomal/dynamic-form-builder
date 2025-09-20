import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { TextAreaFieldConfig } from "@/types/fields-type";
import SimpleFormBuilder from "@/components/form-builder/form-editor";

describe('TextArea Field Tests (type: "textarea")', () => {
  const getDefaultField = (
    overrides: Partial<TextAreaFieldConfig> = {}
  ): TextAreaFieldConfig[] => [
    {
      name: "description",
      label: "Description",
      type: "textarea",
      required: true,
      requiredMessage: "Description is required",
      maxlength: 500,
      maxlengthMessage: "Description too long",
      placeholder: "Enter description",
      ...overrides,
    },
  ];

  test("renders label and textarea", () => {
    render(<SimpleFormBuilder fields={getDefaultField()} />);
    expect(screen.getByLabelText(/description/i)).toBeInTheDocument();
  });

  test("renders placeholder", () => {
    render(<SimpleFormBuilder fields={getDefaultField()} />);
    expect(screen.getByPlaceholderText("Enter description")).toBeInTheDocument();
  });

  test("shows required validation message", async () => {
    render(<SimpleFormBuilder fields={getDefaultField()} />);
    fireEvent.click(screen.getByRole("button", { name: /submit/i }));
    await waitFor(() => {
      expect(screen.getByText("Description is required")).toBeInTheDocument();
    });
  });

  test("shows maxlength validation message", async () => {
    render(<SimpleFormBuilder fields={getDefaultField()} />);
    const longText = "a".repeat(501);
    fireEvent.input(screen.getByLabelText(/description/i), {
      target: { value: longText },
    });
    fireEvent.click(screen.getByRole("button", { name: /submit/i }));
    await waitFor(() => {
      expect(screen.getByText("Description too long")).toBeInTheDocument();
    });
  });

  test("accepts valid text within limit", async () => {
    const mockSubmit = jest.fn();
    render(
      <SimpleFormBuilder fields={getDefaultField()} onSubmit={mockSubmit} />
    );
    fireEvent.input(screen.getByLabelText(/description/i), {
      target: { value: "This is a valid description" },
    });
    fireEvent.click(screen.getByRole("button", { name: /submit/i }));
    await waitFor(() => {
      expect(mockSubmit).toHaveBeenCalledWith({ description: "This is a valid description" });
    });
  });

  test("renders default value", () => {
    render(
      <SimpleFormBuilder
        fields={getDefaultField({ defaultValue: "Default description" })}
      />
    );
    expect(screen.getByLabelText(/description/i)).toHaveValue("Default description");
  });

  test("handles multiline text", async () => {
    const mockSubmit = jest.fn();
    const multilineText = "Line 1\nLine 2\nLine 3";
    render(
      <SimpleFormBuilder fields={getDefaultField()} onSubmit={mockSubmit} />
    );
    fireEvent.input(screen.getByLabelText(/description/i), {
      target: { value: multilineText },
    });
    fireEvent.click(screen.getByRole("button", { name: /submit/i }));
    await waitFor(() => {
      expect(mockSubmit).toHaveBeenCalledWith({ description: multilineText });
    });
  });

  test("validates with custom regex", async () => {
    render(
      <SimpleFormBuilder
        fields={getDefaultField({
          regex: /^[A-Z]/,
          regexMessage: "Must start with uppercase letter",
        })}
      />
    );
    fireEvent.input(screen.getByLabelText(/description/i), {
      target: { value: "lowercase start" },
    });
    fireEvent.click(screen.getByRole("button", { name: /submit/i }));
    await waitFor(() => {
      expect(screen.getByText("Must start with uppercase letter")).toBeInTheDocument();
    });
  });

  test("skips validation when disableError is true", async () => {
    render(
      <SimpleFormBuilder
        fields={getDefaultField({ required: true, disableError: true })}
      />
    );
    fireEvent.click(screen.getByRole("button", { name: /submit/i }));
    await waitFor(() => {
      expect(screen.queryByText(/required/i)).not.toBeInTheDocument();
    });
  });

  test("does not show error message if disableErrorMessage is true", async () => {
    render(
      <SimpleFormBuilder
        fields={getDefaultField({ disableErrorMessage: true })}
      />
    );
    fireEvent.click(screen.getByRole("button", { name: /submit/i }));
    await waitFor(() => {
      const message = screen.queryByText(/required/i);
      expect(message).not.toBeInTheDocument();
    });
  });

  test("validates with customValidation (sync)", async () => {
    render(
      <SimpleFormBuilder
        fields={getDefaultField({
          customValidation: (value: string | number) => {
            return typeof value === 'string' && !value.includes("spam");
          },
          customValidationMessage: "Spam content not allowed",
        })}
      />
    );

    fireEvent.input(screen.getByLabelText(/description/i), {
      target: { value: "This is spam content" },
    });
    fireEvent.click(screen.getByRole("button", { name: /submit/i }));

    await waitFor(() => {
      expect(screen.getByText("Spam content not allowed")).toBeInTheDocument();
    });
  });

  test("validates with customValidation (async)", async () => {
    render(
      <SimpleFormBuilder
        fields={getDefaultField({
          customValidation: async (value: string | number) => {
            return typeof value === 'string' && !value.includes("forbidden");
          },
          customValidationMessage: "Forbidden word detected",
        })}
      />
    );

    fireEvent.input(screen.getByLabelText(/description/i), {
      target: { value: "This contains forbidden words" },
    });
    fireEvent.click(screen.getByRole("button", { name: /submit/i }));

    await waitFor(() => {
      expect(screen.getByText("Forbidden word detected")).toBeInTheDocument();
    });
  });

  test("renders custom component using renderComponent", () => {
    const customField = getDefaultField({
      renderComponent: ({ field }) => (
        <div data-testid="custom-textarea-field">{field.name}</div>
      ),
    });

    render(<SimpleFormBuilder fields={customField} />);
    expect(screen.getByTestId("custom-textarea-field")).toHaveTextContent("description");
  });
});
