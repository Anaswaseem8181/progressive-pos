import { useState, useEffect } from "react";
import { Plus, Edit2, Trash2, Search } from "lucide-react";
import { motion } from "motion/react";
import { useProducts } from "../../hooks/useProducts";
import { mergeClasses } from "../../utils/mergeClasses";
import { useCurrency } from "../../hooks/useCurrency";
import WarningModal from "../../components/modals/common/WarningModal";
import { ProductModal } from "../../components/modals/inventory/ProductModal";
import { ActionDropdown } from "../../components/ui/ActionDropdown";
import { notify } from "../../utils/notifications";

const Inventory = () => {
  const { products, addProduct, updateProduct, deleteProduct } = useProducts();
  const { formatCurrency } = useCurrency();
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [productToDelete, setProductToDelete] = useState(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [productToEdit, setProductToEdit] = useState(null);
  const [openDropdownId, setOpenDropdownId] = useState(null);

  const handleSaveProduct = (data) => {
    const newProductData = {
      ...data,
      price: parseFloat(data.price),
      stock: parseInt(data.stock, 10),
    };

    if (productToEdit) {
      if (updateProduct(productToEdit.id, newProductData)) {
        notify.success("Product updated successfully");
        closeModal();
      }
    } else {
      if (addProduct(newProductData)) {
        notify.success("Product added successfully");
        closeModal();
      }
    }
  };

  const closeModal = () => {
    setIsAddModalOpen(false);
    setProductToEdit(null);
  };

  const handleEditClick = (product) => {
    setProductToEdit(product);
    setIsAddModalOpen(true);
    setOpenDropdownId(null);
  };

  const handleDeleteClick = (product) => {
    setProductToDelete(product);
    setShowDeleteModal(true);
    setOpenDropdownId(null);
  };

  const confirmDelete = () => {
    if (productToDelete && deleteProduct(productToDelete.id)) {
      setShowDeleteModal(false);
      setProductToDelete(null);
      notify.success("Product removed from inventory");
    }
  };

  useEffect(() => {
    const handleClickOutside = () => setOpenDropdownId(null);
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex flex-col gap-1">
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Inventory Management</h1>
          <p className="text-gray-500 text-sm">Manage your products and stock levels.</p>
        </div>
        <button
          onClick={() => setIsAddModalOpen(true)}
          className="bg-emerald-500 text-white px-5 py-2.5 rounded-xl font-bold text-sm flex items-center gap-2 hover:bg-emerald-600 transition-all shadow-lg shadow-emerald-100 active:scale-[0.98]"
        >
          <Plus size={18} />
          Add Product
        </button>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-gray-50 flex items-center gap-4">
          <div className="relative flex-1 max-w-md">
            <Search size={20} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search products..."
              className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-100 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>
        </div>

        {/* Mobile View: Card Layout */}
        <div className="md:hidden divide-y divide-gray-100">
          {products.map((product) => (
            <div key={product.id} className="p-4 flex flex-col gap-3 relative">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-bold text-gray-900">{product.name}</h3>
                  <p className="text-xs text-gray-500 font-medium mt-0.5">{product.category} • {product.size || "N/A"}</p>
                </div>
                <div className="flex flex-col items-end gap-1">
                  <span className="font-bold text-emerald-600">{formatCurrency(product.price)}</span>
                  <span className={mergeClasses(
                    "px-2 py-0.5 rounded-md text-[10px] font-bold tracking-wider",
                    product.status === "IN STOCK" ? "bg-emerald-50 text-emerald-600" : "bg-orange-50 text-orange-600"
                  )}>
                    {product.status}
                  </span>
                </div>
              </div>

              <div className="flex items-center justify-between mt-2 pt-3 border-t border-gray-50">
                <div className="text-sm">
                  <span className="text-gray-400 mr-1">Stock:</span>
                  <span className={mergeClasses("font-bold", product.stock < 10 ? "text-orange-600" : "text-gray-900")}>
                    {product.stock}
                  </span>
                </div>
                <div className="flex items-center gap-1">
                  <ActionDropdown
                    isOpen={openDropdownId === product.id}
                    onToggle={() => setOpenDropdownId(openDropdownId === product.id ? null : product.id)}
                    containerClassName=""
                    actions={[
                      {
                        label: "Edit",
                        icon: Edit2,
                        onClick: () => handleEditClick(product),
                        variant: "default",
                      },
                      {
                        label: "Delete",
                        icon: Trash2,
                        onClick: () => handleDeleteClick(product),
                        variant: "danger",
                      },
                    ]}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Desktop View: Table Layout */}
        <div className="hidden md:block overflow-x-auto min-h-[300px]">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50/50 border-b border-gray-100">
                <th className="px-6 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Product</th>
                <th className="px-6 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Category</th>
                <th className="px-6 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Size</th>
                <th className="px-6 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Price</th>
                <th className="px-6 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest text-center">Stock</th>
                <th className="px-6 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest text-center">Status</th>
                <th className="px-6 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {products.map((product) => (
                <tr key={product.id} className="hover:bg-gray-50/50 transition-colors group">
                  <td className="px-6 py-4">
                    <span className="text-sm font-bold text-gray-900">{product.name}</span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm text-gray-500 font-medium">{product.category}</span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm text-gray-500 font-medium">{product.size || "-"}</span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm font-bold text-gray-900">{formatCurrency(product.price)}</span>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span className={mergeClasses("text-sm font-bold", product.stock < 10 ? "text-orange-600" : "text-gray-900")}>
                      {product.stock}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span className={mergeClasses(
                      "px-2.5 py-1 rounded-full text-[10px] font-bold tracking-wider",
                      product.status === "IN STOCK" ? "bg-emerald-50 text-emerald-600" : "bg-orange-50 text-orange-600"
                    )}>
                      {product.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <ActionDropdown
                      isOpen={openDropdownId === product.id}
                      onToggle={() => setOpenDropdownId(openDropdownId === product.id ? null : product.id)}
                      containerClassName="relative inline-block text-left"
                      actions={[
                        {
                          label: "Edit",
                          icon: Edit2,
                          onClick: () => handleEditClick(product),
                          variant: "default",
                        },
                        {
                          label: "Delete",
                          icon: Trash2,
                          onClick: () => handleDeleteClick(product),
                          variant: "danger",
                        },
                      ]}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <WarningModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={confirmDelete}
        title="Delete Product?"
        message={`Are you sure you want to delete "${productToDelete?.name}"? This will remove it from your inventory and POS system.`}
        confirmText="Delete Product"
        variant="danger"
      />

      <ProductModal
        isOpen={isAddModalOpen}
        onClose={closeModal}
        onSave={handleSaveProduct}
        product={productToEdit}
      />
    </motion.div>
  );
};

export default Inventory;
