import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { X, Package, Tag, Barcode, Plus, Trash2 } from "lucide-react";
import { InputField } from "../../ui/InputField";
import { useCategories } from "../../../hooks/useCategories";
import { useAuth } from "../../../hooks/useAuth";

const SIZE_OPTIONS = ["XS", "S", "M", "L", "XL", "XXL", "Free Size"];

export const ProductModal = ({ isOpen, onClose, onSave, product }) => {
  const { categories, fetchCategories, loading } = useCategories();
  const { user } = useAuth();
  const [variants, setVariants] = useState([{ size: "M", sku: "", stock: 0 }]);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  useEffect(() => {
    if (isOpen) fetchCategories();
  }, [isOpen, fetchCategories]);

  useEffect(() => {
    if (product) {
      reset({
        name: product.name || "",
        sku: product.sku || "",
        categoryId: product.categoryId?._id || product.categoryId || "",
        price: product.price || "",
      });
      setVariants(
        product.variants?.length
          ? product.variants.map((v) => ({ size: v.size, sku: v.sku || "", stock: v.stock, _id: v._id }))
          : [{ size: "M", sku: "", stock: 0 }]
      );
    } else {
      reset({ name: "", sku: "", categoryId: "", price: "" });
      setVariants([{ size: "M", sku: "", stock: 0 }]);
    }
  }, [product, reset, isOpen]);

  // Auto pre-select business category
  useEffect(() => {
    if (!isOpen || product || !categories?.length) return;
    const preferred = user?.businessCategory || "Clothing & Apparel";
    const match =
      categories.find((c) => c.name.toLowerCase() === preferred.toLowerCase()) ||
      categories.find((c) => c.name.toLowerCase().includes("cloth"));
    if (match) reset((prev) => ({ ...prev, categoryId: match._id }));
  }, [categories, user, product, isOpen, reset]);

  const addVariant = () => {
    const usedSizes = variants.map((v) => v.size);
    const next = SIZE_OPTIONS.find((s) => !usedSizes.includes(s)) || "M";
    setVariants((prev) => [...prev, { size: next, sku: "", stock: 0 }]);
  };

  const removeVariant = (idx) => {
    if (variants.length === 1) return;
    setVariants((prev) => prev.filter((_, i) => i !== idx));
  };

  const updateVariant = (idx, field, value) => {
    setVariants((prev) =>
      prev.map((v, i) => (i === idx ? { ...v, [field]: value } : v))
    );
  };

  const onSubmit = (data) => {
    const parsedVariants = variants.map((v) => ({
      ...v,
      stock: parseInt(v.stock, 10) || 0,
    }));
    onSave({ ...data, price: parseFloat(data.price), variants: parsedVariants });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-300">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden">
        {/* Header */}
        <div className="p-6 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
          <h2 className="text-xl font-bold text-gray-900">
            {product ? "Edit Product" : "Add New Product"}
          </h2>
          <button onClick={onClose} className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100 transition-colors">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-5 max-h-[80vh] overflow-y-auto">
          {/* Product Name */}
          <InputField
            label="Product Name"
            name="name"
            register={register}
            errors={errors}
            icon={<Tag size={18} />}
            placeholder="e.g. Denim Jacket"
            required
          />

          {/* Master SKU + Category */}
          <div className="grid grid-cols-2 gap-4">
            <InputField
              label="Master SKU"
              name="sku"
              register={register}
              errors={errors}
              icon={<Barcode size={18} />}
              placeholder="e.g. DJ-001"
            />
            <div className="space-y-1">
              <label className="block text-sm font-semibold text-gray-700">Category</label>
              <div className="relative">
                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                  <Package size={18} />
                </div>
                <select
                  {...register("categoryId", { required: "Category is required" })}
                  className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 text-gray-900 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all appearance-none"
                  disabled={loading}
                >
                  <option value="">Select Category</option>
                  {categories.map((cat) => (
                    <option key={cat._id} value={cat._id}>{cat.name}</option>
                  ))}
                </select>
                {errors.categoryId && (
                  <p className="text-xs text-red-500 mt-1 font-medium">{errors.categoryId.message}</p>
                )}
              </div>
            </div>
          </div>

          {/* Price */}
          <InputField
            label="Price (₨)"
            name="price"
            type="number"
            register={register}
            errors={errors}
            icon={<span className="text-sm font-semibold">₨</span>}
            placeholder="0.00"
            required
          />

          {/* Variants */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-sm font-bold text-gray-700">Size Variants & Stock</label>
              <button
                type="button"
                onClick={addVariant}
                className="flex items-center gap-1 text-xs font-bold text-emerald-600 hover:text-emerald-700 px-3 py-1.5 bg-emerald-50 hover:bg-emerald-100 rounded-lg transition-all"
              >
                <Plus size={14} /> Add Size
              </button>
            </div>

            <div className="space-y-2">
              {/* Header row */}
              <div className="grid grid-cols-[100px_1fr_80px_32px] gap-2 px-1">
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Size</span>
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Variant SKU</span>
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Stock</span>
                <span />
              </div>

              {variants.map((v, idx) => (
                <div key={idx} className="grid grid-cols-[100px_1fr_80px_32px] gap-2 items-center bg-gray-50 rounded-xl p-2 border border-gray-100">
                  <select
                    value={v.size}
                    onChange={(e) => updateVariant(idx, "size", e.target.value)}
                    className="bg-white border border-gray-200 text-sm font-semibold text-gray-900 rounded-lg px-2 py-1.5 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                  >
                    {SIZE_OPTIONS.map((s) => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                  <input
                    type="text"
                    value={v.sku}
                    onChange={(e) => updateVariant(idx, "sku", e.target.value)}
                    placeholder={`DJ-001-${v.size}`}
                    className="bg-white border border-gray-200 text-sm text-gray-700 rounded-lg px-2 py-1.5 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 w-full"
                  />
                  <input
                    type="number"
                    value={v.stock}
                    onChange={(e) => updateVariant(idx, "stock", e.target.value)}
                    min="0"
                    className="bg-white border border-gray-200 text-sm font-bold text-gray-900 rounded-lg px-2 py-1.5 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 w-full text-center"
                  />
                  <button
                    type="button"
                    onClick={() => removeVariant(idx)}
                    disabled={variants.length === 1}
                    className="w-8 h-8 flex items-center justify-center text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all disabled:opacity-30 disabled:cursor-not-allowed"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Actions */}
          <div className="pt-2 flex gap-3">
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
