import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { NumberFieldConfig } from "@/types/fields-type";
import SimpleFormBuilder from "@/components/form-builder/form-editor";

describe('Number Field Tests (type: "number")', () => {
  const getDefaultField = (
    overrides: Partial<NumberFieldConfig> = {}
  ): NumberFieldConfig[] => [
    {
      name: "age",
      label: "Age",
      type: "number",
      required: true,
      requiredMessage: "Age is required",
      min: 18,
      max: 100,
      minMessage: "Must be at least 18",
      maxMessage: "Must be at most 100",
      placeholder: "Enter your age",
      ...overrides,
    },
  ];

  test("renders label and input", () => {
    render(<SimpleFormBuilder fields={getDefaultField()} />);
    expect(screen.getByLabelText(/age/i)).toBeInTheDocument();
  });

  test("renders placeholder", () => {
    render(<SimpleFormBuilder fields={getDefaultField()} />);
    expect(screen.getByPlaceholderText("Enter your age")).toBeInTheDocument();
  });

  test("shows required validation message", async () => {
    render(<SimpleFormBuilder fields={getDefaultField()} />);
    fireEvent.click(screen.getByRole("button", { name: /submit/i }));
    await waitFor(() => {
      expect(screen.getByText("Age is required")).toBeInTheDocument();
    });
  });

  test("shows min validation message", async () => {
    render(<SimpleFormBuilder fields={getDefaultField()} />);
    fireEvent.input(screen.getByLabelText(/age/i), {
      target: { value: "15" },
    });
    fireEvent.click(screen.getByRole("button", { name: /submit/i }));
    await waitFor(() => {
      expect(screen.getByText("Must be at least 18")).toBeInTheDocument();
    });
  });

  test("shows max validation message", async () => {
    render(<SimpleFormBuilder fields={getDefaultField()} />);
    fireEvent.input(screen.getByLabelText(/age/i), {
      target: { value: "150" },
    });
    fireEvent.click(screen.getByRole("button", { name: /submit/i }));
    await waitFor(() => {
      expect(screen.getByText("Must be at most 100")).toBeInTheDocument();
    });
  });

  test("accepts valid number within range", async () => {
    const mockSubmit = jest.fn();
    render(
      <SimpleFormBuilder fields={getDefaultField()} onSubmit={mockSubmit} />
    );
    fireEvent.input(screen.getByLabelText(/age/i), {
      target: { value: "25" },
    });
    fireEvent.click(screen.getByRole("button", { name: /submit/i }));
    await waitFor(() => {
      expect(mockSubmit).toHaveBeenCalledWith({ age: 25 });
    });
  });

  test("renders default value", () => {
    render(
      <SimpleFormBuilder
        fields={getDefaultField({ defaultValue: 30 })}
      />
    );
    expect(screen.getByLabelText(/age/i)).toHaveValue(30);
  });

  test("handles decimal numbers", async () => {
    const mockSubmit = jest.fn();
    render(
      <SimpleFormBuilder 
        fields={getDefaultField({ min: 0, max: 10 })}
        onSubmit={mockSubmit} 
      />
    );
    fireEvent.input(screen.getByLabelText(/age/i), {
      target: { value: "5.5" },
    });
    fireEvent.click(screen.getByRole("button", { name: /submit/i }));
    await waitFor(() => {
      expect(mockSubmit).toHaveBeenCalledWith({ age: 5.5 });
    });
  });

  test("handles negative numbers", async () => {
    render(
      <SimpleFormBuilder
        fields={getDefaultField({ min: -10, max: 10 })}
      />
    );
    fireEvent.input(screen.getByLabelText(/age/i), {
      target: { value: "-5" },
    });
    fireEvent.click(screen.getByRole("button", { name: /submit/i }));
    await waitFor(() => {
      expect(screen.queryByText(/must be at least/i)).not.toBeInTheDocument();
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
          customValidation: (value) => value !== 13,
          customValidationMessage: "Unlucky number not allowed",
        })}
      />
    );

    fireEvent.input(screen.getByLabelText(/age/i), {
      target: { value: "13" },
    });
    fireEvent.click(screen.getByRole("button", { name: /submit/i }));

    await waitFor(() => {
      expect(screen.getByText("Unlucky number not allowed")).toBeInTheDocument();
    });
  });

  test("validates with customValidation (async)", async () => {
    render(
      <SimpleFormBuilder
        fields={getDefaultField({
          customValidation: async (value) => value !== 42,
          customValidationMessage: "Answer to everything not allowed",
        })}
      />
    );

    fireEvent.input(screen.getByLabelText(/age/i), {
      target: { value: "42" },
    });
    fireEvent.click(screen.getByRole("button", { name: /submit/i }));

    await waitFor(() => {
      expect(screen.getByText("Answer to everything not allowed")).toBeInTheDocument();
    });
  });

  test("renders custom component using renderComponent", () => {
    const customField = getDefaultField({
      renderComponent: ({ field }) => (
        <div data-testid="custom-number-field">{field.name}</div>
      ),
    });

    render(<SimpleFormBuilder fields={customField} />);
    expect(screen.getByTestId("custom-number-field")).toHaveTextContent("age");
  });
});
