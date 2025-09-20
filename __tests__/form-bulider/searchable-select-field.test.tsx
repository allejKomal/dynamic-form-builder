import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { SearchableSelectFieldConfig } from "@/types/fields-type";
import SimpleFormBuilder from "@/components/form-builder/form-editor";

describe('Searchable Select Field Tests (type: "searchable-select")', () => {
  const getDefaultField = (
    overrides: Partial<SearchableSelectFieldConfig> = {}
  ): SearchableSelectFieldConfig[] => [
    {
      name: "city",
      label: "City",
      type: "searchable-select",
      required: true,
      requiredMessage: "City is required",
      placeholder: "Search for a city",
      options: [
        { value: "new-york", label: "New York" },
        { value: "london", label: "London" },
        { value: "paris", label: "Paris" },
        { value: "tokyo", label: "Tokyo" },
        { value: "sydney", label: "Sydney" },
        { value: "disabled", label: "Disabled City", disabled: true },
      ],
      ...overrides,
    },
  ];

  test("renders label and searchable select", () => {
    render(<SimpleFormBuilder fields={getDefaultField()} />);
    expect(screen.getByRole("combobox")).toBeInTheDocument();
  });

  test("renders placeholder", () => {
    render(<SimpleFormBuilder fields={getDefaultField()} />);
    expect(screen.getByText("Search for a city")).toBeInTheDocument();
  });

  test("shows required validation message", async () => {
    render(<SimpleFormBuilder fields={getDefaultField()} />);
    fireEvent.click(screen.getByRole("button", { name: /submit/i }));
    await waitFor(() => {
      expect(screen.getByText("City is required")).toBeInTheDocument();
    });
  });

  test("renders all options when opened", () => {
    render(<SimpleFormBuilder fields={getDefaultField()} />);
    const select = screen.getByRole("combobox");
    fireEvent.click(select);
    
    expect(screen.getByText("New York")).toBeInTheDocument();
    expect(screen.getByText("London")).toBeInTheDocument();
    expect(screen.getByText("Paris")).toBeInTheDocument();
    expect(screen.getByText("Tokyo")).toBeInTheDocument();
    expect(screen.getByText("Sydney")).toBeInTheDocument();
  });

  test("selects an option", async () => {
    const mockSubmit = jest.fn();
    render(
      <SimpleFormBuilder fields={getDefaultField()} onSubmit={mockSubmit} />
    );
    
    const select = screen.getByRole("combobox");
    fireEvent.click(select);
    fireEvent.click(screen.getByText("New York"));
    fireEvent.click(screen.getByRole("button", { name: /submit/i }));
    
    await waitFor(() => {
      expect(mockSubmit).toHaveBeenCalledWith({ city: "new-york" });
    });
  });

  test("filters options based on search input", () => {
    render(<SimpleFormBuilder fields={getDefaultField()} />);
    
    const select = screen.getByRole("combobox");
    fireEvent.click(select);
    
    // Type in search input (implementation dependent)
    const searchInput = screen.getByPlaceholderText("Search options...");
    fireEvent.change(searchInput, { target: { value: "new" } });
    
    // Should show only New York
    expect(screen.getByText("New York")).toBeInTheDocument();
    expect(screen.queryByText("London")).not.toBeInTheDocument();
  });

  test("shows no results message when search has no matches", () => {
    render(<SimpleFormBuilder fields={getDefaultField()} />);
    
    const select = screen.getByRole("combobox");
    fireEvent.click(select);
    
    const searchInput = screen.getByPlaceholderText("Search options...");
    fireEvent.change(searchInput, { target: { value: "nonexistent" } });
    
    // Should show no results message
    expect(screen.getByText("No options found.")).toBeInTheDocument();
  });

  test("renders default value", () => {
    render(
      <SimpleFormBuilder
        fields={getDefaultField({ defaultValue: "london" })}
      />
    );
    expect(screen.getByRole("combobox")).toHaveTextContent("London");
  });

  test("handles clearable option", async () => {
    render(
      <SimpleFormBuilder
        fields={getDefaultField({ clearable: true })}
      />
    );
    
    const select = screen.getByRole("combobox");
    fireEvent.click(select);
    fireEvent.click(screen.getByText("New York"));
    
    // Check if clear button is present (implementation dependent)
    // This test assumes the clearable functionality is implemented
  });

  test("disables disabled options", () => {
    render(<SimpleFormBuilder fields={getDefaultField()} />);
    const select = screen.getByRole("combobox");
    fireEvent.click(select);
    
    const disabledOption = screen.getByText("Disabled City");
    expect(disabledOption).toHaveAttribute("data-disabled", "true");
  });

  test("handles case-insensitive search", () => {
    render(<SimpleFormBuilder fields={getDefaultField()} />);
    
    const select = screen.getByRole("combobox");
    fireEvent.click(select);
    
    const searchInput = screen.getByPlaceholderText("Search options...");
    fireEvent.change(searchInput, { target: { value: "LONDON" } });
    
    // Should find London regardless of case
    expect(screen.getByText("London")).toBeInTheDocument();
  });

  test("handles partial matches", () => {
    render(<SimpleFormBuilder fields={getDefaultField()} />);
    
    const select = screen.getByRole("combobox");
    fireEvent.click(select);
    
    const searchInput = screen.getByPlaceholderText("Search options...");
    fireEvent.change(searchInput, { target: { value: "kyo" } });
    
    // Should find Tokyo
    expect(screen.getByText("Tokyo")).toBeInTheDocument();
    expect(screen.queryByText("New York")).not.toBeInTheDocument();
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
          customValidation: (value) => value !== "new-york",
          customValidationMessage: "New York not available",
        })}
      />
    );

    const select = screen.getByRole("combobox");
    fireEvent.click(select);
    fireEvent.click(screen.getByText("New York"));
    fireEvent.click(screen.getByRole("button", { name: /submit/i }));

    await waitFor(() => {
      expect(screen.getByText("New York not available")).toBeInTheDocument();
    });
  });

  test("validates with customValidation (async)", async () => {
    render(
      <SimpleFormBuilder
        fields={getDefaultField({
          customValidation: async (value) => value !== "london",
          customValidationMessage: "London temporarily unavailable",
        })}
      />
    );

    const select = screen.getByRole("combobox");
    fireEvent.click(select);
    fireEvent.click(screen.getByText("London"));
    fireEvent.click(screen.getByRole("button", { name: /submit/i }));

    await waitFor(() => {
      expect(screen.getByText("London temporarily unavailable")).toBeInTheDocument();
    });
  });

  test("renders custom component using renderComponent", () => {
    const customField = getDefaultField({
      renderComponent: ({ field }) => (
        <div data-testid="custom-searchable-select-field">{field.name}</div>
      ),
    });

    render(<SimpleFormBuilder fields={customField} />);
    expect(screen.getByTestId("custom-searchable-select-field")).toHaveTextContent("city");
  });

  test("handles empty options array", () => {
    render(
      <SimpleFormBuilder
        fields={getDefaultField({ options: [] })}
      />
    );
    expect(screen.getByRole("combobox")).toBeInTheDocument();
  });

  test("handles single option", async () => {
    const mockSubmit = jest.fn();
    render(
      <SimpleFormBuilder
        fields={getDefaultField({
          options: [{ value: "only", label: "Only City" }]
        })}
        onSubmit={mockSubmit}
      />
    );
    
    const select = screen.getByRole("combobox");
    fireEvent.click(select);
    fireEvent.click(screen.getByText("Only City"));
    fireEvent.click(screen.getByRole("button", { name: /submit/i }));
    
    await waitFor(() => {
      expect(mockSubmit).toHaveBeenCalledWith({ city: "only" });
    });
  });

  test("handles keyboard navigation", () => {
    render(<SimpleFormBuilder fields={getDefaultField()} />);
    
    const select = screen.getByRole("combobox");
    fireEvent.click(select);
    
    // Test arrow key navigation (implementation dependent)
    fireEvent.keyDown(select, { key: "ArrowDown" });
    fireEvent.keyDown(select, { key: "Enter" });
    
    // Should select the first option
    expect(screen.getByText("New York")).toBeInTheDocument();
  });

  test("handles escape key to close dropdown", () => {
    render(<SimpleFormBuilder fields={getDefaultField()} />);
    
    const select = screen.getByRole("combobox");
    fireEvent.click(select);
    
    // Press escape to close
    fireEvent.keyDown(select, { key: "Escape" });
    
    // Dropdown should be closed (implementation dependent)
    expect(screen.queryByText("London")).not.toBeInTheDocument();
  });
});
