import Category from '../models/Category.js';
import User from '../models/User.js';
import AppError from '../utils/AppError.js';

async function findOwnedCategory(categoryId, businessId) {
  const category = await Category.findOne({ _id: categoryId, businessId });
  if (!category) {
    throw new AppError('Category not found', 404);
  }
  return category;
}

export const listCategories = async (businessId) => {
  let categories = await Category.find({
    businessId,
    isArchived: false,
  }).sort({ createdAt: -1 });

  if (categories.length === 0) {
    const user = await User.findById(businessId);
    if (user && user.businessCategory) {
      const defaultCategory = await Category.create({
        name: user.businessCategory,
        description: 'Default auto-generated category',
        businessId: user._id,
        createdBy: user._id,
      });
      categories = [defaultCategory];
    }
  }

  return categories;
};

export const createCategory = async ({ name, description, businessId, createdBy }) => {
  const categoryExists = await Category.findOne({ name, businessId, isArchived: false });
  if (categoryExists) {
    throw new AppError('A category with this name already exists', 400);
  }

  const category = await Category.create({
    name,
    description,
    businessId,
    createdBy,
  });

  return category;
};

export const updateCategory = async (categoryId, businessId, { name, description }) => {
  const category = await findOwnedCategory(categoryId, businessId);

  if (name && name !== category.name) {
    const categoryExists = await Category.findOne({ name, businessId, isArchived: false });
    if (categoryExists) {
      throw new AppError('A category with this name already exists', 400);
    }
  }

  category.name = name || category.name;
  category.description = description !== undefined ? description : category.description;

  const updatedCategory = await category.save();
  return updatedCategory;
};

export const archiveCategory = async (categoryId, businessId) => {
  const category = await findOwnedCategory(categoryId, businessId);

  category.isArchived = true;
  await category.save();

  return { message: 'Category archived successfully' };
};
