import mongoose from 'mongoose';

const variantSchema = new mongoose.Schema(
  {
    size: {
      type: String,
      required: [true, 'Please add a size'],
      trim: true,
    },
    sku: {
      type: String,
      trim: true,
      default: '',
    },
    stock: {
      type: Number,
      required: [true, 'Please add a stock quantity'],
      default: 0,
      min: [0, 'Stock cannot be negative'],
    },
  },
  { _id: true }
);

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please add a product name'],
      trim: true,
    },
    sku: {
      type: String,
      trim: true,
      default: '',
    },
    price: {
      type: Number,
      required: [true, 'Please add a price'],
      default: 0,
      min: [0, 'Price cannot be negative'],
    },
    variants: {
      type: [variantSchema],
      default: [],
      validate: {
        validator: function (v) {
          return v && v.length > 0;
        },
        message: 'At least one variant (size) is required',
      },
    },
    categoryId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Category',
      required: true,
    },
    businessId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

// Virtual for total stock (sum of all variant stocks)
productSchema.virtual('totalStock').get(function () {
  if (!this.variants || this.variants.length === 0) return 0;
  return this.variants.reduce((sum, v) => sum + v.stock, 0);
});

// Virtual for status based on totalStock
productSchema.virtual('status').get(function () {
  const total = this.totalStock;
  if (total >= 10) return 'IN STOCK';
  if (total > 0) return 'LOW STOCK';
  return 'OUT OF STOCK';
});

// Virtual to check if any variant has low stock (< 5)
productSchema.virtual('hasLowStockVariant').get(function () {
  if (!this.variants || this.variants.length === 0) return false;
  return this.variants.some((v) => v.stock > 0 && v.stock < 5);
});

// Ensure virtuals are included in JSON/Object conversion
productSchema.set('toJSON', { virtuals: true });
productSchema.set('toObject', { virtuals: true });

// Partial index for unique active product names per business
productSchema.index(
  { name: 1, businessId: 1 },
  { unique: true, partialFilterExpression: { isDeleted: false } }
);

// Partial index for unique active product SKU per business
productSchema.index(
  { sku: 1, businessId: 1 },
  {
    unique: true,
    partialFilterExpression: {
      isDeleted: false,
      sku: { $type: 'string', $ne: '' },
    },
  }
);

const Product = mongoose.model('Product', productSchema);

export default Product;
