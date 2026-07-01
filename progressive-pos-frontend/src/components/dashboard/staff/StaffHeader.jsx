import React from "react";
import { Plus } from "lucide-react";

const UsersHeader = ({ businessName, onAddStaff }) => {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Staff Management</h1>
        <p className="text-gray-500 text-sm">Manage staff accounts for {businessName}.</p>
      </div>
      <button
        onClick={onAddStaff}
        className="bg-emerald-500 text-white px-5 py-2.5 rounded-xl font-bold text-sm flex items-center gap-2 hover:bg-emerald-600 transition-all shadow-lg shadow-emerald-100 active:scale-[0.98]"
      >
        <Plus size={18} />
        Add Staff
      </button>
    </div>
  );
};

export default UsersHeader;
