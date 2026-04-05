"use client";
import React, { createContext, useContext, useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [permissions, setPermissions] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    // Check localStorage on mount
    const token = localStorage.getItem('token');
    const storedUser = localStorage.getItem('admin'); // Check general admin/role user storage
    
    if (token && storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        setUser(parsedUser);
        if (parsedUser.permissions) {
          // Normalize if backend wrapped it in an array due to Mongoose Schema definition
          let perms = parsedUser.permissions;
          if (Array.isArray(perms) && perms.length > 0 && typeof perms[0] === 'object') {
            perms = perms[0];
          } else if (Array.isArray(perms)) {
             perms = {}; // empty or corrupted
          }
          setPermissions(perms);
        }
      } catch (e) {
        console.error("Error parsing user data");
      }
    }
    setIsLoading(false);
  }, []);

  // Helper to check if logged in user has a specific permission
  const hasPermission = (category, action) => {
    if (!user) return false;
    // SuperAdmin bypasses all permission checks
    if (user.role === 'superAdmin') return true; 
    
    // Check SuperRole specific permissions array
    if (permissions && permissions[category] && Array.isArray(permissions[category])) {
      return permissions[category].includes(action);
    }
    return false;
  };

  // Helper to get allowed routes. (Optional advanced security to kick users from direct URL hits)
  useEffect(() => {
    if (isLoading || !pathname || pathname === '/login') return;
    
    // Hard check for blocked top-level routes
    const routeCategoryMap = {
      '/tenants': 'Tenants',
      '/plans': 'Plans',
      '/payments': 'Payments',
      '/categories': 'Categories',
      '/analytics': 'Analytics',
      '/roles': 'Roles',
      '/notifications': 'Notifications',
      '/audit-logs': 'Audit Logs',
      '/settings': 'Settings'
    };

    const currentBaseRoute = Object.keys(routeCategoryMap).find(route => pathname.startsWith(route));
    if (currentBaseRoute && user) {
      const category = routeCategoryMap[currentBaseRoute];
      if (!hasPermission(category, 'View')) {
        // User has absolutely no access to this view, redirect to dashboard as approved in plan
        router.replace('/dashboard');
      }
    }
  }, [pathname, user, isLoading]);


  const login = (userData) => {
    setUser(userData);
    if (userData.permissions) {
      let perms = userData.permissions;
      if (Array.isArray(perms) && perms.length > 0 && typeof perms[0] === 'object') {
        perms = perms[0];
      }
      setPermissions(perms);
    }
  };

  const logout = () => {
    setUser(null);
    setPermissions({});
    localStorage.removeItem('token');
    localStorage.removeItem('admin');
    router.replace('/login');
  };

  return (
    <AuthContext.Provider value={{ user, permissions, hasPermission, isLoading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
