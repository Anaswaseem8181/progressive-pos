import mongoose from 'mongoose';

const categorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please add a category name'],
      trim: true,
    },
    slug: {
      type: String,
      lowercase: true,
    },
    description: {
      type: String,
      default: '',
    },
    businessId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    isArchived: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

// Auto-trim and generate slug
categorySchema.pre('save', function () {
  if (this.isModified('name')) {
    this.name = this.name.trim();
    this.slug = this.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
  }
});

// Partial index for unique active category names per business
categorySchema.index(
  { name: 1, businessId: 1 },
  { unique: true, partialFilterExpression: { isArchived: false } }
);

const Category = mongoose.model('Category', categorySchema);

export default Category;
