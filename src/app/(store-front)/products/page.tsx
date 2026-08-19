import { getPaginatedProducts } from '@/actions/productActions';
import { getCategories } from '@/actions/categoryActions';
import ProductsGrid from '@/components/(store-front)/ProductsGrid';
import ProductsHeader from '@/components/(store-front)/ProductsHeader';

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string; category?: string }>;
}) {
  const resolvedParams = await searchParams;
  const currentPage = Number(resolvedParams.page) || 1;
  const categoryId = resolvedParams.category || undefined;

  const [{ products, totalPages, totalProducts }, categoriesRes] = await Promise.all([
    getPaginatedProducts(currentPage, categoryId),
    getCategories(),
  ]);

  // Extract array safely from the wrapper object
  const categoryList = Array.isArray(categoriesRes)
    ? categoriesRes
    : (categoriesRes as { data?: any[] })?.data || [];

  return (
    <main className="relative min-h-screen py-12 sm:py-16 overflow-hidden bg-[#F5EADD]">
      {/* Decorative top ambient glow line */}
      <div 
        className="pointer-events-none absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-[1px]"
        style={{
          background: 'linear-gradient(90deg, transparent 0%, rgba(128, 96, 142, 0.3) 50%, transparent 100%)',
        }}
      />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Localized Dual-Language Header */}
        <ProductsHeader />

        {/* Client Grid & Pagination Controls */}
        <ProductsGrid
          products={products}
          categories={categoryList}
          currentPage={currentPage}
          totalPages={totalPages}
          totalProducts={totalProducts}
          selectedCategoryId={categoryId || 'all'}
        />
      </div>
    </main>
  );
}