'use client';

import { useState, useEffect } from 'react';
import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import { ProductCard } from '@/components/product-card';
import { getAllProducts, getAllCategories, initializeData } from '@/lib/products-manager';
import { Product } from '@/lib/mock-data';
import { addToCart } from '@/lib/cart';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';

export default function ProductsPage() {
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState(getAllCategories());

  useEffect(() => {
    initializeData();
    setProducts(getAllProducts());
    setCategories(getAllCategories());
  }, []);

  const handleAddToCart = (product: Product) => {
    addToCart(product);
    toast({
      title: 'Produit ajouté',
      description: `${product.name} a été ajouté à votre panier`,
    });
  };

  // Filter products
  let filteredProducts = products.filter((product) => {
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.description?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || product.category_id === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1">
        <div className="bg-background border-b">
          <div className="container mx-auto py-12 px-4 text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-3">
              Tous les <span className="text-primary">Produits</span>
            </h1>
            <p className="text-lg text-muted-foreground">
              Explorez notre catalogue complet
            </p>
          </div>
        </div>

        <div className="container mx-auto py-8 px-4">
          <div className="mb-8">
            <div className="relative max-w-2xl mx-auto">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input
                placeholder="Rechercher un produit..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-12 h-14 text-base rounded-xl"
              />
            </div>
          </div>

          <div className="flex flex-wrap gap-2 mb-8 justify-center">
            <Button
              variant={selectedCategory === 'all' ? 'default' : 'outline'}
              onClick={() => setSelectedCategory('all')}
              className="rounded-full font-semibold"
            >
              Tous
            </Button>
            {categories.map((category) => (
              <Button
                key={category.id}
                variant={selectedCategory === category.id ? 'default' : 'outline'}
                onClick={() => setSelectedCategory(category.id)}
                className="rounded-full font-semibold"
              >
                {category.name}
              </Button>
            ))}
          </div>

          {/* Products Grid */}
          {filteredProducts.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onAddToCart={handleAddToCart}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-20">
              <div className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-muted mb-4">
                <Search className="h-8 w-8 text-muted-foreground" />
              </div>
              <p className="text-muted-foreground text-lg font-medium">
                Aucun produit trouvé
              </p>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
