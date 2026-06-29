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

  const addToCart = (product, variant) => {
    // Unique ID for the cart item is a combination of product and variant
    const itemId = `${product._id}_${variant._id}`;
    
    const existing = cart.find((item) => item.id === itemId);
    if (existing) {
      // Check if we have enough stock
      if (existing.quantity >= variant.stock) {
        notify.warning(`Only ${variant.stock} available in stock.`);
        return;
      }
      
      setCart(
        cart.map((item) =>
          item.id === itemId
            ? { ...item, quantity: item.quantity + 1 }
            : item,
        ),
      );
    } else {
      if (variant.stock < 1) {
        notify.error("Out of stock");
        return;
      }
      
      setCart([...cart, { 
        id: itemId, 
        productId: product._id,
        variantId: variant._id,
        name: product.name, 
        size: variant.size,
        stock: variant.stock,
        price: product.price, 
        quantity: 1 
      }]);
    }
    notify.info(`${product.name} (${variant.size}) added to cart`, { autoClose: 1000 });
  };

  const updateQuantity = (id, delta) => {
    setCart(
      cart.map((item) => {
        if (item.id === id) {
          const newQty = item.quantity + delta;
          if (newQty > item.stock) {
            notify.warning(`Only ${item.stock} available in stock.`);
            return item;
          }
          return { ...item, quantity: Math.max(1, newQty) };
        }
        return item;
      })
    );
  };

  const removeFromCart = (id) => {
    setCart(cart.filter((item) => item.id !== id));
  };

  const clearCart = () => {
    setCart([]);
  };

  // updateVariantStock is passed from useProducts to actually update the DB
  const handleCompleteOrder = async (updateVariantStock) => {
    if (cart.length === 0) return;

    // Deduct stock for every item
    if (updateVariantStock) {
      try {
        for (const item of cart) {
          await updateVariantStock(item.productId, item.variantId, -item.quantity);
        }
      } catch (err) {
        console.error("Failed to deduct stock:", err);
      }
    }

    const saleData = {
      customerId: selectedCustomerId || null,
      amount: subtotal,
      billedBy: `${currentUser?.name || "User"} (${currentUser?.role || "Staff"})`,
      items: cart.map(item => ({
        name: item.name,
        size: item.size,
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
