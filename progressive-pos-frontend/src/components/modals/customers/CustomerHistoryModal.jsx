import React, { useMemo } from "react";
import { X, Calendar, ShoppingBag, Receipt, ArrowUpRight } from "lucide-react";
import { sales } from "../../../data";
import { useCurrency } from "../../../hooks/useCurrency";

export const CustomerHistoryModal = ({ isOpen, onClose, customer }) => {
  const { formatCurrency } = useCurrency();

  const hasCustomer = Boolean(customer);
  const isVisible = isOpen && hasCustomer;

  const customerHistory = useMemo(() => {
    if (!customer) return [];
    return sales.filter((sale) => sale.customer === customer.name);
  }, [customer, sales]);

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-300">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden flex flex-col max-h-[85vh]">

        <div className="p-6 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
          <div>
            <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
              <ShoppingBag size={20} className="text-emerald-500" />
              Purchase History
            </h2>
            <p className="text-sm text-gray-500 mt-1">
              Showing recent transactions for{" "}
              <span className="font-bold text-gray-700">
                {customer.name}
              </span>
            </p>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        <div className="p-6 overflow-y-auto flex-1 bg-gray-50/30">
          {customerHistory.length === 0 ? (
            <div className="text-center py-12 flex flex-col items-center justify-center">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center text-gray-400 mb-4">
                <Receipt size={24} />
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-1">
                No Purchase History
              </h3>
              <p className="text-gray-500 text-sm">
                This customer hasn't made any purchases yet.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {customerHistory.map((sale) => (
                <div
                  key={sale.id}
                  className="bg-white rounded-xl border border-gray-100 shadow-sm p-4 hover:shadow-md transition-shadow"
                >
                  <div className="flex items-start justify-between mb-3 border-b border-gray-50 pb-3">
                    <div className="flex items-center gap-2 text-sm text-gray-500 font-medium">
                      <Calendar size={14} />
                      {sale.date}
                    </div>

                    <div className="flex items-center gap-1 text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-md">
                      <ArrowUpRight size={12} />
                      {formatCurrency(sale.amount)}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider">
                      Items Purchased
                    </h4>

                    <ul className="space-y-1">
                      {sale.items.map((item, index) => (
                        <li
                          key={index}
                          className="flex items-center justify-between text-sm"
                        >
                          <span className="text-gray-700 font-medium">
                            <span className="text-gray-400 mr-2">
                              {item.qty}x
                            </span>
                            {item.name}
                          </span>

                          <span className="text-gray-900 font-semibold">
                            {formatCurrency(item.price)}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="mt-4 pt-3 border-t border-gray-50 flex items-center justify-between text-xs text-gray-400">
                    <span>Order #{sale.id}</span>
                    <span>
                      Processed by:{" "}
                      <span className="font-medium text-gray-600">
                        {sale.billedBy.split(" ")[0]}
                      </span>
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="p-4 border-t border-gray-100 bg-white">
          <button
            onClick={onClose}
            className="w-full px-4 py-2.5 bg-gray-100 text-gray-700 font-bold rounded-xl hover:bg-gray-200 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};