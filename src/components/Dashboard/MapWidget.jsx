import { FiMapPin, FiNavigation } from 'react-icons/fi';
import clsx from 'clsx';

export const MapWidget = () => {
  return (
    <div className="relative h-full min-h-[200px] w-full overflow-hidden rounded-3xl bg-gray-100 p-6 shadow-sm">
      <div className="absolute inset-0 z-0 opacity-50 bg-[url('https://api.mapbox.com/styles/v1/mapbox/streets-v11/static/-0.09,51.505,12,0/600x600?access_token=Pk.xyz')] bg-cover bg-center">
        {/* Mock map background using CSS pattern if image fails */}
        <div className="h-full w-full bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:16px_16px]"></div>
      </div>

      <div className="absolute top-6 left-6 z-10">
        <h3 className="flex items-center gap-2 text-lg font-bold text-gray-800">
          <FiMapPin className="text-[#5B4DBC]" /> Live map
        </h3>
      </div>

      <button className="absolute right-6 top-6 z-10 text-xs font-medium text-gray-500 hover:text-gray-800">View</button>

      {/* Mock Location Pin */}
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 transform rounded-full bg-white p-2 shadow-lg">
        <div className="rounded-full bg-[#FF754C] p-2 text-white">
          <FiNavigation size={16} />
        </div>
      </div>
      <div className="absolute left-[60%] top-[40%] h-8 w-8 rounded-full border-2 border-white bg-gray-800 bg-[url('https://i.pravatar.cc/150?u=1')] bg-cover"></div>
      <div className="absolute left-[40%] top-[60%] h-8 w-8 rounded-full border-2 border-white bg-gray-800 bg-[url('https://i.pravatar.cc/150?u=2')] bg-cover"></div>
    </div>
  );
};

export const BannerCard = ({ title, icon: Icon, color, className }) => {
  return (
    <div className={clsx("relative flex items-center justify-between overflow-hidden rounded-3xl p-6 text-white shadow-md transition-transform hover:scale-[1.02]", className)} style={{ background: color }}>
      <div className="relative z-10 flex items-center gap-4">
        <div className="rounded-2xl bg-white/20 p-3 backdrop-blur-md">
          {Icon && <Icon size={24} />}
        </div>
        <div>
          <span className="block text-lg font-semibold">{title}</span>
        </div>
      </div>

      {/* Decorative circles */}
      <div className="absolute -right-8 -top-8 h-32 w-32 rounded-full bg-white/10 blur-2xl" />
    </div>
  );
};
