import DashboardLayout from '../components/Layout/DashboardLayout';
import OverviewChart from '../components/Dashboard/OverviewChart';
import StatCard from '../components/Dashboard/StatCard';
import ActivityCard from '../components/Dashboard/ActivityCard';
import FriendsList from '../components/Dashboard/FriendsList';
import { MapWidget, BannerCard } from '../components/Dashboard/MapWidget';
import { FiSearch, FiTarget, FiActivity } from 'react-icons/fi';
import { IoMdBicycle } from 'react-icons/io';
import { FaRunning, FaWalking } from 'react-icons/fa';

export default function Home() {
  return (
    <DashboardLayout>
      {/* Header */}
      <div className="mb-8 flex flex-col items-start justify-between gap-4 md:flex-row md:items-center">
        <div>
          <h1 className="text-sm font-medium text-gray-500">Primary</h1>
          <h2 className="text-3xl font-bold text-gray-800">Dashboard</h2>
        </div>

        <div className="flex items-center gap-6">
          <div className="flex items-center gap-3 rounded-2xl bg-white px-4 py-2 shadow-sm">
            <FiSearch className="text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Search"
              className="w-40 bg-transparent text-sm text-gray-600 placeholder-gray-400 outline-none"
            />
          </div>
          <div className="h-10 w-10 overflow-hidden rounded-full border-2 border-white shadow-sm">
            <img src="https://i.pravatar.cc/150?u=user" alt="User Profile" className="h-full w-full object-cover" />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
        {/* Left Main Section - Spans 3 cols */}
        <div className="col-span-1 flex flex-col gap-6 xl:col-span-3">
          {/* Top Row: Overview + Promo Cards */}
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
            {/* Overview Chart - Spans 2 */}
            <div className="lg:col-span-2">
              <OverviewChart />
            </div>
            {/* Promo Cards Column */}
            <div className="flex flex-col justify-between gap-6">
              <BannerCard
                title="Daily Jogging"
                color="#7B6FDF" // Matching the blue-purple
                icon={FaWalking}
                className="h-full min-h-[140px]"
              />
              <BannerCard
                title="My Jogging"
                color="#F472B6" // Matching the pink
                icon={FaRunning}
                className="h-full min-h-[140px]"
              />
            </div>
          </div>

          {/* Bottom Row: Activity Cards */}
          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            <ActivityCard
              title="Bicycle Drill"
              subTitle="36 km / week"
              max={50}
              current={17}
              timeLeft="2 days left"
              icon={IoMdBicycle}
              iconColor="bg-[#7B6FDF]"
            />
            <ActivityCard
              title="Jogging Hero"
              subTitle="12 km / month"
              max={12}
              current={2}
              timeLeft="17 days left"
              icon={FaRunning}
              iconColor="bg-[#F472B6]"
            />
            <ActivityCard
              title="Healthy Busy"
              subTitle="3600 steps / weeks"
              max={3600}
              current={3200}
              timeLeft="3 days left"
              icon={FiTarget}
              iconColor="bg-[#7B6FDF]"
            />
          </div>
        </div>

        {/* Right Sidebar Section - Spans 1 col */}
        <div className="col-span-1 flex flex-col gap-6">
          <FriendsList />
          <MapWidget />
        </div>
      </div>
    </DashboardLayout>
  );
}
