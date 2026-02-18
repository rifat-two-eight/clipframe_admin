"use client";

import {
    Search,
    Filter,
    PlayCircle,
    Eye,
    TrendingUp,
    Edit3,
    MoreVertical,
    Plus,
    Loader2
} from "lucide-react";
import { useEffect, useState } from "react";
import TemplateEditor from "./components/TemplateEditor";
import api from "@/lib/axios";
import { Template } from "./types";

const CATEGORIES = ["All Categories", "Lifestyle", "Restaurant", "Tutorial", "Product"];

export default function ManagementPage() {
    const [view, setView] = useState<"dashboard" | "editor">("dashboard");
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("All Categories");
    const [isFilterOpen, setIsFilterOpen] = useState(false);
    const [currentTemplate, setCurrentTemplate] = useState<Partial<Template>>({});

    // Live data state
    const [templates, setTemplates] = useState<Template[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [fetchError, setFetchError] = useState<string | null>(null);

    const fetchTemplates = async () => {
        setIsLoading(true);
        setFetchError(null);
        try {
            const res = await api.get("/contentTemplate");
            console.log("GET /contentTemplate response:", res.data);
            // Handle common response shapes from the backend
            const raw = res.data;
            const data =
                Array.isArray(raw) ? raw :
                    Array.isArray(raw?.data?.data) ? raw.data.data : // Adjusted for nested data.data pattern seen in API response
                        Array.isArray(raw?.data) ? raw.data :
                            [];
            setTemplates(data);
        } catch (err: unknown) {
            const axiosErr = err as { response?: { data?: { message?: string } }; message?: string };
            const msg = axiosErr?.response?.data?.message || axiosErr?.message || "Failed to load templates.";
            console.error("GET /contentTemplate error:", axiosErr?.response?.data);
            setFetchError(msg);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchTemplates();
    }, []);

    // Derived stats from real data
    const totalTemplates = templates.length;
    const publishedCount = templates.filter(t => t.isActive).length;
    const draftCount = templates.filter(t => !t.isActive).length;
    // API doesn't seem to return views, so we'll default to 0 or use usage as proxy if needed.
    // Using simple sum for now assuming future API update or just 0.
    const totalUsage = templates.reduce((sum, t) => sum + (t.stats?.reuseCount || 0), 0);

    const formatCount = (n: number) => n >= 1000 ? `${(n / 1000).toFixed(1)}K` : String(n);

    // Filter Logic
    const filteredTemplates = templates.filter(template => {
        const matchesSearch = template.title?.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesCategory = selectedCategory === "All Categories" || template.category?.toLowerCase() === selectedCategory.toLowerCase();
        return matchesSearch && matchesCategory;
    });

    const handleCreateTemplate = () => {
        setCurrentTemplate({ steps: [], isActive: false }); // Default to draft
        setView("editor");
    };

    const handleEditTemplate = (template: Template) => {
        setCurrentTemplate(template);
        setView("editor");
    };

    const handleSaveTemplate = () => {
        // Refresh list from API after a successful save
        setView("dashboard");
        fetchTemplates();
    };

    if (view === "editor") {
        return (
            <TemplateEditor
                template={currentTemplate}
                onBack={() => setView("dashboard")}
                onSave={handleSaveTemplate}
            />
        );
    }

    // DASHBOARD VIEW
    return (
        <div className="space-y-8">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-[#ff1f71]">Content Dashboard</h1>
                    <p className="mt-1 text-sm text-gray-700">
                        Manage your step-by-step content creation guides
                    </p>
                </div>
                <button
                    onClick={handleCreateTemplate}
                    className="flex items-center gap-2 rounded-xl bg-[#ff1f71] px-6 py-3 text-sm font-bold text-white shadow-lg shadow-[#ff1f71]/30 transition-colors hover:bg-pink-600"
                >
                    <Plus className="h-4 w-4" />
                    Create Template
                </button>
            </div>

            {/* Search & Filter */}
            <div className="flex gap-4">
                <div className="relative flex-1">
                    <input
                        type="text"
                        placeholder="Search templates..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full rounded-xl border border-gray-200 bg-white/50 px-4 py-3 pl-10 text-sm text-gray-700 outline-none backdrop-blur-sm focus:border-pink-300 focus:ring-2 focus:ring-pink-100"
                    />
                    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                </div>

                <div className="relative">
                    <button
                        onClick={() => setIsFilterOpen(!isFilterOpen)}
                        className="flex h-full items-center gap-2 rounded-xl border border-gray-200 bg-white/50 px-4 text-gray-600 backdrop-blur-sm hover:bg-white"
                    >
                        <Filter className="h-4 w-4" />
                        {selectedCategory === "All Categories" ? "" : selectedCategory}
                        <span className={`transition-transform ${isFilterOpen ? 'rotate-180' : ''}`}>▼</span>
                    </button>

                    {isFilterOpen && (
                        <div className="absolute right-0 top-full mt-2 w-48 rounded-xl border border-gray-100 bg-white p-2 shadow-xl z-20">
                            {CATEGORIES.map(category => (
                                <button
                                    key={category}
                                    onClick={() => {
                                        setSelectedCategory(category);
                                        setIsFilterOpen(false);
                                    }}
                                    className={`w-full rounded-lg px-3 py-2 text-left text-sm ${selectedCategory === category ? 'bg-pink-50 text-[#ff1f71]' : 'text-gray-600 hover:bg-gray-50'
                                        }`}
                                >
                                    {category}
                                </button>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {/* Stats Cards — derived from real data */}
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
                <div className="flex items-center justify-between rounded-2xl bg-white p-6 shadow-sm">
                    <div>
                        <p className="text-sm font-medium text-gray-500">Total Templates</p>
                        <h3 className="mt-1 text-2xl font-bold text-gray-900">{isLoading ? "—" : totalTemplates}</h3>
                    </div>
                    <PlayCircle className="h-6 w-6 text-blue-500" />
                </div>
                <div className="flex items-center justify-between rounded-2xl bg-white p-6 shadow-sm">
                    <div>
                        <p className="text-sm font-medium text-gray-500">Published</p>
                        <h3 className="mt-1 text-2xl font-bold text-gray-900">{isLoading ? "—" : publishedCount}</h3>
                    </div>
                    <Eye className="h-6 w-6 text-green-500" />
                </div>
                <div className="flex items-center justify-between rounded-2xl bg-white p-6 shadow-sm">
                    <div>
                        <p className="text-sm font-medium text-gray-500">Total Usage</p>
                        <h3 className="mt-1 text-2xl font-bold text-gray-900">{isLoading ? "—" : formatCount(totalUsage)}</h3>
                    </div>
                    <TrendingUp className="h-6 w-6 text-purple-500" />
                </div>
                <div className="flex items-center justify-between rounded-2xl bg-white p-6 shadow-sm">
                    <div>
                        <p className="text-sm font-medium text-gray-500">Draft</p>
                        <h3 className="mt-1 text-2xl font-bold text-gray-900">{isLoading ? "—" : draftCount}</h3>
                    </div>
                    <Edit3 className="h-6 w-6 text-orange-500" />
                </div>
            </div>

            {/* Loading State */}
            {isLoading && (
                <div className="flex items-center justify-center py-20">
                    <Loader2 className="h-8 w-8 animate-spin text-[#ff1f71]" />
                </div>
            )}

            {/* Error State */}
            {!isLoading && fetchError && (
                <div className="flex flex-col items-center justify-center rounded-2xl border border-red-100 bg-red-50 py-16 text-center">
                    <p className="text-sm font-medium text-red-500">{fetchError}</p>
                    <button
                        onClick={fetchTemplates}
                        className="mt-4 rounded-xl bg-[#ff1f71] px-6 py-2.5 text-sm font-bold text-white hover:bg-pink-600"
                    >
                        Retry
                    </button>
                </div>
            )}

            {/* Empty State */}
            {!isLoading && !fetchError && filteredTemplates.length === 0 && (
                <div className="flex flex-col items-center justify-center rounded-2xl border border-gray-100 py-20 text-center">
                    <div className="mb-3 rounded-full bg-gray-100 p-4">
                        <PlayCircle className="h-8 w-8 text-gray-400" />
                    </div>
                    <p className="text-sm font-medium text-gray-500">No templates found</p>
                    <button
                        onClick={handleCreateTemplate}
                        className="mt-4 rounded-xl bg-[#ff1f71] px-6 py-3 text-sm font-bold text-white hover:bg-pink-600"
                    >
                        Create your first template
                    </button>
                </div>
            )}

            {/* Template Grid */}
            {!isLoading && !fetchError && filteredTemplates.length > 0 && (
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {filteredTemplates.map(template => (
                        <div key={template._id} className="group overflow-hidden rounded-3xl bg-white p-4 shadow-sm transition-shadow hover:shadow-md">
                            {/* Thumbnail Area */}
                            <div className="relative mb-4 flex aspect-video w-full items-center justify-center rounded-2xl bg-gray-100 overflow-hidden">
                                {template.thumbnail ? (
                                    <img
                                        src={template.thumbnail}
                                        alt={template.title}
                                        className="h-full w-full object-cover"
                                    />
                                ) : (
                                    <PlayCircle className="h-12 w-12 text-gray-300" />
                                )}

                                {/* Status Badge */}
                                <div className={`absolute left-3 top-3 rounded-full px-3 py-1 text-xs font-bold text-white ${template.isActive ? 'bg-green-500' : 'bg-orange-500'
                                    }`}>
                                    {template.isActive ? 'Published' : 'Draft'}
                                </div>

                                {/* Steps Badge */}
                                <div className="absolute right-3 top-3 rounded-full bg-white/80 px-3 py-1 text-xs font-bold text-gray-700 backdrop-blur-sm">
                                    {template.steps?.length ?? 0} steps
                                </div>
                            </div>

                            {/* Content */}
                            <div className="space-y-3">
                                <div className="flex items-start justify-between">
                                    <h3 className="text-base font-bold text-gray-900">{template.title}</h3>
                                    <button className="text-gray-400 hover:text-gray-600">
                                        <MoreVertical className="h-5 w-5" />
                                    </button>
                                </div>

                                <p className="text-sm text-gray-500 line-clamp-2">
                                    {template.description}
                                </p>

                                {/* Tags */}
                                <div className="flex items-center gap-2 flex-wrap">
                                    <span className="rounded-lg bg-blue-50 px-3 py-1 text-xs font-bold text-blue-500">
                                        {template.category}
                                    </span>
                                    {template.type && (
                                        <span className="rounded-lg bg-purple-50 px-3 py-1 text-xs font-bold text-purple-500">
                                            {template.type}
                                        </span>
                                    )}
                                </div>

                                {/* Footer Stats */}
                                <div className="flex items-center justify-between border-t border-gray-100 pt-4 text-xs text-gray-500">
                                    <div className="flex gap-4">
                                        <span className="flex items-center gap-1">
                                            <PlayCircle className="h-3 w-3" /> {template.stats?.reuseCount ?? 0}
                                        </span>
                                        <span className="flex items-center gap-1">
                                            <Eye className="h-3 w-3" /> {template.stats?.loveCount ?? 0}
                                        </span>
                                    </div>
                                    <span>{new Date(template.createdAt || Date.now()).toLocaleDateString()}</span>
                                </div>

                                <button
                                    onClick={() => handleEditTemplate(template)}
                                    className="w-full rounded-xl bg-[#ff1f71] py-2.5 text-sm font-bold text-white transition-opacity hover:bg-pink-600"
                                >
                                    Edit Template
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
