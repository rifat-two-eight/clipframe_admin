"use client";

import { ChevronLeft, Eye, PlayCircle, Upload, ChevronDown, Plus } from "lucide-react";
import { useState } from "react";
import StepModal from "./StepModal";

// Types
type Step = {
  id: number;
  title: string;
  shotType: string;
  duration: string;
  mainTip: string;
  detailedTips: string;
  video?: string;
};

type Template = {
  id: number;
  title: string;
  category: string;
  description: string;
  status: "Published" | "Draft";
  steps: Step[];
  views: number;
  usage: number;
  date: string;
  mainVideo?: string;
};

const CATEGORIES = ["All Categories", "Lifestyle", "Restaurant", "Tutorial", "Product"];

type TemplateEditorProps = {
    template: Partial<Template>;
    onBack: () => void;
    onSave: (template: Partial<Template>) => void;
};

export default function TemplateEditor({ template: initialTemplate, onBack, onSave }: TemplateEditorProps) {
    const [currentTemplate, setCurrentTemplate] = useState<Partial<Template>>(initialTemplate);
    const [isStepModalOpen, setIsStepModalOpen] = useState(false);

    const handleAddStep = (newStep: Step) => {
        setCurrentTemplate(prev => ({
            ...prev,
            steps: [...(prev.steps || []), newStep]
        }));
        setIsStepModalOpen(false);
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <button 
                    onClick={onBack}
                    className="flex items-center gap-2 text-gray-600 hover:text-gray-900"
                >
                    <ChevronLeft className="h-5 w-5" />
                    Back to Dashboard
                </button>
                <div className="flex gap-3">
                    <button className="flex items-center gap-2 rounded-xl bg-blue-500 px-6 py-2.5 text-sm font-bold text-white hover:bg-blue-600">
                        <Eye className="h-4 w-4" />
                        Preview
                    </button>
                     <button 
                        onClick={() => onSave(currentTemplate)}
                        className="flex items-center gap-2 rounded-xl bg-[#ff1f71] px-6 py-2.5 text-sm font-bold text-white hover:bg-pink-600"
                    >
                        <PlayCircle className="h-4 w-4" />
                        Save Template
                    </button>
                </div>
            </div>

            <div className="rounded-3xl bg-white p-8 shadow-sm">
                <h2 className="text-lg font-bold text-gray-900 mb-6">Template Details</h2>

                {/* Main Video Upload */}
                <div className="mb-8">
                    <label className="mb-2 block text-sm font-bold text-gray-700">Template Main Video *</label>
                    <div className="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-gray-300 bg-gray-50 py-12 text-center hover:bg-gray-100 cursor-pointer">
                        <Upload className="mb-2 h-8 w-8 text-gray-400" />
                        <p className="text-sm font-bold text-gray-700">Click to upload template main video</p>
                        <p className="mt-1 text-xs text-gray-500">This is the overview/preview video for the entire template</p>
                         <p className="text-xs text-gray-500">MP4, MOV, AVI (Max 500MB)</p>
                    </div>
                </div>

                {/* Form Fields */}
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                    <div className="space-y-2">
                         <label className="text-sm font-bold text-gray-700">Template Title *</label>
                         <input 
                            type="text" 
                            className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm text-gray-900 font-medium outline-none focus:border-blue-500"
                            placeholder="e.g., Restaurant Welcome Experience"
                            defaultValue={currentTemplate.title}
                            onChange={(e) => setCurrentTemplate({...currentTemplate, title: e.target.value})}
                         />
                    </div>
                    <div className="space-y-2">
                         <label className="text-sm font-bold text-gray-700">Category *</label>
                         <div className="relative">
                            <select 
                                className="w-full appearance-none rounded-xl border border-gray-200 px-4 py-3 text-sm text-gray-900 font-medium outline-none focus:border-blue-500"
                                defaultValue={currentTemplate.category || ""}
                                onChange={(e) => setCurrentTemplate({...currentTemplate, category: e.target.value})}
                            >
                                <option value="" disabled>Select Category</option>
                                {CATEGORIES.slice(1).map(c => <option key={c} value={c}>{c}</option>)}
                            </select>
                            <ChevronDown className="absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400 pointer-events-none" />
                         </div>
                    </div>
                </div>

                <div className="mt-6 space-y-2">
                     <label className="text-sm font-bold text-gray-700">Description *</label>
                     <textarea 
                        className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm text-gray-900 font-medium outline-none focus:border-blue-500 h-32 resize-none"
                        placeholder="Brief description of what this template is for..."
                        defaultValue={currentTemplate.description}
                        onChange={(e) => setCurrentTemplate({...currentTemplate, description: e.target.value})}
                     />
                </div>

                <div className="mt-6 w-full md:w-1/2 pr-0 md:pr-3">
                     <label className="text-sm font-bold text-gray-700">Status *</label>
                     <div className="relative">
                        <select 
                            className="w-full appearance-none rounded-xl border border-gray-200 px-4 py-3 text-sm text-gray-900 font-medium outline-none focus:border-blue-500"
                             defaultValue={currentTemplate.status || "Draft"}
                             onChange={(e) => setCurrentTemplate({...currentTemplate, status: e.target.value as any})}
                        >
                            <option value="Published">Published</option>
                            <option value="Draft">Draft</option>
                        </select>
                        <ChevronDown className="absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400 pointer-events-none" />
                     </div>
                </div>
            </div>

            {/* Content Steps Section */}
            <div className="rounded-3xl bg-white p-8 shadow-sm">
                <div className="mb-8 flex items-center justify-between">
                    <div>
                        <h2 className="text-lg font-bold text-gray-900">Content Steps</h2>
                        <p className="text-sm text-gray-500">Add steps with videos and tips</p>
                    </div>
                    {(currentTemplate.steps && currentTemplate.steps.length > 0) && (
                         <button 
                            onClick={() => setIsStepModalOpen(true)}
                            className="flex items-center gap-2 rounded-xl bg-[#ff1f71] px-4 py-2 text-sm font-bold text-white hover:bg-pink-600"
                        >
                            <Plus className="h-4 w-4" />
                            Add Step
                        </button>
                    )}
                </div>

                {(!currentTemplate.steps || currentTemplate.steps.length === 0) ? (
                    <div className="flex flex-col items-center justify-center rounded-2xl border border-gray-100 py-16 text-center">
                         <div className="mb-3 rounded-full bg-gray-100 p-4">
                            <PlayCircle className="h-8 w-8 text-gray-400" />
                         </div>
                        <p className="text-sm font-medium text-gray-500">No steps added yet</p>
                         <button 
                            onClick={() => setIsStepModalOpen(true)}
                            className="mt-4 rounded-xl bg-[#ff1f71] px-6 py-3 text-sm font-bold text-white hover:bg-pink-600"
                        >
                            Add First Step
                        </button>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {currentTemplate.steps.map((step, idx) => (
                             <div key={step.id || idx} className="flex items-center justify-between rounded-xl border border-gray-100 p-4">
                                <div className="flex items-center gap-4">
                                     <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gray-100 text-gray-500">
                                        {idx + 1}
                                     </div>
                                     <div>
                                        <p className="font-bold text-gray-900">{step.title || `Step ${idx + 1}`}</p>
                                        <p className="text-xs text-gray-500">{step.duration}</p>
                                     </div>
                                </div>
                             </div>
                        ))}
                    </div>
                )}
            </div>

            <StepModal 
                isOpen={isStepModalOpen} 
                onClose={() => setIsStepModalOpen(false)} 
                onAddStep={handleAddStep} 
            />
        </div>
    );
}
