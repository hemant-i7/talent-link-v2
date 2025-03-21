import ManagerSidebar from "@/components/ManagerSidebar";
import Sidebar from "@/components/Sidebar";
import { FloatingNavDemo } from "@/components/ui/Navbar";


const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div>
      <div className="h-full relative">
        <div className="z-20  flex justify-end">

        </div>
        <div className="hidden h-full  md:flex md:w-80 md:flex-col md:fixed md:inset-y-0 z-80 bg-gray-600">
        <Sidebar/>
        </div>
        <main className="md:pl-72 ml-8 pb-10">
         
          {children}
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
