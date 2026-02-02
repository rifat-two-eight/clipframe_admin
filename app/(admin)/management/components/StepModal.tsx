"use client";

import { X, Upload, Lightbulb } from "lucide-react";
import { useState } from "react";

// Shared Types (ideally move to a types file, but keeping simple for now)
type Step = {
  id: number;
  title: string;
  shotType: string;
  duration: string;
  mainTip: string;
  detailedTips: string;
  video?: string;
};

type StepModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onAddStep: (step: Step) => void;
};

export default function StepModal({ isOpen, onClose, onAddStep }: StepModalProps) {
  const [stepForm, setStepForm] = useState<Partial<Step>>({});

  const handleAdd = () => {
    // Basic validation could go here
    const newStep = { 
        ...stepForm, 
        id: Date.now() 
    } as Step;
    
    onAddStep(newStep);
    setStepForm({}); // Reset form
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="w-full max-w-2xl rounded-3xl bg-gradient-to-br from-[#ffeec2] to-[#d6c6ff] p-8 shadow-2xl relative max-h-[90vh] overflow-y-auto">
        <button 
            onClick={onClose}
            className="absolute right-6 top-6 rounded-full bg-blue-100 p-1 text-blue-500 hover:bg-blue-200"
        >
            <X className="h-6 w-6" />
        </button>

        <h2 className="text-2xl font-bold text-[#ff1f71]">Add new step</h2>
        
        <div className="mt-6 space-y-6">
            {/* Video Upload */}
            <div>
                <label className="mb-2 block text-sm font-bold text-gray-700">Step Video *</label>
                <div className="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-gray-400 bg-white py-8 text-center hover:bg-gray-50 cursor-pointer shadow-inner">
                    <Upload className="mb-2 h-8 w-8 text-gray-700" />
                    <p className="text-sm font-bold text-gray-700">Click to upload video</p>
                    <p className="text-xs text-gray-500">MP4, MOV, AVI (Max 500MB)</p>
                </div>
            </div>

            <div className="space-y-2">
                <label className="text-sm font-bold text-gray-700">Step Title *</label>
                <input 
                    type="text" 
                    className="w-full rounded-xl border border-gray-400 bg-white px-4 py-3 text-sm text-gray-900 font-medium placeholder:text-gray-400 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                    placeholder="e.g., Waiter welcoming guests to the restaurant"
                    onChange={(e) => setStepForm({...stepForm, title: e.target.value})}
                    value={stepForm.title || ""}
                />
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                    <label className="text-sm font-bold text-gray-700">Shot Type *</label>
                    <input 
                        type="text" 
                        className="w-full rounded-xl border border-gray-400 bg-white px-4 py-3 text-sm text-gray-900 font-medium placeholder:text-gray-400 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                        onChange={(e) => setStepForm({...stepForm, shotType: e.target.value})}
                        value={stepForm.shotType || ""}
                    />
                </div>
                <div className="space-y-2">
                    <label className="text-sm font-bold text-gray-700">Duration *</label>
                    <input 
                        type="text" 
                        className="w-full rounded-xl border border-gray-400 bg-white px-4 py-3 text-sm text-gray-900 font-medium placeholder:text-gray-400 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                        placeholder="e.g., 4-6 seconds"
                        onChange={(e) => setStepForm({...stepForm, duration: e.target.value})}
                        value={stepForm.duration || ""}
                    />
                </div>
            </div>

            <div className="space-y-2">
                <label className="text-sm font-bold text-gray-700">Main Tip *</label>
                <input 
                    type="text" 
                    className="w-full rounded-xl border border-gray-400 bg-white px-4 py-3 text-sm text-gray-900 font-medium placeholder:text-gray-400 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                    placeholder="Record in landscape for best results. Focus on steam and smile!"
                    onChange={(e) => setStepForm({...stepForm, mainTip: e.target.value})}
                    value={stepForm.mainTip || ""}
                />
            </div>

            <div className="space-y-2">
                <label className="text-sm font-bold text-gray-700">Detailed Tips</label>
                <div className="relative">
                    <input 
                        type="text" 
                        className="w-full rounded-xl border border-gray-400 bg-white px-4 py-3 pl-10 text-sm text-gray-900 font-medium placeholder:text-gray-400 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                        placeholder="Enter a helpful tip..."
                        onChange={(e) => setStepForm({...stepForm, detailedTips: e.target.value})}
                        value={stepForm.detailedTips || ""}
                    />
                    <Lightbulb className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-yellow-600" />
                </div>
            </div>

            <div className="mt-8 flex justify-end gap-3">
                <button 
                    onClick={onClose}
                    className="rounded-xl px-6 py-3 text-sm font-bold text-gray-600 hover:bg-gray-100"
                >
                    Cancel
                </button>
                <button 
                    onClick={handleAdd}
                    className="rounded-xl bg-[#ff1f71] px-6 py-3 text-sm font-bold text-white shadow-lg hover:bg-pink-600"
                >
                    Add Step
                </button>
            </div>
        </div>
      </div>
    </div>
  );
}
