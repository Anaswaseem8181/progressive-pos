import { formatPrice } from "../utils/formatPrice";
import { useAuth } from "./useAuth";
import { defaultCurrency } from "../data";

export const useCurrency = () => {
  const { user } = useAuth();

  const currency = user?.currency || defaultCurrency || "PKR";

  const formatCurrency = (amount) => formatPrice(amount, currency);

  return { currency, formatCurrency };
};
