'use server';

import { connectDB } from '@/lib/db';
import { Product } from '@/models';
import { imagekit } from '@/lib/imagekit';
import { revalidatePath } from 'next/cache';
import mongoose from 'mongoose';

const PAGE_SIZE = 9;
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

function sanitizeFileName(fileName: string): string {
  const lastDotIndex = fileName.lastIndexOf('.');
  const ext = lastDotIndex !== -1 ? fileName.substring(lastDotIndex).toLowerCase() : '';
  const nameWithoutExt = lastDotIndex !== -1 ? fileName.substring(0, lastDotIndex) : fileName;

  const cleanName = nameWithoutExt
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/_/g, '-')
    .replace(/[^a-z0-9-]/g, '');

  return `${cleanName}-${Date.now()}${ext}`;
}

async function uploadProductImage(file: File): Promise<string> {
  if (file.size > MAX_FILE_SIZE) {
    throw new Error('Image file size exceeds the 5MB limit.');
  }

  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);
  const base64File = buffer.toString('base64');
  const cleanFileName = sanitizeFileName(file.name || 'product.png');

  const uploadResponse = await imagekit.upload({
    file: base64File,
    fileName: cleanFileName,
    folder: '/products',
    useUniqueFileName: true,
  });

  return uploadResponse.url;
}

async function deleteProductImage(imageUrl: string): Promise<void> {
  if (!imageUrl || imageUrl.startsWith('/') || imageUrl.includes('placeholder')) return;

  try {
    const fileName = imageUrl.split('/').pop() || '';
    if (!fileName) return;

    const files = await imagekit.listFiles({ searchQuery: `name="${fileName}"` });
    if (files && files.length > 0) {
      const fileId = (files[0] as { fileId: string }).fileId;
      await imagekit.deleteFile(fileId);
    }
  } catch (error) {
    console.error(`Failed to delete image from ImageKit (${imageUrl}):`, error);
  }
}

export async function getPaginatedProducts(page: number = 1, categoryId?: string) {
  try {
    await connectDB();

    const query: Record<string, any> = {};

    if (
      categoryId &&
      categoryId !== 'all' &&
      categoryId.trim() !== '' &&
      mongoose.Types.ObjectId.isValid(categoryId)
    ) {
      query.category = categoryId;
    }

    const currentPage = Math.max(1, Number(page) || 1);
    const skip = (currentPage - 1) * PAGE_SIZE;

    const [products, totalCount] = await Promise.all([
      Product.find(query)
        .populate('category', 'name')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(PAGE_SIZE)
        .lean(),
      Product.countDocuments(query),
    ]);

    return {
      success: true,
      products: JSON.parse(JSON.stringify(products)),
      totalPages: Math.ceil(totalCount / PAGE_SIZE) || 1,
      currentPage,
      totalProducts: totalCount,
    };
  } catch (error) {
    console.error('Error fetching paginated products:', error);
    return {
      success: false,
      products: [],
      totalPages: 1,
      currentPage: 1,
      totalProducts: 0,
      error: 'Failed to fetch products.',
    };
  }
}

export async function createProduct(formData: FormData) {
  try {
    await connectDB();

    const nameEn = (formData.get('nameEn') as string)?.trim();
    const nameAr = (formData.get('nameAr') as string)?.trim();
    const descEn = (formData.get('descEn') as string)?.trim() || '';
    const descAr = (formData.get('descAr') as string)?.trim() || '';
    const price = Number(formData.get('price'));
    const stock = Number(formData.get('qty'));
    const category = (formData.get('category') as string)?.trim();

    if (!nameEn || !nameAr) {
      return { success: false, error: 'Both English and Arabic names are required.' };
    }
    if (isNaN(price) || price < 0) {
      return { success: false, error: 'Please enter a valid price.' };
    }
    if (isNaN(stock) || stock < 0) {
      return { success: false, error: 'Please enter a valid stock quantity.' };
    }
    if (!category || !mongoose.Types.ObjectId.isValid(category)) {
      return { success: false, error: 'Please select a valid category.' };
    }

    const imageFile = formData.get('image') as File | null;
    let imageUrl = '/placeholder.svg';

    if (imageFile && imageFile instanceof File && imageFile.size > 0) {
      imageUrl = await uploadProductImage(imageFile);
    }

    const product = await Product.create({
      name: { en: nameEn, ar: nameAr },
      description: { en: descEn, ar: descAr },
      price,
      stock,
      category,
      image: imageUrl,
    });

    revalidatePath('/products');
    revalidatePath('/admin/products');
    revalidatePath('/');

    return {
      success: true,
      data: JSON.parse(JSON.stringify(product)),
      message: 'Product created successfully.',
    };
  } catch (error: any) {
    console.error('Failed to create product:', error);
    return { success: false, error: error?.message || 'Failed to create product.' };
  }
}

export async function updateProduct(id: string, formData: FormData) {
  try {
    await connectDB();

    if (!id || !mongoose.Types.ObjectId.isValid(id)) {
      return { success: false, error: 'Invalid Product ID.' };
    }

    const existingProduct = await Product.findById(id);
    if (!existingProduct) {
      return { success: false, error: 'Product not found.' };
    }

    const nameEn = (formData.get('nameEn') as string)?.trim();
    const nameAr = (formData.get('nameAr') as string)?.trim();
    const descEn = (formData.get('descEn') as string)?.trim() || '';
    const descAr = (formData.get('descAr') as string)?.trim() || '';
    const price = Number(formData.get('price'));
    const stock = Number(formData.get('qty'));
    const category = (formData.get('category') as string)?.trim();

    const imageFile = formData.get('image') as File | null;
    let finalImageUrl = existingProduct.image;

    // If a new image is provided, upload it and delete the old one
    if (imageFile && imageFile instanceof File && imageFile.size > 0) {
      if (existingProduct.image) {
        await deleteProductImage(existingProduct.image);
      }
      finalImageUrl = await uploadProductImage(imageFile);
    }

    const updatedProduct = await Product.findByIdAndUpdate(
      id,
      {
        name: { en: nameEn, ar: nameAr },
        description: { en: descEn, ar: descAr },
        price,
        stock,
        category,
        image: finalImageUrl,
      },
      { new: true }
    ).lean();

    revalidatePath('/products');
    revalidatePath('/admin/products');
    revalidatePath('/');

    return {
      success: true,
      data: JSON.parse(JSON.stringify(updatedProduct)),
      message: 'Product updated successfully.',
    };
  } catch (error: any) {
    console.error('Failed to update product:', error);
    return { success: false, error: error?.message || 'Failed to update product.' };
  }
}

export async function deleteProduct(id: string) {
  try {
    await connectDB();

    if (!id || !mongoose.Types.ObjectId.isValid(id)) {
      return { success: false, error: 'Invalid Product ID.' };
    }

    const product = await Product.findById(id);
    if (!product) {
      return { success: false, error: 'Product not found.' };
    }

    if (product.image) {
      await deleteProductImage(product.image);
    }

    await Product.findByIdAndDelete(id);

    revalidatePath('/products');
    revalidatePath('/admin/products');
    revalidatePath('/');

    return { success: true, message: 'Product deleted successfully.' };
  } catch (error) {
    console.error('Failed to delete product:', error);
    return { success: false, error: 'Failed to delete product.' };
  }
}




export async function getProductById(id: string) {
  try {
    await connectDB();

    if (!id || !mongoose.Types.ObjectId.isValid(id)) {
      return { success: false, product: null, error: 'Invalid Product ID.' };
    }

    const rawProduct = await Product.findById(id)
      .populate('category', 'name')
      .lean();

    if (!rawProduct) {
      return { success: false, product: null, error: 'Product not found.' };
    }

    const serialized = JSON.parse(JSON.stringify(rawProduct));

    const product = {
      ...serialized,
      stock: serialized.stock ?? serialized.qty ?? 0,
      image: serialized.image ?? (Array.isArray(serialized.images) ? serialized.images[0] : '/placeholder.svg'),
    };

    return {
      success: true,
      product,
    };
  } catch (error: any) {
    console.error(`Error fetching product by ID (${id}):`, error);
    return {
      success: false,
      product: null,
      error: error?.message || 'Failed to fetch product.',
    };
  }
}