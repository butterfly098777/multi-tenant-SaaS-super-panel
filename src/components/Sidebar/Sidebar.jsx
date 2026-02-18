import Link from 'next/link';
import {
  FiHome,
  FiFileText,
  FiBarChart2,
  FiMessageSquare,
  FiPlayCircle,
  FiBell,
  FiLogOut,
  FiSettings
} from 'react-icons/fi';
import clsx from 'clsx';

const Sidebar = () => {
  const navItems = [
    { icon: FiHome, href: '/', label: 'Dashboard', active: true },
    { icon: FiFileText, href: '/documents', label: 'Documents' },
    { icon: FiBarChart2, href: '/stats', label: 'Statistics' },
    { icon: FiMessageSquare, href: '/messages', label: 'Messages' },
    { icon: FiPlayCircle, href: '/videos', label: 'Videos' },
  ];

  return (
    <div className="group flex h-full w-20 flex-col items-center justify-between bg-[#5B4DBC] py-8 text-white transition-all duration-300 ease-in-out hover:w-64 hover:items-start hover:px-6">
      {/* Top Section */}
      <div className="flex w-full flex-col gap-8">
        {/* Logo / Bell Icon */}
        <div className="mb-4 flex items-center gap-4 px-5">
          <button className="flex h-10 w-10 min-w-[40px] items-center justify-center rounded-full bg-white/20 hover:bg-white/30 transition-colors">
            <FiBell size={20} />
          </button>
          <span className="whitespace-nowrap text-xl font-bold opacity-0 transition-opacity duration-300 group-hover:opacity-100">
            SuperPanel
          </span>
        </div>

        {/* Navigation Items */}
        <nav className="flex w-full flex-col gap-4">
          {navItems.map((item, index) => (
            <Link
              key={index}
              href={item.href}
              className={clsx(
                "flex items-center gap-4 rounded-xl p-3 px-7 transition-all duration-200 overflow-hidden whitespace-nowrap",
                item.active
                  ? "bg-white text-[#5B4DBC] shadow-lg"
                  : "text-white/70 hover:bg-white/10 hover:text-white"
              )}
            >
              <item.icon size={24} className="min-w-[24px]" />
              <span className="opacity-0 transition-opacity delay-100 duration-200 group-hover:opacity-100">
                {item.label}
              </span>
            </Link>
          ))}
        </nav>
      </div>

      {/* Bottom Section */}
      <div className="flex w-full flex-col gap-6 group-hover:px-0">
        <button className="flex w-full items-center gap-4 rounded-xl p-3 px-7 text-white/70 transition-all duration-200 hover:bg-white/10 hover:text-white overflow-hidden whitespace-nowrap">
          <FiLogOut size={24} className="min-w-[24px] rotate-180" />
          <span className="opacity-0 transition-opacity delay-100 duration-200 group-hover:opacity-100">
            Logout
          </span>
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
