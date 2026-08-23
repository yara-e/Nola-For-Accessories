'use client';

import Link from 'next/link';
import { Phone, MapPin, ExternalLink } from 'lucide-react';
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
  const googleMapsUrl = 'https://www.google.com/maps?q=29.9289242,31.076956&z=17&hl=en';
  const facebookUrl = 'https://www.facebook.com/share/18qFUxPbbP/';
  const instagramUrl = 'https://www.instagram.com/nola.accessories22?igsi=ZjgxdmM5NHVvYWxw';

  return (
    <footer id="footer" className="bg-[#403450] text-[#F3EEF6] border-t border-[#3A2850] font-sans mt-auto">
      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-6 py-12 grid grid-cols-1 md:grid-cols-3 gap-10">
        
        {/* Brand Story & Info + Social Media */}
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

          {/* Social Media Links (Smaller & Compact) */}
          <div className="pt-1 flex flex-col gap-2 max-w-[200px] mx-auto rtl:md:mr-0 ltr:md:ml-0">
            {/* Facebook Button */}
            <a
              href={facebookUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 bg-[#1877F2] hover:bg-[#166fe5] text-white px-3 py-1.5 rounded-lg text-[11px] font-medium transition-all shadow-sm active:scale-[0.98]"
            >
              <svg className="w-3.5 h-3.5 fill-current shrink-0" viewBox="0 0 24 24">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
              </svg>
              <span>{isAr ? 'فيسبوك' : 'Facebook'}</span>
            </a>

            {/* Instagram Button */}
            <a
              href={instagramUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 bg-gradient-to-r from-[#833ab4] via-[#fd1d1d] to-[#fcb045] hover:opacity-95 text-white px-3 py-1.5 rounded-lg text-[11px] font-medium transition-all shadow-sm active:scale-[0.98]"
            >
              <svg className="w-3.5 h-3.5 fill-current shrink-0" viewBox="0 0 24 24">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
              </svg>
              <span>{isAr ? 'إنستغرام' : 'Instagram'}</span>
            </a>
          </div>
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

        {/* Location Section */}
        <div className="space-y-4 text-center rtl:md:text-right ltr:md:text-left">
          <h3 className="font-serif text-sm font-bold tracking-widest text-[#D8CDE0] uppercase">
            {isAr ? 'موقع المتجر' : 'Store Location'}
          </h3>
          
          {/* Interactive Clickable Location Card */}
          <a
            href={googleMapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="block group bg-[#4A3D5D] hover:bg-[#534568] border border-[#5E4E75] p-3.5 rounded-2xl transition-all shadow-sm hover:shadow-md hover:border-[#80608E]"
          >
            <div className="flex items-start gap-3">
              <div className="p-2 rounded-xl bg-[#5C3D6A] group-hover:bg-[#80608E] text-white transition-colors shrink-0">
                <MapPin className="w-4 h-4" />
              </div>
              <div className="text-start space-y-1 flex-1">
                <div className="flex items-center justify-between gap-2">
                  <strong className="text-white text-xs font-bold block">
                    {isAr ? 'فرع حدائق أكتوبر' : 'Hadayek October Branch'}
                  </strong>
                  <ExternalLink className="w-3.5 h-3.5 text-[#B8A7C5] group-hover:text-white transition-colors shrink-0" />
                </div>
                <p className="text-[11px] text-[#C5B8D0] leading-snug">
                  {isAr 
                    ? 'مول مدينة الرحاب، حدائق أكتوبر، الدور الأول' 
                    : 'Rehab City Mall, Hadayek October, First Floor'}
                </p>
                <span className="inline-block text-[10px] text-[#D8CDE0] font-semibold underline decoration-dotted underline-offset-2 pt-0.5 group-hover:text-white">
                  {isAr ? 'افتح في خرائط جوجل ←' : 'Open in Google Maps →'}
                </span>
              </div>
            </div>
          </a>
        </div>

      </div>
    </footer>
  );
}