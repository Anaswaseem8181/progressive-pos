import { Menu } from "lucide-react";
import { useAuth } from "../../hooks/useAuth";
import { useLocation } from "react-router-dom";
import { menuItems } from "../../data";

const Topbar = ({ onToggleSidebar }) => {
  const { user } = useAuth();
  const location = useLocation();

  const currentPage = menuItems.find((item) => item.path === location.pathname);

  return (
    <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6 shrink-0">
      <div className="flex items-center gap-4">
        <button
          onClick={onToggleSidebar}
          className="md:hidden p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <Menu size={24} />
        </button>
        <h2 className="text-lg font-semibold text-gray-800">
          {currentPage ? currentPage.name : "Dashboard"}
        </h2>
      </div>

      <div className="flex items-center gap-4">
        <div className="text-right hidden sm:block">
          <p className="text-sm font-medium text-gray-900">{user?.name}</p>
          <p className="text-xs text-gray-500 capitalize">{user?.role}</p>
        </div>
        <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-700 font-bold border border-emerald-200">
          {user?.name?.charAt(0)}
        </div>
      </div>
    </header>
  );
};

export default Topbar;
