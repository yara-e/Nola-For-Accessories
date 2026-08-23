'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Package, FolderTree, LogOut, Settings, Menu, X, Globe } from 'lucide-react';
import { adminLogout } from '@/actions/authActions';
import { useAdminLanguage } from '@/app/admin/AdminLanguageContext'; // Adjust path if needed

const translations = {
  en: {
    admin: 'Admin',
    products: 'Products',
    categories: 'Categories',
    settings: 'Settings',
    logout: 'Logout',
    toggleLang: 'العربية',
  },
  ar: {
    admin: 'الإدارة',
    products: 'المنتجات',
    categories: 'الأقسام',
    settings: 'الإعدادات',
    logout: 'تسجيل الخروج',
    toggleLang: 'English',
  },
};

export default function AdminNavbar() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { lang, toggleLanguage } = useAdminLanguage();

  const t = translations[lang];

  const navLinks = [
    { name: t.products, href: '/admin/products', icon: Package },
    { name: t.categories, href: '/admin/categories', icon: FolderTree },
    { name: t.settings, href: '/admin/settings', icon: Settings },
  ];

  return (
    <header className="bg-white border-b-2 border-[#D8CDE0] px-4 md:px-6 py-4 sticky top-0 z-40">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex items-center gap-8">
          <Link href="/admin/" className="font-serif text-xl md:text-2xl font-bold text-[#2A1B3D]">
            NOLA <span className="text-xs font-sans uppercase text-[#80608E]">{t.admin}</span>
          </Link>

          {/* Desktop Links */}
          <nav className="hidden md:flex items-center gap-2">
            {navLinks.map((link) => {
              const Icon = link.icon;
              const isActive = pathname.startsWith(link.href);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                    isActive
                      ? 'bg-[#5C3D6A] text-white shadow-sm'
                      : 'text-[#3D3442] hover:bg-[#FAF9F6]'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{link.name}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Desktop Controls */}
        <div className="hidden md:flex items-center gap-3">
          <button
            onClick={toggleLanguage}
            className="flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-bold text-[#3D3442] bg-[#FAF9F6] border border-[#E0D7E5] hover:bg-[#E5DCEB] transition-all"
            aria-label="Toggle Language"
          >
            <Globe className="w-4 h-4" />
            <span>{t.toggleLang}</span>
          </button>

          <button
            onClick={() => adminLogout()}
            className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold text-rose-600 hover:bg-rose-50 border border-rose-200 transition-all"
          >
            <LogOut className="w-4 h-4" />
            <span>{t.logout}</span>
          </button>
        </div>

        {/* Mobile Header Controls (Language Toggle + Burger Menu) */}
        <div className="flex items-center gap-2 md:hidden">
          <button
            onClick={toggleLanguage}
            className="flex items-center gap-1.5 px-3 py-2 text-xs font-bold text-[#3D3442] hover:bg-[#FAF9F6] rounded-xl border border-[#E0D7E5] transition-all"
            aria-label="Toggle Language"
          >
            <Globe className="w-4 h-4 text-[#80608E]" />
            <span>{t.toggleLang}</span>
          </button>

          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 text-[#2A1B3D] hover:bg-[#FAF9F6] rounded-xl border border-[#E0D7E5]"
            aria-label="Toggle Navigation Menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden pt-4 pb-2 border-t border-[#E5DCEB] mt-3 space-y-2">
          {navLinks.map((link) => {
            const Icon = link.icon;
            const isActive = pathname.startsWith(link.href);
            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all ${
                  isActive
                    ? 'bg-[#5C3D6A] text-white shadow-sm'
                    : 'text-[#3D3442] hover:bg-[#FAF9F6]'
                }`}
              >
                <Icon className="w-5 h-5" />
                <span>{link.name}</span>
              </Link>
            );
          })}

          <button
            onClick={() => adminLogout()}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold text-rose-600 hover:bg-rose-50 border border-rose-200 transition-all mt-4"
          >
            <LogOut className="w-5 h-5" />
            <span>{t.logout}</span>
          </button>
        </div>
      )}
    </header>
  );
}