"use client";

import { Edit, Plus, X, ChevronDown, Loader2, AlertCircle, TrendingUp, Users, Activity, Calendar, ShieldCheck, Zap, Star } from "lucide-react";
import { useEffect, useState } from "react";
import { SubscriptionPlan } from "../management/types";
import { subscriptionService, UserSubscription } from "@/services/subscriptionService";
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

const DEFAULT_PLAN: Partial<SubscriptionPlan> = {
    name: "",
    description: "",
    price: 0,
    currency: "usd",
    interval: "month",
    intervalCount: 1,
    trialPeriodDays: 0,
    features: [],
    tier: "basic",
    priority: 0,
    reelsPerWeek: 0,
    postsPerWeek: 0,
    storiesPerWeek: 0,
    carouselPerWeek: 0,
    businessesManageable: 0,
    isActive: true
};

type TabType = "plans" | "subscriptions";

export default function SubscriptionPage() {
    const [activeTab, setActiveTab] = useState<TabType>("plans");
    const [subscriptions, setSubscriptions] = useState<SubscriptionPlan[]>([]);
    const [userSubscriptions, setUserSubscriptions] = useState<UserSubscription[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isEditMode, setIsEditMode] = useState(false);
    const [currentId, setCurrentId] = useState<string | null>(null);

    // Form State
    const [formData, setFormData] = useState<Partial<SubscriptionPlan>>(DEFAULT_PLAN);
    const [featureInput, setFeatureInput] = useState("");

    const fetchData = async () => {
        setIsLoading(true);
        setError(null);
        try {
            if (activeTab === "plans") {
                const data = await subscriptionService.getAllPlans();
                setSubscriptions(Array.isArray(data) ? data : []);
            } else if (activeTab === "subscriptions") {
                const data = await subscriptionService.getAllSubscriptions();
                setUserSubscriptions(Array.isArray(data) ? data : []);
            }
        } catch (err: any) {
            console.error(`Fetch ${activeTab} error:`, err);
            setError(err.response?.data?.message || err.message || `Failed to fetch ${activeTab}`);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, [activeTab]);

    const openAddModal = () => {
        setIsEditMode(false);
        setCurrentId(null);
        setFormData(DEFAULT_PLAN);
        setFeatureInput("");
        setIsModalOpen(true);
    };

    const openEditModal = (sub: SubscriptionPlan) => {
        setIsEditMode(true);
        setCurrentId(sub._id || null);
        setFormData({ ...sub });
        setFeatureInput("");
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        if (!isSubmitting) {
            setIsModalOpen(false);
        }
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value, type } = e.target;

        const numericFields = ["price", "intervalCount", "priority", "reelsPerWeek", "postsPerWeek", "storiesPerWeek", "carouselPerWeek", "businessesManageable", "trialPeriodDays"];

        setFormData(prev => ({
            ...prev,
            [name]: numericFields.includes(name)
                ? parseFloat(value) || 0
                : (name === "isActive" ? (e.target as HTMLInputElement).checked : value)
        }));
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
                await subscriptionService.updatePlan(currentId, formData);
                Toast.fire({ icon: "success", title: "Plan updated successfully" });
            } else {
                await subscriptionService.createPlan(formData);
                Toast.fire({ icon: "success", title: "Plan created successfully" });
            }
            setIsModalOpen(false);
            fetchData();
        } catch (err: any) {
            console.error("Save plan error:", err);
            Swal.fire({
                icon: "error",
                title: "Error",
                text: err.response?.data?.message || "Failed to save plan",
                confirmButtonColor: "#ff1f71"
            });
        } finally {
            setIsSubmitting(false);
        }
    };



    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-[#ff1f71]">Subscription Management</h1>
                    <p className="mt-1 text-sm text-gray-700">
                        Manage plans, analyze performance, and oversee user subscriptions.
                    </p>
                </div>
                {activeTab === "plans" && (
                    <button
                        onClick={openAddModal}
                        className="flex items-center gap-2 rounded-xl bg-[#ff1f71] px-6 py-3 text-sm font-bold text-white shadow-lg transition-transform hover:scale-105 active:scale-95"
                    >
                        <Plus className="h-4 w-4" />
                        Create New Plan
                    </button>
                )}
            </div>

            {/* Tabs */}
            <div className="flex border-b border-gray-200">
                {(["plans", "subscriptions"] as const).map((tab) => (
                    <button
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        className={`px-6 py-3 text-sm font-bold capitalize transition-colors relative ${activeTab === tab ? "text-[#ff1f71]" : "text-gray-500 hover:text-gray-700"
                            }`}
                    >
                        {tab}
                        {activeTab === tab && (
                            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#ff1f71]" />
                        )}
                    </button>
                ))}
            </div>

            {/* Error State */}
            {error && (
                <div className="flex items-center gap-3 rounded-2xl border border-red-100 bg-red-50 p-4 text-red-600">
                    <AlertCircle className="h-5 w-5" />
                    <p className="text-sm font-medium">{error}</p>
                    <button onClick={fetchData} className="ml-auto text-sm font-bold underline">Retry</button>
                </div>
            )}

            {/* Main Content */}
            {isLoading ? (
                <div className="flex items-center justify-center py-20">
                    <Loader2 className="h-10 w-10 animate-spin text-[#ff1f71]" />
                </div>
            ) : (
                <div className="mt-6">
                    {/* Plans Tab */}
                    {activeTab === "plans" && (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {subscriptions.length === 0 ? (
                                <div className="col-span-full flex flex-col items-center justify-center rounded-3xl border border-dashed border-gray-300 py-20 text-center">
                                    <p className="text-gray-500">No subscription plans found.</p>
                                    <button onClick={openAddModal} className="mt-4 text-[#ff1f71] font-bold hover:underline">Create your first plan</button>
                                </div>
                            ) : (
                                subscriptions.map((sub) => (
                                    <div key={sub._id} className="relative group overflow-hidden rounded-3xl bg-white border border-gray-100 shadow-xl transition-all hover:shadow-2xl hover:-translate-y-1">
                                        <div className={`h-2 w-full ${sub.tier === 'premium' ? 'bg-gradient-to-r from-yellow-400 to-orange-500' : sub.tier === 'basic' ? 'bg-[#ff1f71]' : 'bg-gray-400'}`} />

                                        <div className="p-6">
                                            <div className="flex justify-between items-start mb-4">
                                                <div>
                                                    <h3 className="text-xl font-bold text-gray-900 group-hover:text-[#ff1f71] transition-colors">{sub.name}</h3>
                                                    <span className={`inline-block mt-1 rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider ${sub.isActive ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-500'}`}>
                                                        {sub.isActive ? 'Active' : 'Inactive'}
                                                    </span>
                                                </div>
                                                <div className="flex gap-2">
                                                    <button onClick={() => openEditModal(sub)} className="p-2 rounded-lg bg-blue-50 text-blue-500 hover:bg-blue-100 transition-colors">
                                                        <Edit className="h-4 w-4" />
                                                    </button>
                                                </div>
                                            </div>

                                            <p className="text-sm text-gray-600 mb-6 line-clamp-2 min-h-[40px]">{sub.description}</p>

                                            <div className="mb-6 flex items-baseline gap-1">
                                                <span className="text-3xl font-black text-gray-900">${sub.price}</span>
                                                <span className="text-sm text-gray-500 uppercase">/ {sub.intervalCount > 1 ? `${sub.intervalCount} ${sub.interval}s` : sub.interval}</span>
                                            </div>

                                            <div className="space-y-3 mb-6">
                                                <div className="grid grid-cols-2 gap-2 text-xs">
                                                    <div className="flex items-center gap-2 p-2 rounded-xl bg-gray-50 text-gray-700">
                                                        <Zap className="h-3 w-3 text-[#ff1f71]" />
                                                        <span>{sub.reelsPerWeek} Reels/wk</span>
                                                    </div>
                                                    <div className="flex items-center gap-2 p-2 rounded-xl bg-gray-50 text-gray-700">
                                                        <Activity className="h-3 w-3 text-[#ff1f71]" />
                                                        <span>{sub.postsPerWeek} Posts/wk</span>
                                                    </div>
                                                    <div className="flex items-center gap-2 p-2 rounded-xl bg-gray-50 text-gray-700">
                                                        <Calendar className="h-3 w-3 text-[#ff1f71]" />
                                                        <span>{sub.storiesPerWeek} Stories/wk</span>
                                                    </div>
                                                    <div className="flex items-center gap-2 p-2 rounded-xl bg-gray-50 text-gray-700">
                                                        <ShieldCheck className="h-3 w-3 text-[#ff1f71]" />
                                                        <span>{sub.businessesManageable} Businesses</span>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="space-y-2">
                                                <h4 className="text-[10px] font-bold uppercase text-gray-400 tracking-widest">Top Features</h4>
                                                <div className="flex flex-wrap gap-1.5">
                                                    {sub.features?.slice(0, 3).map((f, i) => (
                                                        <span key={i} className="px-2 py-1 rounded-md bg-pink-50 text-[#ff1f71] text-[10px] font-medium">
                                                            {f}
                                                        </span>
                                                    ))}
                                                    {(sub.features?.length || 0) > 3 && (
                                                        <span className="px-2 py-1 rounded-md bg-gray-50 text-gray-400 text-[10px] font-medium">
                                                            +{(sub.features?.length || 0) - 3} more
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    )}

                    {/* Subscriptions Tab */}
                    {activeTab === "subscriptions" && (
                        <div className="overflow-hidden rounded-3xl border border-gray-100 bg-white shadow-lg">
                            <div className="overflow-x-auto">
                                <table className="w-full text-left">
                                    <thead>
                                        <tr className="bg-gray-50 border-b border-gray-100">
                                            <th className="px-6 py-4 text-xs font-bold uppercase tracking-widest text-gray-500">User</th>
                                            <th className="px-6 py-4 text-xs font-bold uppercase tracking-widest text-gray-500">Plan</th>
                                            <th className="px-6 py-4 text-xs font-bold uppercase tracking-widest text-gray-500">Status</th>
                                            <th className="px-6 py-4 text-xs font-bold uppercase tracking-widest text-gray-500">Period</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-50">
                                        {userSubscriptions.length === 0 ? (
                                            <tr>
                                                <td colSpan={5} className="px-6 py-10 text-center text-gray-500">No active user subscriptions found.</td>
                                            </tr>
                                        ) : (
                                            userSubscriptions.map((sub) => (
                                                <tr key={sub._id} className="hover:bg-gray-50/50 transition-colors">
                                                    <td className="px-6 py-4">
                                                        <div className="flex items-center gap-3">
                                                            {sub.userId.profile && (
                                                                <img src={sub.userId.profile} alt="" className="h-8 w-8 rounded-full object-cover border border-gray-100" />
                                                            )}
                                                            <div>
                                                                <div className="font-bold text-gray-900">{sub.userId.name}</div>
                                                                <div className="text-xs text-gray-500">{sub.userId.email}</div>
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4 font-medium text-[#ff1f71]">{sub.planId.name}</td>
                                                    <td className="px-6 py-4">
                                                        <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase ${
                                                            sub.status === 'active' || sub.status === 'trialing' 
                                                            ? 'bg-green-100 text-green-600' 
                                                            : 'bg-red-100 text-red-600'
                                                        }`}>
                                                            {sub.status}
                                                        </span>
                                                    </td>
                                                    <td className="px-6 py-4 text-xs text-gray-600">
                                                        <div>Start: {new Date(sub.currentPeriodStart).toLocaleDateString()}</div>
                                                        <div>End: {new Date(sub.currentPeriodEnd).toLocaleDateString()}</div>
                                                    </td>
                                                </tr>
                                            ))
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}
                </div>
            )}

            {/* Modal Overlay for Create/Edit */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
                    <div className="w-full max-w-3xl rounded-[2.5rem] bg-white p-10 shadow-2xl relative max-h-[90vh] overflow-y-auto border border-white/20">
                        {/* Close Button */}
                        <button
                            onClick={handleCloseModal}
                            disabled={isSubmitting}
                            className="absolute right-8 top-8 rounded-full bg-gray-100 p-2 text-gray-500 hover:bg-gray-200 disabled:opacity-50 transition-colors"
                        >
                            <X className="h-6 w-6" />
                        </button>

                        <div className="mb-10">
                            <h2 className="text-3xl font-black text-gray-900">{isEditMode ? 'Edit Plan' : 'Create New Plan'}</h2>
                            <p className="mt-2 text-gray-500">Define the value, usage limits, and features of this plan.</p>
                        </div>

                        <div className="space-y-8">
                            {/* Basics */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-xs font-bold uppercase text-gray-400 tracking-widest">Plan Name</label>
                                    <input
                                        type="text"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleInputChange}
                                        className="w-full rounded-2xl bg-gray-50 border-none px-5 py-4 text-gray-900 outline-none focus:ring-2 focus:ring-[#ff1f71]/20 focus:bg-white transition-all"
                                        placeholder="e.g., Enterprise Core"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-bold uppercase text-gray-400 tracking-widest">Tier Category</label>
                                    <select
                                        name="tier"
                                        value={formData.tier}
                                        onChange={handleInputChange}
                                        className="w-full rounded-2xl bg-gray-50 border-none px-5 py-4 text-gray-900 outline-none focus:ring-2 focus:ring-[#ff1f71]/20 focus:bg-white transition-all appearance-none"
                                    >
                                        <option value="free">Free Tier</option>
                                        <option value="basic">Basic / Standard</option>
                                        <option value="premium">Premium / Pro</option>
                                    </select>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-xs font-bold uppercase text-gray-400 tracking-widest">Public Description</label>
                                <textarea
                                    name="description"
                                    value={formData.description}
                                    onChange={handleInputChange}
                                    rows={3}
                                    className="w-full rounded-2xl bg-gray-50 border-none px-5 py-4 text-gray-900 outline-none focus:ring-2 focus:ring-[#ff1f71]/20 focus:bg-white transition-all resize-none"
                                    placeholder="Write a compelling description for potential customers..."
                                />
                            </div>

                            {/* Pricing & Billing */}
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                <div className="space-y-2">
                                    <label className="text-xs font-bold uppercase text-gray-400 tracking-widest">Price</label>
                                    <div className="relative">
                                        <span className="absolute left-5 top-1/2 -translate-y-1/2 font-bold text-gray-400">$</span>
                                        <input
                                            type="number"
                                            name="price"
                                            value={formData.price}
                                            onChange={handleInputChange}
                                            className="w-full rounded-2xl bg-gray-50 border-none pl-10 pr-5 py-4 text-gray-900 outline-none focus:ring-2 focus:ring-[#ff1f71]/20 focus:bg-white transition-all"
                                            placeholder="99.99"
                                        />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-bold uppercase text-gray-400 tracking-widest">Interval</label>
                                    <select
                                        name="interval"
                                        value={formData.interval}
                                        onChange={handleInputChange}
                                        className="w-full rounded-2xl bg-gray-50 border-none px-5 py-4 text-gray-900 outline-none focus:ring-2 focus:ring-[#ff1f71]/20 focus:bg-white transition-all appearance-none"
                                    >
                                        <option value="month">Monthly</option>
                                        <option value="year">Yearly</option>
                                    </select>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-bold uppercase text-gray-400 tracking-widest">Interval Count</label>
                                    <select
                                        name="intervalCount"
                                        value={formData.intervalCount}
                                        onChange={handleInputChange}
                                        className="w-full rounded-2xl bg-gray-50 border-none px-5 py-4 text-gray-900 outline-none focus:ring-2 focus:ring-[#ff1f71]/20 focus:bg-white transition-all appearance-none"
                                    >
                                        {[1, 2, 3].map(num => (
                                            <option key={num} value={num}>{num}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            {/* Limits Section */}
                            <div className="pt-6 border-t border-gray-100">
                                <h3 className="text-sm font-black text-gray-900 mb-6 uppercase tracking-widest">Usage Limits (Weekly)</h3>
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                    {[
                                        { label: 'Reels', name: 'reelsPerWeek' },
                                        { label: 'Posts', name: 'postsPerWeek' },
                                        { label: 'Stories', name: 'storiesPerWeek' },
                                        { label: 'Carousel', name: 'carouselPerWeek' },
                                        { label: 'Businesses', name: 'businessesManageable' },
                                        { label: 'Trial Days', name: 'trialPeriodDays' },
                                    ].map((field) => (
                                        <div key={field.name} className="space-y-2">
                                            <label className="text-[10px] font-bold uppercase text-gray-400">{field.label}</label>
                                            <input
                                                type="number"
                                                name={field.name}
                                                value={(formData as any)[field.name]}
                                                onChange={handleInputChange}
                                                className="w-full rounded-xl bg-gray-50 border-none px-4 py-3 text-sm text-gray-900 outline-none focus:ring-2 focus:ring-[#ff1f71]/20 focus:bg-white transition-all"
                                            />
                                        </div>
                                    ))}
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-bold uppercase text-gray-400">Priority (Sort)</label>
                                        <input
                                            type="number"
                                            name="priority"
                                            value={formData.priority}
                                            onChange={handleInputChange}
                                            className="w-full rounded-xl bg-gray-50 border-none px-4 py-3 text-sm text-gray-900 outline-none focus:ring-2 focus:ring-[#ff1f71]/20 focus:bg-white transition-all"
                                        />
                                    </div>
                                    <div className="space-y-2 flex flex-col justify-end">
                                        <label className="flex items-center gap-2 cursor-pointer p-3 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors">
                                            <input
                                                type="checkbox"
                                                name="isActive"
                                                checked={formData.isActive}
                                                onChange={handleInputChange}
                                                className="w-4 h-4 accent-[#ff1f71]"
                                            />
                                            <span className="text-xs font-bold text-gray-700">Display (Active)</span>
                                        </label>
                                    </div>
                                </div>
                            </div>

                            {/* Features List */}
                            <div className="space-y-4 pt-6 border-t border-gray-100">
                                <label className="text-sm font-black text-gray-900 uppercase tracking-widest">Feature Bundle</label>
                                <div className="flex gap-4">
                                    <input
                                        type="text"
                                        className="flex-1 rounded-2xl bg-gray-50 border-none px-5 py-4 text-gray-900 outline-none focus:ring-2 focus:ring-[#ff1f71]/20 focus:bg-white transition-all"
                                        placeholder="Add a premium feature..."
                                        value={featureInput}
                                        onChange={(e) => setFeatureInput(e.target.value)}
                                        onKeyDown={(e) => e.key === 'Enter' && handleAddFeature()}
                                    />
                                    <button
                                        type="button"
                                        onClick={handleAddFeature}
                                        className="px-8 rounded-2xl bg-black text-white text-sm font-bold shadow-lg hover:bg-gray-800 transition-all active:scale-95"
                                    >
                                        Add
                                    </button>
                                </div>

                                <div className="flex flex-wrap gap-2">
                                    {formData.features?.map((feature, index) => (
                                        <div key={index} className="flex items-center gap-2 rounded-xl bg-[#ff1f71]/5 px-4 py-2 border border-[#ff1f71]/10 text-sm font-medium text-[#ff1f71]">
                                            {feature}
                                            <button onClick={() => handleRemoveFeature(index)} className="p-0.5 rounded-full hover:bg-[#ff1f71] hover:text-white transition-all">
                                                <X className="h-3.5 w-3.5" />
                                            </button>
                                        </div>
                                    ))}
                                    {(formData.features?.length || 0) === 0 && (
                                        <p className="text-xs text-gray-400 italic">No features added yet. Use the input above to add features like 'Priority Support'.</p>
                                    )}
                                </div>
                            </div>

                            {/* Action Buttons */}
                            <div className="mt-12 flex gap-4">
                                <button
                                    type="button"
                                    disabled={isSubmitting}
                                    onClick={() => setFormData(DEFAULT_PLAN)}
                                    className="px-10 py-5 rounded-2xl bg-gray-100 text-gray-500 font-bold hover:bg-gray-200 transition-all disabled:opacity-50"
                                >
                                    Reset
                                </button>
                                <button
                                    type="button"
                                    disabled={isSubmitting}
                                    onClick={handleSave}
                                    className="flex-1 flex items-center justify-center gap-2 rounded-2xl bg-[#ff1f71] py-5 text-lg font-black text-white shadow-xl shadow-pink-200 hover:bg-pink-600 transition-all disabled:opacity-50 active:scale-95"
                                >
                                    {isSubmitting ? <Loader2 className="h-6 w-6 animate-spin" /> : (isEditMode ? 'Update Plan' : 'Push Live')}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
