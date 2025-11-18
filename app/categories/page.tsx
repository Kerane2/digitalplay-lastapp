import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import { CategoryCard } from '@/components/category-card';
import { mockCategories } from '@/lib/mock-data';
import { Grid3x3 } from 'lucide-react';

export default function CategoriesPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1">
        <div className="bg-gradient-to-br from-primary/10 via-accent/10 to-primary/5 border-b animate-fade-in">
          <div className="container mx-auto py-16 md:py-20 px-4">
            <div className="flex items-center gap-4 mb-4 animate-slide-up">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-accent text-primary-foreground shadow-lg">
                <Grid3x3 className="h-7 w-7" />
              </div>
              <h1 className="text-4xl md:text-6xl font-bold">Catégories</h1>
            </div>
            <p className="text-xl text-muted-foreground animate-slide-up" style={{ animationDelay: '0.1s' }}>
              Explorez nos {mockCategories.length} catégories de produits numériques
            </p>
          </div>
        </div>

        <div className="container mx-auto py-16 md:py-20 px-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {mockCategories.map((category) => (
              <CategoryCard key={category.id} category={category} />
            ))}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
