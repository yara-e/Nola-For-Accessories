import { notFound } from 'next/navigation';
import { getProductById } from '@/actions/productActions';
import ProductDetailClient from '@/components/(store-front)/ProductDetailClient';

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const res = await getProductById(id);

  if (!res.success || !res.product) {
    notFound();
  }

  return <ProductDetailClient product={res.product} />;
}