'use client';

import { notFound } from 'next/navigation';
import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { mockProducts, Product } from '@/lib/mock-data';
import { formatPrice } from '@/lib/format';
import { addToCart } from '@/lib/cart';
import { useToast } from '@/hooks/use-toast';
import { ShoppingCart, Package, Globe, Monitor } from 'lucide-react';
import { ProductCard } from '@/components/product-card';

interface PageProps {
  params: { slug: string };
}

export default function ProductPage({ params }: PageProps) {
  const { slug } = params;
  const { toast } = useToast();
  
  const product = mockProducts.find((p) => p.slug === slug);

  if (!product) {
    notFound();
  }

  const relatedProducts = mockProducts
    .filter((p) => p.category_id === product.category_id && p.id !== product.id)
    .slice(0, 4);

  const handleAddToCart = (prod: Product) => {
    addToCart(prod);
    toast({
      title: 'Produit ajouté',
      description: `${prod.name} a été ajouté à votre panier`,
    });
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1">
        <div className="container py-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 mb-16">
            {/* Product Image */}
            <div className="aspect-[4/3] overflow-hidden rounded-lg bg-muted">
              <img
                src={product.image_url || "/placeholder.svg"}
                alt={product.name}
                className="h-full w-full object-cover"
              />
            </div>

            {/* Product Info */}
            <div className="flex flex-col gap-6">
              <div>
                <h1 className="font-serif text-4xl font-bold mb-4 text-balance">
                  {product.name}
                </h1>
                <div className="flex flex-wrap gap-2 mb-4">
                  {product.platform && (
                    <Badge variant="secondary" className="text-sm">
                      <Monitor className="mr-1 h-3 w-3" />
                      {product.platform}
                    </Badge>
                  )}
                  {product.region && (
                    <Badge variant="outline" className="text-sm">
                      <Globe className="mr-1 h-3 w-3" />
                      {product.region}
                    </Badge>
                  )}
                  {product.type && (
                    <Badge variant="outline" className="text-sm">
                      <Package className="mr-1 h-3 w-3" />
                      {product.type}
                    </Badge>
                  )}
                </div>
                <p className="text-3xl font-bold text-primary mb-2">
                  {formatPrice(product.price)}
                </p>
                <p className="text-sm text-muted-foreground mb-6">
                  {product.stock > 0 ? (
                    <span className="text-green-600 dark:text-green-400">
                      ✓ {product.stock} en stock
                    </span>
                  ) : (
                    <span className="text-destructive">Rupture de stock</span>
                  )}
                </p>
              </div>

              <Card>
                <CardContent className="p-6">
                  <h3 className="font-semibold mb-3">Description</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    {product.description}
                  </p>
                </CardContent>
              </Card>

              <Button
                size="lg"
                onClick={() => handleAddToCart(product)}
                disabled={product.stock === 0}
                className="gap-2"
              >
                <ShoppingCart className="h-5 w-5" />
                Ajouter au panier
              </Button>

              <Card className="bg-muted/50">
                <CardContent className="p-6">
                  <h3 className="font-semibold mb-3">Informations de livraison</h3>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li>✓ Livraison instantanée par email</li>
                    <li>✓ Code d'activation valide immédiatement</li>
                    <li>✓ Garantie satisfait ou remboursé</li>
                    <li>✓ Support client disponible 24/7</li>
                  </ul>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Related Products */}
          {relatedProducts.length > 0 && (
            <div>
              <h2 className="font-serif text-3xl font-bold mb-6">
                Produits similaires
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {relatedProducts.map((relatedProduct) => (
                  <ProductCard
                    key={relatedProduct.id}
                    product={relatedProduct}
                    onAddToCart={handleAddToCart}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
