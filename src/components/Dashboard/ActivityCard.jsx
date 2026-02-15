import clsx from 'clsx';
import { FiMoreVertical } from 'react-icons/fi';

const ActivityCard = ({ title, subTitle, max, current, timeLeft, icon: Icon, iconColor }) => {
  const percentage = Math.min(100, Math.max(0, (current / max) * 100));

  return (
    <div className="flex flex-col rounded-3xl bg-white p-6 shadow-sm transition-transform hover:scale-[1.02]">
      <div className="mb-6 flex items-start justify-between">
        <div className={clsx("rounded-full p-3 text-white", iconColor)}>
          {Icon && <Icon size={24} />}
        </div>
        <button className="text-gray-400 hover:text-gray-600">
          <FiMoreVertical size={20} />
        </button>
      </div>

      <div className="mb-4">
        <h3 className="text-lg font-bold text-gray-800">{title}</h3>
        <p className="text-xs text-gray-500">{subTitle}</p>
      </div>

      <div className="space-y-2">
        <div className="flex justify-between text-xs text-gray-500">
          <span>Progress</span>
          <span>{percentage.toFixed(0)}%</span>
        </div>
        <div className="h-2 w-full overflow-hidden rounded-full bg-gray-100">
          <div
            className={clsx("h-full rounded-full transition-all duration-500", iconColor)}
            style={{ width: `${percentage}%` }}
          />
        </div>
      </div>

      <div className="mt-6 flex items-center justify-between">
        <div className="text-xs font-semibold text-gray-400">
          {current} / {max}km
        </div>
        <div className="rounded-full bg-red-50 px-3 py-1 text-xs font-medium text-red-500">
          {timeLeft}
        </div>
      </div>
    </div>
  );
};

export default ActivityCard;
