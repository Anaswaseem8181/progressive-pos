import { useState, useEffect } from "react";
import { Edit2, Trash2 } from "lucide-react";
import { mergeClasses } from "../../../utils/mergeClasses";
import { ActionDropdown } from "../../ui/ActionDropdown";

const UsersTable = ({ users, onEdit, onDelete, onToggleStatus }) => {
  const [openDropdownId, setOpenDropdownId] = useState(null);

  useEffect(() => {
    const handleClickOutside = () => setOpenDropdownId(null);
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  const formatDate = (dateString) => {
    if (!dateString) return "Never";
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">

      {/* Mobile View: Card Layout */}
      <div className="md:hidden divide-y divide-gray-100">
        {users.length === 0 ? (
          <div className="p-8 text-center text-gray-400 text-sm">
            No staff members found.
          </div>
        ) : (
          users.map((user) => (
            <div key={user._id} className="p-4 flex flex-col gap-3 relative">
              <div className="flex justify-between items-start pr-10">
                <div>
                  <h3 className="font-bold text-gray-900">{user.name}</h3>
                  <p className="text-xs text-gray-500 font-medium mt-0.5">{user.email}</p>
                </div>
                <div className="flex flex-col items-end gap-2">
                  <span className={mergeClasses(
                    "px-2 py-0.5 rounded-full text-[9px] font-bold uppercase",
                    user.status === "active" ? "bg-green-100 text-green-600" : "bg-red-100 text-red-600"
                  )}>
                    {user.status}
                  </span>
                </div>
              </div>

              {/* Action Dropdown (Mobile) */}
              <ActionDropdown
                isOpen={openDropdownId === user._id}
                onToggle={() => setOpenDropdownId(openDropdownId === user._id ? null : user._id)}
                containerClassName="absolute top-4 right-4"
                actions={[
                  {
                    label: user.status === "active" ? "Deactivate" : "Activate",
                    icon: user.status === "active" ? Trash2 : Edit2,
                    onClick: () => onToggleStatus(user._id, user.status),
                    variant: user.status === "active" ? "danger" : "default",
                  },
                  {
                    label: "Edit",
                    icon: Edit2,
                    onClick: () => onEdit(user),
                    variant: "default",
                  },
                  {
                    label: "Delete",
                    icon: Trash2,
                    onClick: () => onDelete(user._id),
                    variant: "danger",
                  },
                ]}
              />

              <div className="flex items-center justify-between mt-2 pt-3 border-t border-gray-50">
                <span className={mergeClasses(
                  "px-2.5 py-1 rounded-full text-[10px] font-bold tracking-wider uppercase",
                  user.role?.toLowerCase() === "admin" ? "bg-blue-50 text-blue-600" :
                    user.role?.toLowerCase() === "manager" ? "bg-purple-50 text-purple-600" : "bg-green-100 text-green-600"
                )}>
                  {user.role}
                </span>
                <span className="text-[10px] text-gray-400">
                  Seen: {formatDate(user.lastLogin)}
                </span>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Desktop View: Table Layout */}
      <div className="hidden md:block overflow-x-auto min-h-[300px]">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50/50 border-b border-gray-100">
              <th className="px-6 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Name</th>
              <th className="px-6 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Role</th>
              <th className="px-6 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest text-center">Status</th>
              <th className="px-6 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest text-center">Last Login</th>
              <th className="px-6 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {users.length === 0 ? (
              <tr>
                <td colSpan="5" className="px-6 py-8 text-center text-gray-400 text-sm">
                  No staff members found.
                </td>
              </tr>
            ) : (
              users.map((user) => (
                <tr key={user._id} className="hover:bg-gray-50/50 transition-colors group">
                  <td className="px-6 py-4">
                    <div className="flex flex-col">
                      <span className="text-sm font-bold text-gray-900">{user.name}</span>
                      <span className="text-xs text-gray-500">{user.email}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={mergeClasses(
                      "px-2.5 py-1 rounded-full text-[10px] font-bold tracking-wider uppercase",
                      user.role?.toLowerCase() === "admin" ? "bg-blue-50 text-blue-600" :
                        user.role?.toLowerCase() === "manager" ? "bg-purple-50 text-purple-600" : "bg-green-100 text-green-600"
                    )}>
                      {user.role}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <button
                      onClick={() => onToggleStatus(user._id, user.status)}
                      className={mergeClasses(
                        "px-3 py-1 rounded-full text-[10px] font-bold uppercase transition-all active:scale-95",
                        user.status === "active" 
                          ? "bg-green-50 text-green-600 hover:bg-green-100" 
                          : "bg-red-50 text-red-600 hover:bg-red-100"
                      )}
                    >
                      {user.status}
                    </button>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span className="text-xs text-gray-500 font-medium">
                      {formatDate(user.lastLogin)}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <ActionDropdown
                      isOpen={openDropdownId === user._id}
                      onToggle={() => setOpenDropdownId(openDropdownId === user._id ? null : user._id)}
                      containerClassName="relative inline-block text-left"
                      actions={[
                        {
                          label: user.status === "active" ? "Deactivate" : "Activate",
                          icon: user.status === "active" ? Trash2 : Edit2,
                          onClick: () => onToggleStatus(user._id, user.status),
                          variant: user.status === "active" ? "danger" : "default",
                        },
                        {
                          label: "Edit",
                          icon: Edit2,
                          onClick: () => onEdit(user),
                          variant: "default",
                        },
                        {
                          label: "Delete",
                          icon: Trash2,
                          onClick: () => onDelete(user._id),
                          variant: "danger",
                        },
                      ]}
                    />
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default UsersTable;
