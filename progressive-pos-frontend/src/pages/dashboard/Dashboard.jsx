import StatsCards from "../../components/dashboard/StatsCards";
import RecentSales from "../../components/dashboard/RecentSales";
import LowStockAlert from "../../components/dashboard/LowStockAlert";
import { motion } from "motion/react";
import { useAuth } from "../../hooks/useAuth";

const Dashboard = () => {
  const { user } = useAuth();

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="space-y-8"
    >
      <div className="flex flex-col gap-1">
        <h1 className="text-3xl font-bold text-gray-900 tracking-tight">
          Welcome back, {user?.name}
        </h1>
        <p className="text-gray-500">
          Here's what's happening with your store today.
        </p>
      </div>

      <StatsCards />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <RecentSales />
        <LowStockAlert />
      </div>
    </motion.div>
  );
};

export default Dashboard;
