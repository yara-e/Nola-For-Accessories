'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Menu, X, ChevronDown, Globe } from 'lucide-react';
import { useLanguage } from '@/context/languageContext';

interface Category {
  _id?: string;
  id?: string;
  name: { en: string; ar: string } | string;
  image?: string;
}

interface NavbarProps {
  categories?: Category[] | { success?: boolean; data?: Category[]; categories?: Category[] };
}

export default function Navbar({ categories = [] }: NavbarProps) {
  const [isShopOpen, setIsShopOpen] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const { language, toggleLanguage, t } = useLanguage();

  // FIX: Safely extract array from Server Action response object or direct array
  const categoryList: Category[] = Array.isArray(categories)
    ? categories
    : (categories as any)?.data || (categories as any)?.categories || [];

  const closeMobileMenu = () => {
    setIsMobileOpen(false);
    setIsShopOpen(false);
  };

  const getCategoryName = (catName: { en: string; ar: string } | string) => {
    if (typeof catName === 'string') return catName;
    return t(catName);
  };

  return (
    <header className="sticky top-0 z-50 bg-[#fcf8f2]/95 backdrop-blur-md border-b border-[#E8E2D9] shadow-[0_4px_20px_-2px_rgba(42,27,61,0.03)] transition-all">
      <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-12">
        {/* DESKTOP NAVBAR */}
        <div className="hidden h-[76px] items-center justify-between md:flex">
          {/* Logo */}
          <Link href="/" className="group shrink-0">
            <span className="font-serif text-[27px] font-normal tracking-[0.18em] text-[#2A1B3D] transition-colors duration-300 group-hover:text-[#80608E]">
              NOLA
            </span>
          </Link>

          {/* Navigation */}
          <nav className="flex h-full items-center gap-9">
            {/* Home */}
            <NavLink href="/">{language === 'ar' ? 'الرئيسية' : 'Home'}</NavLink>

            {/* Shop Dropdown */}
            <div
              className="relative h-full flex items-center"
              onMouseEnter={() => setIsShopOpen(true)}
              onMouseLeave={() => setIsShopOpen(false)}
            >
              <Link
                href="/products"
                className="group relative flex items-center gap-1.5 py-2 text-[13px] font-medium tracking-wide text-[#3D3442]"
              >
                <span>{language === 'ar' ? 'المتجر' : 'Shop'}</span>
                <ChevronDown
                  className={`h-3.5 w-3.5 transition-transform duration-200 ${
                    isShopOpen ? 'rotate-180' : ''
                  }`}
                  strokeWidth={1.7}
                />
                <span className="absolute -bottom-0.5 left-0 h-px w-0 bg-[#80608E] transition-all duration-300 group-hover:w-full" />
              </Link>

              {/* Dropdown */}
              <div
                className={`absolute ltr:right-0 rtl:left-0 top-[calc(50%+24px)] w-52 border border-[#E8E2D9] bg-[#FAF8F5] p-2 shadow-[0_18px_45px_rgba(42,27,61,0.08)] transition-all duration-200 ${
                  isShopOpen ? 'visible translate-y-0 opacity-100' : 'invisible translate-y-2 opacity-0'
                }`}
              >
                <Link
                  href="/products"
                  className="block px-4 py-3 text-[11px] font-semibold uppercase tracking-[0.15em] text-[#80608E] transition-colors hover:bg-[#F2ECE4]"
                >
                  {language === 'ar' ? 'كل المنتجات' : 'All Products'}
                </Link>

                <div className="my-1 h-px bg-[#E8E2D9]" />

                {categoryList.map((category: Category, index: number) => {
                  const catId = category._id || category.id || index;
                  return (
                    <Link
                      key={catId}
                      href={`/products?category=${catId}`}
                      className="block px-4 py-2.5 text-[13px] text-[#524658] transition-all duration-200 hover:bg-[#F2ECE4] hover:text-[#80608E]"
                    >
                      {getCategoryName(category.name)}
                    </Link>
                  );
                })}
              </div>
            </div>

            {/* Contact */}
            <NavLink href="#footer">{language === 'ar' ? 'تواصل معنا' : 'Contact'}</NavLink>

            {/* Language Switcher Button */}
            <button
              onClick={toggleLanguage}
              className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-[#3D3442] hover:text-[#80608E] transition-colors px-2.5 py-1 rounded-full border border-[#E8E2D9] bg-white/60 hover:bg-white"
            >
              <Globe className="w-3.5 h-3.5" />
              <span>{language === 'en' ? 'العربية' : 'EN'}</span>
            </button>
          </nav>
        </div>

        {/* MOBILE NAVBAR */}
        <div className="flex h-[68px] items-center justify-between md:hidden">
          <Link href="/" onClick={closeMobileMenu} className="group">
            <span className="font-serif text-[25px] tracking-[0.17em] text-[#2A1B3D] transition-colors duration-300 group-hover:text-[#80608E]">
              NOLA
            </span>
          </Link>

          <div className="flex items-center gap-3">
            <button
              onClick={toggleLanguage}
              className="text-xs font-semibold text-[#3D3442] px-2 py-1 rounded-md border border-[#E8E2D9] bg-white/60"
            >
              {language === 'en' ? 'عربي' : 'EN'}
            </button>

            <button
              type="button"
              onClick={() => setIsMobileOpen((prev) => !prev)}
              className="flex h-10 w-10 items-center justify-center text-[#3D3442]"
            >
              {isMobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* MOBILE MENU */}
      <div
        className={`border-t border-[#E8E2D9] bg-[#FAF8F5] md:hidden transition-all duration-300 ${
          isMobileOpen ? 'max-h-[500px] opacity-100' : 'max-h-0 overflow-hidden opacity-0'
        }`}
      >
        <nav className="mx-auto max-w-7xl px-5 py-6">
          <MobileNavLink href="/" onClick={closeMobileMenu}>
            {language === 'ar' ? 'الرئيسية' : 'Home'}
          </MobileNavLink>

          <div className="border-b border-[#E8E2D9]">
            <button
              type="button"
              onClick={() => setIsShopOpen((prev) => !prev)}
              className="flex w-full items-center justify-between py-4 text-sm font-medium text-[#3D3442]"
            >
              <span>{language === 'ar' ? 'المتجر' : 'Shop'}</span>
              <ChevronDown className={`h-4 w-4 transition-transform ${isShopOpen ? 'rotate-180' : ''}`} />
            </button>

            <div className={`overflow-hidden transition-all duration-300 ${isShopOpen ? 'max-h-80 pb-3' : 'max-h-0'}`}>
              <Link
                href="/products"
                onClick={closeMobileMenu}
                className="block py-2 pl-4 text-xs font-semibold uppercase tracking-[0.15em] text-[#80608E]"
              >
                {language === 'ar' ? 'كل المنتجات' : 'All Products'}
              </Link>

              {categoryList.map((category: Category, index: number) => {
                const catId = category._id || category.id || index;
                return (
                  <Link
                    key={catId}
                    href={`/products?category=${catId}`}
                    onClick={closeMobileMenu}
                    className="block py-2 pl-4 text-sm text-[#524658]"
                  >
                    {getCategoryName(category.name)}
                  </Link>
                );
              })}
            </div>
          </div>

          <MobileNavLink href="#footer" onClick={closeMobileMenu}>
            {language === 'ar' ? 'تواصل معنا' : 'Contact'}
          </MobileNavLink>
        </nav>
      </div>
    </header>
  );
}

function NavLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link href={href} className="group relative py-2 text-[13px] font-medium tracking-wide text-[#3D3442] hover:text-[#80608E]">
      {children}
      <span className="absolute -bottom-0.5 left-0 h-px w-0 bg-[#80608E] transition-all duration-300 group-hover:w-full" />
    </Link>
  );
}

function MobileNavLink({ href, children, onClick }: { href: string; children: React.ReactNode; onClick: () => void }) {
  return (
    <Link href={href} onClick={onClick} className="block border-b border-[#E8E2D9] py-4 text-sm font-medium text-[#3D3442]">
      {children}
    </Link>
  );
}