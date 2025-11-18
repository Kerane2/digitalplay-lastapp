'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import { CategoryCard } from '@/components/category-card';
import { ProductCard } from '@/components/product-card';
import { getAllCategories, getAllProducts, initializeData } from '@/lib/products-manager';
import { ArrowRight, Shield, Zap, Headphones, Star } from 'lucide-react';

export default function HomePage() {
  const [categories, setCategories] = useState(getAllCategories());
  const [products, setProducts] = useState(getAllProducts());

  useEffect(() => {
    initializeData();
    setCategories(getAllCategories());
    setProducts(getAllProducts());
  }, []);

  const popularProducts = categories.map((category) => {
    const categoryProducts = products.filter(p => p.category_id === category.id);
    return categoryProducts.find(p => p.is_featured) || categoryProducts[0];
  }).filter(Boolean);

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1">
        <section className="relative overflow-hidden bg-gradient-to-br from-primary via-accent to-primary py-16 md:py-24 lg:py-32">
          <div className="absolute inset-0 bg-[url('/abstract-digital-pattern.png')] opacity-10 mix-blend-overlay" />
          <div className="container mx-auto px-4 relative">
            <div className="max-w-3xl mx-auto text-center animate-slide-in-up">
              <div className="inline-flex items-center gap-2 px-3 md:px-4 py-1.5 md:py-2 rounded-full bg-white/20 backdrop-blur-sm text-white text-xs md:text-sm font-medium mb-4 md:mb-6 animate-float">
                <Star className="h-3 w-3 md:h-4 md:w-4 fill-current" />
                Plateforme de confiance depuis 2024
              </div>
              <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold mb-4 md:mb-6 text-white text-balance leading-tight px-2">
                Vos produits numériques en un clic
              </h1>
              <p className="text-base md:text-lg lg:text-xl text-white/90 mb-6 md:mb-8 leading-relaxed text-pretty max-w-2xl mx-auto px-4">
                Abonnements streaming, cartes cadeaux, recharges jeux mobile et accessoires gaming. Livraison instantanée, prix compétitifs.
              </p>
              <div className="flex flex-col sm:flex-row flex-wrap gap-3 md:gap-4 justify-center px-4">
                <Button size="lg" className="bg-white text-primary hover:bg-white/90 gap-2 shadow-lg hover:shadow-2xl transition-all hover:scale-105 h-12 md:h-auto text-base w-full sm:w-auto" asChild>
                  <Link href="/products">
                    Explorer les produits
                    <ArrowRight className="h-5 w-5" />
                  </Link>
                </Button>
                <Button size="lg" variant="outline" className="border-white/30 text-white hover:bg-white/10 backdrop-blur-sm hover:scale-105 transition-all h-12 md:h-auto text-base w-full sm:w-auto" asChild>
                  <Link href="/categories">Voir catégories</Link>
                </Button>
              </div>
            </div>
          </div>
        </section>

        <section className="py-8 md:py-12 lg:py-16 bg-white border-y">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 lg:gap-12 max-w-6xl mx-auto">
              <div className="flex items-start gap-3 md:gap-4 animate-fade-in-scale stagger-1 p-4 md:p-0">
                <div className="flex h-10 w-10 md:h-12 md:w-12 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary animate-pulse-glow">
                  <Zap className="h-5 w-5 md:h-6 md:w-6" />
                </div>
                <div>
                  <h3 className="font-bold text-base md:text-lg mb-1 md:mb-2">Livraison instantanée</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    Recevez vos codes par email immédiatement après paiement
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3 md:gap-4 animate-fade-in-scale stagger-2 p-4 md:p-0">
                <div className="flex h-10 w-10 md:h-12 md:w-12 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary animate-pulse-glow">
                  <Shield className="h-5 w-5 md:h-6 md:w-6" />
                </div>
                <div>
                  <h3 className="font-bold text-base md:text-lg mb-1 md:mb-2">100% sécurisé</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    Paiements cryptés et protection des données garantie
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3 md:gap-4 animate-fade-in-scale stagger-3 p-4 md:p-0">
                <div className="flex h-10 w-10 md:h-12 md:w-12 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary animate-pulse-glow">
                  <Headphones className="h-5 w-5 md:h-6 md:w-6" />
                </div>
                <div>
                  <h3 className="font-bold text-base md:text-lg mb-1 md:mb-2">Support 24/7</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    Notre équipe est là pour vous aider à tout moment
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="py-12 md:py-16 lg:py-24 bg-white">
          <div className="container mx-auto px-4">
            <div className="text-center mb-8 md:mb-12 max-w-2xl mx-auto px-4">
              <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-3 md:mb-4 text-balance">
                Produits populaires
              </h2>
              <p className="text-muted-foreground text-base md:text-lg leading-relaxed">
                Nos meilleures ventes, sélectionnées rien que pour vous
              </p>
            </div>
            <div className="md:hidden overflow-x-auto snap-x snap-mandatory scrollbar-hide -mx-4">
              <div className="flex gap-4 px-4 pb-4">
                {popularProducts.map((product, idx) => product && (
                  <div key={product.id} className="min-w-[85vw] sm:min-w-[320px] snap-center">
                    <ProductCard product={product} />
                  </div>
                ))}
              </div>
            </div>
            <div className="hidden md:grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
              {popularProducts.map((product, idx) => product && (
                <div key={product.id} className={`animate-fade-in-scale stagger-${idx + 1}`}>
                  <ProductCard product={product} />
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="py-12 md:py-16 lg:py-24 bg-secondary/30">
          <div className="container mx-auto px-4">
            <div className="text-center mb-8 md:mb-12 max-w-2xl mx-auto px-4">
              <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-3 md:mb-4 text-balance">
                Explorez nos catégories
              </h2>
              <p className="text-muted-foreground text-base md:text-lg leading-relaxed">
                Trouvez exactement ce que vous cherchez parmi notre sélection
              </p>
            </div>
            <div className="md:hidden overflow-x-auto snap-x snap-mandatory scrollbar-hide -mx-4">
              <div className="flex gap-4 px-4 pb-4">
                {categories.map((category) => (
                  <div key={category.id} className="min-w-[85vw] sm:min-w-[320px] snap-center">
                    <CategoryCard category={category} />
                  </div>
                ))}
              </div>
            </div>
            <div className="hidden md:grid md:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6 max-w-6xl mx-auto">
              {categories.map((category, idx) => (
                <div key={category.id} className={`animate-fade-in-scale stagger-${idx + 1}`}>
                  <CategoryCard category={category} />
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
