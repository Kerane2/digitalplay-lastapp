import CategoryClient from './category-client';

interface PageProps {
  params: Promise<{ slug: string }>;
}

export const dynamic = 'force-dynamic';

export default async function CategoryPage({ params }: PageProps) {
  const { slug } = await params;
  return <CategoryClient slug={slug} />;
}
