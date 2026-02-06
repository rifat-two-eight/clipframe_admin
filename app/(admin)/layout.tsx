"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { 
  Home, 
  FileText, 
  CreditCard, 
  Settings, 
  Users, 
  LogOut,
  Menu,
  X
} from "lucide-react";
import { usePathname, useRouter } from "next/navigation";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();  
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen w-full overflow-hidden bg-[#fdf2f8]">
      {/* Mobile Header */}
      <div className="fixed top-0 left-0 right-0 z-20 flex h-16 items-center justify-between border-b border-gray-100 bg-white px-4 lg:hidden">
        <button 
            onClick={() => setIsSidebarOpen(true)}
            className="p-2 text-gray-600 focus:outline-none"
        >
            <Menu className="h-6 w-6" />
        </button>
        <div className="relative h-8 w-28">
            <Image src="/logo.svg" alt="ClipFrame" fill className="object-contain object-right" />
        </div>
      </div>

       {/* Sidebar Overlay (Mobile) */}
       {isSidebarOpen && (
        <div 
            className="fixed inset-0 z-30 bg-black/50 lg:hidden"
            onClick={() => setIsSidebarOpen(false)}
        />
       )}

       {/* Sidebar */}
      <aside className={`fixed inset-y-0 left-0 z-40 flex w-64 flex-col border-r border-gray-100 bg-white p-6 transition-transform duration-300 lg:static lg:flex lg:translate-x-0 ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"}`}>
        {/* Mobile Close Button */}
        <div className="mb-4 flex justify-end lg:hidden">
            <button onClick={() => setIsSidebarOpen(false)}>
                <X className="h-6 w-6 text-gray-500" />
            </button>
        </div>

        {/* Logo (Desktop) */}
        <div className="mb-10 hidden cursor-pointer items-center gap-2 lg:flex">
            <div className="relative h-8 w-28">
                <Image src="/logo.svg" alt="ClipFrame" fill className="object-contain" /> 
            </div>
        </div>

        {/* Logo (Mobile - inside sidebar, top) */}
        <div className="mb-8 flex justify-center lg:hidden">
             <div className="relative h-10 w-28">
                <Image src="/logo.svg" alt="ClipFrame" fill className="object-contain" /> 
            </div>
        </div>

        {/* User Profile */}
        <div className="mb-8 flex items-center gap-3">
          <div className="relative h-10 w-10 overflow-hidden rounded-full bg-gray-200">
             {/* Placeholder for user avatar */}
             <div className="absolute inset-0 flex items-center justify-center bg-gray-300 text-xs font-bold text-gray-600">
                A
             </div>
          </div>
          <div>
            <p className="text-xs font-bold text-gray-400">ADMIN</p>
            <p className="text-sm font-bold text-gray-900">Rose</p>
          </div>
        </div>

        {/* Navigation */}
        <div className="flex-1 space-y-1">
          <p className="mb-2 px-4 text-xs font-bold text-gray-400">MAIN</p>
          
          <NavItem 
            href="/dashboard" 
            icon={Home} 
            label="Dashboard" 
            isActive={pathname === "/dashboard"} 
          />

          <NavItem 
            href="/terms" 
            icon={FileText} 
            label="Terms & Condition" 
            isActive={pathname === "/terms"} 
          />

          <NavItem 
            href="/subscription" 
            icon={CreditCard} 
            label="Subscription" 
            isActive={pathname === "/subscription"} 
          />
          
           <NavItem 
            href="/management" 
            icon={Settings} 
            label="Management" 
            isActive={pathname === "/management"} 
          />

           <NavItem
            href="/user" 
            icon={Users} 
            label="User Info" 
            isActive={pathname === "/user"} 
          />
        </div>

        {/* Logout */}
        <button 
          onClick={() => router.push("/login")}
          className="flex items-center gap-3 rounded-xl bg-gray-500 px-4 py-3 text-sm font-medium text-white hover:bg-gray-600"
        >
          <LogOut className="h-4 w-4" />
          Logout Account
        </button>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto bg-gradient-to-br from-[#ffeec2] to-[#d6c6ff] pt-16 lg:pt-0">
        <div className="h-full w-full p-4 lg:p-12">
            {children}
        </div>
      </main>
    </div>

  );
}

function NavItem({ 
    href, 
    icon: Icon, 
    label, 
    isActive 
}: { 
    href: string; 
    icon: any; 
    label: string; 
    isActive: boolean; 
}) {
    return (
        <Link
            href={href}
            className={`flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-colors ${
                isActive 
                ? "bg-[#ff1f71] text-white shadow-lg shadow-[#ff1f71]/30" 
                : "text-gray-500 hover:bg-gray-50 hover:text-gray-900"
            }`}
        >
            <Icon className="h-4 w-4" />
            {label}
        </Link>
    );
}
