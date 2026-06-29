import { ShoppingCart, Minus, Plus, Trash2 } from "lucide-react";
import { useTaxDiscount } from "../../../components/dashboard/settings/TaxDiscountSection";
import { SearchableCustomerDropdown } from "./SearchableCustomerDropdown";

const POSCartSidebar = ({
  cart,
  selectedCustomerId,
  setSelectedCustomerId,
  onUpdateQuantity,
  onRemoveFromCart,
  onCompleteOrder,
  onAddCustomer,
  subtotal,
  formatCurrency,
  dropdownRefreshKey
}) => {
  const { taxRate, discountRate } = useTaxDiscount();
  const discountAmount = subtotal * (discountRate / 100);
  const taxableAmount = subtotal - discountAmount;
  const taxAmount = taxableAmount * (taxRate / 100);
  const total = taxableAmount + taxAmount;
  return (
    <div className="w-full lg:w-[400px] bg-white rounded-2xl border border-gray-100 shadow-lg flex flex-col overflow-hidden shrink-0">
      <div className="p-6 border-b border-gray-100">
        <h3 className="text-lg font-bold text-gray-900 mb-4">Current Order</h3>
        <div className="space-y-2">
          <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">
            Customer
          </label>
          <div className="flex gap-2">
            <SearchableCustomerDropdown
              selectedCustomerId={selectedCustomerId}
              onSelectCustomer={setSelectedCustomerId}
              refreshKey={dropdownRefreshKey}
            />
            <button
              type="button"
              onClick={onAddCustomer}
              className="bg-emerald-50 text-emerald-600 p-2 rounded-lg hover:bg-emerald-100 transition-colors border border-emerald-100 flex items-center justify-center shrink-0"
              title="Add New Customer"
            >
              <Plus size={20} />
            </button>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-6 space-y-4 custom-scrollbar">
        {cart.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-gray-300 gap-4">
            <ShoppingCart size={64} strokeWidth={1} />
            <p className="font-medium">Cart is empty</p>
          </div>
        ) : (
          <div className="space-y-3">
            {cart.map((item) => (
              <div
                key={item.id}
                className="flex items-center justify-between gap-4 p-3 bg-gray-50 rounded-xl group transition-all hover:bg-gray-100"
              >
                <div className="flex flex-col flex-1 min-w-0">
                  <span className="text-sm font-bold text-gray-800 truncate">
                    {item.name} <span className="text-emerald-600 font-semibold ml-1">({item.size})</span>
                  </span>
                  <span className="text-xs text-gray-400">
                    {formatCurrency(item.price)} per unit
                  </span>
                </div>

                <div className="flex items-center gap-3">
                  <div className="flex items-center bg-white border border-gray-200 rounded-lg p-1">
                    <button
                      onClick={() => onUpdateQuantity(item.id, -1)}
                      className="w-6 h-6 flex items-center justify-center text-gray-400 hover:text-emerald-600 hover:bg-emerald-50 rounded transition-all"
                    >
                      <Minus size={14} />
                    </button>
                    <span className="w-8 text-center text-xs font-bold text-gray-900">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() => onUpdateQuantity(item.id, 1)}
                      className="w-6 h-6 flex items-center justify-center text-gray-400 hover:text-emerald-600 hover:bg-emerald-50 rounded transition-all"
                    >
                      <Plus size={14} />
                    </button>
                  </div>

                  <div className="flex items-center gap-3 min-w-[80px] justify-end">
                    <span className="text-sm font-bold text-gray-900">
                      {formatCurrency(item.price * item.quantity)}
                    </span>
                    <button
                      onClick={() => onRemoveFromCart(item.id)}
                      className="text-gray-300 hover:text-red-500 transition-colors flex-shrink-0"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="p-6 bg-gray-50 border-t border-gray-100 space-y-4">
        <div className="space-y-2">
          <div className="flex justify-between text-sm text-gray-500">
            <span>Subtotal</span>
            <span className="font-bold">{formatCurrency(subtotal)}</span>
          </div>
          {discountRate > 0 && (
            <div className="flex justify-between text-sm text-red-500">
              <span>Discount ({discountRate}%)</span>
              <span className="font-bold">- {formatCurrency(discountAmount)}</span>
            </div>
          )}
          {taxRate > 0 && (
            <div className="flex justify-between text-sm text-blue-500">
              <span>Tax ({taxRate}%)</span>
              <span className="font-bold">+ {formatCurrency(taxAmount)}</span>
            </div>
          )}
        </div>
        <div className="pt-4 border-t border-gray-200 flex items-center justify-between">
          <span className="text-lg font-bold text-gray-900">Total</span>
          <span className="text-3xl font-bold text-emerald-600">
            {formatCurrency(total)}
          </span>
        </div>
        <button
          onClick={onCompleteOrder}
          disabled={cart.length === 0}
          className="w-full bg-emerald-500 text-white py-4 rounded-xl font-bold text-lg hover:bg-emerald-600 transition-all shadow-lg shadow-emerald-100 disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none active:scale-[0.98]"
        >
          Complete Order
        </button>
      </div>
    </div>
  );
};

export default POSCartSidebar;
