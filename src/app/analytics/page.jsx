"use client";
import React, { useState } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, BarChart, Bar, Legend, PieChart, Pie, Cell } from 'recharts';
import { FiTrendingUp, FiTrendingDown, FiActivity, FiUsers, FiDollarSign } from 'react-icons/fi';

const mrrData = [
  { month: 'Jan', mrr: 12000, churn: 200 },
  { month: 'Feb', mrr: 15000, churn: 150 },
  { month: 'Mar', mrr: 20000, churn: 300 },
  { month: 'Apr', mrr: 23500, churn: 180 },
  { month: 'May', mrr: 28000, churn: 250 },
  { month: 'Jun', mrr: 34000, churn: 120 },
  { month: 'Jul', mrr: 45000, churn: 190 },
];

const planDistribution = [
  { name: 'Basic Plan', value: 400 },
  { name: 'Pro Plan', value: 300 },
  { name: 'Enterprise', value: 100 },
];

const COLORS = ['#8b5cf6', '#3b82f6', '#10b981'];

export default function AnalyticsPage() {
  const [timeRange, setTimeRange] = useState('7d');

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Business Intelligence</h1>
          <p className="text-gray-500 text-sm mt-1">Deep dive into platform's financial and growth metrics.</p>
        </div>
        <select 
          value={timeRange}
          onChange={(e) => setTimeRange(e.target.value)}
          className="bg-white border text-sm border-gray-300 text-gray-900 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block p-2.5 dark:bg-gray-800 dark:border-gray-600 dark:text-white"
        >
          <option value="7d">Last 7 Days</option>
          <option value="30d">Last 30 Days</option>
          <option value="3m">Last 3 Months</option>
          <option value="1y">Last Year</option>
        </select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl p-6 text-white shadow-lg overflow-hidden relative">
          <div className="relative z-10">
            <p className="text-indigo-100 text-sm font-medium mb-1">Monthly Recurring Revenue (MRR)</p>
            <h2 className="text-3xl font-bold">$45,000</h2>
            <div className="flex items-center mt-4 text-sm bg-white/20 w-fit px-2 py-1 rounded-full backdrop-blur-sm">
              <FiTrendingUp className="mr-1" /> +15.5% this month
            </div>
          </div>
          <FiDollarSign className="absolute -right-6 -bottom-6 text-9xl opacity-20" />
        </div>
        
        <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl p-6 shadow-sm">
          <p className="text-gray-500 dark:text-gray-400 text-sm font-medium mb-1">Active Subscribers</p>
          <h2 className="text-3xl font-bold text-gray-800 dark:text-white">842</h2>
          <div className="flex items-center mt-4 text-sm text-green-500 font-medium">
            <FiTrendingUp className="mr-1" /> +42 new this month
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl p-6 shadow-sm">
          <p className="text-gray-500 dark:text-gray-400 text-sm font-medium mb-1">Avg. Churn Rate</p>
          <h2 className="text-3xl font-bold text-gray-800 dark:text-white">2.4%</h2>
          <div className="flex items-center mt-4 text-sm text-red-500 font-medium">
            <FiTrendingDown className="mr-1" /> -0.5% improved
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl p-6 shadow-sm">
          <h3 className="text-lg font-bold text-gray-800 dark:text-white mb-6">MRR Growth vs Churn</h3>
          <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={mrrData}>
                <defs>
                  <linearGradient id="colorMrr" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#374151" opacity={0.2} />
                <XAxis dataKey="month" axisLine={false} tickLine={false} />
                <YAxis axisLine={false} tickLine={false} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#1f2937', borderColor: '#374151', borderRadius: '8px', color: '#fff' }}
                  itemStyle={{ color: '#fff' }}
                />
                <Area type="monotone" dataKey="mrr" stroke="#8b5cf6" strokeWidth={3} fillOpacity={1} fill="url(#colorMrr)" />
                <Line type="monotone" dataKey="churn" stroke="#ef4444" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl p-6 shadow-sm">
          <h3 className="text-lg font-bold text-gray-800 dark:text-white mb-6">Plan Distribution</h3>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={planDistribution}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {planDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ backgroundColor: '#1f2937', borderColor: '#374151', borderRadius: '8px' }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="flex flex-col gap-3 mt-4">
            {planDistribution.map((plan, i) => (
              <div key={plan.name} className="flex justify-between items-center text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[i] }}></div>
                  <span className="text-gray-600 dark:text-gray-300">{plan.name}</span>
                </div>
                <span className="font-bold text-gray-800 dark:text-white">{plan.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
