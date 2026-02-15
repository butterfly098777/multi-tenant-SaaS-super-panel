import Link from 'next/link';
import {
  FiHome,
  FiFileText,
  FiBarChart2,
  FiMessageSquare,
  FiPlayCircle,
  FiBell,
  FiLogOut
} from 'react-icons/fi';
import clsx from 'clsx';

const Sidebar = () => {
  const navItems = [
    { icon: FiHome, href: '/', active: true },
    { icon: FiFileText, href: '/documents' },
    { icon: FiBarChart2, href: '/stats' },
    { icon: FiMessageSquare, href: '/messages' },
    { icon: FiPlayCircle, href: '/videos' },
  ];

  return (
    <div className="flex w-20 flex-col items-center justify-between bg-[#5B4DBC] py-8 text-white">
      {/* Top Section */}
      <div className="flex flex-col items-center gap-8">
        {/* Logo / Bell Icon */}
        <div className="mb-4">
          <button className="rounded-full bg-white/20 p-3 hover:bg-white/30 transition-colors">
            <FiBell size={24} />
          </button>
        </div>

        {/* Navigation Items */}
        <nav className="flex flex-col gap-6">
          {navItems.map((item, index) => (
            <Link
              key={index}
              href={item.href}
              className={clsx(
                "rounded-xl p-3 transition-all duration-200",
                item.active
                  ? "bg-white text-[#5B4DBC] shadow-lg"
                  : "text-white/70 hover:bg-white/10 hover:text-white"
              )}
            >
              <item.icon size={24} />
            </Link>
          ))}
        </nav>
      </div>

      {/* Bottom Section */}
      <div className="flex flex-col items-center gap-6">
        <button className="text-white/70 hover:text-white transition-colors">
          <FiLogOut size={24} className="rotate-180" /> {/* Rotate to match "exit" look if needed */}
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
