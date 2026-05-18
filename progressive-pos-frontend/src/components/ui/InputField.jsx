import React, { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { mergeClasses } from "../../utils/mergeClasses";

export const InputField = ({
  label,
  name,
  register,
  errors = {},
  type = "text",
  icon: Icon,
  placeholder,
  value,
  onChange,
  required,
  disabled,
  className = ""
}) => {
  const [showPassword, setShowPassword] = useState(false);
  const isPassword = type === "password";
  const inputType = isPassword ? (showPassword ? "text" : "password") : type;

  // Handle both register and manual state
  const inputProps = register
    ? register(name, { required: required ? `${label} is required` : false })
    : { value, onChange, name };

  return (
    <div className={mergeClasses("mb-4 group", className)}>
      {label && (
        <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-3 transition-colors group-focus-within:text-blue-600">
          {label}
        </label>
      )}

      <div className="relative">
        {Icon && (
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-blue-600 transition-colors">
            {Icon}
          </div>
        )}

        <input
          type={inputType}
          placeholder={placeholder}
          disabled={disabled}
          {...inputProps}
          className={mergeClasses(
            "block w-full py-4 bg-white border-2 border-slate-200 rounded-3xl text-sm font-semibold placeholder-slate-300 focus:outline-none focus:border-blue-600 transition-all shadow-sm",
            Icon ? "pl-12" : "pl-6",
            isPassword ? "pr-12" : "pr-4",
            errors[name] ? "border-red-500 focus:border-red-500" : "focus:border-blue-600",
            disabled && "bg-slate-50 text-slate-400 cursor-not-allowed"
          )}
        />

        {isPassword && (
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-400 hover:text-blue-600 transition-colors"
            tabIndex="-1"
          >
            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        )}
      </div>

      {errors[name] && (
        <p className="text-red-500 text-xs font-bold mt-2 ml-1 animate-in fade-in slide-in-from-top-1 duration-200">
          {errors[name].message}
        </p>
      )}
    </div>
  );
};
