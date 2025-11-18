'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/components/auth-provider';
import { formatPrice, formatDate } from '@/lib/format';
import { CheckCircle2, Download } from 'lucide-react';
import Link from 'next/link';

interface PageProps {
  params: { id: string };
}

export default function OrderDetailPage({ params }: PageProps) {
  const { id } = params;
  const { user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!user) {
      router.push('/login');
    }
  }, [user, router]);

  // Mock order data
  const order = {
    id,
    date: new Date(),
    total: 45000,
    status: 'completed',
    paymentMethod: 'Carte bancaire',
    items: [
      {
        name: 'EA SPORTS FC 25',
        quantity: 1,
        price: 45000,
        code: 'XXXX-XXXX-XXXX-XXXX',
        platform: 'PC',
        region: 'Global'
      }
    ]
  };

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1">
        <div className="border-b border-border bg-muted/30">
          <div className="container py-8">
            <div className="flex items-center gap-3 mb-2">
              <h1 className="font-serif text-4xl font-bold">Commande #{order.id}</h1>
              <Badge variant="default" className="h-6">
                Complétée
              </Badge>
            </div>
            <p className="text-muted-foreground">
              Passée le {formatDate(order.date)}
            </p>
          </div>
        </div>

        <div className="container py-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Order Details */}
            <div className="lg:col-span-2 space-y-6">
              {/* Success Message */}
              <Card className="bg-green-50 dark:bg-green-950/20 border-green-200 dark:border-green-900">
                <CardContent className="p-6">
                  <div className="flex gap-4">
                    <CheckCircle2 className="h-6 w-6 text-green-600 dark:text-green-400 flex-shrink-0" />
                    <div>
                      <h3 className="font-semibold mb-1 text-green-900 dark:text-green-100">
                        Commande confirmée
                      </h3>
                      <p className="text-sm text-green-700 dark:text-green-300 leading-relaxed">
                        Votre commande a été traitée avec succès. Vous trouverez vos codes d'activation ci-dessous.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Products & Codes */}
              <Card>
                <CardHeader>
                  <CardTitle>Vos produits</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {order.items.map((item, index) => (
                    <div key={index} className="space-y-4">
                      <div className="flex justify-between">
                        <div>
                          <h4 className="font-semibold">{item.name}</h4>
                          <p className="text-sm text-muted-foreground">
                            {item.platform} • {item.region}
                          </p>
                        </div>
                        <p className="font-semibold">{formatPrice(item.price)}</p>
                      </div>
                      <Card className="bg-muted/30">
                        <CardContent className="p-4">
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="text-sm text-muted-foreground mb-1">
                                Code d'activation
                              </p>
                              <p className="font-mono font-semibold text-lg">
                                {item.code}
                              </p>
                            </div>
                            <Button size="sm" variant="outline" className="gap-2">
                              <Download className="h-4 w-4" />
                              Copier
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                      {index < order.items.length - 1 && (
                        <div className="border-t border-border" />
                      )}
                    </div>
                  ))}
                </CardContent>
              </Card>

              {/* Instructions */}
              <Card>
                <CardHeader>
                  <CardTitle>Comment utiliser votre code</CardTitle>
                </CardHeader>
                <CardContent>
                  <ol className="list-decimal list-inside space-y-2 text-sm text-muted-foreground leading-relaxed">
                    <li>Connectez-vous à votre compte sur la plateforme</li>
                    <li>Accédez à la section d'activation de code</li>
                    <li>Entrez le code fourni ci-dessus</li>
                    <li>Confirmez l'activation et profitez de votre produit</li>
                  </ol>
                </CardContent>
              </Card>
            </div>

            {/* Order Summary */}
            <div>
              <Card className="sticky top-20">
                <CardHeader>
                  <CardTitle>Récapitulatif</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2 pb-4 border-b border-border">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Sous-total</span>
                      <span>{formatPrice(order.total)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Frais de service</span>
                      <span>Gratuit</span>
                    </div>
                  </div>

                  <div className="flex justify-between text-lg font-bold">
                    <span>Total</span>
                    <span className="text-primary">{formatPrice(order.total)}</span>
                  </div>

                  <div className="pt-4 border-t border-border space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Mode de paiement</span>
                      <span>{order.paymentMethod}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Date</span>
                      <span>{formatDate(order.date)}</span>
                    </div>
                  </div>

                  <Button variant="outline" className="w-full" asChild>
                    <Link href="/orders">Voir toutes mes commandes</Link>
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
