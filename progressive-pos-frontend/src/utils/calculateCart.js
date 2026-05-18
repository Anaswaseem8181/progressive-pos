export const calculateCartSubtotal = (cart) => {
  if (!Array.isArray(cart)) return 0;
  return cart.reduce((acc, item) => acc + (item.price * item.quantity), 0);
};
