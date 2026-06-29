import React, { useState, useEffect } from "react";
import { X, Hash, TrendingUp, TrendingDown } from "lucide-react";

const VariantStockModal = ({ isOpen, onClose, product, variant, onSave }) => {
  const [mode, setMode] = useState("set"); // 'set' | 'add' | 'subtract'
  const [amount, setAmount] = useState("");

  useEffect(() => {
    if (isOpen) {
      setAmount("");
      setMode("add");
    }
  }, [isOpen]);

  if (!isOpen || !variant || !product) return null;

  const currentStock = variant.stock;
  const parsedAmount = parseInt(amount, 10) || 0;

  const previewStock =
    mode === "set"
      ? parsedAmount
      : mode === "add"
      ? currentStock + parsedAmount
      : currentStock - parsedAmount;

  const handleSave = () => {
    if (!amount || parsedAmount < 0) return;
    let delta;
    if (mode === "set") delta = parsedAmount - currentStock;
    else if (mode === "add") delta = parsedAmount;
    else delta = -parsedAmount;

    onSave(product._id, variant._id, delta);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm overflow-hidden">
        {/* Header */}
        <div className="p-5 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
          <div>
            <h2 className="text-base font-bold text-gray-900">Update Stock</h2>
            <p className="text-xs text-gray-500 mt-0.5">
              {product.name} — <span className="font-semibold text-emerald-600">{variant.size}</span>
            </p>
          </div>
          <button onClick={onClose} className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100 transition-colors">
            <X size={18} />
          </button>
        </div>

        <div className="p-5 space-y-4">
          {/* Current stock badge */}
          <div className="flex items-center justify-between bg-gray-50 rounded-xl p-3 border border-gray-100">
            <span className="text-sm text-gray-500 font-medium">Current Stock</span>
            <span className="text-xl font-black text-gray-900">{currentStock}</span>
          </div>

          {/* Mode selector */}
          <div className="grid grid-cols-3 gap-2">
            {[
              { key: "add", label: "Add", icon: TrendingUp, color: "emerald" },
              { key: "subtract", label: "Deduct", icon: TrendingDown, color: "red" },
              { key: "set", label: "Set", icon: Hash, color: "blue" },
            ].map(({ key, label, icon: Icon, color }) => (
              <button
                key={key}
                type="button"
                onClick={() => setMode(key)}
                className={`flex flex-col items-center gap-1 py-2.5 rounded-xl border-2 text-xs font-bold transition-all ${
                  mode === key
                    ? `border-${color}-500 bg-${color}-50 text-${color}-600`
                    : "border-gray-100 text-gray-400 hover:border-gray-200"
                }`}
              >
                <Icon size={16} />
                {label}
              </button>
            ))}
          </div>

          {/* Amount input */}
          <div className="space-y-1">
            <label className="text-sm font-semibold text-gray-700">
              {mode === "set" ? "New Stock Value" : mode === "add" ? "Quantity to Add" : "Quantity to Deduct"}
            </label>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              min="0"
              placeholder="0"
              autoFocus
              className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 text-gray-900 rounded-xl text-lg font-bold text-center focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
            />
          </div>

          {/* Preview */}
          {amount !== "" && (
            <div className={`flex items-center justify-between rounded-xl p-3 border ${
              previewStock < 0 ? "bg-red-50 border-red-200" : "bg-emerald-50 border-emerald-200"
            }`}>
              <span className="text-sm font-medium text-gray-600">New Stock</span>
              <span className={`text-xl font-black ${previewStock < 0 ? "text-red-600" : "text-emerald-600"}`}>
                {previewStock < 0 ? "⚠️ Invalid" : previewStock}
              </span>
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-3 pt-1">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2.5 border border-gray-200 text-gray-700 font-semibold rounded-xl hover:bg-gray-50 transition-all active:scale-95"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSave}
              disabled={!amount || previewStock < 0}
              className="flex-1 px-4 py-2.5 bg-emerald-500 text-white font-semibold rounded-xl hover:bg-emerald-600 transition-all shadow-lg shadow-emerald-100 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Update Stock
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VariantStockModal;
