'use server';

import { connectDB } from '@/lib/db';
import { Category } from '@/models/Category';
import { Product } from '@/models/Product';
import { imagekit } from '@/lib/imagekit';
import { revalidatePath } from 'next/cache';
import mongoose from 'mongoose';

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB in bytes

/**
 * Sanitizes file names to prevent ImageKit reserved character errors
 */
function sanitizeFileName(fileName: string): string {
  const lastDotIndex = fileName.lastIndexOf('.');

  const ext = lastDotIndex !== -1 ? fileName.substring(lastDotIndex).toLowerCase() : '';
  const nameWithoutExt = lastDotIndex !== -1 ? fileName.substring(0, lastDotIndex) : fileName;

  const cleanName = nameWithoutExt
    .toLowerCase()
    .replace(/\s+/g, '-')             // Replace spaces with hyphens
    .replace(/_/g, '-')              // Replace underscores with hyphens
    .replace(/[^a-z0-9-]/g, '');      // Strip special characters

  return `${cleanName}${ext}`;
}

/**
 * Helper to upload an image to ImageKit with strict 5MB size check
 */
async function uploadCategoryImage(file: File): Promise<{ url: string; fileId: string }> {
  if (file.size > MAX_FILE_SIZE) {
    throw new Error('the image size is so big');
  }

  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);
  const base64File = buffer.toString('base64');
  const cleanFileName = sanitizeFileName(file.name || 'category.png');

  const uploadResponse = await imagekit.upload({
    file: base64File,
    fileName: cleanFileName,
    folder: '/categories',
    useUniqueFileName: true,
  });

  return {
    url: uploadResponse.url,
    fileId: uploadResponse.fileId,
  };
}

/**
 * Helper to safely delete an image from ImageKit
 */
async function deleteCategoryImage(imageUrl: string): Promise<void> {
  if (!imageUrl) return;

  try {
    const fileName = imageUrl.split('/').pop() || '';
    if (!fileName) return;

    const files = await imagekit.listFiles({ searchQuery: `name="${fileName}"` });
    if (files && files.length > 0) {
      const fileId = (files[0] as { fileId: string }).fileId;
      await imagekit.deleteFile(fileId);
    }
  } catch (error) {
    console.error('Failed to delete image from ImageKit:', error);
  }
}

/**
 * 1. GET ALL CATEGORIES
 */
export async function getCategories() {
  try {
    await connectDB();
    const categories = await Category.find().sort({ createdAt: -1 }).lean();
    
    return { 
      success: true, 
      data: JSON.parse(JSON.stringify(categories)) 
    };
  } catch (error) {
    console.error('Failed to fetch categories:', error);
    return { 
      success: false, 
      data: [], 
      error: 'Failed to load categories. Please try refreshing.' 
    };
  }
}

/**
 * 2. GET CATEGORY BY ID
 */
export async function getCategoryById(id: string) {
  try {
    await connectDB();

    if (!id?.trim() || !mongoose.Types.ObjectId.isValid(id.trim())) {
      return { success: false, error: 'Invalid or missing Category ID.' };
    }

    const category = await Category.findById(id.trim()).lean();
    if (!category) {
      return { success: false, error: 'Category not found.' };
    }

    return { 
      success: true, 
      data: JSON.parse(JSON.stringify(category)) 
    };
  } catch (error) {
    console.error('Failed to fetch category:', error);
    return { success: false, error: 'Failed to fetch category details.' };
  }
}

/**
 * 3. CREATE CATEGORY
 */
export async function createCategory(formData: FormData) {
  try {
    await connectDB();

    const nameEn = (formData.get('nameEn') as string)?.trim();
    const nameAr = (formData.get('nameAr') as string)?.trim();
    const imageFile = formData.get('image') as File | null;

    // Validation: Names
    if (!nameEn || !nameAr) {
      return { success: false, error: 'Both English and Arabic category names are required.' };
    }

    // Check for duplicate names
    const existingCategory = await Category.findOne({
      $or: [{ 'name.en': nameEn }, { 'name.ar': nameAr }],
    }).lean();

    if (existingCategory) {
      return { success: false, error: 'A category with this English or Arabic name already exists.' };
    }

    let imageUrl = '';

    // Validation & Upload: Image
    if (imageFile && imageFile.size > 0) {
      if (imageFile.size > MAX_FILE_SIZE) {
        return { success: false, error: 'the image size is so big' };
      }

      const uploadResult = await uploadCategoryImage(imageFile);
      imageUrl = uploadResult.url;
    }

    // Save to Database
    const category = await Category.create({
      name: { en: nameEn, ar: nameAr },
      image: imageUrl,
    });

    revalidatePath('/admin/categories');
    revalidatePath('/categories');
    revalidatePath('/');

    return { 
      success: true, 
      data: JSON.parse(JSON.stringify(category)),
      message: 'Category created successfully.' 
    };
  } catch (error: any) {
    console.error('Failed to create category:', error);
    
    if (error?.message === 'the image size is so big') {
      return { success: false, error: 'the image size is so big' };
    }

    return { success: false, error: 'Failed to create category. Please try again.' };
  }
}

/**
 * 4. UPDATE CATEGORY
 */
export async function updateCategory(id: string, formData: FormData) {
  try {
    await connectDB();

    if (!id?.trim() || !mongoose.Types.ObjectId.isValid(id.trim())) {
      return { success: false, error: 'Invalid or missing Category ID.' };
    }

    const category = await Category.findById(id.trim());
    if (!category) {
      return { success: false, error: 'Category not found.' };
    }

    const nameEn = (formData.get('nameEn') as string)?.trim();
    const nameAr = (formData.get('nameAr') as string)?.trim();
    const newImageFile = formData.get('image') as File | null;

    if (!nameEn || !nameAr) {
      return { success: false, error: 'Both English and Arabic category names are required.' };
    }

    // Duplicate check for updated names (excluding current record)
    const duplicateCategory = await Category.findOne({
      _id: { $ne: category._id },
      $or: [{ 'name.en': nameEn }, { 'name.ar': nameAr }],
    }).lean();

    if (duplicateCategory) {
      return { success: false, error: 'Another category with this English or Arabic name already exists.' };
    }

    let updatedImageUrl = category.image;

    // Handle Image Replacement
    if (newImageFile && newImageFile.size > 0) {
      if (newImageFile.size > MAX_FILE_SIZE) {
        return { success: false, error: 'the image size is so big' };
      }

      // Delete previous image from ImageKit
      if (category.image) {
        await deleteCategoryImage(category.image);
      }

      // Upload new image
      const uploadResult = await uploadCategoryImage(newImageFile);
      updatedImageUrl = uploadResult.url;
    }

    category.name = { en: nameEn, ar: nameAr };
    category.image = updatedImageUrl;
    await category.save();

    revalidatePath('/admin/categories');
    revalidatePath('/categories');
    revalidatePath('/');

    return { 
      success: true, 
      data: JSON.parse(JSON.stringify(category)),
      message: 'Category updated successfully.' 
    };
  } catch (error: any) {
    console.error('Failed to update category:', error);

    if (error?.message === 'the image size is so big') {
      return { success: false, error: 'the image size is so big' };
    }

    return { success: false, error: 'Failed to update category.' };
  }
}

/**
 * 5. DELETE CATEGORY
 */
export async function deleteCategory(id: string) {
  try {
    await connectDB();

    if (!id?.trim() || !mongoose.Types.ObjectId.isValid(id.trim())) {
      return { success: false, error: 'Invalid or missing Category ID.' };
    }

    const category = await Category.findById(id.trim());
    if (!category) {
      return { success: false, error: 'Category not found.' };
    }

    // Safety check: Don't allow deletion if products are linked to this category
    const linkedProductsCount = await Product.countDocuments({ category: category._id });
    if (linkedProductsCount > 0) {
      return { 
        success: false, 
        error: `Cannot delete category. It is currently linked to ${linkedProductsCount} product(s).` 
      };
    }

    // Delete image from ImageKit
    if (category.image) {
      await deleteCategoryImage(category.image);
    }

    // Delete category from database
    await Category.findByIdAndDelete(category._id);

    revalidatePath('/admin/categories');
    revalidatePath('/categories');
    revalidatePath('/');

    return { success: true, message: 'Category deleted successfully.' };
  } catch (error) {
    console.error('Failed to delete category:', error);
    return { success: false, error: 'Failed to delete category.' };
  }
}