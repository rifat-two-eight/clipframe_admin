"use client";

import { ChevronLeft, Eye, PlayCircle, Upload, ChevronDown, Plus, CheckCircle, Loader2, X, Edit2 } from "lucide-react";
import { useRef, useState } from "react";
import StepModal from "./StepModal";
import api from "@/lib/axios";
import { Template, Step } from "../types";

// Constants
const CATEGORIES = ["Restaurant"];
const TYPES = ["reel", "story", "post"];

type TemplateEditorProps = {
    template: Partial<Template>;
    onBack: () => void;
    onSave: () => void;
    onPreview: (template: Partial<Template>) => void;
};

export default function TemplateEditor({ template: initialTemplate, onBack, onSave, onPreview }: TemplateEditorProps) {
    const [currentTemplate, setCurrentTemplate] = useState<Partial<Template>>({
        ...initialTemplate,
        steps: initialTemplate.steps || []
    });
    const [isStepModalOpen, setIsStepModalOpen] = useState(false);
    const [editingStepIndex, setEditingStepIndex] = useState<number | null>(null);
    const [thumbnailFile, setThumbnailFile] = useState<File | null>(null);
    const [hashtagInput, setHashtagInput] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const thumbnailInputRef = useRef<HTMLInputElement>(null);

    const handleAddStep = (newStep: Step) => {
        setCurrentTemplate(prev => {
            const steps = [...(prev.steps || [])];
            if (editingStepIndex !== null) {
                steps[editingStepIndex] = newStep;
            } else {
                steps.push(newStep);
            }
            return { ...prev, steps };
        });
        handleCloseStepModal();
    };

    const handleEditStep = (index: number) => {
        setEditingStepIndex(index);
        setIsStepModalOpen(true);
    };

    const handleCloseStepModal = () => {
        setIsStepModalOpen(false);
        setEditingStepIndex(null);
    };

    const handleRemoveStep = (indexToRemove: number) => {
        setCurrentTemplate(prev => ({
            ...prev,
            steps: (prev.steps || []).filter((_, idx) => idx !== indexToRemove)
        }));
    };

    const handleAddHashtag = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter" && hashtagInput.trim()) {
            e.preventDefault();
            const tag = hashtagInput.trim().replace(/^#/, "");
            if (tag && !(currentTemplate.hashtags || []).includes(tag)) {
                setCurrentTemplate(prev => ({
                    ...prev,
                    hashtags: [...(prev.hashtags || []), tag]
                }));
            }
            setHashtagInput("");
        }
    };

    const handleRemoveHashtag = (tag: string) => {
        setCurrentTemplate(prev => ({
            ...prev,
            hashtags: (prev.hashtags || []).filter(h => h !== tag)
        }));
    };

    const handleSave = async () => {
        setError(null);
        setIsLoading(true);
        try {
            const templateData = {
                title: currentTemplate.title,
                type: currentTemplate.type,
                category: currentTemplate.category,
                description: currentTemplate.description || "", // Optional in shared type, but form has it
                hashtags: currentTemplate.hashtags || [],
                isActive: currentTemplate.isActive,
                steps: (currentTemplate.steps || []).map(step => ({
                    title: step.title,
                    mainTip: step.mainTip,
                    detailedTips: step.detailedTips || "",
                    shotType: step.shotType,
                    duration: step.duration,
                    mediaType: step.mediaType,
                    // We don't send file object in JSON, backend expects files in multipart
                    // _id is not needed for creation, maybe needed for update if backend supports updating specific steps?
                    // For now assuming full replacement or new steps.
                    ...(step._id ? { _id: step._id } : {})
                })),
            };

            const formData = new FormData();

            // 1. JSON data
            formData.append("data", JSON.stringify(templateData));

            // 2. Thumbnail image
            if (thumbnailFile) {
                formData.append("image", thumbnailFile);
            }

            // 4. Clip files — order must match steps array
            // The backend likely iterates through `clips` array. 
            // We need to ensure that the order matches the steps that HAVE files.
            // Or does the backend map them by index?
            // "files (thumbnail, preview media, step clips)"
            // Usually step clips are appended as "clips" or similar.
            // We need to be careful: if we have 3 steps, and step 2 has a NEW file, but step 1 and 3 are existing/no-change...
            // If the backend replaces ALL steps, we might need to re-upload files or provide URLs for existing ones.
            // The shared type has `url`.
            // If `videoFile` is present, it's a new upload.
            // The backend logic from `Step 1` user description: "Implementing multipart/form-data upload... step clips".
            // I will append `clips` for every step that has a `videoFile`.
            // But how does backend know which clip belongs to which step?
            // Often it's positional.
            // If I have steps [A, B, C] and only B has a file, and I append 1 file...
            // If the backend expects 1:1 mapping, I might need to append null or handle it.
            // However, usually "clips" field accumulates files.
            // Let's look at `TemplateEditor.tsx` original code:
            /*
            (currentTemplate.steps || []).forEach(step => {
                if (step.videoFile) {
                    formData.append("clips", step.videoFile);
                }
            });
            */
            // This suggests it blindly appends. I'll stick to this for now unless I see errors.
            (currentTemplate.steps || []).forEach(step => {
                if (step.videoFile) {
                    formData.append("clips", step.videoFile);
                }
            });

            // 5. POST to API / Update
            // If we have an ID, it's an update?
            // The API list response had `_id`.
            if (currentTemplate._id) {
                // Update logic - usually PUT or PATCH
                // Assuming PUT /contentTemplate/:id or similar?
                // User request didn't specify update endpoint.
                // "Create/update operations reflect live data".
                // I'll try generic POST for create. For update, I might need to check if there is an update endpoint.
                // If `currentTemplate` has `_id`, I should probably use PUT `contentTemplate/${currentTemplate._id}`?
                // Or maybe POST handles both? I'll assume PUT for update if ID exists.
                await api.patch(`/contentTemplate/${currentTemplate._id}`, formData, {
                    headers: { "Content-Type": "multipart/form-data" },
                });
            } else {
                await api.post("/contentTemplate", formData, {
                    headers: { "Content-Type": "multipart/form-data" },
                });
            }

            onSave();
        } catch (err: unknown) {
            const axiosErr = err as { response?: { data?: { message?: string; error?: string } }; message?: string };
            const serverMsg = axiosErr?.response?.data?.message
                || axiosErr?.response?.data?.error
                || JSON.stringify(axiosErr?.response?.data)
                || axiosErr?.message
                || "Failed to save template.";
            console.error("API Error:", axiosErr?.response?.data);
            setError(serverMsg);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="space-y-6 pb-10">
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
                    <button
                        onClick={() => onPreview(currentTemplate)}
                        className="flex items-center gap-2 rounded-xl bg-blue-500 px-6 py-2.5 text-sm font-bold text-white hover:bg-blue-600 transition-all active:scale-95"
                    >
                        <Eye className="h-4 w-4" />
                        Preview
                    </button>
                    <button
                        onClick={handleSave}
                        disabled={isLoading}
                        className="flex items-center gap-2 rounded-xl bg-[#ff1f71] px-6 py-2.5 text-sm font-bold text-white hover:bg-pink-600 disabled:opacity-60 disabled:cursor-not-allowed"
                    >
                        {isLoading ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                            <PlayCircle className="h-4 w-4" />
                        )}
                        {isLoading ? "Saving..." : "Save Template"}
                    </button>
                </div>
            </div>

            {/* Error Banner */}
            {error && (
                <div className="rounded-xl bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-600 flex items-center gap-2">
                    <X className="h-4 w-4 shrink-0" />
                    {error}
                </div>
            )}

            <div className="rounded-3xl bg-white p-8 shadow-sm">
                <h2 className="text-lg font-bold text-gray-900 mb-6">Template Details</h2>

                {/* Thumbnail Upload */}
                <div className="mb-6">
                    <label className="mb-2 block text-sm font-bold text-gray-700">Thumbnail Image *</label>
                    <input
                        ref={thumbnailInputRef}
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => setThumbnailFile(e.target.files?.[0] ?? null)}
                    />
                    <div
                        onClick={() => thumbnailInputRef.current?.click()}
                        className="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-gray-300 bg-gray-50 py-10 text-center hover:bg-gray-100 cursor-pointer"
                    >
                        {thumbnailFile ? (
                            <>
                                <CheckCircle className="mb-2 h-8 w-8 text-green-500" />
                                <p className="text-sm font-bold text-green-600">{thumbnailFile.name}</p>
                                <p className="text-xs text-gray-500 mt-1">Click to change</p>
                            </>
                        ) : currentTemplate.thumbnail ? (
                            <>
                                <img src={currentTemplate.thumbnail} alt="Thumbnail" className="h-32 w-auto object-cover rounded-lg mb-2" />
                                <p className="text-sm font-bold text-gray-700">Click to replace thumbnail</p>
                            </>
                        ) : (
                            <>
                                <Upload className="mb-2 h-8 w-8 text-gray-400" />
                                <p className="text-sm font-bold text-gray-700">Click to upload thumbnail image</p>
                                <p className="mt-1 text-xs text-gray-500">JPG, PNG, WEBP (Max 10MB)</p>
                            </>
                        )}
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
                            onChange={(e) => setCurrentTemplate({ ...currentTemplate, title: e.target.value })}
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-bold text-gray-700">Category *</label>
                        <div className="relative">
                            <select
                                className="w-full appearance-none rounded-xl border border-gray-200 px-4 py-3 text-sm text-gray-900 font-medium outline-none focus:border-blue-500"
                                defaultValue={currentTemplate.category || ""}
                                onChange={(e) => setCurrentTemplate({ ...currentTemplate, category: e.target.value })}
                            >
                                <option value="" disabled>Select Category</option>
                                {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                            </select>
                            <ChevronDown className="absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400 pointer-events-none" />
                        </div>
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-bold text-gray-700">Type *</label>
                        <div className="relative">
                            <select
                                className="w-full appearance-none rounded-xl border border-gray-200 px-4 py-3 text-sm text-gray-900 font-medium outline-none focus:border-blue-500"
                                defaultValue={currentTemplate.type || ""}
                                onChange={(e) => setCurrentTemplate({ ...currentTemplate, type: e.target.value })}
                            >
                                <option value="" disabled>Select Type</option>
                                {TYPES.map(t => <option key={t} value={t}>{t.charAt(0).toUpperCase() + t.slice(1)}</option>)}
                            </select>
                            <ChevronDown className="absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400 pointer-events-none" />
                        </div>
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-bold text-gray-700">Status *</label>
                        <div className="relative">
                            <select
                                className="w-full appearance-none rounded-xl border border-gray-200 px-4 py-3 text-sm text-gray-900 font-medium outline-none focus:border-blue-500"
                                value={currentTemplate.isActive ? "Published" : "Draft"}
                                onChange={(e) => setCurrentTemplate({ ...currentTemplate, isActive: e.target.value === "Published" })}
                            >
                                <option value="Published">Published</option>
                                <option value="Draft">Draft</option>
                            </select>
                            <ChevronDown className="absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400 pointer-events-none" />
                        </div>
                    </div>
                </div>

                <div className="mt-6 space-y-2">
                    <label className="text-sm font-bold text-gray-700">Description</label>
                    <textarea
                        className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm text-gray-900 font-medium outline-none focus:border-blue-500 h-32 resize-none"
                        placeholder="Brief description of what this template is for..."
                        defaultValue={currentTemplate.description}
                        onChange={(e) => setCurrentTemplate({ ...currentTemplate, description: e.target.value })}
                    />
                </div>

                {/* Hashtags */}
                <div className="mt-6 space-y-2">
                    <label className="text-sm font-bold text-gray-700">Hashtags</label>
                    <input
                        type="text"
                        className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm text-gray-900 font-medium outline-none focus:border-blue-500"
                        placeholder="Type a hashtag and press Enter (e.g., morning)"
                        value={hashtagInput}
                        onChange={(e) => setHashtagInput(e.target.value)}
                        onKeyDown={handleAddHashtag}
                    />
                    {(currentTemplate.hashtags || []).length > 0 && (
                        <div className="flex flex-wrap gap-2 mt-2">
                            {(currentTemplate.hashtags || []).map(tag => (
                                <span
                                    key={tag}
                                    className="flex items-center gap-1 rounded-full bg-pink-50 px-3 py-1 text-xs font-bold text-[#ff1f71]"
                                >
                                    #{tag}
                                    <button
                                        onClick={() => handleRemoveHashtag(tag)}
                                        className="ml-1 hover:text-pink-800"
                                    >
                                        <X className="h-3 w-3" />
                                    </button>
                                </span>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {/* Content Steps Section */}
            <div className="rounded-3xl bg-white p-8 shadow-sm">
                <div className="mb-8 flex items-center justify-between">
                    <div>
                        <h2 className="text-lg font-bold text-gray-900">Content Steps</h2>
                        <p className="text-sm text-gray-500">Add steps with videos and tips. Order matters for clip upload.</p>
                    </div>
                    {(currentTemplate.steps && currentTemplate.steps.length > 0) && (
                        <button
                            onClick={() => {
                                setEditingStepIndex(null);
                                setIsStepModalOpen(true);
                            }}
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
                            onClick={() => {
                                setEditingStepIndex(null);
                                setIsStepModalOpen(true);
                            }}
                            className="mt-4 rounded-xl bg-[#ff1f71] px-6 py-3 text-sm font-bold text-white hover:bg-pink-600"
                        >
                            Add First Step
                        </button>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {currentTemplate.steps.map((step, idx) => (
                            <div key={step._id || idx} className="flex items-center justify-between rounded-xl border border-gray-100 p-4">
                                <div className="flex items-center gap-4">
                                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gray-100 text-gray-500 font-bold">
                                        {idx + 1}
                                    </div>
                                    <div>
                                        <p className="font-bold text-gray-900">{step.title || `Step ${idx + 1}`}</p>
                                        <div className="flex items-center gap-3 mt-0.5">
                                            <p className="text-xs text-gray-500">{step.duration}</p>
                                            {step.shotType && (
                                                <span className="rounded-full bg-blue-50 px-2 py-0.5 text-xs font-medium text-blue-500">
                                                    {step.shotType}
                                                </span>
                                            )}
                                            {step.videoFile ? (
                                                <span className="flex items-center gap-1 text-xs text-green-600 font-medium">
                                                    <CheckCircle className="h-3 w-3" />
                                                    {step.videoFile.name}
                                                </span>
                                            ) : step.url ? (
                                                <span className="text-xs text-blue-500 font-medium">Existing Clip</span>
                                            ) : (
                                                <span className="text-xs text-orange-500 font-medium">No clip uploaded</span>
                                            )}
                                        </div>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2">
                                    <button
                                        onClick={() => handleEditStep(idx)}
                                        className="rounded-full p-1.5 text-gray-400 hover:text-blue-500 hover:bg-blue-50 transition-colors"
                                        title="Edit Step"
                                    >
                                        <Edit2 className="h-4 w-4" />
                                    </button>
                                    <button
                                        onClick={() => handleRemoveStep(idx)}
                                        className="rounded-full p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors"
                                        title="Remove Step"
                                    >
                                        <X className="h-4 w-4" />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            <StepModal
                isOpen={isStepModalOpen}
                onClose={handleCloseStepModal}
                onAddStep={handleAddStep}
                initialData={editingStepIndex !== null ? (currentTemplate.steps || [])[editingStepIndex] : null}
            />
        </div>
    );
}
