import { useProducts } from "../../hooks/useProducts";

const LowStockAlert = () => {
  const { getLowStockProducts } = useProducts();
  const lowStockProducts = getLowStockProducts();

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
      <h3 className="text-lg font-bold text-gray-900 mb-6">Low Stock Alerts</h3>
      <div className="space-y-6">
        {lowStockProducts.map((product) => (
          <div key={product.id} className="flex items-center justify-between">
            <div className="flex flex-col">
              <span className="text-sm font-bold text-gray-800">{product.name}</span>
              <span className="text-xs text-gray-400 font-medium">{product.category}</span>
            </div>
            <div className="text-right">
              <span className="text-sm font-bold text-orange-600">{product.stock} left</span>
              <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">
                Threshold: 10
              </p>
            </div>
          </div>
        ))}
        {lowStockProducts.length === 0 && (
          <p className="text-sm text-gray-400 italic">No low stock items found.</p>
        )}
      </div>
    </div>
  );
};

export default LowStockAlert;
