import { FiMoreHorizontal } from 'react-icons/fi';

const friendsData = [
  { name: 'Max Stone', activity: 'Weekly Bicycle', time: '10 min ago', avatar: 'https://i.pravatar.cc/150?u=1' },
  { name: 'Grisha Jack', activity: 'Slow Jogging', time: '22 min ago', avatar: 'https://i.pravatar.cc/150?u=2' },
  { name: 'Levi Patrick', activity: 'Morning Swim', time: '52 min ago', avatar: 'https://i.pravatar.cc/150?u=3' },
  { name: 'Cody Bryan', activity: 'Quick Sprint', time: '57 min ago', avatar: 'https://i.pravatar.cc/150?u=4' },
  { name: 'Max Stone', activity: 'Hiking', time: '1 hour ago', avatar: 'https://i.pravatar.cc/150?u=5' },
];

const FriendsList = () => {
  return (
    <div className="rounded-3xl bg-white p-6 shadow-sm">
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <h3 className="text-lg font-bold text-gray-800">Friends</h3>
        </div>
        <button className="text-xs font-medium text-gray-400 hover:text-gray-600">View All</button>
      </div>

      <div className="mb-6 flex gap-2 rounded-xl bg-gray-100 p-1">
        <button className="flex-1 rounded-lg bg-[#5B4DBC] py-2 text-xs font-medium text-white shadow-sm transition-all">Activities</button>
        <button className="flex-1 rounded-lg py-2 text-xs font-medium text-gray-500 hover:bg-white hover:shadow-sm transition-all">Online</button>
      </div>

      <div className="flex flex-col gap-6">
        {friendsData.map((friend, index) => (
          <div key={index} className="flex items-center justify-between group cursor-pointer">
            <div className="flex items-center gap-4">
              <img src={friend.avatar} alt={friend.name} className="h-10 w-10 rounded-full object-cover ring-2 ring-transparent group-hover:ring-[#5B4DBC] transition-all" />
              <div>
                <h4 className="text-sm font-bold text-gray-800">{friend.name}</h4>
                <p className="text-xs text-gray-500">{friend.activity}</p>
              </div>
            </div>
            <span className="text-xs text-gray-400">{friend.time}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FriendsList;
