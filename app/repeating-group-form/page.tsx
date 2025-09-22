"use client";

import { useRef, useState } from "react";
import SimpleFormBuilder, {
  FormEditorRef,
  FormData,
} from "@/components/form-builder/form-editor";
import { FieldConfig } from "@/types/fields-type";
import PageWrapper from "@/components/page-wrapper";

// Define fields for the repeating group form
const repeatingFields: FieldConfig[] = [
  {
    name: "fullName",
    label: "Full Name",
    type: "text",
    required: true,
    placeholder: "Enter your full name",
  },
  {
    name: "email",
    label: "Email",
    type: "email",
    required: true,
    placeholder: "Enter your email",
  },
  {
    name: "addresses",
    label: "Addresses",
    type: "array",
    itemType: "text",
    itemConfig: {
      label: "Address",
      placeholder: "Enter address",
      required: true,
    },
    minItems: 1,
    maxItems: 5,
    addButtonText: "Add Address",
    removeButtonText: "Remove Address",
  },
];

export default function RepeatingGroupFormPage() {
  const formRef = useRef<FormEditorRef>(null);
  const [submittedData, setSubmittedData] = useState<FormData>();

  const handleSubmit = (data: FormData) => {
    setSubmittedData(data);
  };

  const handleReset = () => {
    setSubmittedData(undefined);
  };

  return (
    <PageWrapper showBackButton title="Repeating Group Form">
      <div className="pt-10 max-w-3xl mx-auto">
        <div className="mb-6">
          <h2 className="text-xl font-semibold mb-2">Repeating Group Form Example</h2>
          <p className="text-gray-600 mb-4">
            This form demonstrates array fields where users can add/remove multiple items.
            Try adding multiple addresses using the array field.
          </p>
        </div>

        <SimpleFormBuilder
          ref={formRef}
          fields={repeatingFields}
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
