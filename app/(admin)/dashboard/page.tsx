"use client";

import { Users, DollarSign, Bell } from "lucide-react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";

const data = [
  { name: "Jan", uv: 200 },
  { name: "Feb", uv: 400 },
  { name: "Mar", uv: 350 },
  { name: "Apr", uv: 500 },
  { name: "May", uv: 700 },
  { name: "Jun", uv: 600 },
  { name: "Jul", uv: 800 },
  { name: "Aug", uv: 650 },
  { name: "Sep", uv: 750 },
  { name: "Oct", uv: 600 },
  { name: "Nov", uv: 850 },
  { name: "Dec", uv: 900 },
];

const pieData = [
  { name: "Bed & Breakfast", value: 20, color: "#FFA500" }, // Orange
  { name: "Apartment", value: 20, color: "#4FD1C5" }, // Teal
  { name: "Room only", value: 20, color: "#F56565" }, // Red
  { name: "Guesthouse", value: 40, color: "#81E6D9" }, // Light Green/Tealish
];

// Custom colors for the pie chart
const PIE_COLORS = ["#ff715b", "#5ce1e6", "#ff4f4f", "#8af36d"];


export default function DashboardPage() {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-[#ff1f71]">Admin Dashboard</h1>
        <p className="mt-1 text-sm text-[#ff7171]">
          Welcome back, Here's what's happening with your account.
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        {/* Card 1 */}
        <div className="rounded-2xl bg-white p-6 shadow-sm">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm font-medium text-pink-300">Total User</p>
              <h3 className="mt-2 text-3xl font-bold text-[#ff1f71]">40,689</h3>
            </div>
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-500 shadow-md">
               <Users className="h-5 w-5 text-white" />
            </div>
          </div>
          <p className="mt-4 text-xs font-medium text-blue-500">
            ↗ 8.5% <span className="text-gray-400">Up from yesterday</span>
          </p>
        </div>

        {/* Card 2 */}
        <div className="rounded-2xl bg-white p-6 shadow-sm">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm font-medium text-pink-300">Total Revenue</p>
              <h3 className="mt-2 text-3xl font-bold text-[#ff1f71]">40,689</h3>
            </div>
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-purple-600 shadow-md">
               <DollarSign className="h-5 w-5 text-white" />
            </div>
          </div>
          <p className="mt-4 text-xs font-medium text-blue-500">
             ↗ 8.5% <span className="text-gray-400">Up from yesterday</span>
          </p>
        </div>

         {/* Card 3 */}
         <div className="rounded-2xl bg-white p-6 shadow-sm">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm font-medium text-pink-300">Total Subscription</p>
              <h3 className="mt-2 text-3xl font-bold text-[#ff1f71]">40,689</h3>
            </div>
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#ff1f71] shadow-md">
               <Bell className="h-5 w-5 text-white" />
            </div>
          </div>
          <p className="mt-4 text-xs font-medium text-blue-500">
             ↗ 8.5% <span className="text-gray-400">Up from yesterday</span>
          </p>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Revenue Chart */}
        <div className="rounded-3xl bg-white p-6 shadow-sm lg:col-span-2">
            <div className="mb-6">
                <h3 className="text-lg font-bold text-[#ff1f71]">Revenue</h3>
                <p className="text-xs text-blue-500">↑ (+5) more <span className="text-gray-400">in 2025</span></p>
            </div>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={data}
                margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
              >
                <defs>
                    <linearGradient id="colorUv" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8}/>
                        <stop offset="95%" stopColor="#8884d8" stopOpacity={0}/>
                    </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                <XAxis 
                    dataKey="name" 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fill: '#d1d5db', fontSize: 12 }}
                    dy={10}
                />
                <YAxis hide />
                <Tooltip />
                <Area
                  type="monotone"
                  dataKey="uv"
                  stroke="#6366f1"
                  strokeWidth={3}
                  fillOpacity={1}
                  fill="url(#colorUv)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Device/Distribution Chart */}
        <div className="rounded-3xl bg-white p-6 shadow-sm">
            <div className="mb-4 flex flex-wrap gap-2 text-sm font-bold">
                 {/* Legend (Manual) */}
                 <div className="w-1/2 text-[#ff715b]">Bed & Breakfast <br/><span className="text-lg">20%</span></div>
                 <div className="w-1/3 text-[#5ce1e6]">Apartment <br/><span className="text-lg">20%</span></div>
            </div>

          <div className="flex h-[200px] items-center justify-center">
             <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                    <Pie
                        data={pieData}
                        innerRadius={60}
                        outerRadius={80}
                        fill="#8884d8"
                        paddingAngle={0}
                        dataKey="value"
                    >
                        {pieData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                        ))}
                    </Pie>
                </PieChart>
             </ResponsiveContainer>
          </div>
          
            <div className="mt-4 flex flex-wrap gap-y-4 text-sm font-bold">
                 {/* Legend (Manual Bottom) */}
                 <div className="w-1/2 text-[#ff4f4f]">Room only <br/><span className="text-lg">20%</span></div>
                 <div className="w-1/3 text-[#8af36d]">Guesthouse <br/><span className="text-lg">40%</span></div>
            </div>
            
            <div className="mt-8 flex gap-2">
                <button className="rounded-lg bg-[#ff1f71] px-4 py-2 text-xs font-bold text-white">Properties Type</button>
                <button className="rounded-lg bg-blue-500 px-4 py-2 text-xs font-bold text-white">Period</button>
            </div>
        </div>
      </div>
    </div>
  );
}
