"use client";

import { ChevronLeft, PlayCircle, Eye, TrendingUp, Calendar, Tag, Layers, Share2, Heart, ExternalLink } from "lucide-react";
import { Template } from "../types";

type TemplateDetailsProps = {
    template: Partial<Template>;
    onBack: () => void;
};

export default function TemplateDetails({ template, onBack }: TemplateDetailsProps) {
    return (
        <div className="space-y-8 pb-20 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Header / Navigation */}
            <div className="flex items-center justify-between">
                <button
                    onClick={onBack}
                    className="flex items-center gap-2 text-gray-600 hover:text-[#ff1f71] transition-colors group"
                >
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white shadow-sm group-hover:bg-pink-50">
                        <ChevronLeft className="h-5 w-5" />
                    </div>
                    <span className="font-bold">Back</span>
                </button>
                <div className="flex gap-3">
                    <button className="flex items-center gap-2 rounded-xl bg-white px-5 py-2.5 text-sm font-bold text-gray-700 shadow-sm hover:bg-gray-50 border border-gray-100 transition-all">
                        <Share2 className="h-4 w-4" />
                        Share
                    </button>
                    <button className="flex items-center gap-2 rounded-xl bg-[#ff1f71] px-6 py-2.5 text-sm font-bold text-white shadow-lg shadow-[#ff1f71]/20 hover:bg-pink-600 transition-all active:scale-95">
                        <ExternalLink className="h-4 w-4" />
                        Live Link
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
                {/* Left Column: Media & Overview */}
                <div className="lg:col-span-1 space-y-6">
                    <div className="relative overflow-hidden rounded-[2.5rem] bg-gray-200 shadow-2xl shadow-pink-100 group">
                        {template.thumbnail ? (
                            <img
                                src={template.thumbnail}
                                alt={template.title}
                                className="aspect-9/16 w-full object-cover transition-transform duration-700 group-hover:scale-105"
                            />
                        ) : (
                            <div className="flex aspect-9/16 w-full flex-col items-center justify-center bg-linear-to-br from-gray-100 to-gray-200 text-gray-400">
                                <PlayCircle className="h-16 w-16 opacity-20" />
                                <p className="mt-4 font-medium opacity-50">No preview available</p>
                            </div>
                        )}
                        <div className="absolute inset-0 bg-linear-to-t from-black/60 via-transparent to-transparent"></div>
                        <div className="absolute bottom-8 left-8 right-8">
                            <span className="rounded-full bg-white/20 px-4 py-1.5 text-xs font-bold text-white backdrop-blur-md">
                                {template.category || "Uncategorized"}
                            </span>
                        </div>
                    </div>

                    <div className="rounded-3xl bg-white p-6 shadow-sm border border-gray-50 flex justify-between items-center">
                        <div className="flex flex-col items-center gap-1 flex-1 border-r border-gray-100">
                            <Heart className="h-5 w-5 text-pink-500 fill-pink-500" />
                            <span className="text-sm font-bold text-gray-900">{template.stats?.loveCount || 0}</span>
                            <span className="text-[10px] text-gray-400 font-medium uppercase tracking-wider">Loves</span>
                        </div>
                        <div className="flex flex-col items-center gap-1 flex-1 border-r border-gray-100">
                            <PlayCircle className="h-5 w-5 text-blue-500" />
                            <span className="text-sm font-bold text-gray-900">{template.stats?.reuseCount || 0}</span>
                            <span className="text-[10px] text-gray-400 font-medium uppercase tracking-wider">Usage</span>
                        </div>
                        <div className="flex flex-col items-center gap-1 flex-1">
                            <Eye className="h-5 w-5 text-green-500" />
                            <span className="text-sm font-bold text-gray-900">0</span>
                            <span className="text-[10px] text-gray-400 font-medium uppercase tracking-wider">Views</span>
                        </div>
                    </div>
                </div>

                {/* Right Column: Details & Steps */}
                <div className="lg:col-span-2 space-y-8">
                    <div className="rounded-[2.5rem] bg-white p-8 shadow-sm border border-gray-50">
                        <div className="flex items-start justify-between mb-4">
                            <h1 className="text-3xl font-black text-gray-900 leading-tight">
                                {template.title || "Untitled Template"}
                            </h1>
                            <div className={`rounded-full px-4 py-1.5 text-xs font-black uppercase tracking-widest text-white ${template.isActive ? 'bg-green-500' : 'bg-orange-500'}`}>
                                {template.isActive ? 'Published' : 'Draft'}
                            </div>
                        </div>

                        <p className="text-gray-600 leading-relaxed text-lg mb-8">
                            {template.description || "No description provided for this template yet."}
                        </p>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="flex items-center gap-4 rounded-2xl bg-gray-50/50 p-4 border border-gray-100">
                                <div className="h-10 w-10 rounded-xl bg-blue-50 flex items-center justify-center">
                                    <Tag className="h-5 w-5 text-blue-500" />
                                </div>
                                <div>
                                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Type</p>
                                    <p className="text-sm font-bold text-gray-900 capitalize">{template.type || "Post"}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-4 rounded-2xl bg-gray-50/50 p-4 border border-gray-100">
                                <div className="h-10 w-10 rounded-xl bg-purple-50 flex items-center justify-center">
                                    <Calendar className="h-5 w-5 text-purple-500" />
                                </div>
                                <div>
                                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Created At</p>
                                    <p className="text-sm font-bold text-gray-900">
                                        {template.createdAt ? new Date(template.createdAt).toLocaleDateString() : 'Just now'}
                                    </p>
                                </div>
                            </div>
                        </div>

                        {template.hashtags && template.hashtags.length > 0 && (
                            <div className="mt-8">
                                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-3">Hashtags</p>
                                <div className="flex flex-wrap gap-2">
                                    {template.hashtags.map(tag => (
                                        <span key={tag} className="rounded-xl bg-pink-50 px-4 py-2 text-xs font-bold text-[#ff1f71] border border-pink-100">
                                            #{tag}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Steps Section */}
                    <div>
                        <div className="flex items-center gap-3 mb-6 px-4">
                            <div className="h-10 w-10 rounded-2xl bg-[#ff1f71] flex items-center justify-center shadow-lg shadow-pink-100">
                                <Layers className="h-5 w-5 text-white" />
                            </div>
                            <h2 className="text-xl font-black text-gray-900 uppercase tracking-tight">Sequence Steps</h2>
                            <span className="ml-auto rounded-full bg-gray-100 px-4 py-1 text-xs font-bold text-gray-500">
                                {template.steps?.length || 0} Total
                            </span>
                        </div>

                        <div className="space-y-4">
                            {(template.steps || []).map((step, idx) => (
                                <div key={step._id || idx} className="group relative rounded-4xl bg-white p-6 shadow-sm border border-gray-50 hover:shadow-xl hover:shadow-pink-50 hover:border-pink-100 transition-all duration-500">
                                    <div className="flex items-start gap-6">
                                        <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-linear-to-br from-[#ff1f71] to-pink-400 text-xl font-black text-white shadow-lg shadow-pink-200">
                                            {idx + 1}
                                        </div>
                                        <div className="flex-1 space-y-3">
                                            <div className="flex items-center justify-between">
                                                <h3 className="text-xl font-black text-gray-900">{step.title}</h3>
                                                <span className="rounded-full bg-blue-50 px-3 py-1 text-[10px] font-black uppercase tracking-widest text-blue-600">
                                                    {step.duration}s • {step.shotType}
                                                </span>
                                            </div>
                                            <p className="text-gray-600 leading-relaxed font-medium bg-gray-50/50 p-4 rounded-2xl border border-gray-50">
                                                {step.mainTip}
                                            </p>

                                            {step.detailedTips && (
                                                <div className="pt-2">
                                                    <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-2 flex items-center gap-2">
                                                        <TrendingUp className="h-3 w-3" /> Pro Insights
                                                    </p>
                                                    <p className="text-sm text-gray-500 italic border-l-2 border-pink-200 pl-4 py-1">
                                                        {step.detailedTips}
                                                    </p>
                                                </div>
                                            )}
                                        </div>

                                        {/* Step Media Preview */}
                                        {(step.url || step.videoFile) && (
                                            <div className="hidden sm:block w-32 aspect-9/16 rounded-2xl bg-gray-100 overflow-hidden relative group-hover:shadow-lg transition-all duration-500">
                                                {step.url ? (
                                                    <video src={step.url} className="h-full w-full object-cover" />
                                                ) : step.videoFile ? (
                                                    <div className="flex h-full w-full items-center justify-center bg-green-50">
                                                        <PlayCircle className="h-8 w-8 text-green-500 opacity-50" />
                                                    </div>
                                                ) : null}
                                                <div className="absolute inset-0 flex items-center justify-center bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity">
                                                    <PlayCircle className="h-10 w-10 text-white" />
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
