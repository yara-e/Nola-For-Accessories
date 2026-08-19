'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowLeft, MessageCircle, Tag, CheckCircle2, AlertCircle, ShoppingBag, Sparkles, FileText } from 'lucide-react';
import { useLanguage } from '@/context/languageContext';
import { createWhatsAppOrderLink } from '@/lib/whatsapp';

export interface SingleProduct {
  _id: string;
  name: { en: string; ar: string } | string;
  description?: { en: string; ar: string } | string;
  price: number;
  stock: number;
  image: string;
  category?: {
    _id: string;
    name: { en: string; ar: string } | string;
  };
}

export default function ProductDetailClient({ product }: { product: SingleProduct }) {
  const { t, language } = useLanguage();
  const [productUrl, setProductUrl] = useState('');

  useEffect(() => {
    setProductUrl(window.location.href);
  }, []);

  const productName = typeof product?.name === 'string' ? product.name : t(product?.name);
  const productDescription = product?.description
    ? typeof product.description === 'string'
      ? product.description
      : t(product.description)
    : null;

  const categoryName = product?.category?.name
    ? typeof product.category.name === 'string'
      ? product.category.name
      : t(product.category.name)
    : null;

  const whatsappLink = createWhatsAppOrderLink({
    productName,
    productUrl,
    language,
  });

  const mainImage = product?.image || '/placeholder.svg';
  const inStock = (product?.stock ?? 0) > 0;

  return (
    <main className="bg-[#F5EADD] min-h-screen py-8 sm:py-14">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back Link */}
        <Link
          href="/products"
          className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#80608E] hover:text-[#5C3D6A] transition-colors mb-6"
        >
          <ArrowLeft className="w-4 h-4 rtl:rotate-180" />
          <span>{language === 'ar' ? 'العودة للمتجر' : 'Back to Shop'}</span>
        </Link>

        {/* Main Card Wrapper */}
        <div className="bg-[#FAF5EE]/95 backdrop-blur-md rounded-[2.5rem] p-6 sm:p-10 border border-[#EADBCE] shadow-[0_16px_45px_rgba(128,96,142,0.08)] grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-center">
          
          {/* IMAGE DISPLAY SECTION (Columns 1-7) */}
          <div className="lg:col-span-7 flex items-center justify-center h-full">
            <div className="relative flex items-center justify-center w-full group">
              <div className="absolute inset-2 rounded-3xl bg-gradient-to-tr from-[#80608E]/25 via-[#E2A76F]/20 to-transparent blur-2xl opacity-70 group-hover:opacity-100 transition-opacity duration-500" />

              <Image
                src={mainImage}
                alt={productName || ''}
                width={600}
                height={600}
                priority
                className="relative z-10 w-auto h-auto max-h-[460px] max-w-full object-contain rounded-3xl bg-white/60 backdrop-blur-sm p-3 border border-white/80 shadow-[0_12px_32px_rgba(128,96,142,0.18)] transition-transform duration-500 group-hover:scale-[1.02]"
              />
            </div>
          </div>

          {/* PRODUCT INFO & ACTION CARD (Columns 8-12) */}
          <div className="lg:col-span-5 flex flex-col justify-between h-full space-y-6">
            <div className="space-y-4">
              {/* Category Badge */}
              {categoryName && (
                <div>
                  <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-[#F5EADD]/60 border border-[#EADBCE] text-xs font-bold text-[#80608E]">
                    <Tag className="w-3.5 h-3.5" />
                    {categoryName}
                  </span>
                </div>
              )}

              {/* Product Title */}
              <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[#2A1B3D] leading-tight">
                {productName}
              </h1>

              {/* Product Description */}
              {productDescription && (
                <div className="p-4 rounded-2xl bg-white/50 border border-[#EADBCE] text-xs leading-relaxed text-[#524658]">
                  <div className="flex items-center gap-1.5 font-bold text-[#80608E] mb-1.5">
                    <FileText className="w-3.5 h-3.5" />
                    <span>{language === 'ar' ? 'الوصف' : 'Description'}</span>
                  </div>
                  <p className="whitespace-pre-line">{productDescription}</p>
                </div>
              )}

              {/* Order Details Card */}
              <div className="p-5 rounded-3xl bg-[#F5EADD]/40 border border-[#EADBCE] space-y-4 backdrop-blur-xs">
                <div className="flex items-center justify-between pb-3 border-b border-[#EADBCE]">
                  <span className="text-xs font-bold text-[#80608E]/80 uppercase tracking-wider flex items-center gap-1.5">
                    <ShoppingBag className="w-3.5 h-3.5 text-[#80608E]" />
                    {language === 'ar' ? 'تفاصيل الطلب' : 'Item Details'}
                  </span>
                  {inStock ? (
                    <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-800 bg-emerald-100/80 px-2.5 py-1 rounded-lg border border-emerald-200">
                      <CheckCircle2 className="w-3 h-3" />
                      {language === 'ar' ? 'متوفر' : 'In Stock'}
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 text-[11px] font-bold text-rose-800 bg-rose-100/80 px-2.5 py-1 rounded-lg border border-rose-200">
                      <AlertCircle className="w-3 h-3" />
                      {language === 'ar' ? 'غير متوفر' : 'Out of Stock'}
                    </span>
                  )}
                </div>

                <div className="flex items-baseline justify-between">
                  <span className="text-xs font-semibold text-[#625866]">
                    {language === 'ar' ? 'الإجمالي' : 'Total Price'}
                  </span>
                  <span className="font-serif text-3xl font-bold text-[#5C3D6A]">
                    {product?.price ? product.price.toLocaleString() : '0'}{' '}
                    <span className="text-base font-sans font-bold">EGP</span>
                  </span>
                </div>

                <div className="bg-white/70 p-3 rounded-2xl border border-[#EADBCE] text-[11px] font-medium text-[#625866] flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-[#80608E] shrink-0" />
                  <span>
                    {language === 'ar'
                      ? 'تواصل مباشر مع المتجر للحجز والاستفسار'
                      : 'Instant direct chat to confirm & reserve'}
                  </span>
                </div>
              </div>
            </div>

            {/* WHATSAPP CTA ACTION */}
            <div className="space-y-3 pt-2">
              <a
                href={whatsappLink}
                target="_blank"
                rel="noopener noreferrer"
                className={`w-full flex items-center justify-center gap-3 py-4 px-6 rounded-2xl font-bold text-sm shadow-md transition-all duration-300 ${
                  inStock
                    ? 'bg-[#25D366] hover:bg-[#20bd5a] text-white hover:shadow-lg hover:-translate-y-0.5'
                    : 'bg-gray-200 text-gray-400 pointer-events-none'
                }`}
              >
                <MessageCircle className="w-5 h-5 fill-current" />
                <span>
                  {inStock
                    ? language === 'ar'
                      ? 'حجز المنتج عبر واتساب'
                      : 'Reserve via WhatsApp'
                    : language === 'ar'
                    ? 'غير متوفر حالياً'
                    : 'Currently Unavailable'}
                </span>
              </a>

              <p className="text-center text-[11px] font-medium text-[#80608E]/70">
                {language === 'ar'
                  ? 'سيتم تحويلك مباشرة إلى واتساب مع إرسال تفاصيل المنتج'
                  : 'Directly opens WhatsApp with product details pre-filled.'}
              </p>
            </div>
          </div>

        </div>
      </div>
    </main>
  );
}