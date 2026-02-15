import clsx from 'clsx';
import { FiArrowUpRight } from 'react-icons/fi';

const StatCard = ({ title, value, subValue, icon: Icon, color, className, trend }) => {
  return (
    <div className={clsx("relative overflow-hidden rounded-3xl p-6 text-white transition-transform hover:scale-[1.02]", className)} style={{ background: color }}>
      <div className="relative z-10 flex h-full flex-col justify-between">
        <div className="flex items-start justify-between">
          <div className="rounded-full bg-white/20 p-3 backdrop-blur-sm">
            {Icon && <Icon size={24} className="text-white" />}
          </div>
          {trend && (
            <div className="flex items-center gap-1 rounded-full bg-white/20 px-2 py-1 text-xs font-medium backdrop-blur-sm">
              <FiArrowUpRight />
              <span>{trend}</span>
            </div>
          )}
        </div>

        <div className="mt-4">
          <h3 className="text-lg font-medium opacity-90">{title}</h3>
          <div className="mt-1 flex items-baseline gap-2">
            <span className="text-3xl font-bold">{value}</span>
            <span className="text-sm opacity-75">{subValue}</span>
          </div>
        </div>
      </div>

      {/* Decorative circles */}
      <div className="absolute -right-4 -top-4 h-24 w-24 rounded-full bg-white/10 blur-2xl" />
      <div className="absolute -bottom-4 -left-4 h-32 w-32 rounded-full bg-white/10 blur-2xl" />
    </div>
  );
};

export default StatCard;
