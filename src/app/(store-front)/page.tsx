import { getCategories } from '@/actions/categoryActions';
import Hero from '@/components/(store-front)/Hero';
import Categories from '@/components/(store-front)/categories';

export default async function HomePage() {
  // Fetch initial data concurrently
  const categoriesRes = await getCategories();
  const categoryList = categoriesRes.success ? categoriesRes.data : [];

  return (
    <main className="bg-[#FAF9F6] min-h-screen">
      {/* HERO BANNER */}
      <Hero />

      {/* CATEGORIES SECTION */}
      <Categories categories={categoryList} />

      
    </main>
  );
}