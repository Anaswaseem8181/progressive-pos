import { DollarSign, Package, AlertTriangle, Users } from "lucide-react";
import { formatPrice } from "./formatPrice";

export const getDashboardStats = (products, customers, sales, currency = "PKR") => {
  const totalRevenue = sales.reduce((revenueSum, sale) => revenueSum + sale.amount, 0);
  const lowStockCount = products.filter(product => product.stock < 10).length;

  return [
    {
      label: "Total Revenue",
      value: formatPrice(totalRevenue, currency),
      icon: DollarSign,
      color: "text-blue-600",
      bg: "bg-blue-50",
      link: "View all sales",
    },
    {
      label: "Total Products",
      value: products.length.toString(),
      icon: Package,
      color: "text-blue-600",
      bg: "bg-blue-50",
      link: "Manage inventory",
    },
    {
      label: "Low Stock Items",
      value: lowStockCount.toString(),
      icon: AlertTriangle,
      color: "text-orange-600",
      bg: "bg-orange-50",
      link: "Restock needed",
    },
    {
      label: "Active Customers",
      value: customers.length.toString(),
      icon: Users,
      color: "text-purple-600",
      bg: "bg-purple-50",
      link: "View customers",
    },
  ];
};
