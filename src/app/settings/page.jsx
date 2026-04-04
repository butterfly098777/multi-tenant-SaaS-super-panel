"use client";
import React, { useState } from 'react';
import { FiSave, FiGlobe, FiDatabase, FiLock, FiCreditCard } from 'react-icons/fi';

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState('general');

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Platform Settings</h1>
        <p className="text-gray-500 text-sm mt-1">Configure global application parameters and integrations.</p>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Sidebar Tabs */}
        <div className="w-full lg:w-64 shrink-0">
          <nav className="flex lg:flex-col gap-1 overflow-x-auto lg:overflow-visible pb-2 lg:pb-0">
            {[
              { id: 'general', label: 'General Info', icon: FiGlobe },
              { id: 'security', label: 'Security limits', icon: FiLock },
              { id: 'payment', label: 'Payment Integration', icon: FiCreditCard },
              { id: 'system', label: 'System Config', icon: FiDatabase },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-xl transition-all whitespace-nowrap
                  ${activeTab === tab.id 
                    ? 'bg-indigo-600 text-white shadow-md shadow-indigo-200 dark:shadow-none' 
                    : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'
                  }`}
              >
                <tab.icon size={18} /> {tab.label}
              </button>
            ))}
          </nav>
        </div>

        {/* Content Area */}
        <div className="flex-1 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl shadow-sm p-6 lg:p-8 relative overflow-hidden">
          {activeTab === 'general' && (
            <div className="space-y-6 animate-fade-in">
              <h2 className="text-lg font-bold text-gray-800 dark:text-white mb-4 border-b pb-2 dark:border-gray-700">Platform Identity</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Platform Name</label>
                  <input type="text" defaultValue="NeonStream Enterprise" className="w-full px-4 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-lg outline-none focus:ring-2 focus:ring-indigo-500" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Support Email</label>
                  <input type="email" defaultValue="support@neonstream.com" className="w-full px-4 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-lg outline-none focus:ring-2 focus:ring-indigo-500" />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Base Domain (For Tenants)</label>
                <div className="flex bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-lg overflow-hidden">
                  <span className="px-4 py-2 bg-gray-100 dark:bg-gray-800 border-r border-gray-300 dark:border-gray-600 text-gray-500">*.</span>
                  <input type="text" defaultValue="neonstream.com" className="w-full px-4 py-2 bg-transparent outline-none" />
                </div>
                <p className="text-xs text-gray-500 mt-1">Example: tenant.neonstream.com</p>
              </div>
            </div>
          )}

          {activeTab === 'system' && (
            <div className="space-y-6 animate-fade-in">
               <h2 className="text-lg font-bold text-gray-800 dark:text-white mb-4 border-b pb-2 dark:border-gray-700">System Controls</h2>
               
               <div className="flex items-center justify-between p-4 border border-red-200 dark:border-red-900/50 bg-red-50 dark:bg-red-900/10 rounded-xl">
                 <div>
                   <h3 className="font-bold text-red-700 dark:text-red-400">Maintenance Mode</h3>
                   <p className="text-sm text-red-600 dark:text-red-300 mt-1">Suspend access for all tenants temporarily.</p>
                 </div>
                 <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" className="sr-only peer" />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-red-500"></div>
                 </label>
               </div>
            </div>
          )}

          {activeTab === 'payment' && (
            <div className="space-y-6 animate-fade-in">
              <h2 className="text-lg font-bold text-gray-800 dark:text-white mb-4 border-b pb-2 dark:border-gray-700">Stripe Integration</h2>
               <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Publishable Key</label>
                    <input type="text" defaultValue="pk_test_51Nx..." className="w-full px-4 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-lg font-mono text-sm" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Secret Key</label>
                    <input type="password" defaultValue="sk_test_..." className="w-full px-4 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-lg font-mono text-sm" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Webhook Secret</label>
                    <input type="password" defaultValue="whsec_..." className="w-full px-4 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-lg font-mono text-sm" />
                  </div>
               </div>
            </div>
          )}

          <div className="mt-8 pt-5 border-t border-gray-200 dark:border-gray-700 flex justify-end">
            <button className="flex items-center gap-2 bg-indigo-600 text-white px-6 py-2.5 rounded-lg hover:bg-indigo-700 transition font-medium">
              <FiSave /> Save Changes
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
