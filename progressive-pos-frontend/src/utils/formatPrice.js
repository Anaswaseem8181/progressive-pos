
export const formatPrice = (amount, currency = 'PKR') => {
  if (amount === undefined || amount === null) return "0";

  return `${currency} ${amount.toLocaleString()}`;
};
