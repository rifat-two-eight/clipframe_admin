"use client";

import { Edit, Trash2, Plus, X, ChevronDown, Loader2, AlertCircle } from "lucide-react";
import { useEffect, useState } from "react";
import api from "@/lib/axios";
import { SubscriptionPlan } from "../management/types";
import Swal from "sweetalert2";

const Toast = Swal.mixin({
    toast: true,
    position: "top-end",
    showConfirmButton: false,
    timer: 3000,
    timerProgressBar: true,
    didOpen: (toast) => {
        toast.onmouseenter = Swal.stopTimer;
        toast.onmouseleave = Swal.resumeTimer;
    }
});

const DEFAULT_LIMITS = {
    reelsPerWeek: 0,
    postsPerWeek: 0,
    storiesPerWeek: 0,
    carouselPerWeek: 0,
    businessesManageable: 0
};

export default function SubscriptionPage() {
    const [subscriptions, setSubscriptions] = useState<SubscriptionPlan[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isEditMode, setIsEditMode] = useState(false);
    const [currentId, setCurrentId] = useState<string | null>(null);

    // Form State
    const [formData, setFormData] = useState<Partial<SubscriptionPlan>>({
        title: "",
        description: "",
        price: 0,
        duration: "1 month",
        paymentType: "Monthly",
        limits: { ...DEFAULT_LIMITS },
        features: []
    });
    const [featureInput, setFeatureInput] = useState("");

    const fetchSubscriptions = async () => {
        setIsLoading(true);
        setError(null);
        try {
            const res = await api.get("/plan");
            console.log("GET /plan response:", res.data);
            const data = Array.isArray(res.data) ? res.data : res.data?.data || [];
            setSubscriptions(data);
        } catch (err: any) {
            console.error("Fetch plans error:", err);
            setError(err.response?.data?.message || err.message || "Failed to fetch subscription plans");
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchSubscriptions();
    }, []);

    const openAddModal = () => {
        setIsEditMode(false);
        setCurrentId(null);
        setFormData({
            title: "",
            description: "",
            price: 0,
            duration: "1 month",
            paymentType: "Monthly",
            limits: { ...DEFAULT_LIMITS },
            features: []
        });
        setFeatureInput("");
        setIsModalOpen(true);
    };

    const openEditModal = (sub: SubscriptionPlan) => {
        setIsEditMode(true);
        setCurrentId(sub._id || null);
        setFormData({
            title: sub.title,
            description: sub.description,
            price: sub.price,
            duration: sub.duration,
            paymentType: sub.paymentType,
            limits: sub.limits ? { ...sub.limits } : { ...DEFAULT_LIMITS },
            features: sub.features || []
        });
        setFeatureInput("");
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        if (!isSubmitting) {
            setIsModalOpen(false);
        }
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;

        if (name.startsWith("limits.")) {
            const limitKey = name.split(".")[1];
            setFormData(prev => ({
                ...prev,
                limits: {
                    ...(prev.limits || DEFAULT_LIMITS),
                    [limitKey]: parseInt(value) || 0
                }
            }));
        } else {
            setFormData(prev => ({
                ...prev,
                [name]: name === "price" ? parseFloat(value) || 0 : value
            }));
        }
    };

    const handleAddFeature = () => {
        if (featureInput.trim()) {
            setFormData(prev => ({
                ...prev,
                features: [...(prev.features || []), featureInput.trim()]
            }));
            setFeatureInput("");
        }
    };

    const handleRemoveFeature = (index: number) => {
        setFormData(prev => ({
            ...prev,
            features: (prev.features || []).filter((_, i) => i !== index)
        }));
    };

    const handleSave = async () => {
        setIsSubmitting(true);
        try {
            if (isEditMode && currentId) {
                await api.patch(`/plan/${currentId}`, formData);
                Toast.fire({
                    icon: "success",
                    title: "Plan updated successfully"
                });
            } else {
                await api.post("/plan", formData);
                Toast.fire({
                    icon: "success",
                    title: "Plan created successfully"
                });
            }
            setIsModalOpen(false);
            fetchSubscriptions();
        } catch (err: any) {
            console.error("Save plan error:", err);
            Swal.fire({
                icon: "error",
                title: "Oops...",
                text: err.response?.data?.message || "Failed to save plan",
                confirmButtonColor: "#ff1f71"
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDelete = async (id: string) => {
        const result = await Swal.fire({
            title: "Are you sure?",
            text: "You won't be able to revert this!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#ff1f71",
            cancelButtonColor: "#6c757d",
            confirmButtonText: "Yes, delete it!"
        });

        if (result.isConfirmed) {
            try {
                await api.delete(`/plan/${id}`);
                Toast.fire({
                    icon: "success",
                    title: "Plan deleted successfully"
                });
                fetchSubscriptions();
            } catch (err: any) {
                console.error("Delete plan error:", err);
                Swal.fire({
                    icon: "error",
                    title: "Error!",
                    text: err.response?.data?.message || "Failed to delete plan",
                    confirmButtonColor: "#ff1f71"
                });
            }
        }
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-[#ff1f71]">Subscriptions</h1>
                    <p className="mt-1 text-sm text-gray-700">
                        Unlock perks, protection, and peace of mind.
                    </p>
                </div>
                <button
                    onClick={openAddModal}
                    className="flex items-center gap-2 rounded-xl bg-[#ff1f71] px-6 py-3 text-sm font-bold text-white shadow-lg transition-colors hover:bg-pink-600"
                >
                    <Plus className="h-4 w-4" />
                    Add Plan
                </button>
            </div>

            {/* Error State */}
            {error && (
                <div className="flex items-center gap-3 rounded-2xl border border-red-100 bg-red-50 p-4 text-red-600">
                    <AlertCircle className="h-5 w-5" />
                    <p className="text-sm font-medium">{error}</p>
                    <button onClick={fetchSubscriptions} className="ml-auto text-sm font-bold underline">Retry</button>
                </div>
            )}

            {/* Loading State */}
            {isLoading ? (
                <div className="flex items-center justify-center py-20">
                    <Loader2 className="h-10 w-10 animate-spin text-[#ff1f71]" />
                </div>
            ) : (
                <div className="flex flex-col gap-6">
                    {subscriptions.length === 0 && !error && (
                        <div className="flex flex-col items-center justify-center rounded-3xl border border-dashed border-gray-300 py-20 text-center">
                            <p className="text-gray-500">No subscription plans found.</p>
                            <button onClick={openAddModal} className="mt-4 text-[#ff1f71] font-bold hover:underline">Create your first plan</button>
                        </div>
                    )}
                    {subscriptions.map((sub) => (
                        <div key={sub._id} className="flex flex-col gap-4 lg:flex-row">
                            {/* Card */}
                            <div
                                className={`relative flex-1 overflow-hidden rounded-3xl p-6 text-white shadow-lg ${sub.title?.toLowerCase().includes("starter") || sub.title?.toLowerCase().includes("pro")
                                    ? "bg-gradient-to-r from-pink-500 to-blue-600"
                                    : "bg-gray-600"
                                    }`}
                            >
                                <div className="flex justify-between items-start">
                                    <div>
                                        <h3 className="text-xl font-bold">{sub.title || "Unnamed Plan"}</h3>
                                        <p className="text-xs text-white/70 mt-1 line-clamp-1">{sub.description}</p>
                                    </div>
                                    <span className="rounded-full bg-white/20 px-3 py-1 text-[10px] font-bold uppercase tracking-wider backdrop-blur-sm">
                                        {sub.paymentType}
                                    </span>
                                </div>

                                <div className="mt-6 flex items-end justify-between">
                                    <div>
                                        {sub.price > 0 ? (
                                            <p className="text-3xl font-bold">€{sub.price} <span className="text-base font-normal opacity-80">/ {sub.duration}</span></p>
                                        ) : (
                                            <p className="text-sm text-gray-300">Enable Free Access</p>
                                        )}
                                    </div>

                                    {/* Counts for Reel/Post/Story/Carousel/Business */}
                                    <div className="text-right">
                                        <div className="flex flex-wrap justify-end gap-x-4 gap-y-2">
                                            {sub.limits?.reelsPerWeek > 0 && (
                                                <div className="text-center">
                                                    <p className="text-lg font-bold leading-tight">{sub.limits.reelsPerWeek}</p>
                                                    <p className="text-[10px] text-gray-300 uppercase leading-none">reels/wk</p>
                                                </div>
                                            )}
                                            {sub.limits?.postsPerWeek > 0 && (
                                                <div className="text-center">
                                                    <p className="text-lg font-bold leading-tight">{sub.limits.postsPerWeek}</p>
                                                    <p className="text-[10px] text-gray-300 uppercase leading-none">posts/wk</p>
                                                </div>
                                            )}
                                            {sub.limits?.storiesPerWeek > 0 && (
                                                <div className="text-center">
                                                    <p className="text-lg font-bold leading-tight">{sub.limits.storiesPerWeek}</p>
                                                    <p className="text-[10px] text-gray-300 uppercase leading-none">stories/wk</p>
                                                </div>
                                            )}
                                            {sub.limits?.carouselPerWeek > 0 && (
                                                <div className="text-center">
                                                    <p className="text-lg font-bold leading-tight">{sub.limits.carouselPerWeek}</p>
                                                    <p className="text-[10px] text-gray-300 uppercase leading-none">carousel/wk</p>
                                                </div>
                                            )}
                                            {sub.limits?.businessesManageable > 0 && (
                                                <div className="text-center">
                                                    <p className="text-lg font-bold leading-tight">{sub.limits.businessesManageable}</p>
                                                    <p className="text-[10px] text-gray-300 uppercase leading-none">business</p>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Actions */}
                            <div className="flex w-full flex-col justify-center gap-3 lg:w-48">
                                <button
                                    onClick={() => openEditModal(sub)}
                                    className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#007bff] py-2.5 text-sm font-bold text-white hover:bg-blue-600"
                                >
                                    <Edit className="h-4 w-4" />
                                    Edit
                                </button>
                                <button
                                    onClick={() => sub._id && handleDelete(sub._id)}
                                    className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#e60000] py-2.5 text-sm font-bold text-white hover:bg-red-600"
                                >
                                    <Trash2 className="h-4 w-4" />
                                    Delete
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Modal Overlay */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
                    <div className="w-full max-w-3xl rounded-3xl bg-gradient-to-br from-[#ffeec2] to-[#d6c6ff] p-8 shadow-2xl relative max-h-[90vh] overflow-y-auto">
                        {/* Close Button */}
                        <button
                            onClick={handleCloseModal}
                            disabled={isSubmitting}
                            className="absolute right-6 top-6 rounded-full bg-blue-100 p-2 text-blue-500 hover:bg-blue-200 disabled:opacity-50 transition-colors"
                        >
                            <X className="h-6 w-6" />
                        </button>

                        <h2 className="text-2xl font-bold text-[#ff1f71]">{isEditMode ? 'Edit' : 'Add'} Subscription</h2>
                        <p className="mt-1 text-sm text-gray-600">Configure your plan details, pricing, and weekly limits</p>

                        <div className="mt-8 space-y-6">
                            {/* Plan Title & Description */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-gray-900">Plan Title</label>
                                    <input
                                        type="text"
                                        name="title"
                                        value={formData.title}
                                        onChange={handleInputChange}
                                        className="w-full rounded-xl border border-gray-400 bg-white px-4 py-3 text-gray-900 outline-none focus:border-blue-500"
                                        placeholder="e.g., Pro Plan"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-gray-900">Payment Type</label>
                                    <select
                                        name="paymentType"
                                        value={formData.paymentType}
                                        onChange={handleInputChange}
                                        className="w-full rounded-xl border border-gray-400 bg-white px-4 py-3 text-gray-900 outline-none focus:border-blue-500 appearance-none"
                                    >
                                        <option value="One-time">One-time</option>
                                        <option value="Monthly">Monthly</option>
                                        <option value="Yearly">Yearly</option>
                                    </select>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-bold text-gray-900">Description</label>
                                <textarea
                                    name="description"
                                    value={formData.description}
                                    onChange={handleInputChange}
                                    rows={2}
                                    className="w-full rounded-xl border border-gray-400 bg-white px-4 py-3 text-gray-900 outline-none focus:border-blue-500"
                                    placeholder="Brief plan overview..."
                                />
                            </div>

                            {/* Pricing & Duration */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-gray-900">Price (€)</label>
                                    <input
                                        type="number"
                                        name="price"
                                        value={formData.price}
                                        onChange={handleInputChange}
                                        className="w-full rounded-xl border border-gray-400 bg-white px-4 py-3 text-gray-900 outline-none focus:border-blue-500"
                                        placeholder="0"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-gray-900">Duration Text</label>
                                    <input
                                        type="text"
                                        name="duration"
                                        value={formData.duration}
                                        onChange={handleInputChange}
                                        className="w-full rounded-xl border border-gray-400 bg-white px-4 py-3 text-gray-900 outline-none focus:border-blue-500"
                                        placeholder="e.g., 1 month or Lifetime"
                                    />
                                </div>
                            </div>

                            <div className="pt-4 border-t border-gray-300">
                                <h3 className="text-sm font-bold text-gray-900 mb-4 uppercase tracking-wider">Plan Limits</h3>
                                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                                    <div className="space-y-2">
                                        <label className="text-[11px] font-bold text-gray-600 uppercase">Reels/Wk</label>
                                        <input
                                            type="number"
                                            name="limits.reelsPerWeek"
                                            value={formData.limits?.reelsPerWeek}
                                            onChange={handleInputChange}
                                            className="w-full rounded-lg border border-gray-400 bg-white px-3 py-2 text-gray-900 outline-none focus:border-blue-500"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[11px] font-bold text-gray-600 uppercase">Posts/Wk</label>
                                        <input
                                            type="number"
                                            name="limits.postsPerWeek"
                                            value={formData.limits?.postsPerWeek}
                                            onChange={handleInputChange}
                                            className="w-full rounded-lg border border-gray-400 bg-white px-3 py-2 text-gray-900 outline-none focus:border-blue-500"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[11px] font-bold text-gray-600 uppercase">Stories/Wk</label>
                                        <input
                                            type="number"
                                            name="limits.storiesPerWeek"
                                            value={formData.limits?.storiesPerWeek}
                                            onChange={handleInputChange}
                                            className="w-full rounded-lg border border-gray-400 bg-white px-3 py-2 text-gray-900 outline-none focus:border-blue-500"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[11px] font-bold text-gray-600 uppercase">Carousel/Wk</label>
                                        <input
                                            type="number"
                                            name="limits.carouselPerWeek"
                                            value={formData.limits?.carouselPerWeek}
                                            onChange={handleInputChange}
                                            className="w-full rounded-lg border border-gray-400 bg-white px-3 py-2 text-gray-900 outline-none focus:border-blue-500"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[11px] font-bold text-gray-600 uppercase">Business</label>
                                        <input
                                            type="number"
                                            name="limits.businessesManageable"
                                            value={formData.limits?.businessesManageable}
                                            onChange={handleInputChange}
                                            className="w-full rounded-lg border border-gray-400 bg-white px-3 py-2 text-gray-900 outline-none focus:border-blue-500"
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Features */}
                            <div className="space-y-4 pt-4 border-t border-gray-300">
                                <label className="text-sm font-bold text-gray-900 uppercase tracking-wider">Features & Perks</label>
                                <div className="flex gap-4 items-end">
                                    <div className="flex-1 space-y-2">
                                        <input
                                            type="text"
                                            className="w-full rounded-xl border border-gray-400 bg-white px-4 py-3 text-gray-900 outline-none focus:border-blue-500"
                                            placeholder="e.g., Priority Support"
                                            value={featureInput}
                                            onChange={(e) => setFeatureInput(e.target.value)}
                                            onKeyDown={(e) => e.key === 'Enter' && handleAddFeature()}
                                        />
                                    </div>
                                    <button
                                        type="button"
                                        onClick={handleAddFeature}
                                        className="h-[50px] rounded-xl bg-[#ff1f71] px-6 text-sm font-bold text-white shadow-lg hover:bg-pink-600 transition-colors"
                                    >
                                        Add
                                    </button>
                                </div>

                                <div className="flex flex-wrap gap-2">
                                    {formData.features?.map((feature, index) => (
                                        <div key={index} className="flex items-center gap-2 rounded-lg bg-black/5 px-3 py-1.5 text-sm font-medium text-gray-700">
                                            {feature}
                                            <button onClick={() => handleRemoveFeature(index)} className="text-gray-400 hover:text-red-500 transition-colors">
                                                <X className="h-4 w-4" />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Footer Buttons */}
                            <div className="mt-8 grid grid-cols-2 gap-4">
                                <button
                                    type="button"
                                    disabled={isSubmitting}
                                    onClick={() => setFormData({
                                        title: "",
                                        description: "",
                                        price: 0,
                                        duration: "1 month",
                                        paymentType: "Monthly",
                                        limits: { ...DEFAULT_LIMITS },
                                        features: []
                                    })}
                                    className="w-full rounded-xl bg-white border border-gray-300 py-4 text-center font-bold text-gray-700 hover:bg-gray-50 transition-colors disabled:opacity-50"
                                >
                                    Reset
                                </button>
                                <button
                                    type="button"
                                    disabled={isSubmitting}
                                    onClick={handleSave}
                                    className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#ff1f71] py-4 text-center font-bold text-white shadow-xl hover:bg-pink-600 transition-colors disabled:opacity-50"
                                >
                                    {isSubmitting && <Loader2 className="h-4 w-4 animate-spin" />}
                                    {isSubmitting ? 'Processing...' : (isEditMode ? 'Update Plan' : 'Create Plan')}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
