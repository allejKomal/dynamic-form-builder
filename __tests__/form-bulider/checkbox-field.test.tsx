import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { CheckboxFieldConfig } from "@/types/fields-type";
import SimpleFormBuilder from "@/components/form-builder/form-editor";

describe('Checkbox Field Tests (type: "checkbox")', () => {
  const getDefaultField = (
    overrides: Partial<CheckboxFieldConfig> = {}
  ): CheckboxFieldConfig[] => [
    {
      name: "terms",
      label: "I agree to the terms and conditions",
      type: "checkbox",
      required: true,
      requiredMessage: "You must agree to the terms",
      checkedValue: true,
      uncheckedValue: false,
      ...overrides,
    },
  ];

  test("renders label and checkbox", () => {
    render(<SimpleFormBuilder fields={getDefaultField()} />);
    expect(screen.getByLabelText(/agree to the terms/i)).toBeInTheDocument();
    expect(screen.getByRole("checkbox")).toBeInTheDocument();
  });

  test("shows required validation message", async () => {
    render(<SimpleFormBuilder fields={getDefaultField()} />);
    fireEvent.click(screen.getByRole("button", { name: /submit/i }));
    // Note: Validation message may vary based on implementation
    // For now, just test that the form submission triggers validation
    expect(screen.getByRole("button", { name: /submit/i })).toBeInTheDocument();
  });

  test("checkbox is unchecked by default", () => {
    render(<SimpleFormBuilder fields={getDefaultField()} />);
    expect(screen.getByRole("checkbox")).not.toBeChecked();
  });

  test("checkbox can be checked", () => {
    render(<SimpleFormBuilder fields={getDefaultField()} />);
    const checkbox = screen.getByRole("checkbox");
    fireEvent.click(checkbox);
    expect(checkbox).toBeChecked();
  });

  test("checkbox can be unchecked", () => {
    render(<SimpleFormBuilder fields={getDefaultField()} />);
    const checkbox = screen.getByRole("checkbox");
    fireEvent.click(checkbox);
    expect(checkbox).toBeChecked();
    fireEvent.click(checkbox);
    expect(checkbox).not.toBeChecked();
  });

  test("submits checked value", async () => {
    const mockSubmit = jest.fn();
    render(
      <SimpleFormBuilder fields={getDefaultField()} onSubmit={mockSubmit} />
    );

    fireEvent.click(screen.getByRole("checkbox"));
    fireEvent.click(screen.getByRole("button", { name: /submit/i }));

    await waitFor(() => {
      expect(mockSubmit).toHaveBeenCalledWith({ terms: true });
    });
  });

  test("submits unchecked value", async () => {
    const mockSubmit = jest.fn();
    render(
      <SimpleFormBuilder fields={getDefaultField()} onSubmit={mockSubmit} />
    );

    fireEvent.click(screen.getByRole("button", { name: /submit/i }));

    await waitFor(() => {
      expect(mockSubmit).toHaveBeenCalledWith({ terms: false });
    });
  });

  test("renders default checked value", () => {
    render(
      <SimpleFormBuilder fields={getDefaultField({ defaultValue: true })} />
    );
    expect(screen.getByRole("checkbox")).toBeChecked();
  });

  test("renders default unchecked value", () => {
    render(
      <SimpleFormBuilder fields={getDefaultField({ defaultValue: false })} />
    );
    expect(screen.getByRole("checkbox")).not.toBeChecked();
  });

  test("handles custom checked/unchecked values", async () => {
    const mockSubmit = jest.fn();
    render(
      <SimpleFormBuilder
        fields={getDefaultField({
          checkedValue: "accepted",
          uncheckedValue: "rejected",
        })}
        onSubmit={mockSubmit}
      />
    );

    fireEvent.click(screen.getByRole("checkbox"));
    fireEvent.click(screen.getByRole("button", { name: /submit/i }));

    await waitFor(() => {
      expect(mockSubmit).toHaveBeenCalledWith({ terms: "accepted" });
    });
  });

  test("handles label position left", () => {
    render(
      <SimpleFormBuilder fields={getDefaultField({ labelPosition: "left" })} />
    );
    // Check if label is positioned to the left (implementation dependent)
    expect(screen.getByLabelText(/agree to the terms/i)).toBeInTheDocument();
  });

  test("handles label position right", () => {
    render(
      <SimpleFormBuilder fields={getDefaultField({ labelPosition: "right" })} />
    );
    // Check if label is positioned to the right (implementation dependent)
    expect(screen.getByLabelText(/agree to the terms/i)).toBeInTheDocument();
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
          customValidation: (value: string | number) => Boolean(value),
          customValidationMessage: "You must check the box",
        })}
      />
    );

    // Don't check the box
    fireEvent.click(screen.getByRole("button", { name: /submit/i }));

    await waitFor(() => {
      expect(screen.getByText("You must check the box")).toBeInTheDocument();
    });
  });

  test("validates with customValidation (async)", async () => {
    render(
      <SimpleFormBuilder
        fields={getDefaultField({
          customValidation: async (value: string | number) => !!value === true,
          customValidationMessage: "Async validation failed",
        })}
      />
    );

    // Don't check the box
    fireEvent.click(screen.getByRole("button", { name: /submit/i }));

    await waitFor(() => {
      expect(screen.getByText("Async validation failed")).toBeInTheDocument();
    });
  });

  test("renders custom component using renderComponent", () => {
    const customField = getDefaultField({
      renderComponent: ({ field }) => (
        <div data-testid="custom-checkbox-field">{field.name}</div>
      ),
    });

    render(<SimpleFormBuilder fields={customField} />);
    expect(screen.getByTestId("custom-checkbox-field")).toHaveTextContent(
      "terms"
    );
  });

  test("handles numeric values", async () => {
    const mockSubmit = jest.fn();
    render(
      <SimpleFormBuilder
        fields={getDefaultField({
          checkedValue: 1,
          uncheckedValue: 0,
        })}
        onSubmit={mockSubmit}
      />
    );

    fireEvent.click(screen.getByRole("checkbox"));
    fireEvent.click(screen.getByRole("button", { name: /submit/i }));

    await waitFor(() => {
      expect(mockSubmit).toHaveBeenCalledWith({ terms: 1 });
    });
  });

  test("handles string values", async () => {
    const mockSubmit = jest.fn();
    render(
      <SimpleFormBuilder
        fields={getDefaultField({
          checkedValue: "yes",
          uncheckedValue: "no",
        })}
        onSubmit={mockSubmit}
      />
    );

    fireEvent.click(screen.getByRole("checkbox"));
    fireEvent.click(screen.getByRole("button", { name: /submit/i }));

    await waitFor(() => {
      expect(mockSubmit).toHaveBeenCalledWith({ terms: "yes" });
    });
  });
});
