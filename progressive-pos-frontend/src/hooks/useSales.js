import { useState, useMemo, useEffect } from "react";
import { mockDb } from "../utils/mockDb";
import { topSelling as initialTopSelling } from "../data";

export const useSales = () => {
  const [sales, setSales] = useState([]);
  const topSelling = useMemo(() => initialTopSelling, []);

  const refreshSales = () => {
    const data = mockDb.getSales();
    setSales(data);
  };

  useEffect(() => {
    refreshSales();
  }, []);

  const getRecentSales = (limit = 5) => {
    return [...sales].slice(0, limit);
  };

  const getTotalRevenue = () => {
    return sales.reduce((revenueSum, sale) => revenueSum + (sale.amount || 0), 0);
  };

  return {
    sales,
    topSelling,
    getRecentSales,
    getTotalRevenue,
    refreshSales
  };
};
