'use client';

import { useEffect, useState } from 'react';
import { notFound } from 'next/navigation';
import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import { ProductCard } from '@/components/product-card';
import { getAllProducts, getAllCategories, initializeData } from '@/lib/products-manager';
import { Product } from '@/lib/mock-data';
import { addToCart } from '@/lib/cart';
import { useToast } from '@/hooks/use-toast';

interface CategoryClientProps {
  slug: string;
}

export default function CategoryClient({ slug }: CategoryClientProps) {
  const { toast } = useToast();
  const [categories, setCategories] = useState(getAllCategories());
  const [products, setProducts] = useState(getAllProducts());
  
  useEffect(() => {
    initializeData();
    setCategories(getAllCategories());
    setProducts(getAllProducts());
  }, []);

  const category = categories.find((c) => c.slug === slug);

  if (!category) {
    notFound();
  }

  const categoryProducts = products.filter((p) => p.category_id === category.id);

  const handleAddToCart = (product: Product) => {
    addToCart(product);
    toast({
      title: 'Produit ajouté',
      description: `${product.name} a été ajouté à votre panier`,
    });
  };

  return (
    <div className="min-h-screen flex flex-col font-sans">
      <Header />
      
      <main className="flex-1">
        <div className="bg-gradient-to-br from-primary/10 via-accent/10 to-primary/5 border-b animate-fade-in">
          <div className="container mx-auto py-16 md:py-20 px-4">
            <h1 className="font-serif text-4xl md:text-6xl font-bold mb-4 animate-slide-up">{category.name}</h1>
            <p className="text-xl text-muted-foreground mb-6 animate-slide-up" style={{ animationDelay: '0.1s' }}>{category.description}</p>
            <p className="text-lg text-muted-foreground animate-slide-up" style={{ animationDelay: '0.2s' }}>
              {categoryProducts.length} produit{categoryProducts.length > 1 ? 's' : ''} disponible{categoryProducts.length > 1 ? 's' : ''}
            </p>
          </div>
        </div>

        <div className="container mx-auto py-12 md:py-16 px-4">
          {categoryProducts.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
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
