'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/components/auth-provider';
import { formatPrice, formatDate } from '@/lib/format';
import { Package } from 'lucide-react';
import Link from 'next/link';

// Mock orders data
const mockOrders = [
  {
    id: 'abc123',
    date: new Date('2025-01-15'),
    total: 45000,
    status: 'completed',
    items: [
      { name: 'EA SPORTS FC 25', quantity: 1, price: 45000 }
    ]
  },
  {
    id: 'def456',
    date: new Date('2025-01-10'),
    total: 19500,
    status: 'completed',
    items: [
      { name: 'Steam Wallet 20€', quantity: 1, price: 13000 },
      { name: 'PlayStation Store 10€', quantity: 1, price: 6500 }
    ]
  },
];

export default function OrdersPage() {
  const { user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!user) {
      router.push('/login?redirect=/orders');
    }
  }, [user, router]);

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1">
        <div className="bg-gradient-to-br from-primary/10 via-accent/10 to-primary/5 border-b animate-fade-in">
          <div className="container mx-auto py-12 md:py-16 px-4">
            <h1 className="text-4xl md:text-6xl font-bold mb-3 animate-slide-up">Mes commandes</h1>
            <p className="text-xl text-muted-foreground animate-slide-up" style={{ animationDelay: '0.1s' }}>
              Historique de vos achats
            </p>
          </div>
        </div>

        <div className="container mx-auto py-12 md:py-16 px-4">
          {mockOrders.length > 0 ? (
            <div className="space-y-4">
              {mockOrders.map((order) => (
                <Card key={order.id}>
                  <CardContent className="p-6">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
                      <div>
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="font-semibold">
                            Commande #{order.id}
                          </h3>
                          <Badge variant={order.status === 'completed' ? 'default' : 'secondary'}>
                            {order.status === 'completed' ? 'Complétée' : 'En cours'}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {formatDate(order.date)}
                        </p>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="text-right">
                          <p className="text-sm text-muted-foreground">Total</p>
                          <p className="text-lg font-bold text-primary">
                            {formatPrice(order.total)}
                          </p>
                        </div>
                        <Button asChild>
                          <Link href={`/orders/${order.id}`}>Détails</Link>
                        </Button>
                      </div>
                    </div>
                    <div className="space-y-2 pt-4 border-t border-border">
                      {order.items.map((item, index) => (
                        <div key={index} className="flex justify-between text-sm">
                          <span>
                            {item.name} × {item.quantity}
                          </span>
                          <span className="text-muted-foreground">
                            {formatPrice(item.price * item.quantity)}
                          </span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-20 animate-fade-in-scale">
              <div className="inline-flex h-24 w-24 items-center justify-center rounded-3xl bg-gradient-to-br from-primary/10 to-accent/10 mb-6">
                <Package className="h-12 w-12 text-primary" />
              </div>
              <h2 className="text-4xl font-bold mb-3">Aucune commande</h2>
              <p className="text-lg text-muted-foreground mb-8">
                Vous n'avez pas encore passé de commande
              </p>
              <Button asChild size="lg" className="shadow-lg hover:shadow-xl transition-all">
                <Link href="/products">Découvrir nos produits</Link>
              </Button>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
