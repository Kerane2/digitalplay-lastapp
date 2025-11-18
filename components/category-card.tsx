import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';
import { Category } from '@/lib/mock-data';

interface CategoryCardProps {
  category: Category;
}

export function CategoryCard({ category }: CategoryCardProps) {
  return (
    <Link href={`/categories/${category.slug}`}>
      <Card className="group overflow-hidden transition-all hover:shadow-lg cursor-pointer">
        <div className="aspect-[16/9] overflow-hidden bg-muted">
          <img
            src={category.image_url || "/placeholder.svg"}
            alt={category.name}
            className="h-full w-full object-cover transition-transform group-hover:scale-105"
          />
        </div>
        <CardContent className="p-6">
          <h3 className="font-serif text-2xl font-bold mb-2 group-hover:text-primary transition-colors">
            {category.name}
          </h3>
          <p className="text-sm text-muted-foreground leading-relaxed">
            {category.description}
          </p>
        </CardContent>
      </Card>
    </Link>
  );
}
