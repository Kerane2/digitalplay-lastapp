'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import { ProductCard } from '@/components/product-card';
import { CategoryCard } from '@/components/category-card';
import { mockProducts, mockCategories, Product } from '@/lib/mock-data';
import { addToCart } from '@/lib/cart';
import { useToast } from '@/hooks/use-toast';
import { ArrowRight, Shield, Zap, CreditCard } from 'lucide-react';

export default function HomePage() {
  const { toast } = useToast();
  const featuredProducts = mockProducts.filter((p) => p.is_featured);

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
        {/* Hero Section */}
        <section className="relative bg-gradient-to-br from-primary/5 via-background to-accent/5 py-20 md:py-32">
          <div className="container">
            <div className="max-w-3xl">
              <h1 className="font-serif text-4xl md:text-6xl font-bold mb-6 text-balance">
                Votre destination pour les produits numériques
              </h1>
              <p className="text-lg md:text-xl text-muted-foreground mb-8 leading-relaxed text-pretty">
                Découvrez notre sélection de jeux vidéo, cartes cadeaux et recharges mobiles. 
                Livraison instantanée, paiement sécurisé.
              </p>
              <div className="flex flex-wrap gap-4">
                <Button size="lg" asChild className="gap-2">
                  <Link href="/products">
                    Voir tous les produits
                    <ArrowRight className="h-5 w-5" />
                  </Link>
                </Button>
                <Button size="lg" variant="outline" asChild>
                  <Link href="/categories">Explorer les catégories</Link>
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Features */}
        <section className="py-16 border-y border-border bg-card">
          <div className="container">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="flex flex-col items-center text-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                  <Zap className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold mb-2">Livraison instantanée</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    Recevez vos codes immédiatement après l'achat
                  </p>
                </div>
              </div>
              <div className="flex flex-col items-center text-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                  <Shield className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold mb-2">Paiement sécurisé</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    Transactions protégées et cryptées
                  </p>
                </div>
              </div>
              <div className="flex flex-col items-center text-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                  <CreditCard className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold mb-2">Plusieurs moyens de paiement</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    Carte bancaire, Mobile Money et plus
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Featured Products */}
        <section className="py-16">
          <div className="container">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="font-serif text-3xl md:text-4xl font-bold mb-2">
                  Produits populaires
                </h2>
                <p className="text-muted-foreground">
                  Découvrez nos meilleures ventes
                </p>
              </div>
              <Button variant="ghost" asChild>
                <Link href="/products" className="gap-2">
                  Voir tout
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {featuredProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onAddToCart={handleAddToCart}
                />
              ))}
            </div>
          </div>
        </section>

        {/* Categories */}
        <section className="py-16 bg-muted/30">
          <div className="container">
            <div className="text-center mb-12">
              <h2 className="font-serif text-3xl md:text-4xl font-bold mb-4">
                Nos catégories
              </h2>
              <p className="text-muted-foreground max-w-2xl mx-auto leading-relaxed">
                Explorez notre large gamme de produits numériques
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {mockCategories.map((category) => (
                <CategoryCard key={category.id} category={category} />
              ))}
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
