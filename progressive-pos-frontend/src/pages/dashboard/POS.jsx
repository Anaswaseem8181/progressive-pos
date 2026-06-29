import { useState, useEffect } from "react";
import { useProducts } from "../../hooks/useProducts";
import { useCustomers } from "../../hooks/useCustomers";
import { usePOS } from "../../hooks/usePOS";
import { useCurrency } from "../../hooks/useCurrency";
import { useAuth } from "../../hooks/useAuth";
import OrderSuccessModal from "../../components/modals/OrderSuccess/OrderSuccessModal";
import { CustomerModal } from "../../components/modals/customers/CustomerModal";
import POSProductGrid from "../../components/dashboard/pos/POSProductList";
import POSCartSidebar from "../../components/dashboard/pos/POSCartSidebar";
import { notify } from "../../utils/notifications";

const POS = () => {
  const { user } = useAuth();
  const { products: initialProducts, updateVariantStock, fetchProducts } = useProducts();
  const { addCustomer } = useCustomers();
  const { formatCurrency } = useCurrency();
  const [isCustomerModalOpen, setIsCustomerModalOpen] = useState(false);
  const [dropdownRefreshKey, setDropdownRefreshKey] = useState(0);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const {
    cart,
    search,
    setSearch,
    selectedCustomerId,
    setSelectedCustomerId,
    showSuccessModal,
    setShowSuccessModal,
    lastSale,
    addToCart,
    removeFromCart,
    updateQuantity,
    handleCompleteOrder,
    subtotal
  } = usePOS(user);

  return (
    <div className="flex flex-col lg:flex-row gap-8 h-full">
      <POSProductGrid
        products={initialProducts}
        search={search}
        onSearchChange={setSearch}
        onAddToCart={addToCart}
        formatCurrency={formatCurrency}
      />

      <POSCartSidebar
        cart={cart}
        selectedCustomerId={selectedCustomerId}
        setSelectedCustomerId={setSelectedCustomerId}
        onUpdateQuantity={updateQuantity}
        onRemoveFromCart={removeFromCart}
        onCompleteOrder={() => handleCompleteOrder(updateVariantStock)}
        onAddCustomer={() => setIsCustomerModalOpen(true)}
        subtotal={subtotal}
        formatCurrency={formatCurrency}
        dropdownRefreshKey={dropdownRefreshKey}
      />

      <OrderSuccessModal
        isOpen={showSuccessModal}
        onClose={() => setShowSuccessModal(false)}
        sale={lastSale}
      />

      <CustomerModal
        isOpen={isCustomerModalOpen}
        onClose={() => setIsCustomerModalOpen(false)}
        onSave={async (data) => {
          const newCustomer = await addCustomer(data);
          if (newCustomer) {
            notify.success("Customer added successfully");
            setIsCustomerModalOpen(false);
            setDropdownRefreshKey(k => k + 1); // trigger re-fetch in dropdown
            setSelectedCustomerId(newCustomer._id || newCustomer.id);
          }
        }}
      />
    </div>
  );
};

export default POS;
