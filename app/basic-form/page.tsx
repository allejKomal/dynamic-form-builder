"use client";

import type { FieldConfig } from "@/types/fields-type";
import SimpleFormBuilder, {
  FormEditorRef,
  FormData,
} from "@/components/form-builder/form-editor";
import { useRef, useState } from "react";
import PageWrapper from "@/components/page-wrapper";

const basicFields: FieldConfig[] = [
  {
    name: "fullName",
    label: "Full name",
    type: "text",
    required: true,
    placeholder: "John Doe",
    maxlength: 100,
  },
  {
    name: "email",
    label: "Email",
    type: "email",
    required: true,
    placeholder: "you@example.com",
  },
  {
    name: "password",
    label: "Password",
    type: "password",
    required: true,
    placeholder: "Choose a password",
    maxlength: 128,
  },
  {
    name: "age",
    label: "Age",
    type: "number",
    min: 0,
    max: 120,
    placeholder: "Optional",
  },
  {
    name: "bio",
    label: "Short bio",
    type: "textarea",
    maxlength: 250,
    placeholder: "Tell us a little about yourself (optional)",
  },
  {
    name: "terms",
    label: "Agree to terms",
    type: "checkbox",
    required: true,
    checkedValue: true,
    uncheckedValue: false,
    defaultValue: false,
  },
];

export default function BasicFormPage() {
  const formRef = useRef<FormEditorRef>(null);
  const [submittedData, setSubmittedData] = useState<FormData>();

  const handleSubmit = (data: FormData) => {
    setSubmittedData(data);
  };

  const handleReset = () => {
    setSubmittedData(undefined);
  };

  return (
    <PageWrapper showBackButton title="Basic Form">
      <div className="pt-10 max-w-6xl mx-auto">
        <div className="mb-6">
          <h2 className="text-xl font-semibold mb-2">Basic Form Example</h2>
          <p className="text-gray-600 mb-4">
            This is a simple form using the traditional ref-based approach.
          </p>
        </div>

        <div className="space-y-6">
          <SimpleFormBuilder
            ref={formRef}
            fields={basicFields}
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
      </div>
    </PageWrapper>
  );
}
