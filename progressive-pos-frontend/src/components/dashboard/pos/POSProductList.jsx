import React, { useState } from "react";
import { Search, Plus, X, ShoppingBag } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { mergeClasses } from "../../../utils/mergeClasses";
import { filterProducts } from "../../../utils/filterProducts";

// Mini modal: shown when user taps a product with multiple variants
const VariantPicker = ({ product, formatCurrency, onSelect, onClose }) => {
  const totalStock = product.variants?.reduce((s, v) => s + v.stock, 0) ?? 0;
  return (
    <div className="fixed inset-0 z-[80] flex items-end sm:items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-in fade-in duration-200">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-2xl shadow-2xl w-full max-w-xs overflow-hidden"
      >
        <div className="p-4 border-b border-gray-100 flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-gray-900">{product.name}</h3>
            <p className="text-xs text-gray-400 mt-0.5">{formatCurrency(product.price)} · {totalStock} in stock</p>
          </div>
          <button onClick={onClose} className="p-1.5 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100 transition-colors">
            <X size={16} />
          </button>
        </div>
        <div className="p-4 space-y-2">
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Select Size</p>
          {product.variants?.map((variant) => {
            const isOut = variant.stock === 0;
            const isLow = variant.stock > 0 && variant.stock < 5;
            return (
              <button
                key={variant._id}
                onClick={() => !isOut && onSelect(variant)}
                disabled={isOut}
                className={mergeClasses(
                  "w-full flex items-center justify-between px-4 py-3 rounded-xl border-2 transition-all font-semibold text-sm",
                  isOut
                    ? "border-gray-100 bg-gray-50 text-gray-300 cursor-not-allowed"
                    : "border-gray-200 hover:border-emerald-400 hover:bg-emerald-50 text-gray-800 active:scale-[0.98]"
                )}
              >
                <span className="font-bold">{variant.size}</span>
                <span className={mergeClasses(
                  "text-xs font-semibold",
                  isOut ? "text-gray-300" : isLow ? "text-orange-500" : "text-gray-400"
                )}>
                  {isOut ? "Out of stock" : isLow ? `${variant.stock} left ⚠️` : `${variant.stock} left`}
                </span>
              </button>
            );
          })}
        </div>
      </motion.div>
    </div>
  );
};

const POSProductGrid = ({ products, search, onSearchChange, onAddToCart, formatCurrency }) => {
  const [pickerProduct, setPickerProduct] = useState(null);

  const handleCardClick = (product) => {
    const variants = product.variants || [];
    const available = variants.filter((v) => v.stock > 0);
    if (available.length === 0) return; // out of stock
    if (available.length === 1) {
      // Only 1 variant available — add directly
      onAddToCart(product, available[0]);
    } else {
      // Multiple variants — show picker
      setPickerProduct(product);
    }
  };

  const handleVariantSelect = (variant) => {
    onAddToCart(pickerProduct, variant);
    setPickerProduct(null);
  };

  const filteredProducts = filterProducts(products, search);

  return (
    <div className="flex-1 flex flex-col gap-6">
      {/* Search */}
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
          <Search size={20} />
        </div>
        <input
          type="text"
          placeholder="Search products by name or category..."
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          className="w-full pl-10 pr-4 py-3 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all shadow-sm"
        />
      </div>

      {/* Product grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 overflow-y-auto pr-2 custom-scrollbar">
        {filteredProducts.map((product) => {
          const totalStock = product.variants?.reduce((s, v) => s + v.stock, 0) ?? 0;
          const isOutOfStock = totalStock === 0;
          const hasVariants = (product.variants?.length ?? 0) > 1;

          return (
            <motion.div
              key={product._id || product.id}
              whileHover={!isOutOfStock ? { y: -2 } : {}}
              className={mergeClasses(
                "bg-white rounded-xl border shadow-sm p-3.5 flex flex-col justify-between transition-all",
                isOutOfStock ? "border-gray-100 opacity-50 cursor-not-allowed" : "border-gray-100 cursor-pointer"
              )}
            >
              <div>
                <span className="text-[10px] font-bold text-emerald-600 uppercase tracking-widest mb-0.5 block">
                  {product.categoryId?.name || product.category}
                </span>
                <h3 className="text-sm font-bold text-gray-900 line-clamp-1">{product.name}</h3>
                <p className="text-base font-bold text-gray-900 mt-0.5">{formatCurrency(product.price)}</p>
              </div>

              <div className="mt-4 flex items-center justify-between">
                <div className="flex flex-col gap-0.5">
                  <span className={mergeClasses(
                    "text-[10px] font-medium",
                    totalStock < 10 ? "text-orange-600" : "text-gray-400"
                  )}>
                    {totalStock} left
                  </span>
                  {hasVariants && (
                    <span className="text-[9px] text-gray-300 font-medium">
                      {product.variants?.length} sizes
                    </span>
                  )}
                </div>

                <button
                  onClick={() => handleCardClick(product)}
                  disabled={isOutOfStock}
                  className={mergeClasses(
                    "w-8 h-8 rounded-lg flex items-center justify-center transition-all active:scale-95",
                    isOutOfStock
                      ? "bg-gray-100 text-gray-300 cursor-not-allowed"
                      : hasVariants
                      ? "bg-blue-50 text-blue-600 hover:bg-blue-500 hover:text-white"
                      : "bg-emerald-50 text-emerald-600 hover:bg-emerald-500 hover:text-white"
                  )}
                  title={hasVariants ? "Select size" : "Add to cart"}
                >
                  {hasVariants ? <ShoppingBag size={15} /> : <Plus size={16} />}
                </button>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Variant Picker Modal */}
      <AnimatePresence>
        {pickerProduct && (
          <VariantPicker
            product={pickerProduct}
            formatCurrency={formatCurrency}
            onSelect={handleVariantSelect}
            onClose={() => setPickerProduct(null)}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default POSProductGrid;
