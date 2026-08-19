'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {   Package, FolderTree, LogOut , Settings } from 'lucide-react';
import { adminLogout } from '@/actions/authActions';

export default function AdminNavbar() {
  const pathname = usePathname();

const navLinks = [
 
  { name: 'Products', href: '/admin/products', icon: Package },
  { name: 'Categories', href: '/admin/categories', icon: FolderTree },
  { name: 'Settings', href: '/admin/settings', icon: Settings },
];

  return (
    <header className="bg-white border-b-2 border-[#D8CDE0] px-6 py-4">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex items-center gap-8">
          <Link href="/admin/" className="font-serif text-2xl font-bold text-[#2A1B3D]">
            NOLA <span className="text-xs font-sans uppercase text-[#80608E]">Admin</span>
          </Link>

          <nav className="flex items-center gap-2">
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

        <button
          onClick={() => adminLogout()}
          className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold text-rose-600 hover:bg-rose-50 border border-rose-200 transition-all"
        >
          <LogOut className="w-4 h-4" />
          <span>Logout</span>
        </button>
      </div>
    </header>
  );
}