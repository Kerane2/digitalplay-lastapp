'use client';

import { notFound } from 'next/navigation';
import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import { ProductCard } from '@/components/product-card';
import { mockProducts, mockCategories, Product } from '@/lib/mock-data';
import { addToCart } from '@/lib/cart';
import { useToast } from '@/hooks/use-toast';

interface PageProps {
  params: { slug: string };
}

export default function CategoryPage({ params }: PageProps) {
  const { slug } = params;
  const { toast } = useToast();
  
  const category = mockCategories.find((c) => c.slug === slug);

  if (!category) {
    notFound();
  }

  const categoryProducts = mockProducts.filter((p) => p.category_id === category.id);

  const handleAddToCart = (product: Product) => {
    addToCart(product);
    toast({
      title: 'Produit ajouté',
      description: `${product.name} a été ajouté à votre panier`,
    });
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1">
        <div className="border-b border-border bg-muted/30">
          <div className="container py-8">
            <h1 className="font-serif text-4xl font-bold mb-2">{category.name}</h1>
            <p className="text-muted-foreground mb-4">{category.description}</p>
            <p className="text-sm text-muted-foreground">
              {categoryProducts.length} produit{categoryProducts.length > 1 ? 's' : ''} disponible{categoryProducts.length > 1 ? 's' : ''}
            </p>
          </div>
        </div>

        <div className="container py-8">
          {categoryProducts.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {categoryProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onAddToCart={handleAddToCart}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <p className="text-muted-foreground text-lg">
                Aucun produit dans cette catégorie pour le moment
              </p>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
