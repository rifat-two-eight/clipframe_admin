"use client";

import { X, Upload, Lightbulb, CheckCircle } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Step } from "../types";

type StepModalProps = {
    isOpen: boolean;
    onClose: () => void;
    onAddStep: (step: Step) => void;
    initialData?: Step | null;
};

export default function StepModal({ isOpen, onClose, onAddStep, initialData }: StepModalProps) {
    const [stepForm, setStepForm] = useState<Partial<Step>>({});
    const [clipFile, setClipFile] = useState<File | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (isOpen) {
            if (initialData) {
                setStepForm({
                    title: initialData.title,
                    shotType: initialData.shotType,
                    duration: initialData.duration,
                    mediaType: initialData.mediaType,
                    mainTip: initialData.mainTip,
                    detailedTips: initialData.detailedTips,
                    _id: initialData._id,
                    url: initialData.url,
                });
                setClipFile(initialData.videoFile || null);
            } else {
                setStepForm({});
                setClipFile(null);
            }
        }
    }, [isOpen, initialData]);

    const handleAdd = () => {
        // Validate required fields
        if (!stepForm.title || !stepForm.shotType || !stepForm.duration || !stepForm.mainTip) {
            // In a real app, show validation error
            alert("Please fill in all required fields.");
            return;
        }

        const newStep: Step = {
            ...stepForm,
            title: stepForm.title!,
            shotType: stepForm.shotType!,
            duration: stepForm.duration!,
            mainTip: stepForm.mainTip!,
            mediaType: (stepForm.mediaType as "video" | "image") || "video",
            videoFile: clipFile,
        };
        onAddStep(newStep);
        handleClose();
    };

    const handleClose = () => {
        setStepForm({});
        setClipFile(null);
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
            <div className="w-full max-w-2xl rounded-3xl bg-linear-to-br from-[#ffeec2] to-[#d6c6ff] p-8 shadow-2xl relative max-h-[90vh] overflow-y-auto">
                <button
                    onClick={handleClose}
                    className="absolute right-6 top-6 rounded-full bg-blue-100 p-1 text-blue-500 hover:bg-blue-200"
                >
                    <X className="h-6 w-6" />
                </button>

                <h2 className="text-2xl font-bold text-[#ff1f71]">
                    {initialData ? "Edit step" : "Add new step"}
                </h2>

                <div className="mt-6 space-y-6">
                    {/* Clip Video Upload */}
                    <div>
                        <label className="mb-2 block text-sm font-bold text-gray-700">Step Video / Image *</label>
                        <input
                            ref={fileInputRef}
                            type="file"
                            accept="video/*,image/*"
                            className="hidden"
                            onChange={(e) => {
                                const file = e.target.files?.[0] ?? null;
                                setClipFile(file);
                            }}
                        />
                        <div
                            onClick={() => fileInputRef.current?.click()}
                            className="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-gray-400 bg-white py-8 text-center hover:bg-gray-50 cursor-pointer shadow-inner"
                        >
                            {clipFile ? (
                                <>
                                    <CheckCircle className="mb-2 h-8 w-8 text-green-500" />
                                    <p className="text-sm font-bold text-green-600">{clipFile.name}</p>
                                    <p className="text-xs text-gray-500 mt-1">Click to change</p>
                                </>
                            ) : (
                                <>
                                    <Upload className="mb-2 h-8 w-8 text-gray-700" />
                                    <p className="text-sm font-bold text-gray-700">
                                        {stepForm.url ? "Replace existing media" : "Click to upload video / image"}
                                    </p>
                                    <p className="text-xs text-gray-500">MP4, MOV, AVI, JPG, PNG (Max 500MB)</p>
                                </>
                            )}
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-bold text-gray-700">Step Title *</label>
                        <input
                            type="text"
                            className="w-full rounded-xl border border-gray-400 bg-white px-4 py-3 text-sm text-gray-900 font-medium placeholder:text-gray-400 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                            placeholder="e.g., Waiter welcoming guests to the restaurant"
                            onChange={(e) => setStepForm({ ...stepForm, title: e.target.value })}
                            value={stepForm.title || ""}
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label className="text-sm font-bold text-gray-700">Shot Type *</label>
                            <select
                                className="w-full rounded-xl border border-gray-400 bg-white px-4 py-3 text-sm text-gray-900 font-medium outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                                onChange={(e) => setStepForm({ ...stepForm, shotType: e.target.value })}
                                value={stepForm.shotType || ""}
                            >
                                <option value="" disabled>Select shot type</option>
                                <option value="wide">Wide</option>
                                <option value="mid-shot">Mid-shot</option>
                                <option value="close-up">Close-up</option>
                            </select>
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-bold text-gray-700">Duration *</label>
                            <input
                                type="text"
                                className="w-full rounded-xl border border-gray-400 bg-white px-4 py-3 text-sm text-gray-900 font-medium placeholder:text-gray-400 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                                placeholder="e.g., 4-6 seconds"
                                onChange={(e) => setStepForm({ ...stepForm, duration: e.target.value })}
                                value={stepForm.duration || ""}
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-bold text-gray-700">Media Type *</label>
                        <select
                            className="w-full rounded-xl border border-gray-400 bg-white px-4 py-3 text-sm text-gray-900 font-medium outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                            onChange={(e) => setStepForm({ ...stepForm, mediaType: e.target.value as "video" | "image" })}
                            value={stepForm.mediaType || "video"}
                        >
                            <option value="video">Video</option>
                            <option value="image">Image</option>
                        </select>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-bold text-gray-700">Main Tip *</label>
                        <input
                            type="text"
                            className="w-full rounded-xl border border-gray-400 bg-white px-4 py-3 text-sm text-gray-900 font-medium placeholder:text-gray-400 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                            placeholder="Record in landscape for best results. Focus on steam and smile!"
                            onChange={(e) => setStepForm({ ...stepForm, mainTip: e.target.value })}
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
                                onChange={(e) => setStepForm({ ...stepForm, detailedTips: e.target.value })}
                                value={stepForm.detailedTips || ""}
                            />
                            <Lightbulb className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-yellow-600" />
                        </div>
                    </div>

                    <div className="mt-8 flex justify-end gap-3">
                        <button
                            onClick={handleClose}
                            className="rounded-xl px-6 py-3 text-sm font-bold text-gray-600 hover:bg-gray-100"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={handleAdd}
                            className="rounded-xl bg-[#ff1f71] px-6 py-3 text-sm font-bold text-white shadow-lg hover:bg-pink-600"
                        >
                            {initialData ? "Update Step" : "Add Step"}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
