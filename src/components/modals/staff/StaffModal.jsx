import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { X, User, Mail, Lock, Phone } from "lucide-react";
import { InputField } from "../../ui/InputField";
import { mergeClasses } from "../../../utils/mergeClasses";

export const StaffModal = ({ isOpen, onClose, onSave, staff }) => {
  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm();

  const watchStatus = watch("status");

  useEffect(() => {
    if (staff) {
      reset(staff);
    } else {
      reset({
        name: "",
        email: "",
        contactNumber: "",
        password: "",
        role: "cashier",
      });
    }
  }, [staff, reset, isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-300">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden transform transition-all scale-100">
        <div className="p-6 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
          <h2 className="text-xl font-bold text-gray-900">
            {staff ? "Edit Staff" : "Add New Staff"}
          </h2>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit(onSave)} className="p-6 space-y-2">
          <InputField
            label="Full Name"
            name="name"
            register={register}
            errors={errors}
            icon={<User size={18} />}
            placeholder="John Doe"
            required
          />

          <InputField
            label="Email Address"
            name="email"
            type="email"
            register={register}
            errors={errors}
            icon={<Mail size={18} />}
            placeholder="staff@example.com"
            disabled={!!staff}
            required
          />

          <InputField
            label="Contact Number"
            name="contactNumber"
            type="tel"
            register={register}
            errors={errors}
            icon={<Phone size={18} />}
            placeholder="0300-1234567"
            required
          />

          <InputField
            label="Password"
            name="password"
            type="password"
            register={register}
            errors={errors}
            icon={<Lock size={18} />}
            placeholder={staff ? "Leave blank to keep same" : "••••••••"}
            required={!staff}
          />

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              Role
            </label>
            <select
              {...register("role")}
              className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition-all bg-white"
            >
              <option value="manager">Manager</option>
              <option value="cashier">Cashier</option>
            </select>
          </div>

          {staff && (
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                Account Status
              </label>
              <select
                {...register("status")}
                className={mergeClasses(
                  "w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:border-transparent outline-none transition-all bg-white",
                  watchStatus === "active" ? "text-green-600 font-bold" : "text-red-600 font-bold"
                )}
              >
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
                <option value="suspended">Suspended</option>
              </select>
            </div>
          )}

          <div className="pt-4 flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2.5 border border-gray-200 text-gray-700 font-semibold rounded-xl hover:bg-gray-50 transition-all active:scale-95"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-2.5 bg-emerald-500 text-white font-semibold rounded-xl hover:bg-emerald-600 transition-all shadow-lg shadow-emerald-100 active:scale-95"
            >
              {staff ? "Update" : "Create Account"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
