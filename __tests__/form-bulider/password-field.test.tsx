import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { PasswordFieldConfig } from "@/types/fields-type";
import SimpleFormBuilder from "@/components/form-builder/form-editor";

describe('Password Field Tests (type: "password")', () => {
  const getDefaultField = (
    overrides: Partial<PasswordFieldConfig> = {}
  ): PasswordFieldConfig[] => [
    {
      name: "password",
      label: "Password",
      type: "password",
      required: true,
      requiredMessage: "Password is required",
      maxlength: 20,
      maxlengthMessage: "Password too long",
      placeholder: "Enter password",
      ...overrides,
    },
  ];

  test("renders label and password input", () => {
    render(<SimpleFormBuilder fields={getDefaultField()} />);
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toHaveAttribute("type", "password");
  });

  test("renders placeholder", () => {
    render(<SimpleFormBuilder fields={getDefaultField()} />);
    expect(screen.getByPlaceholderText("Enter password")).toBeInTheDocument();
  });

  test("shows required validation message", async () => {
    render(<SimpleFormBuilder fields={getDefaultField()} />);
    fireEvent.click(screen.getByRole("button", { name: /submit/i }));
    await waitFor(() => {
      expect(screen.getByText("Password is required")).toBeInTheDocument();
    });
  });

  test("shows maxlength validation message", async () => {
    render(<SimpleFormBuilder fields={getDefaultField()} />);
    const longPassword = "a".repeat(21);
    fireEvent.input(screen.getByLabelText(/password/i), {
      target: { value: longPassword },
    });
    fireEvent.click(screen.getByRole("button", { name: /submit/i }));
    await waitFor(() => {
      expect(screen.getByText("Password too long")).toBeInTheDocument();
    });
  });

  test("accepts valid password", async () => {
    const mockSubmit = jest.fn();
    render(
      <SimpleFormBuilder fields={getDefaultField()} onSubmit={mockSubmit} />
    );
    fireEvent.input(screen.getByLabelText(/password/i), {
      target: { value: "ValidPassword123" },
    });
    fireEvent.click(screen.getByRole("button", { name: /submit/i }));
    await waitFor(() => {
      expect(mockSubmit).toHaveBeenCalledWith({ password: "ValidPassword123" });
    });
  });

  test("renders default value", () => {
    render(
      <SimpleFormBuilder
        fields={getDefaultField({ defaultValue: "defaultPassword" })}
      />
    );
    expect(screen.getByLabelText(/password/i)).toHaveValue("defaultPassword");
  });

  test("validates with custom regex", async () => {
    render(
      <SimpleFormBuilder
        fields={getDefaultField({
          regex: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).+$/,
          regexMessage: "Password must contain uppercase, lowercase, and number",
        })}
      />
    );
    fireEvent.input(screen.getByLabelText(/password/i), {
      target: { value: "weakpassword" },
    });
    fireEvent.click(screen.getByRole("button", { name: /submit/i }));
    await waitFor(() => {
      expect(screen.getByText("Password must contain uppercase, lowercase, and number")).toBeInTheDocument();
    });
  });

  test("accepts password matching regex", async () => {
    const mockSubmit = jest.fn();
    render(
      <SimpleFormBuilder
        fields={getDefaultField({
          regex: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).+$/,
          regexMessage: "Password must contain uppercase, lowercase, and number",
        })}
        onSubmit={mockSubmit}
      />
    );
    fireEvent.input(screen.getByLabelText(/password/i), {
      target: { value: "StrongPass123" },
    });
    fireEvent.click(screen.getByRole("button", { name: /submit/i }));
    await waitFor(() => {
      expect(mockSubmit).toHaveBeenCalledWith({ password: "StrongPass123" });
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
          customValidation: (value) => value !== "password",
          customValidationMessage: "Password too common",
        })}
      />
    );

    fireEvent.input(screen.getByLabelText(/password/i), {
      target: { value: "password" },
    });
    fireEvent.click(screen.getByRole("button", { name: /submit/i }));

    await waitFor(() => {
      expect(screen.getByText("Password too common")).toBeInTheDocument();
    });
  });

  test("validates with customValidation (async)", async () => {
    render(
      <SimpleFormBuilder
        fields={getDefaultField({
          customValidation: async (value) => value !== "123456",
          customValidationMessage: "Password already used",
        })}
      />
    );

    fireEvent.input(screen.getByLabelText(/password/i), {
      target: { value: "123456" },
    });
    fireEvent.click(screen.getByRole("button", { name: /submit/i }));

    await waitFor(() => {
      expect(screen.getByText("Password already used")).toBeInTheDocument();
    });
  });

  test("renders custom component using renderComponent", () => {
    const customField = getDefaultField({
      renderComponent: ({ field }) => (
        <div data-testid="custom-password-field">{field.name}</div>
      ),
    });

    render(<SimpleFormBuilder fields={customField} />);
    expect(screen.getByTestId("custom-password-field")).toHaveTextContent("password");
  });
});
