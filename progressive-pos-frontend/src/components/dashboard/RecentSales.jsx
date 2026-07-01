import { useSales } from "../../hooks/useSales";
import { useCurrency } from "../../hooks/useCurrency";

const RecentSales = () => {
  const { sales, isLoading } = useSales();
  const { formatCurrency } = useCurrency();
  const recentSales = sales.slice(0, 8);

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
      <h3 className="text-lg font-bold text-gray-900 mb-6">Recent Sales</h3>

      {isLoading && (
        <div className="space-y-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="flex items-center justify-between animate-pulse">
              <div className="space-y-1.5">
                <div className="h-3 w-28 bg-gray-100 rounded" />
                <div className="h-2.5 w-20 bg-gray-100 rounded" />
              </div>
              <div className="h-3 w-16 bg-gray-100 rounded" />
            </div>
          ))}
        </div>
      )}

      {!isLoading && recentSales.length === 0 && (
        <p className="text-sm text-gray-400 italic">No sales recorded yet.</p>
      )}

      {!isLoading && recentSales.length > 0 && (
        <div className="space-y-5">
          {recentSales.map((sale) => {
            const customerName = sale.customerId?.name || "Walk-in Customer";
            const date = new Date(sale.createdAt).toLocaleString();
            return (
              <div key={sale._id} className="flex items-center justify-between group">
                <div className="flex flex-col">
                  <span className="text-sm font-bold text-gray-800 group-hover:text-emerald-600 transition-colors">
                    {customerName}
                  </span>
                  <span className="text-xs text-gray-400 font-medium">{date}</span>
                </div>
                <span className="text-sm font-bold text-emerald-600">
                  {formatCurrency(sale.totalAmount)}
                </span>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default RecentSales;

