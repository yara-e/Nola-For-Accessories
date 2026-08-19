'use client';

import { useLanguage } from '@/context/languageContext';

export default function ProductsHeader() {
  const { language } = useLanguage();

  return (
    <div className="text-center max-w-xl mx-auto mb-10 space-y-2">
      <span className="text-xs font-bold uppercase tracking-[0.25em] text-[#80608E]">
        {language === 'ar' ? ' نولا' : 'NOLA'}
      </span>
      <h1 className="font-serif text-3xl sm:text-5xl text-[#2A1B3D] tracking-tight font-bold">
        {language === 'ar' ? 'استكشفي المنتجات' : 'Explore Products'}
      </h1>
    </div>
  );
}