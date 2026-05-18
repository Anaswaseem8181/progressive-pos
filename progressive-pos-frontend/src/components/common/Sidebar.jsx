import { useState, useMemo } from "react";
import { NavLink } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import { menuItems } from "../../data";
import * as Icons from "lucide-react";
import { mergeClasses } from "../../utils/mergeClasses";
import { LogOut, ShoppingCart, X, Menu } from "lucide-react";
import WarningModal from "../modals/common/WarningModal";
import { notify } from "../../utils/notifications";

const Sidebar = ({ isOpen, setIsOpen, isCollapsed, onToggle }) => {
  const { user, logout } = useAuth();
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  const handleConfirmLogout = () => {
    logout();
    notify.success("Logged out successfully");
  };

  const filteredMenuItems = useMemo(() => {
    if (!user?.role) return [];
    return menuItems.filter((item) => item.roles.includes(user.role));
  }, [user?.role]);

  return (
    <>
      <aside
        className={mergeClasses(
          "fixed top-0 left-0 h-full bg-white border-r border-gray-200 flex flex-col transition-all duration-300 z-40",
          isOpen ? "translate-x-0" : "-translate-x-full",
          "md:translate-x-0 md:relative md:z-auto",
          isCollapsed ? "md:w-20" : "md:w-64",
          "w-64"
        )}
      >
        {/* Header */}
        <div className={mergeClasses(
          "flex justify-between items-center border-b border-gray-100 transition-all duration-300 h-16",
          isCollapsed ? "md:justify-center px-4" : "justify-between px-5"
        )}>
          {/* Desktop: hamburger collapse button */}
          <button
            onClick={onToggle}
            className="hidden md:flex p-2 text-gray-400 hover:text-gray-700 rounded-lg hover:bg-gray-100 transition-colors flex-shrink-0"
            title={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            <Menu size={20} />

          </button>
          <div className={mergeClasses(
            "flex items-center gap-3 overflow-hidden",
            isCollapsed ? "md:hidden" : ""
          )}>
            <div className="w-9 h-9 flex-shrink-0 bg-emerald-500 rounded-lg flex items-center justify-center text-white">
              <ShoppingCart size={20} />
            </div>
            <h1 className="text-base font-bold text-gray-900 tracking-tight whitespace-nowrap">
              {user?.businessName || "Progressive POS"}
            </h1>
          </div>

          {/* Mobile: close button */}
          <button
            onClick={() => setIsOpen(false)}
            className="md:hidden p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-3 space-y-1 mt-4 overflow-y-auto">
          {filteredMenuItems.map((item) => {
            const IconComponent = Icons[item.icon];
            return (
              <NavLink
                key={item.path}
                to={item.path}
                title={isCollapsed ? item.name : undefined}
                className={({ isActive }) =>
                  mergeClasses(
                    "flex items-center gap-3 px-3 py-3 rounded-lg text-sm font-medium transition-all duration-200",
                    isCollapsed ? "md:justify-center md:px-0" : "",
                    isActive
                      ? "bg-emerald-500 text-white shadow-md shadow-emerald-100"
                      : "text-gray-600 hover:bg-gray-50 hover:text-emerald-600"
                  )
                }
                onClick={() => setIsOpen(false)}
              >
                {IconComponent && <IconComponent size={20} className="flex-shrink-0" />}
                <span className={mergeClasses(
                  "whitespace-nowrap transition-all duration-300 overflow-hidden",
                  isCollapsed ? "md:hidden" : "block"
                )}>
                  {item.name}
                </span>
              </NavLink>
            );
          })}
        </nav>

        {/* User Info & Logout */}
        <div className="p-3 border-t border-gray-100">
          {/* User info - hide when collapsed */}
          <div className={mergeClasses(
            "px-3 py-3 mb-1 transition-all duration-300",
            isCollapsed ? "md:hidden" : "block"
          )}>
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">User</p>
            <p className="text-sm font-semibold text-gray-900">{user?.name}</p>
            <p className="text-xs text-emerald-600 font-medium capitalize">{user?.role}</p>
          </div>

          {/* Logout button */}
          <button
            onClick={() => setShowLogoutModal(true)}
            title={isCollapsed ? "Logout" : undefined}
            className={mergeClasses(
              "w-full flex items-center gap-3 px-3 py-3 rounded-lg text-sm font-medium text-red-600 hover:bg-red-50 transition-colors",
              isCollapsed ? "md:justify-center md:px-0" : ""
            )}
          >
            <LogOut size={20} className="flex-shrink-0" />
            <span className={mergeClasses(
              "whitespace-nowrap transition-all duration-300 overflow-hidden",
              isCollapsed ? "md:hidden" : "block"
            )}>
              Logout
            </span>
          </button>
        </div>
      </aside>

      <WarningModal
        isOpen={showLogoutModal}
        onClose={() => setShowLogoutModal(false)}
        onConfirm={handleConfirmLogout}
        title="Confirm Logout"
        message="Are you sure you want to end your session? You will need to login again to access your dashboard."
        confirmText="Logout"
        variant="danger"
      />

      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/30 z-30 md:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}
    </>
  );
};

export default Sidebar;