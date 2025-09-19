"use client";

import FormEditor from "@/components/form-builder/form-editor";
 

export default function Page() {
  return (
    <main className="max-w-md mx-auto py-10">
      <h1 className="text-2xl font-bold mb-6">Simple Dynamic Form</h1>
      <FormEditor />
    </main>
  );
}
