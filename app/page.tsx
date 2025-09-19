"use client";

import { useRef } from "react";
import FormEditor, { FormEditorRef } from "@/components/form-builder/form-editor";
import { defaultFields } from "@/data/default-form";
import { Button } from "@/components/ui/button";

export default function Page() {
  const formRef = useRef<FormEditorRef>(null);

  const handleSubmit = (data: Record<string, unknown>) => {
    console.log("Form submitted with data:", data);
    // You can add your custom submission logic here
    alert("Form submitted successfully!");
  };

  const handleReset = () => {
    console.log("Form reset");
    // You can add custom reset logic here
  };

  const handleCustomAction = () => {
    if (formRef.current) {
      const values = formRef.current.getValues();
      console.log("Current form values:", values);
      
      // Example: Set a specific value
      formRef.current.setValue("email", "custom@example.com");
      
      // Example: Clear errors
      formRef.current.clearErrors();
    }
  };

  return (
    <main className="min-h-screen bg-gray-50 py-10">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold text-center mb-8 text-gray-900">
            Modular Dynamic Form
          </h1>
          <div className="bg-white rounded-lg shadow-md p-6">
            {/* Form without built-in buttons */}
            <FormEditor 
              ref={formRef}
              fields={defaultFields} 
              labelPosition="left"
              className="w-full"
              formClassName="space-y-6"
              showButtons={false}
              onSubmit={handleSubmit}
              onReset={handleReset}
            />
            
            {/* Custom button controls */}
            <div className="flex justify-center gap-4 pt-6 border-t border-gray-200">
              <Button 
                onClick={() => formRef.current?.submit()}
                className="px-8"
              >
                Submit Form
              </Button>
              <Button 
                onClick={() => formRef.current?.reset()}
                variant="outline"
                className="px-8"
              >
                Reset Form
              </Button>
              <Button 
                onClick={handleCustomAction}
                variant="secondary"
                className="px-8"
              >
                Custom Action
              </Button>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
