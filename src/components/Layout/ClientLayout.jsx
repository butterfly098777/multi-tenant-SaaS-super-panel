"use client";
import React, { useState } from 'react';
import Sidebar from '../Sidebar/Sidebar';
import Navbar from '../Navbar/Navbar';
import QueryProvider from '../../providers';

export default function ClientLayout({ children }) {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  return (
    <QueryProvider>
      <div className="flex h-screen w-full bg-gray-50 dark:bg-gray-900">
        <Sidebar
          isCollapsed={isSidebarCollapsed}
          toggleSidebar={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
        />

        <div className={`flex flex-1 flex-col transition-all duration-300 ease-in-out ${isSidebarCollapsed ? 'ml-20' : 'ml-64'}`}>
          <Navbar isSidebarCollapsed={isSidebarCollapsed} />
          <main className="flex-1 overflow-y-auto p-6">
            {children}
          </main>
        </div>
      </div>
    </QueryProvider>
  );
}
