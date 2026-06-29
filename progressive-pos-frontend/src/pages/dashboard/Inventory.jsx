import { useState, useEffect } from "react";
import { Plus, Edit2, Trash2, Search, RefreshCw, ChevronDown, ChevronRight, AlertTriangle } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { useProducts } from "../../hooks/useProducts";
import { mergeClasses } from "../../utils/mergeClasses";
import { useCurrency } from "../../hooks/useCurrency";
import WarningModal from "../../components/modals/common/WarningModal";
import { ProductModal } from "../../components/modals/inventory/ProductModal";
import VariantStockModal from "../../components/modals/inventory/VariantStockModal";
import { ActionDropdown } from "../../components/ui/ActionDropdown";
import { notify } from "../../utils/notifications";

const Inventory = () => {
  const {
    products,
    archivedProducts,
    loadingActive,
    loadingArchived,
    fetchProducts,
    fetchArchivedProducts,
    addProduct,
    updateProduct,
    updateVariantStock,
    deleteProduct,
    restoreProduct,
  } = useProducts();

  const { formatCurrency } = useCurrency();
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [productToDelete, setProductToDelete] = useState(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [productToEdit, setProductToEdit] = useState(null);
  const [openDropdownId, setOpenDropdownId] = useState(null);
  const [activeTab, setActiveTab] = useState("active");
  const [expandedRows, setExpandedRows] = useState(new Set());
  const [search, setSearch] = useState("");
  const [variantStockModal, setVariantStockModal] = useState({ open: false, product: null, variant: null });

  useEffect(() => {
    fetchProducts();
    fetchArchivedProducts();
  }, [fetchProducts, fetchArchivedProducts]);

  const handleSaveProduct = async (data) => {
    const payload = { ...data, price: parseFloat(data.price) };
    if (productToEdit) {
      if (await updateProduct(productToEdit._id, payload)) {
        notify.success("Product updated successfully");
        closeModal();
      }
    } else {
      if (await addProduct(payload)) {
        notify.success("Product added successfully");
        closeModal();
      }
    }
  };

  const closeModal = () => { setIsAddModalOpen(false); setProductToEdit(null); };
  const handleEditClick = (product) => { setProductToEdit(product); setIsAddModalOpen(true); setOpenDropdownId(null); };
  const handleDeleteClick = (product) => { setProductToDelete(product); setShowDeleteModal(true); setOpenDropdownId(null); };
  const handleRestoreClick = async (product) => {
    if (await restoreProduct(product._id)) notify.success("Product restored successfully");
    setOpenDropdownId(null);
  };
  const confirmDelete = async () => {
    if (productToDelete && await deleteProduct(productToDelete._id)) {
      setShowDeleteModal(false);
      setProductToDelete(null);
      notify.success("Product archived");
    }
  };

  const toggleRow = (id) => {
    setExpandedRows((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const handleVariantStockEdit = (product, variant) => {
    setVariantStockModal({ open: true, product, variant });
  };

  const handleVariantStockSave = async (productId, variantId, delta) => {
    if (await updateVariantStock(productId, variantId, delta)) {
      notify.success("Stock updated successfully");
    }
  };

  useEffect(() => {
    const handleClickOutside = () => setOpenDropdownId(null);
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  const displayedProducts = (activeTab === "active" ? products : archivedProducts)
    .filter((p) => p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.categoryId?.name?.toLowerCase().includes(search.toLowerCase())
    );
  const isLoading = activeTab === "active" ? loadingActive : loadingArchived;

  const getStatusStyle = (status) => {
    if (status === "IN STOCK") return "bg-emerald-50 text-emerald-600";
    if (status === "LOW STOCK") return "bg-orange-50 text-orange-600";
    return "bg-red-50 text-red-500";
  };

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex flex-col gap-1">
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Inventory Management</h1>
          <p className="text-gray-500 text-sm">1 product = 1 master item with size variants.</p>
        </div>
        <button
          onClick={() => setIsAddModalOpen(true)}
          className="bg-emerald-500 text-white px-5 py-2.5 rounded-xl font-bold text-sm flex items-center gap-2 hover:bg-emerald-600 transition-all shadow-lg shadow-emerald-100 active:scale-[0.98]"
        >
          <Plus size={18} /> Add Product
        </button>
      </div>

      {/* Tabs */}
      <div className="flex space-x-4 border-b border-gray-200">
        {["active", "archived"].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={mergeClasses(
              "pb-3 text-sm font-semibold transition-colors relative capitalize",
              activeTab === tab ? "text-emerald-600" : "text-gray-500 hover:text-gray-700"
            )}
          >
            {tab === "active" ? "Active Products" : "Archived Products"}
            {activeTab === tab && <span className="absolute bottom-0 left-0 w-full h-0.5 bg-emerald-500 rounded-t-full" />}
          </button>
        ))}
      </div>

      {/* Table Card */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden min-h-[400px]">
        {/* Search */}
        <div className="p-4 border-b border-gray-50 flex items-center gap-4">
          <div className="relative flex-1 max-w-md">
            <Search size={20} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search products..."
              className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-100 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center h-64 text-gray-400">
            <RefreshCw className="animate-spin w-8 h-8" />
          </div>
        ) : (
          <>
          {/* ═══ DESKTOP TABLE (hidden on mobile) ═══ */}
          <div className="hidden lg:block overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50/50 border-b border-gray-100">
                  <th className="px-4 py-4 w-8" />
                  <th className="px-4 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Product</th>
                  <th className="px-4 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest">SKU</th>
                  <th className="px-4 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Category</th>
                  <th className="px-4 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Price</th>
                  <th className="px-4 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest text-center">Variants</th>
                  <th className="px-4 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest text-center">Total Stock</th>
                  <th className="px-4 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest text-center">Status</th>
                  <th className="px-4 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {displayedProducts.map((product) => {
                  const isExpanded = expandedRows.has(product._id);
                  const hasLowVariant = product.variants?.some((v) => v.stock > 0 && v.stock < 5);

                  return [
                    <tr
                      key={product._id}
                      className="hover:bg-gray-50/50 transition-colors cursor-pointer"
                      onClick={() => toggleRow(product._id)}
                    >
                      <td className="px-4 py-4 text-gray-400">
                        {isExpanded ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
                      </td>
                      <td className="px-4 py-4">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-bold text-gray-900">{product.name}</span>
                          {hasLowVariant && (
                            <AlertTriangle size={14} className="text-orange-400 flex-shrink-0" title="Some variants are low on stock" />
                          )}
                        </div>
                      </td>
                      <td className="px-4 py-4">
                        <span className="text-sm font-bold text-gray-500">{product.sku || "—"}</span>
                      </td>
                      <td className="px-4 py-4">
                        <span className="text-sm text-gray-500 font-medium">{product.categoryId?.name || "—"}</span>
                      </td>
                      <td className="px-4 py-4">
                        <span className="text-sm font-bold text-gray-900">{formatCurrency(product.price)}</span>
                      </td>
                      <td className="px-4 py-4 text-center">
                        <span className="text-sm font-semibold text-gray-600">{product.variants?.length || 0}</span>
                      </td>
                      <td className="px-4 py-4 text-center">
                        <span className={mergeClasses("text-sm font-bold", hasLowVariant ? "text-orange-600" : "text-gray-900")}>
                          {product.totalStock ?? product.variants?.reduce((s, v) => s + v.stock, 0) ?? 0}
                        </span>
                      </td>
                      <td className="px-4 py-4 text-center">
                        <span className={mergeClasses("px-2.5 py-1 rounded-full text-[10px] font-bold tracking-wider", getStatusStyle(product.status))}>
                          {product.status}
                        </span>
                      </td>
                      <td className="px-4 py-4 text-right" onClick={(e) => e.stopPropagation()}>
                        <ActionDropdown
                          isOpen={openDropdownId === product._id}
                          onToggle={() => setOpenDropdownId(openDropdownId === product._id ? null : product._id)}
                          containerClassName="relative inline-block text-left"
                          actions={activeTab === "active" ? [
                            { label: "Edit", icon: Edit2, onClick: () => handleEditClick(product), variant: "default" },
                            { label: "Archive", icon: Trash2, onClick: () => handleDeleteClick(product), variant: "danger" },
                          ] : [
                            { label: "Restore", icon: RefreshCw, onClick: () => handleRestoreClick(product), variant: "default" },
                          ]}
                        />
                      </td>
                    </tr>,

                    isExpanded && (
                      <tr key={`${product._id}-variants`}>
                        <td colSpan={9} className="px-0 py-0">
                          <AnimatePresence>
                            <motion.div
                              initial={{ opacity: 0, height: 0 }}
                              animate={{ opacity: 1, height: "auto" }}
                              exit={{ opacity: 0, height: 0 }}
                              className="bg-gray-50/80 border-t border-b border-gray-100"
                            >
                              <div className="px-12 py-3">
                                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">Variant Breakdown</p>
                                <table className="w-full max-w-lg">
                                  <thead>
                                    <tr>
                                      <th className="py-1.5 text-left text-[10px] font-bold text-gray-400 uppercase tracking-widest w-24">Size</th>
                                      <th className="py-1.5 text-left text-[10px] font-bold text-gray-400 uppercase tracking-widest">Variant SKU</th>
                                      <th className="py-1.5 text-center text-[10px] font-bold text-gray-400 uppercase tracking-widest w-20">Stock</th>
                                      {activeTab === "active" && <th className="py-1.5 text-right text-[10px] font-bold text-gray-400 uppercase tracking-widest w-16">Action</th>}
                                    </tr>
                                  </thead>
                                  <tbody className="divide-y divide-gray-100">
                                    {(product.variants || []).map((variant) => {
                                      const isLow = variant.stock > 0 && variant.stock < 5;
                                      const isOut = variant.stock === 0;
                                      return (
                                        <tr key={variant._id} className="group">
                                          <td className="py-2">
                                            <span className="inline-flex items-center gap-1.5 text-sm font-bold text-gray-800">
                                              {variant.size}
                                              {isLow && <AlertTriangle size={12} className="text-orange-400" />}
                                            </span>
                                          </td>
                                          <td className="py-2">
                                            <span className="text-xs text-gray-400 font-mono">{variant.sku || "—"}</span>
                                          </td>
                                          <td className="py-2 text-center">
                                            <span className={mergeClasses(
                                              "text-sm font-bold",
                                              isOut ? "text-red-500" : isLow ? "text-orange-500" : "text-gray-900"
                                            )}>
                                              {variant.stock}
                                            </span>
                                          </td>
                                          {activeTab === "active" && (
                                            <td className="py-2 text-right">
                                              <button
                                                onClick={() => handleVariantStockEdit(product, variant)}
                                                className="text-xs font-bold text-emerald-600 hover:text-emerald-700 px-2 py-1 bg-emerald-50 hover:bg-emerald-100 rounded-lg transition-all"
                                              >
                                                Edit
                                              </button>
                                            </td>
                                          )}
                                        </tr>
                                      );
                                    })}
                                  </tbody>
                                </table>
                              </div>
                            </motion.div>
                          </AnimatePresence>
                        </td>
                      </tr>
                    ),
                  ];
                })}
                {displayedProducts.length === 0 && (
                  <tr>
                    <td colSpan={9} className="px-6 py-12 text-center text-sm text-gray-400">
                      No products found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* ═══ MOBILE CARDS (visible only on mobile) ═══ */}
          <div className="lg:hidden divide-y divide-gray-100">
            {displayedProducts.length === 0 && (
              <div className="px-4 py-12 text-center text-sm text-gray-400">
                No products found.
              </div>
            )}

            {displayedProducts.map((product) => {
              const isExpanded = expandedRows.has(product._id);
              const hasLowVariant = product.variants?.some((v) => v.stock > 0 && v.stock < 5);
              const totalStock = product.totalStock ?? product.variants?.reduce((s, v) => s + v.stock, 0) ?? 0;

              return (
                <div key={product._id} className="group">
                  {/* Product Card */}
                  <div
                    className="p-4 flex items-start gap-3 active:bg-gray-50 transition-colors cursor-pointer"
                    onClick={() => toggleRow(product._id)}
                  >
                    {/* Expand Icon */}
                    <div className="pt-0.5 text-gray-400">
                      {isExpanded ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      {/* Top row: Name + Status + Actions */}
                      <div className="flex items-center justify-between gap-2 mb-2">
                        <div className="flex items-center gap-2 min-w-0">
                          <span className="text-sm font-bold text-gray-900 truncate">{product.name}</span>
                          {hasLowVariant && <AlertTriangle size={14} className="text-orange-400 flex-shrink-0" />}
                        </div>
                        <div className="flex items-center gap-2 flex-shrink-0">
                          <span className={mergeClasses("px-2 py-0.5 rounded-full text-[9px] font-bold tracking-wider", getStatusStyle(product.status))}>
                            {product.status}
                          </span>
                          <div onClick={(e) => e.stopPropagation()}>
                            <ActionDropdown
                              isOpen={openDropdownId === product._id}
                              onToggle={() => setOpenDropdownId(openDropdownId === product._id ? null : product._id)}
                              containerClassName="relative inline-block text-left"
                              actions={activeTab === "active" ? [
                                { label: "Edit", icon: Edit2, onClick: () => handleEditClick(product), variant: "default" },
                                { label: "Archive", icon: Trash2, onClick: () => handleDeleteClick(product), variant: "danger" },
                              ] : [
                                { label: "Restore", icon: RefreshCw, onClick: () => handleRestoreClick(product), variant: "default" },
                              ]}
                            />
                          </div>
                        </div>
                      </div>

                      {/* Meta row */}
                      <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-gray-500">
                        {product.sku && (
                          <span className="font-mono font-medium">{product.sku}</span>
                        )}
                        {product.categoryId?.name && (
                          <span className="font-medium">{product.categoryId.name}</span>
                        )}
                      </div>

                      {/* Stats row */}
                      <div className="flex items-center gap-4 mt-2.5">
                        <div className="flex flex-col">
                          <span className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider">Price</span>
                          <span className="text-sm font-bold text-gray-900">{formatCurrency(product.price)}</span>
                        </div>
                        <div className="w-px h-7 bg-gray-200" />
                        <div className="flex flex-col">
                          <span className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider">Stock</span>
                          <span className={mergeClasses("text-sm font-bold", hasLowVariant ? "text-orange-600" : "text-gray-900")}>
                            {totalStock}
                          </span>
                        </div>
                        <div className="w-px h-7 bg-gray-200" />
                        <div className="flex flex-col">
                          <span className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider">Variants</span>
                          <span className="text-sm font-bold text-gray-600">{product.variants?.length || 0}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Expanded Variants (Mobile) */}
                  <AnimatePresence>
                    {isExpanded && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        className="overflow-hidden"
                      >
                        <div className="bg-gray-50/80 border-t border-gray-100 px-4 py-3 ml-7">
                          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">Variants</p>
                          <div className="space-y-2">
                            {(product.variants || []).map((variant) => {
                              const isLow = variant.stock > 0 && variant.stock < 5;
                              const isOut = variant.stock === 0;
                              return (
                                <div
                                  key={variant._id}
                                  className="flex items-center justify-between bg-white rounded-lg px-3 py-2.5 border border-gray-100"
                                >
                                  <div className="flex items-center gap-2">
                                    <span className="text-xs font-bold text-gray-800 bg-gray-100 rounded-md px-2 py-0.5">
                                      {variant.size}
                                    </span>
                                    {isLow && <AlertTriangle size={12} className="text-orange-400" />}
                                    <span className="text-[10px] text-gray-400 font-mono">{variant.sku || ""}</span>
                                  </div>
                                  <div className="flex items-center gap-2.5">
                                    <span className={mergeClasses(
                                      "text-xs font-bold",
                                      isOut ? "text-red-500" : isLow ? "text-orange-500" : "text-gray-900"
                                    )}>
                                      {variant.stock} pcs
                                    </span>
                                    {activeTab === "active" && (
                                      <button
                                        onClick={(e) => { e.stopPropagation(); handleVariantStockEdit(product, variant); }}
                                        className="text-[10px] font-bold text-emerald-600 px-2 py-1 bg-emerald-50 rounded-md active:bg-emerald-100 transition-all"
                                      >
                                        Edit
                                      </button>
                                    )}
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>
          </>
        )}
      </div>

      <WarningModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={confirmDelete}
        title="Archive Product?"
        message={`Are you sure you want to archive "${productToDelete?.name}"? This will move it to the archived list.`}
        confirmText="Archive Product"
        variant="danger"
      />

      <ProductModal
        isOpen={isAddModalOpen}
        onClose={closeModal}
        onSave={handleSaveProduct}
        product={productToEdit}
      />

      <VariantStockModal
        isOpen={variantStockModal.open}
        onClose={() => setVariantStockModal({ open: false, product: null, variant: null })}
        product={variantStockModal.product}
        variant={variantStockModal.variant}
        onSave={handleVariantStockSave}
      />
    </motion.div>
  );
};

export default Inventory;
