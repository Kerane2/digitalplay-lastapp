'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { getCart, removeFromCart, updateCartQuantity, getCartTotal, CartItem } from '@/lib/cart';
import { formatPrice } from '@/lib/format';
import { Trash2, Plus, Minus, ShoppingBag } from 'lucide-react';
import Link from 'next/link';
import { useAuth } from '@/components/auth-provider';

export default function CartPage() {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [total, setTotal] = useState(0);
  const router = useRouter();
  const { user } = useAuth();

  useEffect(() => {
    loadCart();

    const handleCartUpdate = () => {
      loadCart();
    };

    window.addEventListener('cart-updated', handleCartUpdate);
    return () => window.removeEventListener('cart-updated', handleCartUpdate);
  }, []);

  const loadCart = () => {
    setCart(getCart());
    setTotal(getCartTotal());
  };

  const handleUpdateQuantity = (productId: string, newQuantity: number) => {
    updateCartQuantity(productId, newQuantity);
  };

  const handleRemove = (productId: string) => {
    removeFromCart(productId);
  };

  const handleCheckout = () => {
    if (!user) {
      router.push('/login?redirect=/checkout');
    } else {
      router.push('/checkout');
    }
  };

  if (cart.length === 0) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center py-20 px-4 animate-fade-in-scale">
            <div className="inline-flex h-24 w-24 items-center justify-center rounded-3xl bg-gradient-to-br from-primary/10 to-accent/10 mb-6">
              <ShoppingBag className="h-12 w-12 text-primary" />
            </div>
            <h2 className="text-4xl font-bold mb-3">Votre panier est vide</h2>
            <p className="text-lg text-muted-foreground mb-8">
              Découvrez nos produits et ajoutez-les à votre panier
            </p>
            <Button asChild size="lg" className="shadow-lg hover:shadow-xl transition-all">
              <Link href="/products">Voir les produits</Link>
            </Button>
          </div>
        </main>

        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1">
        <div className="bg-gradient-to-br from-primary/10 via-accent/10 to-primary/5 border-b animate-fade-in">
          <div className="container mx-auto py-12 md:py-16 px-4">
            <h1 className="text-4xl md:text-6xl font-bold mb-3 animate-slide-up">Panier</h1>
            <p className="text-xl text-muted-foreground animate-slide-up" style={{ animationDelay: '0.1s' }}>
              {cart.length} article{cart.length > 1 ? 's' : ''} dans votre panier
            </p>
          </div>
        </div>

        <div className="container mx-auto py-8 md:py-12 lg:py-16 px-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
            <div className="lg:col-span-2 space-y-3 md:space-y-4">
              {cart.map((item) => (
                <Card key={item.id}>
                  <CardContent className="p-3 md:p-4">
                    <div className="flex gap-3 md:gap-4">
                      <div className="w-20 h-20 md:w-24 md:h-24 flex-shrink-0 overflow-hidden rounded-lg bg-muted">
                        <img
                          src={item.image_url || "/placeholder.svg"}
                          alt={item.name}
                          className="h-full w-full object-cover"
                        />
                      </div>
                      <div className="flex-1 flex flex-col justify-between min-w-0">
                        <div>
                          <Link href={`/products/${item.slug}`}>
                            <h3 className="font-semibold text-sm md:text-base hover:text-primary transition-colors line-clamp-2">
                              {item.name}
                            </h3>
                          </Link>
                          <p className="text-xs md:text-sm text-muted-foreground mt-1">
                            {item.platform} • {item.region}
                          </p>
                        </div>
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mt-3">
                          <div className="flex items-center gap-2">
                            <Button
                              size="icon"
                              variant="outline"
                              className="h-8 w-8 md:h-9 md:w-9 flex-shrink-0"
                              onClick={() => handleUpdateQuantity(item.id, item.quantity - 1)}
                              disabled={item.quantity <= 1}
                            >
                              <Minus className="h-3 w-3" />
                            </Button>
                            <Input
                              type="number"
                              value={item.quantity}
                              onChange={(e) => handleUpdateQuantity(item.id, parseInt(e.target.value) || 1)}
                              className="w-14 md:w-16 h-8 md:h-9 text-center text-sm"
                              min={1}
                              max={item.stock}
                            />
                            <Button
                              size="icon"
                              variant="outline"
                              className="h-8 w-8 md:h-9 md:w-9 flex-shrink-0"
                              onClick={() => handleUpdateQuantity(item.id, item.quantity + 1)}
                              disabled={item.quantity >= item.stock}
                            >
                              <Plus className="h-3 w-3" />
                            </Button>
                          </div>
                          <div className="flex items-center justify-between sm:justify-end gap-3 md:gap-4">
                            <p className="font-bold text-primary text-base md:text-lg">
                              {formatPrice(item.price * item.quantity)}
                            </p>
                            <Button
                              size="icon"
                              variant="ghost"
                              onClick={() => handleRemove(item.id)}
                              className="text-destructive hover:text-destructive h-8 w-8 md:h-9 md:w-9 flex-shrink-0"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            <div>
              <Card className="lg:sticky lg:top-20">
                <CardContent className="p-4 md:p-6 space-y-4">
                  <h2 className="font-serif text-xl md:text-2xl font-bold">Récapitulatif</h2>
                  
                  <div className="space-y-2 py-4 border-y border-border">
                    <div className="flex justify-between text-sm md:text-base">
                      <span className="text-muted-foreground">Sous-total</span>
                      <span>{formatPrice(total)}</span>
                    </div>
                    <div className="flex justify-between text-sm md:text-base">
                      <span className="text-muted-foreground">Frais de service</span>
                      <span>Gratuit</span>
                    </div>
                  </div>

                  <div className="flex justify-between text-base md:text-lg font-bold">
                    <span>Total</span>
                    <span className="text-primary">{formatPrice(total)}</span>
                  </div>

                  <Button size="lg" className="w-full h-12 text-base" onClick={handleCheckout}>
                    Passer la commande
                  </Button>

                  <Button variant="outline" size="lg" className="w-full h-12 text-base" asChild>
                    <Link href="/products">Continuer mes achats</Link>
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
