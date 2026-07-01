import { useState, useCallback, useEffect } from "react";
import orderService from "../api/orderService";
import { notify } from "../utils/notifications";

export const useSales = () => {
  const [sales, setSales] = useState([]);
  const [stats, setStats] = useState({ totalRevenue: 0, totalOrders: 0 });
  const [isLoading, setIsLoading] = useState(false);

  const fetchOrders = useCallback(async (limit = 20) => {
    setIsLoading(true);
    try {
      const response = await orderService.getOrders(limit);
      if (response.success) {
        setSales(response.data);
      }
    } catch (err) {
      notify.error(err.response?.data?.message || "Failed to load sales");
    } finally {
      setIsLoading(false);
    }
  }, []);

  const fetchStats = useCallback(async () => {
    try {
      const response = await orderService.getOrderStats();
      if (response.success) {
        setStats(response.data);
      }
    } catch (err) {
      console.error("Failed to load order stats:", err);
    }
  }, []);

  useEffect(() => {
    fetchOrders();
    fetchStats();
  }, [fetchOrders, fetchStats]);

  const getTotalRevenue = () => stats.totalRevenue;

  const refreshSales = () => {
    fetchOrders();
    fetchStats();
  };

  return {
    sales,
    stats,
    isLoading,
    getTotalRevenue,
    refreshSales,
  };
};
