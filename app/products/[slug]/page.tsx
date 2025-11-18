import ProductDetailClient from './product-detail-client';
import { getAllProducts } from '@/lib/products-manager';

interface PageProps {
  params: { slug: string };
}

export async function generateStaticParams() {
  const products = getAllProducts();
  return products.map((product) => ({
    slug: product.slug,
  }));
}

export default function ProductPage({ params }: PageProps) {
  return <ProductDetailClient slug={params.slug} />;
}
