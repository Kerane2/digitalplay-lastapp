import ProductDetailClient from './product-detail-client';
import { getAllProducts } from '@/lib/products-manager';

interface PageProps {
  params: Promise<{ slug: string }>; // params is now a Promise in Next.js 16
}

export const dynamic = 'force-dynamic';

export default async function ProductPage({ params }: PageProps) {
  const { slug } = await params;
  return <ProductDetailClient slug={slug} />;
}
