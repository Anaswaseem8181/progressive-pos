export const filterProducts = (products, searchTerm) => {
  if (!searchTerm) return products;
  const term = searchTerm.toLowerCase();
  return products.filter(
    (product) =>
      product.name.toLowerCase().includes(term) ||
      product.category.toLowerCase().includes(term)
  );
};
