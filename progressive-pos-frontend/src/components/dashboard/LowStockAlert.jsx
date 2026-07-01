import { useEffect } from "react";
import { useProducts } from "../../hooks/useProducts";

const LowStockAlert = () => {
  const { products, fetchProducts, loadingActive } = useProducts();

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  // Collect all individual low-stock variants (stock < 10)
  const lowStockItems = products.flatMap((product) =>
    (product.variants || [])
      .filter((v) => v.stock < 10)
      .map((v) => ({
        productId: product._id,
        productName: product.name,
        size: v.size,
        stock: v.stock,
      }))
  );

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
      <h3 className="text-lg font-bold text-gray-900 mb-6">Low Stock Alerts</h3>

      {loadingActive && (
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="flex items-center justify-between animate-pulse">
              <div className="space-y-1.5">
                <div className="h-3 w-32 bg-gray-100 rounded" />
                <div className="h-2.5 w-16 bg-gray-100 rounded" />
              </div>
              <div className="h-3 w-12 bg-gray-100 rounded" />
            </div>
          ))}
        </div>
      )}

      {!loadingActive && lowStockItems.length === 0 && (
        <p className="text-sm text-gray-400 italic">No low stock items found.</p>
      )}

      {!loadingActive && lowStockItems.length > 0 && (
        <div className="space-y-5">
          {lowStockItems.map((item, idx) => (
            <div key={`${item.productId}-${item.size}-${idx}`} className="flex items-center justify-between">
              <div className="flex flex-col">
                <span className="text-sm font-bold text-gray-800">{item.productName}</span>
                <span className="text-xs text-gray-400 font-medium">Size: {item.size}</span>
              </div>
              <div className="text-right">
                <span className={`text-sm font-bold ${item.stock === 0 ? "text-red-600" : "text-orange-600"}`}>
                  {item.stock === 0 ? "Out of stock" : `${item.stock} left`}
                </span>
                <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">
                  Threshold: 10
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default LowStockAlert;

