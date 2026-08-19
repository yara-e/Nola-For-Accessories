'use client';

import Link from 'next/link';
import { Phone, MapPin } from 'lucide-react';
import { useLanguage } from '@/context/languageContext';

export default function Footer() {
  const { language } = useLanguage();
  const isAr = language === 'ar';

  const whatsappNumber = '201145440767';
  const whatsappMessage = encodeURIComponent(
    isAr 
      ? 'مرحباً متجر نولا! لدي استفسار بخصوص أحد المنتجات.' 
      : 'Hello Nola Store! I have an inquiry regarding a product.'
  );
  const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${whatsappMessage}`;

  return (
    <footer id="footer" className="bg-[#403450] text-[#F3EEF6] border-t border-[#3A2850] font-sans mt-auto">
      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-6 py-12 grid grid-cols-1 md:grid-cols-3 gap-10">
        
        {/* Brand Story & Info */}
        <div className="space-y-4 text-center rtl:md:text-right ltr:md:text-left">
          <Link href="/" className="inline-block">
            <span className="font-serif text-2xl font-bold tracking-wider text-white">
              NOLA <span className="text-[#B8A7C5] font-light">STORE</span>
            </span>
          </Link>
          <p className="text-xs text-[#C5B8D0] leading-relaxed max-w-sm mx-auto rtl:md:mr-0 ltr:md:ml-0">
            {isAr 
              ? 'أناقة مختارة ومستلزمات أسلوب الحياة العصري. جودة فريدة تم اختيارها خصيصاً لك.' 
              : 'Curated elegance and modern lifestyle essentials. Handpicked quality just for you.'}
          </p>
        </div>

        {/* Customer Care & Contact (CENTERED) */}
        <div className="space-y-4 text-center flex flex-col items-center justify-start">
          <h3 className="font-serif text-sm font-bold tracking-widest text-[#D8CDE0] uppercase">
            {isAr ? 'العناية بالعملاء والتواصل' : 'Customer Care & Contact'}
          </h3>
          <ul className="space-y-3 text-xs text-[#C5B8D0] w-full max-w-xs flex flex-col items-center">
            <li>
              <Link href="/products" className="hover:text-white transition-colors font-medium">
                {isAr ? 'تصفح جميع المنتجات' : 'Browse All Products'}
              </Link>
            </li>
            
            <li className="pt-2 w-full">
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-[#25D366] hover:bg-[#20ba5a] text-white px-5 py-3 rounded-2xl text-xs font-bold transition-all w-full justify-center shadow-lg shadow-[#25D366]/10"
              >
                <Phone className="w-4 h-4" />
                <span>{isAr ? 'التواصل عبر واتساب' : 'Chat on WhatsApp'}</span>
              </a>
            </li>
          </ul>
        </div>

        {/* Location & Opening Soon Branch */}
        <div className="space-y-4 text-center rtl:md:text-right ltr:md:text-left">
          <h3 className="font-serif text-sm font-bold tracking-widest text-[#D8CDE0] uppercase">
            {isAr ? 'موقع المتجر' : 'Store Location'}
          </h3>
          
          <div className="flex items-start justify-center rtl:md:justify-start ltr:md:justify-start gap-2.5 text-xs text-[#C5B8D0]">
            <MapPin className="w-4 h-4 text-[#B8A7C5] shrink-0 mt-0.5" />
            <div className="space-y-0.5">
              <strong className="text-white block font-semibold">
                {isAr ? 'فرع الرحاب' : 'Rehab Branch'}
              </strong>
              <span>
                {isAr ? 'مول مدينة الرحاب، حدائق أكتوبر، مصر' : 'Rehab City Mall, Hadayek october, Egypt'}
              </span>
            </div>
          </div>
        </div>

      </div>
    </footer>
  );
}