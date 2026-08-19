'use client';

import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { useLanguage } from '@/context/languageContext';

export interface CategoryItem {
  _id?: string;
  name: { en: string; ar: string } | string;
  image?: string;
}

const DEFAULT_CATEGORY_IMAGES = [
  '/test-1.jpeg',
  '/test-2.jpeg',
  '/test-3.jpeg',
];

export default function Categories({ categories = [] }: { categories?: CategoryItem[] }) {
  const { t, language } = useLanguage();

  if (!categories || categories.length === 0) return null;

  return (
    <section id="categories" className="bg-[#F5EADD] py-16 sm:py-20 lg:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* HEADER */}
        <div className="text-center max-w-xl mx-auto mb-12 sm:mb-16">
          <span className="text-xs font-bold uppercase tracking-[0.25em] text-[#80608E]">
            {language === 'ar' ? 'المجموعات' : 'COLLECTIONS'}
          </span>
          <h2 className="font-serif text-3xl sm:text-5xl text-[#2A1B3D] tracking-tight font-bold mt-2">
            {language === 'ar' ? 'تسوقي حسب القسم' : 'Shop by Category'}
          </h2>
        </div>

        {/* CARDS GRID */}
        <div className="flex flex-wrap justify-center gap-6 lg:gap-8 items-stretch">
          {categories.map((category, index) => {
            const categoryName = typeof category.name === 'string' ? category.name : t(category.name);
            const imageUrl = category.image || DEFAULT_CATEGORY_IMAGES[index % DEFAULT_CATEGORY_IMAGES.length];

            return (
              <motion.div
                key={category._id || index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.08 }}
                className="w-full sm:w-[calc(50%-12px)] lg:w-[calc(25%-24px)] min-w-[260px] max-w-[320px]"
              >
                <Link
                  href={`/products?category=${category._id}`}
                  className="group relative flex flex-col justify-between h-full overflow-hidden rounded-[2rem] bg-[#FAF3EA] p-4 shadow-[0_4px_20px_rgba(42,27,61,0.04)] border border-[#E8DCD0] transition-all duration-300 hover:-translate-y-1.5 hover:shadow-xl hover:border-[#80608E]"
                >
                  {/* TOP IMAGE FRAME: Locked 1:1 Square Frame with Cover Crop */}
                 {/* <div className="relative w-full aspect-square rounded-[1.5rem] overflow-hidden bg-[#EFE3D5]">
  <Image
    src={imageUrl}
    alt={categoryName}
    fill
    sizes="(max-width: 768px) 100vw, 25vw"
    className="object-fill transition-transform duration-500 group-hover:scale-105"
  />
  
  <div className="absolute top-3 left-3 bg-[#FAF3EA]/90 backdrop-blur-md px-2.5 py-1 rounded-full text-[10px] font-bold text-[#2A1B3D] z-10">
    0{index + 1}
  </div>
</div> */}


<div className="relative w-full aspect-square rounded-[1.5rem] overflow-hidden bg-[#EFE3D5]">
  <Image
    src={imageUrl}
    alt={categoryName}
    fill
    sizes="(max-width: 768px) 100vw, 25vw"
    className="object-cover object-center transition-transform duration-500 group-hover:scale-105"
  />
</div>

                  {/* BOTTOM TEXT */}
                  <div className="p-3 pt-4">
                    <h3 className="font-serif text-xl text-[#2A1B3D] font-bold tracking-tight">
                      {categoryName}
                    </h3>
                    
                    <div className="mt-4 pt-3 border-t border-[#E8DCD0] flex items-center justify-between text-xs font-semibold text-[#80608E]">
                      <span>{language === 'ar' ? 'تصفحي المنتجات' : 'Browse Collection'}</span>
                      <ArrowRight className="w-4 h-4 rtl:rotate-180 transition-transform duration-300 group-hover:translate-x-1 rtl:group-hover:-translate-x-1" />
                    </div>
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </div>

      </div>
    </section>
  );
}