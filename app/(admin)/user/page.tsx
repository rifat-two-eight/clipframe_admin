"use client";

import { Search, User as UserIcon, Eye, TrendingUp, Edit3, ChevronLeft, ChevronRight } from "lucide-react";
import { useState, useEffect } from "react";
import { userService, User } from "@/services/user";
import { toast } from "sonner";



// Adding some variation for search testing



export default function UserPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [totalUsers, setTotalUsers] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const LIMIT = 10;

  useEffect(() => {
    fetchUsers(currentPage);
  }, [currentPage]);

  const fetchUsers = async (page: number) => {
    setLoading(true);
    try {
      const response = await userService.getAllUsers(page, LIMIT);
      if (response.success) {
        setUsers(response.data.data);
        setTotalUsers(response.data.meta.total);
        setTotalPages(response.data.meta.totalPages);
      } else {
        toast.error(response.message || "Failed to fetch users");
      }
    } catch (error) {
      console.error("Error fetching users:", error);
      toast.error("An error occurred while fetching users");
    } finally {
      setLoading(false);
    }
  };

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };
  
  // Basic client-side filtering for search if API doesn't support it yet
  // Ideally, search should be server-side
  const filteredUsers = users.filter(user => 
    (user.name?.toLowerCase() || "").includes(searchQuery.toLowerCase()) ||
    (user.email?.toLowerCase() || "").includes(searchQuery.toLowerCase()) ||
    (user._id?.toLowerCase() || "").includes(searchQuery.toLowerCase())
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
              <h3 className="mt-1 text-2xl font-bold text-gray-900">{totalUsers}</h3>
           </div>
           <UserIcon className="h-6 w-6 text-gray-400" />
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
                  <tr key={user._id || i} className="transition-colors hover:bg-[#b3a1f8]/30">
                    <td className="px-6 py-4 text-sm text-gray-600">#{user._id?.substring(0, 8)}</td>
                    <td className="px-6 py-4 text-sm text-gray-900">{user.name?user.name:"N/A"}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">{user.email?user.email:"N/A"}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">{user.phone?user.phone:"N/A"}</td>
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
        <div className="flex items-center justify-end gap-2 pt-4 pb-4">
             <button 
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1 || loading}
                className="flex h-8 w-8 items-center justify-center rounded-full text-pink-500 hover:bg-pink-100 disabled:opacity-50 disabled:cursor-not-allowed"
             >
                <ChevronLeft className="h-5 w-5" />
             </button>
             
             {Array.from({ length: totalPages }, (_, i) => i + 1)
                // Logical pagination needed if many pages, for now showing all or simple slice
                .slice(Math.max(0, currentPage - 3), Math.min(totalPages, currentPage + 2)) 
                .map((page) => (
                 <button
                    key={page}
                    onClick={() => handlePageChange(page)}
                    className={`flex h-8 w-8 items-center justify-center rounded-full text-sm font-bold ${
                        currentPage === page 
                        ? "bg-[#ff1f71] text-white shadow-lg shadow-[#ff1f71]/30" 
                        : "text-gray-600 hover:bg-gray-100" // Adjusted for visibility on white bg
                    }`}
                 >
                    {page}
                 </button>
             ))}

             <button 
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages || loading}
                className="flex h-8 w-8 items-center justify-center rounded-full text-pink-500 hover:bg-pink-100 disabled:opacity-50 disabled:cursor-not-allowed"
             >
                <ChevronRight className="h-5 w-5" />
             </button>
        </div>
    </div>
  );
}
