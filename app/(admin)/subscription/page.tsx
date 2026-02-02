"use client";

import { Edit, Trash2, Plus, X, ChevronDown } from "lucide-react";
import { useState } from "react";

// Mock Data
type Subscription = {
  id: number;
  name: string;
  price: number;
  duration: string;
  reels: string;
  posts: string;
  stories: string;
  businessManageable?: number | string; // Assuming number based on image "3" or text "Enable Free Access"
  features?: string[]; // For the "Feature" input list
};

const INITIAL_SUBSCRIPTIONS: Subscription[] = [
  {
    id: 1,
    name: "Not sure yet?",
    price: 0,
    duration: "month",
    reels: "1",
    posts: "1",
    stories: "3",
    businessManageable: "Enable Free Access",
  },
  {
    id: 2,
    name: "Starter Plan",
    price: 55,
    duration: "month",
    reels: "2",
    posts: "2",
    stories: "6",
  },
  {
    id: 3,
    name: "Pro Plan",
    price: 99,
    duration: "month",
    reels: "-",
    posts: "-",
    stories: "-",
    businessManageable: 3,
  },
  {
    id: 4,
    name: "Plus Plan",
    price: 350,
    duration: "month",
    reels: "-",
    posts: "-",
    stories: "-",
    businessManageable: 10,
  }
];

export default function SubscriptionPage() {
  const [subscriptions, setSubscriptions] = useState<Subscription[]>(INITIAL_SUBSCRIPTIONS);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [currentSub, setCurrentSub] = useState<Partial<Subscription>>({});

  // Form States (Simplified for demo)
  const [features, setFeatures] = useState<string[]>([]);
  const [featureInput, setFeatureInput] = useState("");

  const openAddModal = () => {
    setIsEditMode(false);
    setCurrentSub({});
    setFeatures([]);
    setIsModalOpen(true);
  };

  const openEditModal = (sub: Subscription) => {
    setIsEditMode(true);
    setCurrentSub(sub);
    setFeatures(sub.features || []);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-[#ff1f71]">Subscriptions</h1>
        <p className="mt-1 text-sm text-gray-700">
          Unlock perks, protection, and peace of mind.
        </p>
      </div>

      {/* Subscription List */}
      <div className="flex flex-col gap-6">
            {subscriptions.map((sub) => (
                <div key={sub.id} className="flex flex-col gap-4 lg:flex-row">
                    {/* Card */}
                    <div 
                        className={`relative flex-1 overflow-hidden rounded-2xl p-6 text-white shadow-lg ${
                            sub.name === "Starter Plan" 
                            ? "bg-gradient-to-r from-pink-500 to-blue-600" 
                            : "bg-gray-600"
                        }`}
                    >
                        
                        
                        <h3 className="text-xl font-bold">{sub.name}</h3>
                        {sub.businessManageable && typeof sub.businessManageable === 'string' && sub.businessManageable.includes("Access") && (
                            <p className="text-sm text-gray-300">{sub.businessManageable}</p>
                        )}

                        <div className="mt-4 flex items-end justify-between">
                            <div>
                                {sub.price > 0 ? (
                                    <p className="text-3xl font-bold">€{sub.price} <span className="text-base font-normal">/ {sub.duration}</span></p>
                                ) : (
                                    <p className="text-sm text-gray-300">Enable Free Access</p> 
                                )}
                            </div>

                            {/* Counts for Reel/Post/Story/Week/Business */}
                            <div className="text-right">
                                {sub.businessManageable && typeof sub.businessManageable === 'number' ? (
                                    <div className="text-center">
                                        <p className="text-2xl font-bold">{sub.businessManageable}</p>
                                        <p className="text-xs text-gray-300">Business manageable</p>
                                    </div>
                                ) : sub.reels !== "-" ? (
                                    <div className="flex gap-4">
                                        <div className="text-center">
                                            <p className="text-xl font-bold">{sub.reels}</p>
                                            <p className="text-xs text-gray-300">reel</p>
                                        </div>
                                        <div className="text-center">
                                            <p className="text-xl font-bold">{sub.posts}</p>
                                            <p className="text-xs text-gray-300">post</p>
                                        </div>
                                        <div className="text-center">
                                            <p className="text-xl font-bold">{sub.stories}</p>
                                            <p className="text-xs text-gray-300">story</p>
                                        </div>
                                        <div className="text-center flex flex-col justify-end">
                                            <p className="text-xs font-bold">/{sub.name === 'Starter Plan' ? 'week' : 'month'}</p>
                                        </div>
                                    </div>
                                ) : null}
                            </div>
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="flex w-full flex-col justify-center gap-3 lg:w-48">
                        <button 
                            onClick={() => openEditModal(sub)}
                            className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#007bff] py-2 text-sm font-bold text-white hover:bg-blue-600"
                        >
                            <Edit className="h-4 w-4" />
                            Edit
                        </button>
                        <button className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#e60000] py-2 text-sm font-bold text-white hover:bg-red-600">
                            <Trash2 className="h-4 w-4" />
                            Delete
                        </button>
                    </div>
                </div>
            ))}

            {/* Add Button */}
             <button 
                onClick={openAddModal}
                className="flex w-full max-w-sm items-center justify-center gap-2 rounded-xl bg-[#ff1f71] py-3 text-sm font-bold text-white shadow-lg transition-colors hover:bg-pink-600"
            >
                <Edit className="h-4 w-4" /> 
                Add
            </button>
      </div>

      {/* Modal Overlay */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
            <div className="w-full max-w-2xl rounded-3xl bg-gradient-to-br from-[#ffeec2] to-[#d6c6ff] p-8 shadow-2xl relative max-h-[90vh] overflow-y-auto">
                 {/* Close Button */}
                 <button 
                    onClick={handleCloseModal}
                    className="absolute right-6 top-6 rounded-full bg-blue-100 p-1 text-blue-500 hover:bg-blue-200"
                 >
                    <X className="h-6 w-6" />
                 </button>

                 <h2 className="text-2xl font-bold text-[#ff1f71]">{isEditMode ? 'Edit' : 'Add'} Subscription</h2>
                 <p className="mt-1 text-sm text-gray-600">Create a new plan - include title ,details ,price () and service items</p>

                 <div className="mt-8 space-y-6">
                    {/* Plan Name */}
                    <div className="space-y-2">
                        <label className="text-sm font-bold text-gray-900">Plan Name</label>
                        <input 
                            type="text" 
                            className="w-full rounded-xl border border-gray-400 bg-white px-4 py-3 text-gray-900 outline-none focus:border-blue-500"
                            placeholder="eg"
                            defaultValue={currentSub.name}
                        />
                    </div>

                    {/* Reel / Post / Story Row */}
                    <div className="grid grid-cols-3 gap-4">
                        <div className="space-y-2">
                            <label className="text-sm font-bold text-gray-900">Reel</label>
                            <input 
                                type="text" 
                                className="w-full rounded-xl border border-gray-400 bg-white px-4 py-3 text-gray-900 outline-none focus:border-blue-500"
                                placeholder="eg"
                                defaultValue={currentSub.reels}
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-bold text-gray-900">Post</label>
                            <input 
                                type="text" 
                                className="w-full rounded-xl border border-gray-400 bg-white px-4 py-3 text-gray-900 outline-none focus:border-blue-500"
                                placeholder="eg"
                                defaultValue={currentSub.posts}
                            />
                        </div>
                         <div className="space-y-2">
                            <label className="text-sm font-bold text-gray-900">Story</label>
                            <input 
                                type="text" 
                                className="w-full rounded-xl border border-gray-400 bg-white px-4 py-3 text-gray-900 outline-none focus:border-blue-500"
                                placeholder="eg"
                                defaultValue={currentSub.stories}
                            />
                        </div>
                    </div>

                    {/* Business Manageable */}
                    <div className="space-y-2">
                        <label className="text-sm font-bold text-gray-900">Business Manageable</label>
                        <input 
                            type="text" 
                            className="w-full rounded-xl border border-gray-400 bg-white px-4 py-3 text-gray-900 outline-none focus:border-blue-500"
                             placeholder="000"
                             defaultValue={typeof currentSub.businessManageable === 'number' ? currentSub.businessManageable : ''}
                        />
                    </div>

                    {/* Prices */}
                    <div className="space-y-2">
                        <label className="text-sm font-bold text-gray-900">Prices</label>
                        <input 
                            type="text" 
                            className="w-full rounded-xl border border-gray-400 bg-white px-4 py-3 text-gray-900 outline-none focus:border-blue-500"
                             placeholder="000"
                             defaultValue={currentSub.price}
                        />
                    </div>

                    {/* Duration */}
                    <div className="space-y-2">
                        <label className="text-sm font-bold text-gray-900">Duration</label>
                        <div className="relative">
                            <select className="w-full appearance-none rounded-xl border border-gray-400 bg-white px-4 py-3 text-gray-900 outline-none focus:border-blue-500">
                                <option>1 Month</option>
                                <option>3 Months</option>
                                <option>1 Year</option>
                            </select>
                            <ChevronDown className="absolute right-4 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-500 pointer-events-none" />
                        </div>
                    </div>

                    {/* Feature */}
                    <div className="flex gap-4 items-end">
                         <div className="flex-1 space-y-2">
                            <label className="text-sm font-bold text-gray-900">Feature</label>
                            <input 
                                type="text" 
                                className="w-full rounded-xl border border-gray-400 bg-white px-4 py-3 text-gray-900 outline-none focus:border-blue-500"
                                placeholder="eg"
                                value={featureInput}
                                onChange={(e) => setFeatureInput(e.target.value)}
                            />
                        </div>
                        <button className="h-[50px] rounded-xl bg-[#ff1f71] px-6 text-sm font-bold text-white shadow-lg hover:bg-pink-600">
                            Add More
                        </button>
                    </div>

                    {/* Footer Buttons */}
                    <div className="mt-8 grid grid-cols-2 gap-4">
                        <button 
                            type="button"
                            onClick={() => { /* Handle Reset */ }}
                            className="w-full rounded-xl bg-[#ff1f71] py-3.5 text-center font-bold text-white shadow-lg hover:bg-pink-600"
                        >
                            Reset
                        </button>
                         <button 
                            type="button"
                             onClick={handleCloseModal} // Just close for now
                            className="w-full rounded-xl bg-[#007bff] py-3.5 text-center font-bold text-white shadow-lg hover:bg-blue-600"
                        >
                            Save
                        </button>
                    </div>
                 </div>
            </div>
        </div>
      )}
    </div>
  );
}
