import { useState } from "react";
import { Percent } from "lucide-react";
import { notify } from "../../../utils/notifications";
import { SettingsAccordion, SettingsField, SettingsSaveButton } from "./SettingsComponents";
import { useCurrency } from "../../../hooks/useCurrency";

// A simple hook-like context for discount & tax so POS cart can read it.
// We persist to localStorage so it survives refresh.
const STORAGE_KEY = "pos_tax_discount";

export const useTaxDiscount = () => {
  const stored = localStorage.getItem(STORAGE_KEY);
  return stored ? JSON.parse(stored) : { taxRate: 0, discountRate: 0 };
};

const PercentInput = ({ label, name, value, onChange, hint }) => (
  <SettingsField label={label} hint={hint}>
    <div className="relative">
      <input
        type="number"
        name={name}
        value={value}
        onChange={onChange}
        min="0"
        max="100"
        step="0.5"
        className="w-full p-2.5 pr-10 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all"
      />
      <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm font-bold">%</span>
    </div>
  </SettingsField>
);

export const TaxDiscountSection = () => {
  const saved = useTaxDiscount();
  const { currency, formatCurrency } = useCurrency();
  const [form, setForm] = useState({
    taxRate: saved.taxRate,
    discountRate: saved.discountRate,
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: Math.min(100, Math.max(0, parseFloat(value) || 0)) }));
  };

  const handleSave = () => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(form));
    notify.success("Tax & discount rates saved! They will apply to new orders.");
  };

  const effectiveTotal = (100 - form.discountRate) * (1 + form.taxRate / 100);

  return (
    <SettingsAccordion
      icon={Percent}
      title="Tax & Discount"
      description="Set default tax and discount percentages applied to all orders."
    >
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <PercentInput
          label="Default Tax Rate"
          name="taxRate"
          value={form.taxRate}
          onChange={handleChange}
          hint="Applied on subtotal before checkout"
        />
        <PercentInput
          label="Default Discount Rate"
          name="discountRate"
          value={form.discountRate}
          onChange={handleChange}
          hint="Applied before tax calculation"
        />
      </div>

      {/* Live Preview */}
      <div className="bg-gray-50 rounded-xl p-4 space-y-2 text-sm border border-gray-100">
        <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Live Preview — {currency} 1,000 order</p>
        <div className="flex justify-between text-gray-600">
          <span>Subtotal</span>
          <span className="font-semibold">{formatCurrency(1000)}</span>
        </div>
        <div className="flex justify-between text-red-500">
          <span>Discount ({form.discountRate}%)</span>
          <span className="font-semibold">- {formatCurrency(1000 * form.discountRate / 100)}</span>
        </div>
        <div className="flex justify-between text-blue-500">
          <span>Tax ({form.taxRate}%)</span>
          <span className="font-semibold">+ {formatCurrency((1000 - 1000 * form.discountRate / 100) * form.taxRate / 100)}</span>
        </div>
        <div className="flex justify-between text-gray-900 font-bold border-t border-gray-200 pt-2 mt-2">
          <span>Total</span>
          <span>{formatCurrency((1000 - 1000 * form.discountRate / 100) * (1 + form.taxRate / 100))}</span>
        </div>
      </div>

      <SettingsSaveButton onClick={handleSave} />
    </SettingsAccordion>
  );
};
