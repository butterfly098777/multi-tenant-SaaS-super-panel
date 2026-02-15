import Sidebar from '../Sidebar/Sidebar';

const DashboardLayout = ({ children }) => {
  return (
    <div className="flex h-screen w-full items-center justify-center bg-[#D6D9E0] p-4 lg:p-8">
      <div className="flex h-[90vh] w-full max-w-[1400px] overflow-hidden rounded-[40px] bg-[#F3F4F6] shadow-2xl ring-8 ring-white/50">
        <Sidebar />
        <main className="flex-1 overflow-y-auto p-8">
          {children}
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
