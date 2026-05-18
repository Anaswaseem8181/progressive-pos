import { useState } from "react";
import { calculateCartSubtotal } from "../utils/calculateCart";
import { mockDb } from "../utils/mockDb";
import { notify } from "../utils/notifications";

export const usePOS = (currentUser = null) => {
  const [cart, setCart] = useState([]);
  const [search, setSearch] = useState("");
  const [selectedCustomerId, setSelectedCustomerId] = useState("");
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [lastSale, setLastSale] = useState(null);

  const addToCart = (product) => {
    const existing = cart.find((item) => item.id === product.id);
    if (existing) {
      setCart(
        cart.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item,
        ),
      );
    } else {
      setCart([...cart, { ...product, quantity: 1 }]);
    }
    notify.info(`${product.name} added to cart`, { autoClose: 1000 });
  };

  const updateQuantity = (id, delta) => {
    setCart(
      cart.map((item) =>
        item.id === id
          ? { ...item, quantity: Math.max(1, item.quantity + delta) }
          : item,
      ),
    );
  };

  const removeFromCart = (id) => {
    setCart(cart.filter((item) => item.id !== id));
  };

  const clearCart = () => {
    setCart([]);
  };

  const handleCompleteOrder = () => {
    if (cart.length === 0) return;

    const saleData = {
      customerId: selectedCustomerId || null,
      amount: subtotal,
      billedBy: `${currentUser?.name || "User"} (${currentUser?.role || "Staff"})`,
      items: cart.map(item => ({
        name: item.name,
        qty: item.quantity,
        price: item.price
      }))
    };

    const result = mockDb.saveSale(saleData);
    setLastSale(result);
    setShowSuccessModal(true);
    clearCart();
    notify.success("Order processed successfully");
    return result;
  };

  const subtotal = calculateCartSubtotal(cart);

  return {
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
    clearCart,
    handleCompleteOrder,
    subtotal
  };
};
