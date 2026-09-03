'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import NextLink from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Tag, MessageCircle } from 'lucide-react';
import { useLanguage } from '@/context/languageContext';
import { createWhatsAppOrderLink } from '@/lib/whatsapp';

export interface ProductItem {
  _id: string;
  name: { en: string; ar: string } | string;
  price: number;
  stock: number;
  image: string;
  category: {
    _id: string;
    name: { en: string; ar: string } | string;
  } | string;
}

export interface CategoryItem {
  _id: string;
  name: { en: string; ar: string } | string;
}

interface ProductsGridProps {
  products: ProductItem[];
  categories: CategoryItem[];
  currentPage: number;
  totalPages: number;
  totalProducts: number;
  selectedCategoryId: string;
}

export default function ProductsGrid({
  products,
  categories,
  currentPage,
  totalPages,
  selectedCategoryId,
}: ProductsGridProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { t, language } = useLanguage();
  const [origin, setOrigin] = useState('');

  useEffect(() => {
    setOrigin(window.location.origin);
  }, []);

  const getLocalizedName = (nameObj: { en: string; ar: string } | string) => {
    return typeof nameObj === 'string' ? nameObj : t(nameObj);
  };

  const getCategoryName = (category: ProductItem['category']) => {
    if (typeof category === 'object' && category?.name) {
      return getLocalizedName(category.name);
    }
    return '';
  };

  const updateUrlParams = (newCategory?: string, newPage?: number) => {
    const params = new URLSearchParams(searchParams.toString());

    if (newCategory !== undefined) {
      if (newCategory === 'all') {
        params.delete('category');
      } else {
        params.set('category', newCategory);
      }
      params.set('page', '1');
    }

    if (newPage !== undefined) {
      params.set('page', newPage.toString());
    }

    router.push(`/products?${params.toString()}`);
  };

  return (
    <div className="space-y-10">
      {/* CATEGORY FILTER CHIPS */}
      <div className="flex flex-wrap items-center justify-center gap-2 bg-white p-4 rounded-3xl border-2 border-[#D8CDE0] shadow-[0_4px_20px_rgba(42,27,61,0.04)]">
        <button
          onClick={() => updateUrlParams('all')}
          className={`px-5 py-2.5 rounded-full text-xs font-bold transition-all duration-200 ${
            selectedCategoryId === 'all'
              ? 'bg-[#5C3D6A] text-white shadow-md'
              : 'bg-[#FAF9F6] text-[#3D3442] hover:bg-[#EFECE8] border border-[#E0D7E5]'
          }`}
        >
          {language === 'ar' ? 'الكل' : 'All Products'}
        </button>

        {categories.map((category) => {
          const isActive = selectedCategoryId === category._id;
          return (
            <button
              key={category._id}
              onClick={() => updateUrlParams(category._id)}
              className={`px-5 py-2.5 rounded-full text-xs font-bold transition-all duration-200 ${
                isActive
                  ? 'bg-[#5C3D6A] text-white shadow-md'
                  : 'bg-[#FAF9F6] text-[#3D3442] hover:bg-[#EFECE8] border border-[#E0D7E5]'
              }`}
            >
              {getLocalizedName(category.name)}
            </button>
          );
        })}
      </div>

      {/* PRODUCTS GRID (3 COLUMNS) */}
      {products.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-3xl border-2 border-[#D8CDE0] p-8">
          <Tag className="w-12 h-12 text-[#80608E] mx-auto mb-4 opacity-50" />
          <h3 className="font-serif text-2xl font-bold text-[#2A1B3D]">
            {language === 'ar' ? 'لا توجد منتجات متاحة' : 'No Products Found'}
          </h3>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <AnimatePresence mode="popLayout">
            {products.map((product, index) => {
              const productName = getLocalizedName(product.name);
              const categoryName = getCategoryName(product.category);
              const mainImage = product.image || '/placeholder.svg';
              const productUrl = `${origin}/products/${product._id}`;
              const whatsappLink = createWhatsAppOrderLink({
                productName,
                productUrl,
                language,
              });

              return (
                <motion.div
                  key={product._id}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -15 }}
                  transition={{ duration: 0.3, delay: index * 0.04 }}
                  className="flex flex-col h-full bg-white rounded-[2rem] overflow-hidden border-2 border-[#D8CDE0] shadow-[0_4px_20px_rgba(42,27,61,0.04)] transition-all duration-300 hover:-translate-y-1.5 hover:shadow-xl hover:border-[#80608E]"
                >
                  {/* Option B: Fixed Aspect-Square Frame with Focused Object-Cover */}
                  <NextLink
                    href={`/products/${product._id}`}
                    className="relative w-full aspect-square bg-[#FAF9F6] overflow-hidden border-b border-[#E5DCEB] group block"
                  >
                    <Image
                      src={mainImage}
                      alt={productName}
                      fill
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      className="object-cover object-center transition-transform duration-500 group-hover:scale-105"
                    />
                    {categoryName && (
                      <span className="absolute top-4 ltr:left-4 rtl:right-4 bg-white/90 backdrop-blur-md px-3.5 py-1 rounded-full text-[11px] font-bold text-[#5C3D6A] border border-[#E5DCEB] z-10">
                        {categoryName}
                      </span>
                    )}
                  </NextLink>

                  {/* Body Content */}
                  <div className="p-6 flex flex-col justify-between flex-1 space-y-4">
                    <div>
                      <NextLink href={`/products/${product._id}`}>
                        <h3 className="font-serif text-xl font-bold text-[#2A1B3D] hover:text-[#80608E] transition-colors line-clamp-1">
                          {productName}
                        </h3>
                      </NextLink>

                      <div className="mt-2 flex items-center justify-between text-xs font-semibold text-gray-500">
                        <span>
                          {language === 'ar' ? 'الكمية المتاحة:' : 'Stock:'}{' '}
                          <strong className="text-[#2A1B3D]">{product.stock ?? 0}</strong>
                        </span>
                      </div>
                    </div>

                    {/* Footer: Price & WhatsApp Action */}
                    <div className="pt-4 border-t border-[#E5DCEB] flex items-center justify-between gap-3">
                      <span className="font-serif text-xl font-bold text-[#5C3D6A]">
                        {product.price?.toLocaleString()} EGP
                      </span>

                      <a
                        href={whatsappLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 bg-[#25D366] hover:bg-[#20bd5a] text-white px-4 py-2.5 rounded-full text-xs font-bold transition-all shadow-sm hover:shadow-md shrink-0"
                      >
                        <MessageCircle className="w-4 h-4 fill-white" />
                        <span>{language === 'ar' ? 'اطلبي عبر واتساب' : 'Order WhatsApp'}</span>
                      </a>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      )}

      {/* PAGINATION CONTROLS */}
      {/* PAGINATION CONTROLS */}
{totalPages > 1 && (
  <div className="flex items-center justify-center gap-2 pt-6 w-full max-w-full">
    <button
      disabled={currentPage <= 1}
      onClick={() => updateUrlParams(undefined, currentPage - 1)}
      className="p-2.5 sm:p-3 rounded-full border-2 border-[#D8CDE0] bg-white text-[#2A1B3D] hover:border-[#80608E] disabled:opacity-40 disabled:cursor-not-allowed transition-all shrink-0"
    >
      <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5 rtl:rotate-180" />
    </button>

    {/* Scrollable container for page numbers */}
    <div className="flex items-center gap-1.5 sm:gap-2 overflow-x-auto no-scrollbar py-1 px-1 max-w-[60vw] sm:max-w-none">
      {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
        <button
          key={page}
          onClick={() => updateUrlParams(undefined, page)}
          className={`w-8 h-8 sm:w-10 sm:h-10 rounded-full text-xs font-bold transition-all shrink-0 ${
            page === currentPage
              ? 'bg-[#5C3D6A] text-white shadow-md'
              : 'bg-white border-2 border-[#D8CDE0] text-[#2A1B3D] hover:border-[#80608E]'
          }`}
        >
          {page}
        </button>
      ))}
    </div>

    <button
      disabled={currentPage >= totalPages}
      onClick={() => updateUrlParams(undefined, currentPage + 1)}
      className="p-2.5 sm:p-3 rounded-full border-2 border-[#D8CDE0] bg-white text-[#2A1B3D] hover:border-[#80608E] disabled:opacity-40 disabled:cursor-not-allowed transition-all shrink-0"
    >
      <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5 rtl:rotate-180" />
    </button>
  </div>
)}
    </div>
  );
}