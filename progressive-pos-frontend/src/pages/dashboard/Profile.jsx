import { motion } from "motion/react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import { useState } from "react";
import {
  User,
  Mail,
  Phone,
  Shield,
  LogOut,
  Store,
  Building2,
} from "lucide-react";
import WarningModal from "../../components/modals/common/WarningModal";
import { notify } from "../../utils/notifications";

const roleConfig = {
  admin: { label: "Administrator", color: "bg-violet-100 text-violet-700 border-violet-200", dot: "bg-violet-500" },
  manager: { label: "Manager", color: "bg-blue-100 text-blue-700 border-blue-200", dot: "bg-blue-500" },
  cashier: { label: "Cashier", color: "bg-emerald-100 text-emerald-700 border-emerald-200", dot: "bg-emerald-500" },
};

const InfoCard = ({ icon: Icon, label, value, accent = false }) => (
  <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl border border-gray-100 hover:border-gray-200 transition-colors">
    <div className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${accent ? "bg-emerald-100 text-emerald-600" : "bg-white text-gray-500 border border-gray-200"}`}>
      <Icon size={18} />
    </div>
    <div className="min-w-0">
      <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-0.5">{label}</p>
      <p className="text-sm font-semibold text-gray-800 truncate">{value || <span className="text-gray-300 font-normal italic">Not set</span>}</p>
    </div>
  </div>
);

const Profile = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  const role = roleConfig[user?.role] || roleConfig.cashier;

  const handleConfirmLogout = () => {
    logout();
    notify.success("Logged out successfully");
    navigate("/login");
  };

  const initials = user?.name
    ? user.name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2)
    : "U";

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-xl space-y-5"
      >
        {/* Page Header */}
        <div className="flex flex-col gap-1 mb-2">
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">My Profile</h1>
          <p className="text-gray-500 text-sm">View your account details and manage your session.</p>
        </div>

        {/* Profile Hero Card */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          {/* Top gradient strip */}
          <div className="h-24 bg-gradient-to-r from-emerald-400 to-emerald-600 relative">
            <div className="absolute -bottom-10 left-6">
              <div className="w-20 h-20 rounded-2xl bg-white border-4 border-white shadow-lg flex items-center justify-center">
                <span className="text-2xl font-black text-emerald-600">{initials}</span>
              </div>
            </div>
          </div>

          <div className="pt-14 pb-6 px-6">
            <div className="flex items-start justify-between gap-3 flex-wrap">
              <div>
                <h2 className="text-xl font-bold text-gray-900">{user?.name}</h2>
                <p className="text-sm text-gray-400 mt-0.5">{user?.email}</p>
              </div>
              {/* Role Badge */}
              <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold border ${role.color}`}>
                <span className={`w-1.5 h-1.5 rounded-full ${role.dot}`} />
                {role.label}
              </span>
            </div>
          </div>
        </div>

        {/* Info Cards */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 space-y-3">
          <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-3">Account Information</p>

          <InfoCard icon={User} label="Full Name" value={user?.name} accent />
          <InfoCard icon={Mail} label="Email Address" value={user?.email} />
          <InfoCard icon={Phone} label="Contact Number" value={user?.personalContactNumber} />
          <InfoCard icon={Shield} label="Role" value={role.label} />
        </div>

        {/* Business Info (readonly) */}
        {(user?.businessName || user?.storeAddress) && (
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 space-y-3">
            <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-3">Business Information</p>
            {user?.businessName && <InfoCard icon={Building2} label="Business Name" value={user.businessName} />}
            {user?.storeAddress && <InfoCard icon={Store} label="Store Address" value={user.storeAddress} />}
          </div>
        )}

        {/* Logout */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
          <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-3">Session</p>
          <button
            onClick={() => setShowLogoutModal(true)}
            className="w-full flex items-center justify-center gap-2.5 py-3 px-4 bg-red-50 hover:bg-red-100 text-red-600 font-semibold rounded-xl border border-red-100 hover:border-red-200 transition-all active:scale-[0.98]"
          >
            <LogOut size={18} />
            <span>Logout from account</span>
          </button>
        </div>
      </motion.div>

      <WarningModal
        isOpen={showLogoutModal}
        onClose={() => setShowLogoutModal(false)}
        onConfirm={handleConfirmLogout}
        title="Confirm Logout"
        message="Are you sure you want to end your session? You will need to login again to access your dashboard."
        confirmText="Logout"
        variant="danger"
      />
    </>
  );
};

export default Profile;
