"use client";

import { CheckCircle, Save } from "lucide-react";

export default function TermsPage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-[#ff1f71]">Manage Terms & Conditions</h1>
        <p className="mt-2 text-sm text-gray-700">
          Use this section to write or update the Terms and Conditions for your app. These terms will be displayed to users within the app and must be accepted during registration or major updates.
        </p>
      </div>

      {/* Success Message Alert */}
      <div className="flex items-center gap-3 rounded-xl bg-[#0056b3] p-4 text-white shadow-md">
        <CheckCircle className="h-6 w-6 text-white" />
        <span className="text-sm font-medium">
          Your Terms & Conditions have been successfully updated and will now appear in the app.
        </span>
      </div>

      {/* Editor Card */}
      <div className="rounded-3xl bg-white p-6 shadow-sm">
        <h2 className="mb-4 text-lg font-bold text-[#ff1f71]">Terms & Conditions Editor</h2>
        
        <div className="rounded-xl border border-blue-300 p-2">
            <textarea
            className="min-h-[400px] w-full resize-y rounded-lg p-4 text-sm text-gray-700 outline-none placeholder:text-gray-400"
            placeholder="Write or paste your Terms & Conditions here..."
            defaultValue="" 
            />
        </div>

        <div className="mt-4 text-xs font-medium text-gray-400">
            Last Updated On: <span className="text-gray-500">January 15, 2024</span>
        </div>
      </div>

      {/* Save Button */}
      <div>
        <button className="flex items-center gap-2 rounded-xl bg-blue-500 px-6 py-3 text-sm font-bold text-white transition-colors hover:bg-blue-600">
            <Save className="h-4 w-4" />
            Save Terms & Conditions
        </button>
      </div>
    </div>
  );
}
