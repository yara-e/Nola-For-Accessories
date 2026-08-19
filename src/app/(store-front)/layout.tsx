import { Cairo } from 'next/font/google';
import { LanguageProvider } from '@/context/languageContext';
import Navbar from '@/components/(store-front)/Navbar';
import Footer from '@/components/(store-front)/Footer';

import { getCategories } from '@/actions/categoryActions';

// Unified Font supporting both English & Arabic
const cairo = Cairo({
  subsets: ['latin', 'arabic'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-cairo',
  display: 'swap',
});

export default async function StorefrontLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const categories = await getCategories();

  return (
    <div className={`${cairo.variable} font-sans min-h-screen bg-[#FAF9F6]`}>
      <LanguageProvider>
        <Navbar categories={categories} />
        {children}
        <Footer/>
      </LanguageProvider>
    </div>
  );
}