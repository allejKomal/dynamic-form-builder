import { render, screen, fireEvent, waitFor, cleanup } from "@testing-library/react";
import { UrlFieldConfig } from "@/types/fields-type";
import SimpleFormBuilder from "@/components/form-builder/form-editor";

describe('URL Field Tests (type: "url")', () => {
  const getDefaultField = (
    overrides: Partial<UrlFieldConfig> = {}
  ): UrlFieldConfig[] => [
    {
      name: "website",
      label: "Website URL",
      type: "url",
      required: true,
      requiredMessage: "Website URL is required",
      maxlength: 200,
      maxlengthMessage: "URL too long",
      placeholder: "Enter website URL",
      ...overrides,
    },
  ];

  test("renders label and input", () => {
    render(<SimpleFormBuilder fields={getDefaultField()} />);
    expect(screen.getByLabelText(/website url/i)).toBeInTheDocument();
  });

  test("renders placeholder", () => {
    render(<SimpleFormBuilder fields={getDefaultField()} />);
    expect(
      screen.getByPlaceholderText("Enter website URL")
    ).toBeInTheDocument();
  });

  test("shows required validation message", async () => {
    render(<SimpleFormBuilder fields={getDefaultField()} />);
    fireEvent.click(screen.getByRole("button", { name: /submit/i }));
    await waitFor(() => {
      expect(screen.getByText("Website URL is required")).toBeInTheDocument();
    });
  });

  test("shows invalid URL format message", async () => {
    render(<SimpleFormBuilder fields={getDefaultField()} />);
    fireEvent.input(screen.getByLabelText(/website url/i), {
      target: { value: "not-a-url" },
    });
    fireEvent.click(screen.getByRole("button", { name: /submit/i }));
    await waitFor(() => {
      expect(screen.getByText(/must be a valid url/i)).toBeInTheDocument();
    });
  });

  test("accepts valid URL", async () => {
    const mockSubmit = jest.fn();
    render(
      <SimpleFormBuilder fields={getDefaultField()} onSubmit={mockSubmit} />
    );
    fireEvent.input(screen.getByLabelText(/website url/i), {
      target: { value: "https://example.com" },
    });
    fireEvent.click(screen.getByRole("button", { name: /submit/i }));
    await waitFor(() => {
      expect(mockSubmit).toHaveBeenCalledWith({
        website: "https://example.com",
      });
    });
  });

  test("accepts various URL formats", async () => {
    const mockSubmit = jest.fn();
    const testUrls = [
      "https://example.com",
      "http://example.com",
      "https://www.example.com",
      "https://subdomain.example.com/path",
      "https://example.com:8080",
    ];

    for (const url of testUrls) {
      render(
        <SimpleFormBuilder fields={getDefaultField()} onSubmit={mockSubmit} />
      );
      fireEvent.input(screen.getByLabelText(/website url/i), {
        target: { value: url },
      });
      fireEvent.click(screen.getByRole("button", { name: /submit/i }));
      await waitFor(() => {
        expect(mockSubmit).toHaveBeenCalledWith({ website: url });
      });
      mockSubmit.mockClear();
      cleanup(); // Clean up DOM after each iteration
    }
  });

  test("renders default value", () => {
    render(
      <SimpleFormBuilder
        fields={getDefaultField({ defaultValue: "https://default.com" })}
      />
    );
    expect(screen.getByLabelText(/website url/i)).toHaveValue(
      "https://default.com"
    );
  });

  test("shows maxlength validation message", async () => {
    render(<SimpleFormBuilder fields={getDefaultField()} />);
    const longUrl = "https://" + "a".repeat(200) + ".com";
    fireEvent.input(screen.getByLabelText(/website url/i), {
      target: { value: longUrl },
    });
    fireEvent.click(screen.getByRole("button", { name: /submit/i }));
    await waitFor(() => {
      expect(screen.getByText("URL too long")).toBeInTheDocument();
    });
  });

  test("validates with custom regex", async () => {
    render(
      <SimpleFormBuilder
        fields={getDefaultField({
          regex: /^https:\/\/.*\.com$/,
          regexMessage: "Must be HTTPS and end with .com",
        })}
      />
    );
    fireEvent.input(screen.getByLabelText(/website url/i), {
      target: { value: "http://example.org" },
    });
    fireEvent.click(screen.getByRole("button", { name: /submit/i }));
    await waitFor(() => {
      expect(
        screen.getByText("Must be HTTPS and end with .com")
      ).toBeInTheDocument();
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
          customValidation: (value) => !String(value).includes("blocked"),
          customValidationMessage: "Blocked domain not allowed",
        })}
      />
    );

    fireEvent.input(screen.getByLabelText(/website url/i), {
      target: { value: "https://blocked.com" },
    });
    fireEvent.click(screen.getByRole("button", { name: /submit/i }));

    await waitFor(() => {
      expect(
        screen.getByText("Blocked domain not allowed")
      ).toBeInTheDocument();
    });
  });

  test("validates with customValidation (async)", async () => {
    render(
      <SimpleFormBuilder
        fields={getDefaultField({
          customValidation: async (value) => !String(value).includes("malicious"),
          customValidationMessage: "Malicious URL detected",
        })}
      />
    );

    fireEvent.input(screen.getByLabelText(/website url/i), {
      target: { value: "https://malicious.com" },
    });
    fireEvent.click(screen.getByRole("button", { name: /submit/i }));

    await waitFor(() => {
      expect(screen.getByText("Malicious URL detected")).toBeInTheDocument();
    });
  });

  test("renders custom component using renderComponent", () => {
    const customField = getDefaultField({
      renderComponent: ({ field }) => (
        <div data-testid="custom-url-field">{field.name}</div>
      ),
    });

    render(<SimpleFormBuilder fields={customField} />);
    expect(screen.getByTestId("custom-url-field")).toHaveTextContent("website");
  });
});
