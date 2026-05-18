import { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import { mergeClasses } from "../../../utils/mergeClasses";

/**
 * Reusable accordion section for settings.
 * Each section has a header with an expand/collapse toggle.
 */
export const SettingsAccordion = ({ icon: Icon, title, description, children, defaultOpen = false }) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
      {/* Header */}
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        className="w-full flex items-center justify-between p-5 hover:bg-gray-50/60 transition-colors"
      >
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-600 flex-shrink-0">
            <Icon size={20} />
          </div>
          <div className="text-left">
            <p className="text-sm font-bold text-gray-900">{title}</p>
            <p className="text-xs text-gray-400 mt-0.5">{description}</p>
          </div>
        </div>
        <div className="text-gray-400 flex-shrink-0">
          {isOpen ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
        </div>
      </button>

      {/* Body */}
      {isOpen && (
        <div className="px-5 pb-5 border-t border-gray-100 pt-5 space-y-4">
          {children}
        </div>
      )}
    </div>
  );
};

/**
 * Reusable labelled input field for settings forms.
 */
export const SettingsField = ({ label, hint, children }) => (
  <div className="space-y-1.5">
    <label className="text-sm font-semibold text-gray-700">{label}</label>
    {children}
    {hint && <p className="text-xs text-gray-400">{hint}</p>}
  </div>
);

/**
 * Reusable text/number input for settings.
 */
export const SettingsInput = ({ className, ...props }) => (
  <input
    className={mergeClasses(
      "w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all",
      className
    )}
    {...props}
  />
);

/**
 * Save button for a settings section.
 */
export const SettingsSaveButton = ({ label = "Save Changes", onClick }) => (
  <div className="pt-2 flex justify-end">
    <button
      type="button"
      onClick={onClick}
      className="bg-emerald-500 text-white px-5 py-2.5 rounded-xl font-bold text-sm hover:bg-emerald-600 transition-all shadow-lg shadow-emerald-100 active:scale-[0.98]"
    >
      {label}
    </button>
  </div>
);
