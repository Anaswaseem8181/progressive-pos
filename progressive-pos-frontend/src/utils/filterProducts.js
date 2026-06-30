export const filterProducts = (products, searchTerm) => {
  if (!searchTerm) return products;
  const term = searchTerm.toLowerCase();
  return products.filter((product) => {
    const name = product.name?.toLowerCase() ?? "";
    const category = (product.categoryId?.name || product.category || "").toLowerCase();
    return name.includes(term) || category.includes(term);
  });
};
