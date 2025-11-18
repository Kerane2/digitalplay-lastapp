import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import { CategoryCard } from '@/components/category-card';
import { mockCategories } from '@/lib/mock-data';

export default function CategoriesPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1">
        <div className="bg-background border-b">
          <div className="container mx-auto py-12 px-4 text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-3">
              Toutes les <span className="text-primary">Catégories</span>
            </h1>
            <p className="text-lg text-muted-foreground">
              Parcourez notre catalogue complet de produits gaming
            </p>
          </div>
        </div>

        <div className="container mx-auto py-16 px-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6 max-w-7xl mx-auto">
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
