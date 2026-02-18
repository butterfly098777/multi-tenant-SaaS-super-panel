import Sidebar from '../Sidebar/Sidebar';

const DashboardLayout = ({ children }) => {
  return (
    <div className="flex h-screen w-full overflow-hidden bg-[#F3F4F6]">
      <Sidebar />
      <main className="flex-1 overflow-y-auto p-4 lg:p-8">
        {children}
      </main>
    </div>
  );
};

export default DashboardLayout;
