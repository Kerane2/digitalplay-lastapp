import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import { CategoryCard } from '@/components/category-card';
import { mockCategories } from '@/lib/mock-data';

export default function CategoriesPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1">
        <div className="border-b border-border bg-muted/30">
          <div className="container py-8">
            <h1 className="font-serif text-4xl font-bold mb-2">Catégories</h1>
            <p className="text-muted-foreground">
              Explorez nos différentes catégories de produits
            </p>
          </div>
        </div>

        <div className="container py-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
