import CategoryClient from './category-client';
import { getAllCategories } from '@/lib/products-manager';

interface PageProps {
  params: { slug: string };
}

export async function generateStaticParams() {
  const categories = getAllCategories();
  return categories.map((category) => ({
    slug: category.slug,
  }));
}

export default function CategoryPage({ params }: PageProps) {
  return <CategoryClient slug={params.slug} />;
}
