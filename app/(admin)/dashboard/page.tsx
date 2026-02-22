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
import { useEffect, useState } from "react";
import api from "@/lib/axios";
import { toast } from "sonner";

interface DashboardStats {
  totalUsers: number;
  totalSubscriptions: number;
  totalRevenue: number;
  monthlyRevenue: {
    year: number;
    month: number;
    monthLabel: string;
    totalRevenue: number;
  }[];
  templateCategoryBreakdown: {
    category: string;
    totalTemplates: number;
    percentage: number;
  }[];
}

// Custom colors for the pie chart
const PIE_COLORS = ["#ff1f71", "#5ce1e6", "#ff715b", "#8af36d", "#8884d8", "#ffc658"];


export default function DashboardPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      setIsLoading(true);
      try {
        const res = await api.get("/stats/dashboard");
        if (res.data.success) {
          setStats(res.data.data);
        }
      } catch (error) {
        console.error("Failed to fetch dashboard stats", error);
        toast.error("Failed to load dashboard statistics");
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const chartData = stats?.monthlyRevenue.map(item => ({
    name: item.monthLabel,
    revenue: item.totalRevenue
  })) || [];

  const pieChartData = stats?.templateCategoryBreakdown.map(item => ({
    name: item.category,
    value: item.totalTemplates,
    percentage: item.percentage
  })) || [];

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
              <h3 className="mt-2 text-3xl font-bold text-[#ff1f71]">{isLoading ? "..." : (stats?.totalUsers || 0).toLocaleString()}</h3>
            </div>
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-500 shadow-md">
              <Users className="h-5 w-5 text-white" />
            </div>
          </div>
        </div>

        {/* Card 2 */}
        <div className="rounded-2xl bg-white p-6 shadow-sm">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm font-medium text-pink-300">Total Revenue</p>
              <h3 className="mt-2 text-3xl font-bold text-[#ff1f71]">${isLoading ? "..." : (stats?.totalRevenue || 0).toLocaleString()}</h3>
            </div>
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-purple-600 shadow-md">
              <DollarSign className="h-5 w-5 text-white" />
            </div>
          </div>
        </div>

        {/* Card 3 */}
        <div className="rounded-2xl bg-white p-6 shadow-sm">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm font-medium text-pink-300">Total Subscription</p>
              <h3 className="mt-2 text-3xl font-bold text-[#ff1f71]">{isLoading ? "..." : (stats?.totalSubscriptions || 0).toLocaleString()}</h3>
            </div>
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#ff1f71] shadow-md">
              <Bell className="h-5 w-5 text-white" />
            </div>
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Revenue Chart */}
        <div className="rounded-3xl bg-white p-6 shadow-sm lg:col-span-2">
          <div className="mb-6">
            <h3 className="text-lg font-bold text-[#ff1f71]">Monthly Revenue</h3>
            <p className="text-xs text-blue-500">Last {stats?.monthlyRevenue.length || 0} months</p>
          </div>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={chartData}
                margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
              >
                <defs>
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#ff1f71" stopOpacity={0.1} />
                    <stop offset="95%" stopColor="#ff1f71" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                <XAxis
                  dataKey="name"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: '#94a3b8', fontSize: 12 }}
                  dy={10}
                />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: '#94a3b8', fontSize: 12 }}
                  tickFormatter={(value) => `$${value}`}
                />
                <Tooltip
                  contentStyle={{ borderRadius: '1rem', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                  formatter={(value) => [`$${value}`, 'Revenue']}
                />
                <Area
                  type="monotone"
                  dataKey="revenue"
                  stroke="#ff1f71"
                  strokeWidth={3}
                  fillOpacity={1}
                  fill="url(#colorRevenue)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Device/Distribution Chart */}
        <div className="rounded-3xl bg-white p-6 shadow-sm">
          <div className="mb-4">
            <h3 className="text-lg font-bold text-[#ff1f71]">Category Breakdown</h3>
            <p className="text-xs text-gray-400">Template distribution</p>
          </div>

          <div className="flex h-[200px] items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieChartData}
                  innerRadius={60}
                  outerRadius={80}
                  fill="#8884d8"
                  paddingAngle={5}
                  dataKey="value"
                >
                  {pieChartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{ borderRadius: '1rem', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                  formatter={(value, name, props) => [`${value} templates`, name]}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="mt-6 space-y-3">
            {pieChartData.map((item, index) => (
              <div key={item.name} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="h-3 w-3 rounded-full" style={{ backgroundColor: PIE_COLORS[index % PIE_COLORS.length] }}></div>
                  <span className="text-sm font-medium text-gray-600">{item.name}</span>
                </div>
                <span className="text-sm font-bold text-gray-900">{item.percentage.toFixed(1)}%</span>
              </div>
            ))}
            {pieChartData.length === 0 && !isLoading && (
              <p className="text-center text-sm text-gray-400 py-4">No categories found</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
