"use client";

import { useRef, useState, useEffect } from "react";
import SimpleFormBuilder, {
  FormEditorRef,
  FormData,
} from "@/components/form-builder/form-editor";
import { FieldConfig } from "@/types/fields-type";
import PageWrapper from "@/components/page-wrapper";

// Base fields that are always shown
const baseFields: FieldConfig[] = [
  {
    name: "fullName",
    label: "Full Name",
    type: "text",
    required: true,
  },
  {
    name: "email",
    label: "Email",
    type: "email",
    required: true,
  },
  {
    name: "isEmployed",
    label: "Are you employed?",
    type: "checkbox",
  },
];

// Conditional fields that show when employed
const conditionalFields: FieldConfig[] = [
  {
    name: "company",
    label: "Company",
    type: "text",
    required: true,
    customValidation: (isEmployed) => isEmployed === true,
    customValidationMessage: "You must be employed to add a company",
  },
  {
    name: "jobTitle",
    label: "Job Title",
    type: "text",
  },
  {
    name: "portfolioUrl",
    label: "Portfolio URL",
    type: "text",
    regex:
      /^(https?:\/\/)?[\w.-]+(\.[\w\.-]+)+[\w\-\._~:\/?#\[\]@!\$&'\(\)\*\+,;=.]+$/,
    regexMessage: "Must be a valid URL",
  },
];

export default function ConditionalFormPage() {
  const formRef = useRef<FormEditorRef>(null);
  const [submittedData, setSubmittedData] = useState<FormData>();
  const [currentFields, setCurrentFields] = useState<FieldConfig[]>(baseFields);
  const [isEmployed, setIsEmployed] = useState(false);

  const handleSubmit = (data: FormData) => {
    setSubmittedData(data);
  };

  const handleReset = () => {
    setSubmittedData(undefined);
    setIsEmployed(false);
    setCurrentFields(baseFields);
  };

  // Update fields based on employment status
  useEffect(() => {
    if (formRef.current?.form) {
      const form = formRef.current.form;
      const formValues = form.getValues();
      const employed = formValues.isEmployed === true;

      if (employed !== isEmployed) {
        setIsEmployed(employed);

        if (employed) {
          // Show all fields including conditional ones
          setCurrentFields([...baseFields, ...conditionalFields]);
        } else {
          // Hide conditional fields and clear their values
          setCurrentFields(baseFields);

          // Clear conditional field values
          form.setValue("company", "");
          form.setValue("jobTitle", "");
          form.setValue("portfolioUrl", "");
        }
      }
    }
  }, [isEmployed]);

  // Listen for form value changes to update employment status
  useEffect(() => {
    if (formRef.current?.form) {
      const form = formRef.current.form;
      const subscription = form.watch((value, { name }) => {
        if (name === "isEmployed") {
          const employed = value.isEmployed === true;
          if (employed !== isEmployed) {
            setIsEmployed(employed);

            if (employed) {
              setCurrentFields([...baseFields, ...conditionalFields]);
            } else {
              setCurrentFields(baseFields);
              // Clear conditional field values
              form.setValue("company", "");
              form.setValue("jobTitle", "");
              form.setValue("portfolioUrl", "");
            }
          }
        }
      });

      return () => subscription.unsubscribe();
    }
  }, [isEmployed]);

  return (
    <PageWrapper showBackButton title="Conditional Form">
      <div className="pt-10 max-w-4xl mx-auto">
        <div className="mb-6">
          <h2 className="text-xl font-semibold mb-2">
            Conditional Form Example
          </h2>
          <p className="text-gray-600 mb-4">
            This form demonstrates conditional field visibility. When you check
            &quot;Are you employed?&quot;, additional fields (Company, Job
            Title, Portfolio URL) will appear. When unchecked, these fields are
            hidden and their values are cleared.
          </p>
        </div>

        <SimpleFormBuilder
          ref={formRef}
          fields={currentFields}
          onSubmit={handleSubmit}
          onReset={handleReset}
          showButtons={true}
          labelPosition="left"
          validateOn="onSubmit"
          showMetadata={true}
          metadataOptions={{
            showSchema: true,
            showFieldConfig: true,
            showFormState: true,
            showCurrentValues: true,
            showErrors: true,
            showDirtyFields: true,
            showTouchedFields: true,
          }}
        />

        {submittedData && (
          <div className="mt-6">
            <h3 className="text-sm font-medium">Submitted payload</h3>
            <pre className="mt-2 rounded border p-3 bg-gray-50 text-sm overflow-auto">
              {JSON.stringify(submittedData, null, 2)}
            </pre>
          </div>
        )}
      </div>
    </PageWrapper>
  );
}
