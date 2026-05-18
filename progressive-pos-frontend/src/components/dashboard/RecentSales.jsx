import { useSales } from "../../hooks/useSales";
import { useCurrency } from "../../hooks/useCurrency";

const RecentSales = () => {
  const { sales } = useSales();
  const { formatCurrency } = useCurrency();

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
      <h3 className="text-lg font-bold text-gray-900 mb-6">Recent Sales</h3>
      <div className="space-y-6">
        {sales.map((sale) => (
          <div key={sale.id} className="flex items-center justify-between group">
            <div className="flex flex-col">
              <span className="text-sm font-bold text-gray-800 group-hover:text-emerald-600 transition-colors">
                {sale.customer}
              </span>
              <span className="text-xs text-gray-400 font-medium">{sale.date}</span>
            </div>
            <span className="text-sm font-bold text-emerald-600">{formatCurrency(sale.amount)}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RecentSales;
