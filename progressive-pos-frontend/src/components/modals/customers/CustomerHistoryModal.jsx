import React, { useState, useEffect } from "react";
import { X, Calendar, ShoppingBag, Receipt, ArrowUpRight } from "lucide-react";
import orderService from "../../../api/orderService";
import { useCurrency } from "../../../hooks/useCurrency";
import { notify } from "../../../utils/notifications";

export const CustomerHistoryModal = ({ isOpen, onClose, customer }) => {
  const { formatCurrency } = useCurrency();
  const [customerHistory, setCustomerHistory] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const hasCustomer = Boolean(customer);
  const isVisible = isOpen && hasCustomer;

  useEffect(() => {
    if (isVisible && customer) {
      const fetchHistory = async () => {
        setIsLoading(true);
        try {
          // Pass limit 50, and customerId
          const res = await orderService.getOrders(50, customer._id || customer.id);
          if (res.success) {
            setCustomerHistory(res.data);
          }
        } catch (error) {
          notify.error("Failed to load purchase history");
        } finally {
          setIsLoading(false);
        }
      };
      fetchHistory();
    }
  }, [isVisible, customer]);

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
          {isLoading ? (
             <div className="space-y-4">
               {[...Array(2)].map((_, i) => (
                 <div key={i} className="p-6 bg-white rounded-xl animate-pulse">
                   <div className="h-4 w-32 bg-gray-200 rounded mb-3" />
                   <div className="h-3 w-48 bg-gray-100 rounded" />
                 </div>
               ))}
             </div>
          ) : customerHistory.length === 0 ? (
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
              {customerHistory.map((sale, index) => (
                <div
                  key={sale._id}
                  className="bg-white rounded-xl border border-gray-100 shadow-sm p-4 hover:shadow-md transition-shadow"
                >
                  <div className="flex items-start justify-between mb-3 border-b border-gray-50 pb-3">
                    <div className="flex items-center gap-2 text-sm text-gray-500 font-medium">
                      <Calendar size={14} />
                      {new Date(sale.createdAt).toLocaleString()}
                    </div>

                    <div className="flex items-center gap-1 text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-md">
                      <ArrowUpRight size={12} />
                      {formatCurrency(sale.totalAmount)}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider">
                      Items Purchased
                    </h4>

                    <ul className="space-y-1">
                      {sale.items.map((item, idx) => (
                        <li
                          key={idx}
                          className="flex items-center justify-between text-sm"
                        >
                          <span className="text-gray-700 font-medium">
                            <span className="text-gray-400 mr-2">
                              {item.qty}x
                            </span>
                            {item.name} {item.size ? `(${item.size})` : ""}
                          </span>

                          <span className="text-gray-900 font-semibold">
                            {formatCurrency(item.price * item.qty)}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="mt-4 pt-3 border-t border-gray-50 flex items-center justify-between text-xs text-gray-400">
                    <span>Order #{index + 1}</span>
                    <span>
                      Processed by:{" "}
                      <span className="font-medium text-gray-600">
                        {sale.billedBy ? sale.billedBy.split(" ")[0] : "Admin"}
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