"use client";

import { 
  Search, 
  Filter, 
  PlayCircle, 
  Eye, 
  TrendingUp, 
  Edit3, 
  MoreVertical, 
  Plus
} from "lucide-react";
import { useState } from "react";
import TemplateEditor from "./components/TemplateEditor";

// Types (Ideally matched with component types)
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

// Mock Data
const INITIAL_TEMPLATES: Template[] = [
  {
    id: 1,
    title: "Product Unboxing Template",
    category: "Product",
    description: "Professional product showcase and unboxing guide",
    status: "Published",
    steps: Array(5).fill({}), 
    views: 2891,
    usage: 789,
    date: "2024-01-10",
  },
  {
    id: 2,
    title: "Restaurant Welcome Experience",
    category: "Restaurant",
    description: "Step by step guide for capturing engaging restaurant footage",
    status: "Published",
    steps: Array(3).fill({}),
    views: 1234,
    usage: 456,
    date: "2024-01-15",
  },
  {
    id: 3,
    title: "Restaurant Welcome Experience",
    category: "Restaurant",
    description: "Step by step guide for capturing engaging restaurant footage",
    status: "Draft",
    steps: Array(3).fill({}),
    views: 1234,
    usage: 456,
    date: "2024-01-15",
  }
];

const CATEGORIES = ["All Categories", "Lifestyle", "Restaurant", "Tutorial", "Product"];

export default function ManagementPage() {
  const [view, setView] = useState<"dashboard" | "editor">("dashboard");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All Categories");
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const [currentTemplate, setCurrentTemplate] = useState<Partial<Template>>({});

  // Filter Logic
  const filteredTemplates = INITIAL_TEMPLATES.filter(template => {
    const matchesSearch = template.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === "All Categories" || template.category.toLowerCase() === selectedCategory.toLowerCase();
    return matchesSearch && matchesCategory;
  });

  const handleCreateTemplate = () => {
    setCurrentTemplate({ steps: [] });
    setView("editor");
  };

  const handleEditTemplate = (template: Template) => {
    setCurrentTemplate(template);
    setView("editor");
  };

  const handleSaveTemplate = (template: Partial<Template>) => {
      // Mock save logic
      console.log("Saving template:", template);
      setView("dashboard");
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
                                className={`w-full rounded-lg px-3 py-2 text-left text-sm ${
                                    selectedCategory === category ? 'bg-pink-50 text-[#ff1f71]' : 'text-gray-600 hover:bg-gray-50'
                                }`}
                            >
                                {category}
                            </button>
                        ))}
                    </div>
                 )}
            </div>
       </div>

       {/* Stats Cards */}
       <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            <div className="flex items-center justify-between rounded-2xl bg-white p-6 shadow-sm">
                <div>
                     <p className="text-sm font-medium text-gray-500">Total Templates</p>
                     <h3 className="mt-1 text-2xl font-bold text-gray-900">24</h3>
                </div>
                <PlayCircle className="h-6 w-6 text-blue-500" />
            </div>
             <div className="flex items-center justify-between rounded-2xl bg-white p-6 shadow-sm">
                <div>
                     <p className="text-sm font-medium text-gray-500">Published</p>
                     <h3 className="mt-1 text-2xl font-bold text-gray-900">18</h3>
                </div>
                <Eye className="h-6 w-6 text-gray-900" />
            </div>
            <div className="flex items-center justify-between rounded-2xl bg-white p-6 shadow-sm">
                <div>
                     <p className="text-sm font-medium text-gray-500">Total Views</p>
                     <h3 className="mt-1 text-2xl font-bold text-gray-900">12.4K</h3>
                </div>
                <TrendingUp className="h-6 w-6 text-gray-900" />
            </div>
             <div className="flex items-center justify-between rounded-2xl bg-white p-6 shadow-sm">
                <div>
                     <p className="text-sm font-medium text-gray-500">Draft</p>
                     <h3 className="mt-1 text-2xl font-bold text-gray-900">6</h3>
                </div>
                 <Edit3 className="h-6 w-6 text-gray-900" />
            </div>
       </div>

       {/* Template Grid */}
       <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredTemplates.map(template => (
                <div key={template.id} className="group overflow-hidden rounded-3xl bg-white p-4 shadow-sm transition-shadow hover:shadow-md">
                    {/* Thumbnail Area */}
                     <div className="relative mb-4 flex aspect-video w-full items-center justify-center rounded-2xl bg-gray-100">
                        {/* Status Badge */}
                        <div className={`absolute left-3 top-3 rounded-full px-3 py-1 text-xs font-bold text-white ${
                            template.status === 'Published' ? 'bg-green-500' : 'bg-orange-500'
                        }`}>
                            {template.status}
                        </div>
                        
                        {/* Steps Badge */}
                        <div className="absolute right-3 top-3 rounded-full bg-white/80 px-3 py-1 text-xs font-bold text-gray-700 backdrop-blur-sm">
                            {template.steps.length} steps
                        </div>

                        {/* Play Icon Placeholder */}
                         <PlayCircle className="h-12 w-12 text-gray-300" />
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

                         {/* Tag */}
                         <div>
                             <span className="rounded-lg bg-blue-50 px-3 py-1 text-xs font-bold text-blue-500">
                                {template.category}
                             </span>
                         </div>

                         {/* Footer Stats */}
                         <div className="flex items-center justify-between border-t border-gray-100 pt-4 text-xs text-gray-500">
                            <div className="flex gap-4">
                                <span className="flex items-center gap-1">
                                    <Eye className="h-3 w-3" /> {template.views}
                                </span>
                                 <span className="flex items-center gap-1">
                                    <PlayCircle className="h-3 w-3" /> {template.usage}
                                </span>
                            </div>
                            <span>{template.date}</span>
                         </div>
                        
                         {/* Edit Button - Always Visible now */}
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
    </div>
  );
}
