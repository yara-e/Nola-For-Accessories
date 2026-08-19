'use client';

import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { ArrowRight, Sparkles, Gem, Gift, ShieldCheck, Heart } from 'lucide-react';
import { useLanguage } from '@/context/languageContext';

export default function Hero() {
  const { language } = useLanguage();

  return (
    <section className="relative min-h-[520px] sm:min-h-[580px] lg:min-h-[620px] flex flex-col justify-between overflow-hidden bg-[#FAF8F5] pt-8 sm:pt-12 lg:pt-14 pb-8 lg:pb-10">
      
      {/* 1. BACKGROUND IMAGE */}
      <div className="absolute inset-0 z-0">
        <picture className="absolute inset-0 block h-full w-full">
          <source
            media="(max-width: 639px)"
            srcSet="/mob.png"
          />
          <img
            src="/test-hero-1.png"
            alt="NOLA Silk & Jewelry Background"
            className="h-full w-full object-cover object-[80%_center] sm:object-center lg:object-[85%_center] brightness-[1.02] rtl:-scale-x-100 transition-transform duration-300"
            loading="eager"
          />
        </picture>

        {/* Gradient Overlay for Readability */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#FAF8F5]/90 via-[#FAF8F5]/50 to-transparent sm:hidden rtl:bg-gradient-to-l" />
      </div>

      {/* 2. MAIN CONTENT AREA */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 w-full pt-3 sm:pt-4 lg:pt-5">
        <div className="max-w-xl text-left rtl:text-right">
          
          <div className="space-y-4">
            
            {/* EYEBROW TAG */}
            <motion.div 
              initial={{ opacity: 0, y: 12 }} 
              animate={{ opacity: 1, y: 0 }} 
              className="flex items-center gap-2"
            >
              <span className="text-[11px] font-semibold uppercase tracking-[0.28em] text-[#80608E]">
                {language === 'ar' ? 'إكتشفي نولا' : 'DISCOVER NOLA'}
              </span>
              <Sparkles className="h-3.5 w-3.5 text-[#80608E]" />
            </motion.div>

            {/* HEADLINE WITH INLINE LOGO */}
            <motion.h1 
              initial={{ opacity: 0, y: 20 }} 
              animate={{ opacity: 1, y: 0 }} 
              className="font-serif text-3xl sm:text-5xl lg:text-[4.2rem] text-[#2A1B3D] font-normal leading-[1.15] sm:leading-[1.1] tracking-tight"
            >
              {language === 'ar' ? (
                <>
                  <span className="inline-flex items-center gap-2 sm:gap-3.5">
                    <span>الأناقة</span>
                    <Image
                      src="/logo-pur.png"
                      alt="NOLA"
                      width={160}
                      height={160}
                      className="w-20 sm:w-28 lg:w-36 h-auto object-contain drop-shadow-sm translate-y-0.5 sm:translate-y-2"
                      priority
                    />
                  </span>
                  <br />
                  في كل <em className="font-light italic text-[#80608E]">تفصيلة.</em>
                </>
              ) : (
                <>
                  <span className="inline-flex items-center gap-2 sm:gap-3.5">
                    <span>Elegance</span>
                    <Image
                      src="/logo-pur.png"
                      alt="NOLA"
                      width={160}
                      height={160}
                      className="w-20 sm:w-28 lg:w-36 h-auto object-contain drop-shadow-sm translate-y-0.5 sm:translate-y-2"
                      priority
                    />
                  </span>
                  <br />
                  in every <em className="font-light italic text-[#80608E]">detail.</em>
                </>
              )}
            </motion.h1>

            <div className="h-[1.5px] bg-[#80608E]/40 w-12" />

            {/* SUBTITLE (HIDDEN ON MOBILE) */}
            <motion.p 
              initial={{ opacity: 0, y: 18 }} 
              animate={{ opacity: 1, y: 0 }} 
              className="hidden sm:block max-w-md text-xs sm:text-sm text-[#524658] font-normal leading-relaxed"
            >
              {language === 'ar'
                ? 'اكتشفي تشكيلتنا المتميزة من القطع المصنوعة يدوياً والعطور الفاخرة المصممة لتضيف لمسة من الأناقة لكل لحظة.'
                : 'Discover our collection of timeless pieces, designed to add a touch of elegance to every moment.'}
            </motion.p>

            {/* ACTION BUTTONS: IDENTICAL EQUAL SIZES */}
            <motion.div 
              initial={{ opacity: 0, y: 18 }} 
              animate={{ opacity: 1, y: 0 }} 
              className="pt-1 flex flex-col sm:flex-row items-start rtl:items-start sm:rtl:items-center sm:items-center gap-2.5 sm:gap-4"
            >
              <Link 
                href="/products" 
                className="group inline-flex items-center justify-center gap-2 rounded-xl bg-[#80608E] hover:bg-[#6A4B76] px-3 sm:px-4 py-2.5 sm:py-3.5 text-xs font-bold text-white shadow-md hover:shadow-lg transition-all w-[170px] sm:w-[195px] text-center shrink-0"
              >
                <span className="truncate">{language === 'ar' ? 'تسوقي المجموعة' : 'SHOP COLLECTION'}</span>
                <ArrowRight className="h-4 w-4 shrink-0 rtl:rotate-180" />
              </Link>

              <Link 
                href="#categories" 
                className="inline-flex items-center justify-center rounded-xl bg-white/90 backdrop-blur-md border border-[#D8CDE0] px-3 sm:px-4 py-2.5 sm:py-3.5 text-xs font-bold text-[#2A1B3D] hover:bg-white transition-all shadow-sm w-[170px] sm:w-[195px] text-center shrink-0"
              >
                <span className="truncate">{language === 'ar' ? 'تصفحي الأقسام' : 'EXPLORE CATEGORIES'}</span>
              </Link>
            </motion.div>
          </div>

        </div>
      </div>

      {/* 3. FEATURE HIGHLIGHT BADGES */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 w-full mt-6 lg:mt-8">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 pt-4 border-t border-[#D8CDE0]/60">
          
          <div className="flex items-center gap-3 bg-white/85 backdrop-blur-md p-3 sm:p-3.5 rounded-2xl border border-[#E5DCEB] shadow-sm">
            {/* <Gem className="w-4 sm:w-5 h-4 sm:h-5 text-[#80608E] shrink-0" /> */}
<Image 
  src="/diamond (2).png" 
  alt="Diamond" 
  width={24} 
  height={24} 
  style={{ width: '24px', height: '24px', minWidth: '24px', minHeight: '24px' }}
  className="object-contain shrink-0" 
/>
            <div>
              <h4 className="text-[11px] sm:text-xs font-bold text-[#2A1B3D]">
                {language === 'ar' ? 'جودة فاخرة' : 'Premium Quality'}
              </h4>
              <p className="text-[9px] sm:text-[10px] text-gray-500">
                {language === 'ar' ? 'تصاميم يدوم بريقها' : 'Timeless & durable pieces'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 bg-white/85 backdrop-blur-md p-3 sm:p-3.5 rounded-2xl border border-[#E5DCEB] shadow-sm">
            <Heart className="w-4 sm:w-5 h-4 sm:h-5 text-[#80608E] shrink-0" />
            <div>
              <h4 className="text-[11px] sm:text-xs font-bold text-[#2A1B3D]">
                {language === 'ar' ? 'صنعت بحب' : 'Carefully Crafted'}
              </h4>
              <p className="text-[9px] sm:text-[10px] text-gray-500">
                {language === 'ar' ? 'مختارة بعناية' : 'Handpicked with love'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 bg-white/85 backdrop-blur-md p-3 sm:p-3.5 rounded-2xl border border-[#E5DCEB] shadow-sm">
            <Gift className="w-4 sm:w-5 h-4 sm:h-5 text-[#80608E] shrink-0" />
            <div>
              <h4 className="text-[11px] sm:text-xs font-bold text-[#2A1B3D]">
                {language === 'ar' ? 'تغليف أنيق' : 'Beautiful Packaging'}
              </h4>
              <p className="text-[9px] sm:text-[10px] text-gray-500">
                {language === 'ar' ? 'مثالية للإهداء' : 'Perfect for every gift'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 bg-white/85 backdrop-blur-md p-3 sm:p-3.5 rounded-2xl border border-[#E5DCEB] shadow-sm">
            <ShieldCheck className="w-4 sm:w-5 h-4 sm:h-5 text-[#80608E] shrink-0" />
            <div>
              <h4 className="text-[11px] sm:text-xs font-bold text-[#2A1B3D]">
                {language === 'ar' ? 'تسوق آمن' : 'Secure Shopping'}
              </h4>
              <p className="text-[9px] sm:text-[10px] text-gray-500">
                {language === 'ar' ? 'طلب مباشر موثوق' : 'Safe & trusted checkout'}
              </p>
            </div>
          </div>

        </div>
      </div>

    </section>
  );
}