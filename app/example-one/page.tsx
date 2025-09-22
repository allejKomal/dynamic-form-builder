"use client";

import { useRef, useState } from "react";
import FormEditor, { FormEditorRef } from "@/components/form-builder/form-editor";
// import { defaultFields } from "@/data/default-form"; // Not used in this example
import { Button } from "@/components/ui/button";
import PageWrapper from "@/components/page-wrapper";
import { FieldConfig } from "@/types/fields-type";

// Example fields with different types
const exampleFields: FieldConfig[] = [
  {
    name: "title",
    label: "Title",
    type: "text",
    required: true,
    placeholder: "Enter title",
  },
  {
    name: "description",
    label: "Description",
    type: "textarea",
    required: true,
    placeholder: "Enter description",
  },
  {
    name: "email",
    label: "Email",
    type: "email",
    required: true,
    placeholder: "Enter email",
  },
  {
    name: "age",
    label: "Age",
    type: "number",
    min: 0,
    max: 120,
    placeholder: "Enter age",
  },
  {
    name: "country",
    label: "Country",
    type: "select",
    required: true,
    options: [
      { value: "us", label: "United States" },
      { value: "ca", label: "Canada" },
      { value: "uk", label: "United Kingdom" },
      { value: "de", label: "Germany" },
      { value: "fr", label: "France" },
    ],
  },
  {
    name: "interests",
    label: "Interests",
    type: "multi-select",
    options: [
      { value: "tech", label: "Technology" },
      { value: "sports", label: "Sports" },
      { value: "music", label: "Music" },
      { value: "travel", label: "Travel" },
      { value: "reading", label: "Reading" },
    ],
  },
  {
    name: "newsletter",
    label: "Subscribe to newsletter",
    type: "checkbox",
    required: false,
  },
  {
    name: "birthDate",
    label: "Birth Date",
    type: "date",
    required: true,
  },
];

export default function ExampleOnePage() {
  const formRef = useRef<FormEditorRef>(null);
  const [submittedData, setSubmittedData] = useState<Record<string, unknown>>();

  const handleSubmit = (data: Record<string, unknown>) => {
    console.log("Form submitted with data:", data);
    setSubmittedData(data);
  };

  const handleReset = () => {
    console.log("Form reset");
    setSubmittedData(undefined);
  };

  const handleCustomAction = () => {
    if (formRef.current) {
      const values = formRef.current.getValues();
      console.log("Current form values:", values);

      // Example: Set a specific value
      formRef.current.setValue("title", "Custom Title");

      // Example: Clear errors
      formRef.current.clearErrors();
    }
  };

  return (
    <PageWrapper showBackButton title="Example One (Context-based)">
      <main className="min-h-screen max-w-3xl mx-auto py-10">
        <div className="container mx-auto px-6">
          <h2 className="text-2xl font-bold mb-6">Form with Context-based Architecture</h2>
          <p className="mb-4 text-gray-700">
            This example demonstrates the form builder with a clean context-based approach.
            All field types are handled through the existing form editor.
          </p>

          <FormEditor
            ref={formRef}
            fields={exampleFields}
            onSubmit={handleSubmit}
            onReset={handleReset}
            labelPosition="top"
          />

          <div className="flex gap-3 mt-4">
            <Button onClick={() => formRef.current?.submit()}>
              Submit programmatically
            </Button>
            <Button variant="outline" onClick={() => formRef.current?.reset()}>
              Reset via ref
            </Button>
            <Button variant="ghost" onClick={handleCustomAction}>
              Perform Custom Action
            </Button>
          </div>

          {submittedData && (
            <div className="mt-6">
              <h3 className="text-sm font-medium">Submitted payload</h3>
              <pre className="mt-2 rounded border p-3 bg-gray-50 text-sm overflow-auto">
                {JSON.stringify(submittedData, null, 2)}
              </pre>
            </div>
          )}
        </div>
      </main>
    </PageWrapper>
  );
}