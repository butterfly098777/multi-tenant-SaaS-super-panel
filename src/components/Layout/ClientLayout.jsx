"use client";
import React, { useState, useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import Sidebar from '../Sidebar/Sidebar';
import Navbar from '../Navbar/Navbar';
import QueryProvider from '../../providers';

// Yeh pages bina login ke openly accessible hain
const PUBLIC_ROUTES = ['/login'];

export default function ClientLayout({ children }) {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [checking, setChecking] = useState(true); // auth check ho rahi hai
  const pathname = usePathname();
  const router = useRouter();

  const isPublicRoute = PUBLIC_ROUTES.includes(pathname);

  useEffect(() => {
    const token = localStorage.getItem('token');

    if (!isPublicRoute && !token) {
      // Token nahi hai aur protected route pe hai → login pe bhejo
      router.replace('/login');
    } else if (isPublicRoute && token) {
      // Already logged in aur login page pe hai → dashboard pe bhejo
      router.replace('/dashboard');
    } else {
      setChecking(false);
    }
  }, [pathname]);

  // Auth check chal rahi hai — kuch mat dikhao (flicker prevent)
  if (checking && !isPublicRoute) {
    return (
      <div style={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #0f0c29, #1a1a3e)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}>
        <div style={{
          width: '40px', height: '40px',
          border: '3px solid rgba(99,102,241,0.3)',
          borderTopColor: '#6366f1',
          borderRadius: '50%',
          animation: 'spin 0.8s linear infinite',
        }} />
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  // LOGIN page — sirf children, koi sidebar/navbar nahi
  if (isPublicRoute) {
    return (
      <QueryProvider>
        {children}
      </QueryProvider>
    );
  }

  // PROTECTED pages — full layout with sidebar + navbar
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
