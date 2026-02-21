"use client";

import { CheckCircle, Save, Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import api from "@/lib/axios";
import Swal from "sweetalert2";

const Toast = Swal.mixin({
  toast: true,
  position: "top-end",
  showConfirmButton: false,
  timer: 3000,
  timerProgressBar: true,
});

export default function TermsPage() {
  const [content, setContent] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [lastUpdated, setLastUpdated] = useState("");
  const [termsId, setTermsId] = useState("");

  const fetchTerms = async () => {
    setIsLoading(true);
    try {
      const res = await api.get("/public/terms-and-condition");
      const data = res.data?.data || res.data;
      setContent(data.content || "");
      setLastUpdated(data.updatedAt || "");
      setTermsId(data._id || "");
    } catch (err: any) {
      console.error("Fetch terms error:", err);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Failed to load Terms & Conditions",
        confirmButtonColor: "#ff1f71"
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchTerms();
  }, []);

  const handleSave = async () => {
    if (!termsId) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Could not find terms ID to update",
      });
      return;
    }

    setIsSaving(true);
    try {
      await api.patch(`/public/update/${termsId}`, {
        content: content
      });
      Toast.fire({
        icon: "success",
        title: "Updated successfully"
      });
      fetchTerms(); // Refresh to get the latest update time
    } catch (err: any) {
      console.error("Update terms error:", err);
      Swal.fire({
        icon: "error",
        title: "Save Failed",
        text: err.response?.data?.message || "Could not update Terms & Conditions",
        confirmButtonColor: "#ff1f71"
      });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-[#ff1f71]">Manage Terms & Conditions</h1>
          <p className="mt-2 text-sm text-gray-700">
            Current version of the Terms and Conditions for your app.
          </p>
        </div>
        <button
          onClick={handleSave}
          disabled={isSaving || isLoading}
          className="flex items-center gap-2 rounded-xl bg-blue-500 px-6 py-3 text-sm font-bold text-white transition-all hover:bg-blue-600 disabled:opacity-50"
        >
          {isSaving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
          {isSaving ? "Saving..." : "Save Terms & Conditions"}
        </button>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="h-10 w-10 animate-spin text-[#ff1f71]" />
        </div>
      ) : (
        <>
          {/* Success Message Alert (Visual indicator that data is live) */}
          <div className="flex items-center gap-3 rounded-xl bg-blue-600/10 p-4 text-blue-700 border border-blue-200">
            <CheckCircle className="h-5 w-5 text-blue-600" />
            <span className="text-sm font-medium">
              You are currently editing the live version of Terms & Conditions.
            </span>
          </div>

          {/* Editor Card */}
          <div className="rounded-3xl bg-white p-8 shadow-sm border border-gray-100">
            <h2 className="mb-4 text-lg font-bold text-[#ff1f71]">Terms & Conditions Editor</h2>

            <div className="rounded-2xl border border-gray-200 overflow-hidden focus-within:border-blue-400 transition-colors">
              <textarea
                className="min-h-[500px] w-full resize-none p-6 text-base leading-relaxed text-gray-700 outline-none placeholder:text-gray-400"
                placeholder="Write or paste your Terms & Conditions here..."
                value={content}
                onChange={(e) => setContent(e.target.value)}
              />
            </div>

            <div className="mt-6 flex items-center justify-between border-t border-gray-100 pt-4">
              <div className="text-xs font-medium text-gray-400 uppercase tracking-wider">
                Last Updated: <span className="text-gray-600 font-bold">{lastUpdated ? new Date(lastUpdated).toLocaleString() : "Never"}</span>
              </div>
              <div className="text-xs text-gray-400">
                {content.length} characters
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
