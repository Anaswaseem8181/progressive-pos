import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { X, Package, Tag, Hash, Ruler } from "lucide-react";
import { InputField } from "../../ui/InputField";
import { SelectField } from "../../ui/SelectField";

export const ProductModal = ({ isOpen, onClose, onSave, product }) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  useEffect(() => {
    if (product) {
      reset(product);
    } else {
      reset({
        name: "",
        category: "Clothing",
        size: "Medium",
        price: "",
        stock: "",
      });
    }
  }, [product, reset, isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-300">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden transform transition-all scale-100">
        <div className="p-6 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
          <h2 className="text-xl font-bold text-gray-900">
            {product ? "Edit Product" : "Add New Product"}
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
            label="Product Name"
            name="name"
            register={register}
            errors={errors}
            icon={<Tag size={18} />}
            placeholder="e.g. Vintage Denim Jacket"
            required
          />

          <div className="grid grid-cols-2 gap-4">
            <InputField
              label="Category"
              name="category"
              register={register}
              errors={errors}
              icon={<Package size={18} />}
              disabled={true}
              defaultValue="Clothing"
            />

            <SelectField
              label="Size"
              name="size"
              register={register}
              errors={errors}
              options={["Small", "Medium", "Large"]}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <InputField
              label="Price"
              name="price"
              type="number"
              register={register}
              errors={errors}
              icon={<span className="text-sm font-semibold">₨</span>}
              placeholder="0.00"
              required
            />

            <InputField
              label="Stock Quantity"
              name="stock"
              type="number"
              register={register}
              errors={errors}
              icon={<Hash size={18} />}
              placeholder="0"
              required
            />
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
              {product ? "Update Product" : "Add Product"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
