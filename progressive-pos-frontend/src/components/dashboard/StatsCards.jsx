import { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useProducts } from "../../hooks/useProducts";
import { useCustomers } from "../../hooks/useCustomers";
import { useSales } from "../../hooks/useSales";
import { getDashboardStats } from "../../utils/getDashboardStats";
import { useCurrency } from "../../hooks/useCurrency";

const StatsCards = () => {
  const navigate = useNavigate();
  const { products, fetchProducts } = useProducts();
  const { customers } = useCustomers();
  const { getTotalRevenue } = useSales();
  const { currency } = useCurrency();
  const stats = getDashboardStats(products, customers, getTotalRevenue(), currency);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {stats.map((stat, index) => (
        <div
          key={index}
          className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm hover:shadow-md transition-shadow"
        >
          <div className="flex items-start justify-between mb-4">
            <div>
              <p className="text-sm font-medium text-gray-500 mb-1">{stat.label}</p>
              <h3 className="text-2xl font-bold text-gray-900">{stat.value}</h3>
            </div>
            <div className={`${stat.bg} ${stat.color} p-3 rounded-xl`}>
              <stat.icon size={24} />
            </div>
          </div>
          {stat.path ? (
            <Link 
              to={stat.path}
              className="text-xs font-bold text-emerald-600 hover:text-emerald-700 flex items-center gap-1 cursor-pointer"
            >
              <span className="mr-1">›</span> {stat.link}
            </Link>
          ) : (
            <span className="text-xs font-bold text-gray-400 flex items-center gap-1">
              <span className="mr-1">›</span> {stat.link}
            </span>
          )}
        </div>
      ))}
    </div>
  );
};

export default StatsCards;