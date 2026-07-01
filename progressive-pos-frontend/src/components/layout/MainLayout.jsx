import { useState } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "../common/Sidebar";
import Topbar from "../common/Topbar";

const MainLayout = () => {
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [isDesktopCollapsed, setIsDesktopCollapsed] = useState(false);


  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      <Sidebar
        isOpen={isMobileSidebarOpen}
        setIsOpen={setIsMobileSidebarOpen}
        isCollapsed={isDesktopCollapsed}
        onToggle={() => setIsDesktopCollapsed((prev) => !prev)}
      />
      <div className="flex flex-col flex-1 overflow-hidden min-w-0">
        <Topbar onToggleSidebar={() => setIsMobileSidebarOpen((prev) => !prev)} />
        <main className="flex-1 overflow-y-auto p-4 md:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default MainLayout;
