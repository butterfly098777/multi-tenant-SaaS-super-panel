"use client";
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  FiHome,
  FiUsers,
  FiPackage,
  FiCreditCard,
  FiGrid,
  FiBarChart2,
  FiShield,
  FiBell,
  FiActivity,
  FiSettings,
  FiLogOut,
  FiMenu
} from 'react-icons/fi';
import clsx from 'clsx';
import { logoutAdmin } from '../../api/adminApi';
import { useAuth } from '../../context/AuthContext';

const Sidebar = ({ isCollapsed, toggleSidebar }) => {
  const pathname = usePathname();
  const router = useRouter();
  const { hasPermission, logout } = useAuth();

  const handleLogout = () => {
    logoutAdmin(); // call old api method
    logout(); // uses context logout which clears token and state and redirects
  };


  const navItems = [
    { icon: FiHome, href: '/dashboard', label: 'Dashboard' },
    { icon: FiUsers, href: '/tenants', label: 'Tenants' },
    { icon: FiPackage, href: '/plans', label: 'Plans' },
    { icon: FiCreditCard, href: '/payments', label: 'Payments' },
    { icon: FiGrid, href: '/categories', label: 'Categories' },
    { icon: FiBarChart2, href: '/analytics', label: 'Analytics' },
    { icon: FiShield, href: '/roles', label: 'Roles' },
    { icon: FiBell, href: '/notifications', label: 'Notifications' },
    { icon: FiActivity, href: '/audit-logs', label: 'Audit Logs' },
    { icon: FiSettings, href: '/settings', label: 'Settings' },
  ];

  return (
    <div
      className={clsx(
        "flex h-screen flex-col bg-[#1e293b] text-white transition-all duration-300 ease-in-out shadow-xl fixed left-0 top-0 z-50",
        isCollapsed ? "w-20" : "w-64"
      )}
    >
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-white/10 h-16">
        <div className={clsx("flex items-center gap-3 overflow-hidden", isCollapsed && "justify-center w-full")}>
          <div className="h-8 w-8 rounded-lg bg-indigo-500 flex items-center justify-center shrink-0">
            <span className="font-bold text-lg">S</span>
          </div>
          {!isCollapsed && <span className="font-bold text-lg whitespace-nowrap">SuperAdmin</span>}
        </div>
        {!isCollapsed && (
          <button
            onClick={toggleSidebar}
            className="p-1.5 rounded-lg hover:bg-white/10 text-gray-400 hover:text-white transition-colors"
          >
            <FiMenu size={20} />
          </button>
        )}
      </div>

      {/* Collapse Button (Only visible when collapsed) */}
      {isCollapsed && (
        <div className="flex justify-center p-2 border-b border-white/10">
          <button
            onClick={toggleSidebar}
            className="p-2 rounded-lg hover:bg-white/10 text-gray-400 hover:text-white transition-colors"
          >
            <FiMenu size={20} />
          </button>
        </div>
      )}


      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-1 custom-scrollbar">
        {navItems.map((item) => {
          // If they don't have View permissions for this exact menu item, completely skip rendering it.
          // Note: Dashboard is visible to all
          if (item.label !== 'Dashboard' && !hasPermission(item.label, 'View')) return null;

          const isActive = pathname === item.href || (item.href !== '/dashboard' && pathname?.startsWith(item.href));

          return (
            <Link
              key={item.href}
              href={item.href}
              title={isCollapsed ? item.label : ""}
              className={clsx(
                "flex items-center gap-3 rounded-lg px-3 py-2.5 transition-all duration-200 group relative",
                isActive
                  ? "bg-indigo-600 text-white shadow-md"
                  : "text-gray-400 hover:bg-white/5 hover:text-white"
              )}
            >
              <item.icon
                size={22}
                className={clsx("shrink-0", isActive ? "text-white" : "group-hover:text-white")}
              />
              {!isCollapsed && (
                <span className="whitespace-nowrap text-sm font-medium">
                  {item.label}
                </span>
              )}

              {/* Tooltip for collapsed state */}
              {isCollapsed && (
                <div className="absolute left-full ml-2 px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 pointer-events-none whitespace-nowrap z-50 transition-opacity">
                  {item.label}
                </div>
              )}
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-white/10">
        <button
          onClick={handleLogout}
          className={clsx(
          "flex w-full items-center gap-3 rounded-lg p-2 text-red-400 hover:bg-red-500/10 hover:text-red-300 transition-colors",
          isCollapsed ? "justify-center" : ""
        )}>
          <FiLogOut size={22} className="shrink-0" />
          {!isCollapsed && <span className="whitespace-nowrap text-sm font-medium">Logout</span>}
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
