'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import { CategoryCard } from '@/components/category-card';
import { ProductCard } from '@/components/product-card';
import { getCategories, getProducts, Product, Category } from '@/lib/api-client';
import { ArrowRight, Shield, Zap, Headphones, Star, Clock, Users, TrendingUp } from 'lucide-react';

export default function HomePage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const [categoriesData, productsData] = await Promise.all([
          getCategories(),
          getProducts({ featured: true })
        ]);
        setCategories(Array.isArray(categoriesData) ? categoriesData : []);
        setProducts(Array.isArray(productsData) ? productsData : []);
      } catch (error) {
        console.error('[v0] Failed to load data:', error);
        setCategories([]);
        setProducts([]);
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, []);

  const popularProducts = Array.isArray(categories) 
    ? categories.map((category) => {
        const categoryProducts = products.filter(p => p.category_id === category.id);
        return categoryProducts.find(p => p.is_featured) || categoryProducts[0];
      }).filter(Boolean)
    : [];

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1">
        <section className="relative overflow-hidden bg-gradient-to-br from-primary via-accent to-primary py-20 md:py-28 lg:py-36">
          <div className="absolute inset-0 bg-[url('/abstract-digital-pattern.png')] opacity-10 mix-blend-overlay" />
          <div className="container mx-auto px-4 relative">
            <div className="max-w-4xl mx-auto text-center animate-slide-in-up">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/20 backdrop-blur-sm text-white text-sm font-semibold mb-6 animate-float border border-white/30">
                <Zap className="h-4 w-4 fill-current" />
                Livraison Ultra-Rapide
              </div>
              <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 text-white text-balance leading-tight">
                Gaming & Streaming
                <br />
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-white to-white/80">
                  Nouvelle Génération
                </span>
              </h1>
              <p className="text-lg md:text-xl lg:text-2xl text-white/90 mb-8 leading-relaxed text-pretty max-w-3xl mx-auto">
                Abonnements streaming, cartes cadeaux gaming, recharges mobiles et accessoires premium. Votre boutique digitale de confiance.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
                <Button size="lg" className="bg-white text-primary hover:bg-white/90 gap-2 shadow-2xl hover:shadow-white/20 transition-all hover:scale-105 h-14 text-lg font-semibold" asChild>
                  <Link href="/products">
                    Découvrir nos produits
                    <ArrowRight className="h-5 w-5" />
                  </Link>
                </Button>
                <Button size="lg" variant="outline" className="border-2 border-white/40 text-white hover:bg-white/10 backdrop-blur-sm hover:scale-105 transition-all h-14 text-lg font-semibold" asChild>
                  <Link href="/categories">Explorer les catégories</Link>
                </Button>
              </div>

              {/* Stats Grid inspired by Digital Play */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-3xl mx-auto pt-8 border-t border-white/20">
                <div className="text-center">
                  <div className="flex items-center justify-center gap-2 mb-2">
                    <Clock className="h-5 w-5 text-white/80" />
                    <div className="text-3xl font-bold text-white">5-10min</div>
                  </div>
                  <p className="text-white/80 text-sm font-medium">Livraison moyenne</p>
                </div>
                <div className="text-center">
                  <div className="flex items-center justify-center gap-2 mb-2">
                    <Users className="h-5 w-5 text-white/80" />
                    <div className="text-3xl font-bold text-white">1000+</div>
                  </div>
                  <p className="text-white/80 text-sm font-medium">Clients satisfaits</p>
                </div>
                <div className="text-center">
                  <div className="flex items-center justify-center gap-2 mb-2">
                    <Headphones className="h-5 w-5 text-white/80" />
                    <div className="text-3xl font-bold text-white">24/7</div>
                  </div>
                  <p className="text-white/80 text-sm font-medium">Support disponible</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="py-16 md:py-20 bg-white border-y">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12 max-w-6xl mx-auto">
              <div className="flex flex-col items-center text-center gap-4 p-6 rounded-2xl hover:bg-secondary/50 transition-all animate-fade-in-scale stagger-1">
                <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-primary/10 text-primary animate-pulse-glow">
                  <Zap className="h-8 w-8" />
                </div>
                <div>
                  <h3 className="font-bold text-xl mb-2">Livraison instantanée</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    Recevez vos codes par email immédiatement après validation du paiement
                  </p>
                </div>
              </div>
              <div className="flex flex-col items-center text-center gap-4 p-6 rounded-2xl hover:bg-secondary/50 transition-all animate-fade-in-scale stagger-2">
                <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-primary/10 text-primary animate-pulse-glow">
                  <Shield className="h-8 w-8" />
                </div>
                <div>
                  <h3 className="font-bold text-xl mb-2">100% sécurisé</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    Transactions cryptées et protection totale de vos données personnelles
                  </p>
                </div>
              </div>
              <div className="flex flex-col items-center text-center gap-4 p-6 rounded-2xl hover:bg-secondary/50 transition-all animate-fade-in-scale stagger-3">
                <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-primary/10 text-primary animate-pulse-glow">
                  <Headphones className="h-8 w-8" />
                </div>
                <div>
                  <h3 className="font-bold text-xl mb-2">Support 24/7</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    Une équipe dédiée disponible à tout moment pour vous accompagner
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {loading ? (
          <section className="py-16 md:py-20 bg-secondary/30">
            <div className="container mx-auto px-4 text-center">
              <div className="inline-block h-12 w-12 animate-spin rounded-full border-4 border-solid border-primary border-r-transparent"></div>
              <p className="mt-4 text-muted-foreground text-lg">Chargement des produits...</p>
            </div>
          </section>
        ) : (
          <>
            <section className="py-16 md:py-20 lg:py-28 bg-secondary/30">
              <div className="container mx-auto px-4">
                <div className="text-center mb-12 max-w-3xl mx-auto">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-semibold mb-4">
                    <TrendingUp className="h-4 w-4" />
                    Nos Catégories
                  </div>
                  <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 text-balance">
                    Explorez notre collection
                  </h2>
                  <p className="text-muted-foreground text-lg leading-relaxed">
                    Découvrez nos différentes catégories de produits numériques et accessoires
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
                <div className="hidden md:grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
                  {categories.map((category, idx) => (
                    <div key={category.id} className={`animate-fade-in-scale stagger-${idx + 1}`}>
                      <CategoryCard category={category} />
                    </div>
                  ))}
                </div>
              </div>
            </section>

            <section className="py-16 md:py-20 lg:py-28 bg-white">
              <div className="container mx-auto px-4">
                <div className="text-center mb-12 max-w-3xl mx-auto">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-semibold mb-4">
                    <Star className="h-4 w-4 fill-current" />
                    Tendances
                  </div>
                  <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 text-balance">
                    Produits populaires
                  </h2>
                  <p className="text-muted-foreground text-lg leading-relaxed">
                    Nos meilleures ventes du moment, plébiscitées par nos clients
                  </p>
                </div>
                <div className="md:hidden overflow-x-auto snap-x snap-mandatory scrollbar-hide -mx-4">
                  <div className="flex gap-4 px-4 pb-4">
                    {popularProducts.map((product) => product && (
                      <div key={product.id} className="min-w-[85vw] sm:min-w-[320px] snap-center">
                        <ProductCard product={product} />
                      </div>
                    ))}
                  </div>
                </div>
                <div className="hidden md:grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
                  {popularProducts.map((product, idx) => product && (
                    <div key={product.id} className={`animate-fade-in-scale stagger-${idx + 1}`}>
                      <ProductCard product={product} />
                    </div>
                  ))}
                </div>
              </div>
            </section>
          </>
        )}
      </main>

      <Footer />
    </div>
  );
}
