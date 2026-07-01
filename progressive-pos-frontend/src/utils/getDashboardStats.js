import { Wallet, Package, PackageMinus, Users } from "lucide-react";
import { formatPrice } from "./formatPrice";

export const getDashboardStats = (products, customers, totalRevenue, currency = "PKR") => {
  // Low stock: any product where any variant stock is < 10
  const lowStockCount = products.filter((product) =>
    product.variants?.some((v) => v.stock < 10)
  ).length;

  return [
    {
      label: "Total Revenue",
      value: formatPrice(totalRevenue, currency),
      icon: Wallet,
      color: "text-blue-600",
      bg: "bg-blue-50",
      link: "View all sales",
      path: "/reports",
      allowedRoles: ["admin", "manager"],
    },
    {
      label: "Total Products",
      value: products.length.toString(),
      icon: Package,
      color: "text-blue-600",
      bg: "bg-blue-50",
      link: "Manage inventory",
      path: "/inventory",
      allowedRoles: ["admin"],
    },
    {
      label: "Low Stock Items",
      value: lowStockCount.toString(),
      icon: PackageMinus,
      color: "text-orange-600",
      bg: "bg-orange-50",
      link: "Restock needed",
      path: "/inventory",
      allowedRoles: ["admin"],
    },
    {
      label: "Active Customers",
      value: customers.length.toString(),
      icon: Users,
      color: "text-purple-600",
      bg: "bg-purple-50",
      link: "View customers",
      path: "/customers",
      allowedRoles: ["admin", "manager", "cashier"],
    },
  ];
};

