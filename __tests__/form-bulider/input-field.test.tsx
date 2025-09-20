import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { TextFieldConfig } from "@/types/fields-type";
import SimpleFormBuilder from "@/components/form-builder/form-editor";

describe('Text Field Tests (type: "text")', () => {
  const getDefaultField = (
    overrides: Partial<TextFieldConfig> = {}
  ): TextFieldConfig[] => [
    {
      name: "username",
      label: "Username",
      type: "text",
      required: true,
      requiredMessage: "Username is required",
      maxlength: 10,
      maxlengthMessage: "Too long!",
      regex: /^[a-zA-Z0-9_]+$/,
      regexMessage: "Only letters/numbers allowed",
      placeholder: "Enter username",
      ...overrides,
    },
  ];
  test("renders label and input", () => {
    render(<SimpleFormBuilder fields={getDefaultField()} />);
    expect(screen.getByLabelText(/username/i)).toBeInTheDocument();
  });

  test("renders placeholder", () => {
    render(<SimpleFormBuilder fields={getDefaultField()} />);
    expect(screen.getByPlaceholderText("Enter username")).toBeInTheDocument();
  });

  test("shows required validation message", async () => {
    render(<SimpleFormBuilder fields={getDefaultField()} />);
    fireEvent.click(screen.getByRole("button", { name: /submit/i }));
    await waitFor(() => {
      expect(screen.getByText("Username is required")).toBeInTheDocument();
    });
  });

  test("shows custom maxlength message", async () => {
    render(<SimpleFormBuilder fields={getDefaultField()} />);
    fireEvent.input(screen.getByLabelText(/username/i), {
      target: { value: "toolongusername" },
    });
    fireEvent.click(screen.getByRole("button", { name: /submit/i }));
    await waitFor(() => {
      expect(screen.getByText("Too long!")).toBeInTheDocument();
    });
  });

  test("shows custom regex message", async () => {
    render(<SimpleFormBuilder fields={getDefaultField()} />);
    fireEvent.input(screen.getByLabelText(/username/i), {
      target: { value: "invalid!" },
    });
    fireEvent.click(screen.getByRole("button", { name: /submit/i }));
    await waitFor(() => {
      expect(
        screen.getByText("Only letters/numbers allowed")
      ).toBeInTheDocument();
    });
  });

  test("renders default value", () => {
    render(
      <SimpleFormBuilder
        fields={getDefaultField({ defaultValue: "defaultUser" })}
      />
    );
    expect(screen.getByLabelText(/username/i)).toHaveValue("defaultUser");
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
      expect(message).not.toBeInTheDocument(); // not rendered
    });
  });

  test("validates with customValidation (sync)", async () => {
    render(
      <SimpleFormBuilder
        fields={getDefaultField({
          customValidation: (value) => value !== "forbidden",
          customValidationMessage: "Username not allowed",
        })}
      />
    );

    fireEvent.input(screen.getByLabelText(/username/i), {
      target: { value: "forbidden" },
    });
    fireEvent.click(screen.getByRole("button", { name: /submit/i }));

    await waitFor(() => {
      expect(screen.getByText("Username not allowed")).toBeInTheDocument();
    });
  });

  test("validates with customValidation (async)", async () => {
    render(
      <SimpleFormBuilder
        fields={getDefaultField({
          customValidation: async (value) => value !== "taken",
          customValidationMessage: "Username already taken",
        })}
      />
    );

    fireEvent.input(screen.getByLabelText(/username/i), {
      target: { value: "taken" },
    });
    fireEvent.click(screen.getByRole("button", { name: /submit/i }));

    await waitFor(() => {
      expect(screen.getByText("Username already taken")).toBeInTheDocument();
    });
  });

  test("renders custom component using renderComponent", () => {
    const customField = getDefaultField({
      renderComponent: ({ field }) => (
        <div data-testid="custom-field">{field.name}</div>
      ),
    });

    render(<SimpleFormBuilder fields={customField} />);
    expect(screen.getByTestId("custom-field")).toHaveTextContent("username");
  });

  test("submits valid input successfully", async () => {
    const mockSubmit = jest.fn();

    render(
      <SimpleFormBuilder fields={getDefaultField()} onSubmit={mockSubmit} />
    );

    fireEvent.input(screen.getByLabelText(/username/i), {
      target: { value: "Valid123" },
    });
    fireEvent.click(screen.getByRole("button", { name: /submit/i }));

    await waitFor(() => {
      expect(mockSubmit).toHaveBeenCalledWith({ username: "Valid123" });
    });
  });
});
