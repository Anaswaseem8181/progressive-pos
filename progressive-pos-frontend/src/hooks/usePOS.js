import { useState } from "react";
import { calculateCartSubtotal } from "../utils/calculateCart";
import orderService from "../api/orderService";
import { notify } from "../utils/notifications";

export const usePOS = (currentUser = null) => {
  const [cart, setCart] = useState([]);
  const [search, setSearch] = useState("");
  const [selectedCustomerId, setSelectedCustomerId] = useState("");
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [lastSale, setLastSale] = useState(null);

  const addToCart = (product, variant) => {
    const itemId = `${product._id}_${variant._id}`;

    const existing = cart.find((item) => item.id === itemId);
    if (existing) {
      if (existing.quantity >= variant.stock) {
        notify.warning(`Only ${variant.stock} available in stock.`);
        return;
      }
      setCart(
        cart.map((item) =>
          item.id === itemId
            ? { ...item, quantity: item.quantity + 1 }
            : item
        )
      );
    } else {
      if (variant.stock < 1) {
        notify.error("Out of stock");
        return;
      }
      setCart([
        ...cart,
        {
          id: itemId,
          productId: product._id,
          variantId: variant._id,
          name: product.name,
          size: variant.size,
          stock: variant.stock,
          price: product.price,
          quantity: 1,
        },
      ]);
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

  const setExactQuantity = (id, value) => {
    setCart(
      cart.map((item) => {
        if (item.id === id) {
          let newQty = parseInt(value, 10);
          if (isNaN(newQty) || newQty < 1) newQty = 1;
          if (newQty > item.stock) {
            notify.warning(`Only ${item.stock} available in stock.`);
            return { ...item, quantity: item.stock };
          }
          return { ...item, quantity: newQty };
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

  /**
   * Complete order — calls the backend which atomically:
   * 1. Validates stock
   * 2. Creates the order in MongoDB
   * 3. Deducts variant stock
   * Rolls back everything if any step fails.
   *
   * Note: `updateVariantStock` param is kept for API compatibility
   * but stock is now handled server-side inside the transaction.
   */
  const handleCompleteOrder = async () => {
    if (cart.length === 0) return;

    const orderPayload = {
      customerId: selectedCustomerId || null,
      billedBy: `${currentUser?.name || "User"} (${currentUser?.role || "Staff"})`,
      items: cart.map((item) => ({
        productId: item.productId,
        variantId: item.variantId,
        name: item.name,
        size: item.size,
        qty: item.quantity,
        price: item.price,
      })),
    };

    try {
      const response = await orderService.createOrder(orderPayload);
      if (response.success) {
        setLastSale(response.data);
        setShowSuccessModal(true);
        clearCart();
        notify.success("Order processed successfully");
        return response.data;
      }
    } catch (err) {
      const msg = err.response?.data?.message || "Failed to process order. Please try again.";
      notify.error(msg);
      throw err;
    }
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
    setExactQuantity,
    clearCart,
    handleCompleteOrder,
    subtotal,
  };
};
