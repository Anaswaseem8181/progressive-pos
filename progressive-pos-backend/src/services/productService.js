import Product from '../models/Product.js';
import AppError from '../utils/AppError.js';

async function findOwnedProduct(productId, businessId) {
  const product = await Product.findOne({ _id: productId, businessId });
  if (!product) {
    throw new AppError('Product not found', 404);
  }
  return product;
}

async function populateProduct(productId) {
  return Product.findById(productId).populate('categoryId', 'name');
}

export const listProducts = async (businessId, isDeleted) => {
  const products = await Product.find({ businessId, isDeleted })
    .populate('categoryId', 'name')
    .sort({ createdAt: -1 });
  return products;
};

export const createProduct = async ({ name, sku, price, categoryId, variants, businessId }) => {
  const productExists = await Product.findOne({ name, businessId, isDeleted: false });
  if (productExists) {
    throw new AppError('A product with this name already exists', 400);
  }

  if (sku) {
    const skuExists = await Product.findOne({ sku, businessId, isDeleted: false });
    if (skuExists) {
      throw new AppError('A product with this SKU already exists', 400);
    }
  }

  const product = await Product.create({
    name,
    sku: sku || '',
    price,
    variants: variants || [],
    categoryId,
    businessId,
  });

  return populateProduct(product._id);
};

export const updateProduct = async (productId, businessId, { name, sku, price, categoryId, variants }) => {
  const product = await findOwnedProduct(productId, businessId);

  if (name && name !== product.name) {
    const nameExists = await Product.findOne({ name, businessId, isDeleted: false, _id: { $ne: product._id } });
    if (nameExists) {
      throw new AppError('A product with this name already exists', 400);
    }
  }

  if (sku && sku !== product.sku) {
    const skuExists = await Product.findOne({ sku, businessId, isDeleted: false, _id: { $ne: product._id } });
    if (skuExists) {
      throw new AppError('A product with this SKU already exists', 400);
    }
  }

  product.name = name || product.name;
  product.sku = sku !== undefined ? sku : product.sku;
  product.price = price !== undefined ? price : product.price;
  product.categoryId = categoryId || product.categoryId;
  if (variants !== undefined) product.variants = variants;

  await product.save();

  return populateProduct(product._id);
};

export const updateVariantStock = async (productId, businessId, variantId, quantity) => {
  if (variantId === undefined || quantity === undefined) {
    throw new AppError('variantId and quantity are required', 400);
  }

  const product = await Product.findOne({ _id: productId, businessId, isDeleted: false });
  if (!product) {
    throw new AppError('Product not found', 404);
  }

  const variant = product.variants.id(variantId);
  if (!variant) {
    throw new AppError('Variant not found', 404);
  }

  const newStock = variant.stock + quantity;
  if (newStock < 0) {
    throw new AppError(`Insufficient stock. Available: ${variant.stock}`, 400);
  }

  variant.stock = newStock;
  await product.save();

  return populateProduct(product._id);
};

export const softDeleteProduct = async (productId, businessId) => {
  const product = await findOwnedProduct(productId, businessId);

  product.isDeleted = true;
  await product.save();

  return { message: 'Product archived successfully' };
};

export const restoreProduct = async (productId, businessId) => {
  const product = await findOwnedProduct(productId, businessId);

  const nameExists = await Product.findOne({ name: product.name, businessId, isDeleted: false });
  if (nameExists) {
    throw new AppError('Cannot restore: An active product with this name already exists', 400);
  }

  if (product.sku) {
    const skuExists = await Product.findOne({ sku: product.sku, businessId, isDeleted: false });
    if (skuExists) {
      throw new AppError('Cannot restore: An active product with this SKU already exists', 400);
    }
  }

  product.isDeleted = false;
  await product.save();

  return populateProduct(product._id);
};
