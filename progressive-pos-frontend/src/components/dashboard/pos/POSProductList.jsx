import React from "react";
import { Search, Plus } from "lucide-react";
import { motion } from "motion/react";
import { mergeClasses } from "../../../utils/mergeClasses";
import { filterProducts } from "../../../utils/filterProducts";

const POSProductGrid = ({
  products,
  search,
  onSearchChange,
  onAddToCart,
  formatCurrency
}) => {
  return (
    <div className="flex-1 flex flex-col gap-6">
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
          <Search size={20} />
        </div>
        <input
          type="text"
          placeholder="Search products by name or category..."
          value={search}
          onChange={(event) => onSearchChange(event.target.value)}
          className="w-full pl-10 pr-4 py-3 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all shadow-sm"
        />
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 overflow-y-auto pr-2 custom-scrollbar">
        {filterProducts(products, search).map((product) => (
          <motion.div
            key={product.id}
            whileHover={{ y: -2 }}
            className="bg-white rounded-xl border border-gray-100 shadow-sm p-3.5 flex flex-col justify-between"
          >
            <div>
              <span className="text-[10px] font-bold text-emerald-600 uppercase tracking-widest mb-0.5 block">
                {product.category}
              </span>
              <h3 className="text-sm font-bold text-gray-900 line-clamp-1">
                {product.name}
              </h3>
              <p className="text-base font-bold text-gray-900 mt-0.5">
                {formatCurrency(product.price)}
              </p>
            </div>
            <div className="mt-4 flex items-center justify-between">
              <span
                className={mergeClasses(
                  "text-[10px] font-medium",
                  product.stock < 10 ? "text-orange-600" : "text-gray-400",
                )}
              >
                {product.stock} left
              </span>
              <button
                onClick={() => onAddToCart(product)}
                className="w-8 h-8 bg-emerald-50 text-emerald-600 rounded-lg flex items-center justify-center hover:bg-emerald-500 hover:text-white transition-all active:scale-95"
              >
                <Plus size={16} />
              </button>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default POSProductGrid;
