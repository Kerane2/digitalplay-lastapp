import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';
import { Category } from '@/lib/mock-data';
import { Gamepad2, Tv, Gift, Headphones, Sparkles } from 'lucide-react';

interface CategoryCardProps {
  category: Category;
}

const categoryIcons: Record<string, any> = {
  'recharges-jeux': Gamepad2,
  'abonnements': Tv,
  'cartes-cadeaux': Gift,
  'accessoires': Headphones,
  'promos': Sparkles,
};

export function CategoryCard({ category }: CategoryCardProps) {
  const Icon = categoryIcons[category.slug] || Gamepad2;
  
  return (
    <Link href={`/categories/${category.slug}`}>
      <Card className="group overflow-hidden transition-all hover:shadow-2xl hover:-translate-y-2 cursor-pointer border-border/50 bg-card h-full">
        <CardContent className="p-8 flex flex-col items-start gap-4">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-300 group-hover:scale-110">
            <Icon className="h-7 w-7" />
          </div>
          
          <div>
            <h3 className="text-xl font-bold mb-2 group-hover:text-primary transition-colors">
              {category.name}
            </h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              {category.description}
            </p>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
