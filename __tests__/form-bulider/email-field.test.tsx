import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { EmailFieldConfig } from "@/types/fields-type";
import SimpleFormBuilder from "@/components/form-builder/form-editor";

describe('Email Field Tests (type: "email")', () => {
  const getDefaultField = (
    overrides: Partial<EmailFieldConfig> = {}
  ): EmailFieldConfig[] => [
    {
      name: "email",
      label: "Email Address",
      type: "email",
      required: true,
      requiredMessage: "Email is required",
      placeholder: "Enter your email",
      ...overrides,
    },
  ];

  test("renders label and input", () => {
    render(<SimpleFormBuilder fields={getDefaultField()} />);
    expect(screen.getByLabelText(/email address/i)).toBeInTheDocument();
  });

  test("renders placeholder", () => {
    render(<SimpleFormBuilder fields={getDefaultField()} />);
    expect(screen.getByPlaceholderText("Enter your email")).toBeInTheDocument();
  });

  test("shows required validation message", async () => {
    render(<SimpleFormBuilder fields={getDefaultField()} />);
    fireEvent.click(screen.getByRole("button", { name: /submit/i }));
    await waitFor(() => {
      expect(screen.getByText("Email is required")).toBeInTheDocument();
    });
  });

  test("shows invalid email format message", async () => {
    render(<SimpleFormBuilder fields={getDefaultField()} />);
    fireEvent.input(screen.getByLabelText(/email address/i), {
      target: { value: "invalid-email" },
    });
    fireEvent.click(screen.getByRole("button", { name: /submit/i }));
    await waitFor(() => {
      expect(screen.getByText(/must be a valid email address/i)).toBeInTheDocument();
    });
  });

  test("accepts valid email format", async () => {
    const mockSubmit = jest.fn();
    render(
      <SimpleFormBuilder fields={getDefaultField()} onSubmit={mockSubmit} />
    );
    fireEvent.input(screen.getByLabelText(/email address/i), {
      target: { value: "test@example.com" },
    });
    fireEvent.click(screen.getByRole("button", { name: /submit/i }));
    await waitFor(() => {
      expect(mockSubmit).toHaveBeenCalledWith({ email: "test@example.com" });
    });
  });

  test("renders default value", () => {
    render(
      <SimpleFormBuilder
        fields={getDefaultField({ defaultValue: "default@example.com" })}
      />
    );
    expect(screen.getByLabelText(/email address/i)).toHaveValue("default@example.com");
  });

  test("validates with custom regex", async () => {
    render(
      <SimpleFormBuilder
        fields={getDefaultField({
          regex: /^[a-z]+@[a-z]+\.[a-z]+$/,
          regexMessage: "Only lowercase letters allowed",
        })}
      />
    );
    fireEvent.input(screen.getByLabelText(/email address/i), {
      target: { value: "Test@Example.com" },
    });
    fireEvent.click(screen.getByRole("button", { name: /submit/i }));
    await waitFor(() => {
      expect(screen.getByText("Only lowercase letters allowed")).toBeInTheDocument();
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
          customValidation: (value) => value !== "blocked@example.com",
          customValidationMessage: "This email is blocked",
        })}
      />
    );

    fireEvent.input(screen.getByLabelText(/email address/i), {
      target: { value: "blocked@example.com" },
    });
    fireEvent.click(screen.getByRole("button", { name: /submit/i }));

    await waitFor(() => {
      expect(screen.getByText("This email is blocked")).toBeInTheDocument();
    });
  });

  test("validates with customValidation (async)", async () => {
    render(
      <SimpleFormBuilder
        fields={getDefaultField({
          customValidation: async (value) => value !== "taken@example.com",
          customValidationMessage: "Email already exists",
        })}
      />
    );

    fireEvent.input(screen.getByLabelText(/email address/i), {
      target: { value: "taken@example.com" },
    });
    fireEvent.click(screen.getByRole("button", { name: /submit/i }));

    await waitFor(() => {
      expect(screen.getByText("Email already exists")).toBeInTheDocument();
    });
  });

  test("renders custom component using renderComponent", () => {
    const customField = getDefaultField({
      renderComponent: ({ field }) => (
        <div data-testid="custom-email-field">{field.name}</div>
      ),
    });

    render(<SimpleFormBuilder fields={customField} />);
    expect(screen.getByTestId("custom-email-field")).toHaveTextContent("email");
  });
});
