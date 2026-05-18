import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { X, User, Phone } from "lucide-react";
import { InputField } from "../../ui/InputField";

export const CustomerModal = ({ isOpen, onClose, onSave, customer }) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  useEffect(() => {
    if (customer) {
      reset(customer);
    } else {
      reset({
        name: "",
        phone: "",
        status: "REGULAR",
      });
    }
  }, [customer, reset, isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-300">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden transform transition-all scale-100">
        <div className="p-6 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
          <h2 className="text-xl font-bold text-gray-900">
            {customer ? "Edit Customer" : "Add New Customer"}
          </h2>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit(onSave)} className="p-6 space-y-4">
          <InputField
            label="Full Name"
            name="name"
            register={register}
            errors={errors}
            icon={<User size={18} />}
            placeholder="e.g. John Doe"
            required
          />

          <InputField
            label="Phone Number"
            name="phone"
            register={register}
            errors={errors}
            icon={<Phone size={18} />}
            placeholder="e.g. 03001234567"
            required
          />

          <div className="mb-4 group">
            <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-3 transition-colors group-focus-within:text-blue-600">
              Customer Status
            </label>
            <select
              {...register("status")}
              className="block w-full px-6 py-4 bg-white border-2 border-slate-200 rounded-3xl text-sm font-semibold focus:outline-none focus:border-blue-600 transition-all shadow-sm cursor-pointer"
            >
              <option value="REGULAR">Regular</option>
              <option value="VIP">VIP</option>
              <option value="INACTIVE">Inactive</option>
            </select>
          </div>

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
              {customer ? "Update Customer" : "Add Customer"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
