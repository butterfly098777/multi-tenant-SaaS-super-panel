"use client";
import React, { useState } from 'react';
import { FiMail, FiSend, FiMessageSquare, FiAlertCircle } from 'react-icons/fi';

export default function NotificationsPage() {
  const [activeTab, setActiveTab] = useState('announce');

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Communications & Alerts</h1>
        <p className="text-gray-500 text-sm mt-1">Manage SMTP settings and blast announcements to all tenants.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl shadow-sm overflow-hidden">
            <div className="flex border-b border-gray-200 dark:border-gray-700">
              <button 
                onClick={() => setActiveTab('announce')}
                className={`flex-1 py-4 text-sm font-medium flex items-center justify-center gap-2 transition-colors ${activeTab === 'announce' ? 'text-indigo-600 border-b-2 border-indigo-600 bg-indigo-50/50 dark:bg-indigo-900/10' : 'text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'}`}
              >
                <FiMessageSquare /> Send Announcement
              </button>
              <button 
                onClick={() => setActiveTab('smtp')}
                className={`flex-1 py-4 text-sm font-medium flex items-center justify-center gap-2 transition-colors ${activeTab === 'smtp' ? 'text-indigo-600 border-b-2 border-indigo-600 bg-indigo-50/50 dark:bg-indigo-900/10' : 'text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'}`}
              >
                <FiMail /> SMTP Configuration
              </button>
            </div>

            <div className="p-6">
              {activeTab === 'announce' && (
                <div className="space-y-5 animate-fade-in">
                  <div className="p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl flex items-start gap-3">
                    <FiAlertCircle className="text-blue-500 mt-0.5 shrink-0" size={18} />
                    <p className="text-sm text-blue-700 dark:text-blue-300">
                      Announcements will appear as a banner in all tenant admin panels immediately after sending. Use this for maintenance or update alerts.
                    </p>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Announcement Title</label>
                    <input type="text" placeholder="e.g., Scheduled Maintenance this Saturday" className="w-full px-4 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-lg outline-none focus:ring-2 focus:ring-indigo-500" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Message Body</label>
                    <textarea rows="4" placeholder="Type your message to all tenants..." className="w-full px-4 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-lg outline-none focus:ring-2 focus:ring-indigo-500 resize-none"></textarea>
                  </div>

                  <div className="flex justify-end pt-2">
                    <button className="flex items-center gap-2 bg-indigo-600 text-white px-6 py-2.5 rounded-lg hover:bg-indigo-700 transition font-medium shadow-md">
                      <FiSend /> Broadcast Message
                    </button>
                  </div>
                </div>
              )}

              {activeTab === 'smtp' && (
                <div className="space-y-5">
                  <div className="grid grid-cols-2 gap-5">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">SMTP Host</label>
                      <input type="text" placeholder="smtp.gmail.com" className="w-full px-4 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-lg outline-none" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">SMTP Port</label>
                      <input type="text" placeholder="587" className="w-full px-4 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-lg outline-none" />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-5">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Email Username</label>
                      <input type="email" placeholder="hello@saas.com" className="w-full px-4 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-lg outline-none" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">App Password</label>
                      <input type="password" placeholder="••••••••••••" className="w-full px-4 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-lg outline-none" />
                    </div>
                  </div>
                  <div className="flex justify-end pt-4">
                    <button className="bg-gray-900 dark:bg-white dark:text-gray-900 text-white px-6 py-2 rounded-lg hover:opacity-90 font-medium">
                      Save SMTP Config
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Sidebar Status Widget */}
        <div className="space-y-6">
          <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl p-6 shadow-sm">
            <h3 className="font-bold text-gray-800 dark:text-white mb-4">Email Service Status</h3>
            <div className="flex items-center gap-3 mb-6">
              <span className="relative flex h-4 w-4">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-4 w-4 bg-green-500"></span>
              </span>
              <span className="font-medium text-gray-700 dark:text-gray-300">Connected to AWS SES</span>
            </div>
            
            <div className="space-y-4">
              <div className="flex justify-between items-center text-sm">
                <span className="text-gray-500">Emails Sent Today</span>
                <span className="font-bold text-gray-800 dark:text-white">1,240</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-gray-500">Bounce Rate</span>
                <span className="font-bold text-green-500 hover:underline cursor-pointer">0.2%</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
