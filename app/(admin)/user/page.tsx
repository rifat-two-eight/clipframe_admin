"use client";

import { Search, User, Eye, TrendingUp, Edit3, ChevronLeft, ChevronRight } from "lucide-react";
import { useState } from "react";

// Mock Data
const ALL_USERS = Array.from({ length: 7 }).map((_, i) => ({
  id: `#J-10294`, // distinct IDs would be better but following design
  name: "John Carter",
  email: "example@gmail.com",
  phone: "0000 0000 0000"
}));

// Adding some variation for search testing
const USERS_DATA = [
    { id: "#J-10294", name: "John Carter", email: "john@gmail.com", phone: "0000 0000 0000" },
    { id: "#J-10295", name: "Jane Doe", email: "jane@gmail.com", phone: "1111 2222 3333" },
    { id: "#J-10296", name: "Robert Smith", email: "robert@gmail.com", phone: "4444 5555 6666" },
    { id: "#J-10297", name: "Alice Johnson", email: "alice@gmail.com", phone: "7777 8888 9999" },
    { id: "#J-10298", name: "Michael Brown", email: "michael@gmail.com", phone: "1234 5678 9012" },
    { id: "#J-10299", name: "Emily Davis", email: "emily@gmail.com", phone: "9876 5432 1098" },
    { id: "#J-10300", name: "David Wilson", email: "david@gmail.com", phone: "1122 3344 5566" },
];


export default function UserPage() {
  const [searchQuery, setSearchQuery] = useState("");
  
  const filteredUsers = USERS_DATA.filter(user => 
    user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.id.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-[#ff1f71]">User Information</h1>
          <p className="mt-1 text-sm text-[#ff7171]">
             Welcome back, Here's what's happening with your account.
          </p>
        </div>
        {/* "Create Template" button removed as requested */}
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {/* Card 1 */}
        <div className="rounded-2xl bg-white p-6 shadow-sm flex items-center justify-between">
           <div>
              <p className="text-sm font-medium text-gray-500">Total User</p>
              <h3 className="mt-1 text-2xl font-bold text-gray-900">24</h3>
           </div>
           <User className="h-6 w-6 text-gray-400" />
        </div>

        {/* Card 2 */}
        <div className="rounded-2xl bg-white p-6 shadow-sm flex items-center justify-between">
           <div>
              <p className="text-sm font-medium text-gray-500">View</p>
              <h3 className="mt-1 text-2xl font-bold text-gray-900">18</h3>
           </div>
           <Eye className="h-6 w-6 text-gray-900" />
        </div>

        {/* Card 3 */}
         <div className="rounded-2xl bg-white p-6 shadow-sm flex items-center justify-between">
           <div>
              <p className="text-sm font-medium text-gray-500">Revenue</p>
              <h3 className="mt-1 text-2xl font-bold text-gray-900">12.4K</h3>
           </div>
           <TrendingUp className="h-6 w-6 text-gray-900" />
        </div>

        {/* Card 4 */}
         <div className="rounded-2xl bg-white p-6 shadow-sm flex items-center justify-between">
           <div>
              <p className="text-sm font-medium text-gray-500">Draft</p>
              <h3 className="mt-1 text-2xl font-bold text-gray-900">6</h3>
           </div>
           <Edit3 className="h-6 w-6 text-gray-900" />
        </div>
      </div>

      {/* Search Bar */}
      <div className="flex justify-end">
        <div className="relative">
             <input 
                type="text" 
                placeholder="Search" 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full rounded-full bg-[#ff1f71] py-2 pl-6 pr-10 text-sm text-white placeholder:text-white/80 focus:outline-none focus:ring-2 focus:ring-pink-300"
             />
             <Search className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-white" />
        </div>
      </div>

      {/* Table Section */}
      <div className="overflow-hidden rounded-2xl border border-gray-100 bg-white/50 backdrop-blur-sm">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[800px]">
            <thead className="bg-[#b3a1f8]/30">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">User Id</th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Name</th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Email</th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Phone</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 bg-[#b3a1f8]/20">
              {filteredUsers.length > 0 ? (
                filteredUsers.map((user, i) => (
                  <tr key={i} className="transition-colors hover:bg-[#b3a1f8]/30">
                    <td className="px-6 py-4 text-sm text-gray-600">{user.id}</td>
                    <td className="px-6 py-4 text-sm text-gray-900">{user.name}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">{user.email}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">{user.phone}</td>
                  </tr>
                ))
              ) : (
                 <tr>
                    <td colSpan={4} className="px-6 py-8 text-center text-sm text-gray-500">
                        No users found matching "{searchQuery}"
                    </td>
                 </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

        {/* Pagination */}
        <div className="flex items-center justify-end gap-2 pt-4">
             <button className="flex h-8 w-8 items-center justify-center rounded-full text-pink-500 hover:bg-pink-100">
                <ChevronLeft className="h-5 w-5" />
             </button>
             <button className="flex h-8 w-8 items-center justify-center rounded-full bg-[#ff1f71] text-sm font-bold text-white shadow-lg shadow-[#ff1f71]/30">
                1
             </button>
             <button className="flex h-8 w-8 items-center justify-center rounded-full text-sm font-bold text-white hover:bg-white/20">
                2
             </button>
              <button className="flex h-8 w-8 items-center justify-center rounded-full text-sm font-bold text-white hover:bg-white/20">
                3
             </button>
              <button className="flex h-8 w-8 items-center justify-center rounded-full text-sm font-bold text-white hover:bg-white/20">
                4
             </button>
              <button className="flex h-8 w-8 items-center justify-center rounded-full text-sm font-bold text-white hover:bg-white/20">
                5
             </button>
             <span className="text-white">...</span>
              <button className="flex h-8 w-8 items-center justify-center rounded-full text-sm font-bold text-white hover:bg-white/20">
                33
             </button>
             <button className="flex h-8 w-8 items-center justify-center rounded-full text-pink-500 hover:bg-pink-100">
                <ChevronRight className="h-5 w-5" />
             </button>
        </div>
    </div>
  );
}
