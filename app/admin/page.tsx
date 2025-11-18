'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/components/auth-provider';
import { isAdmin } from '@/lib/auth';
import { mockProducts, mockCategories } from '@/lib/mock-data';
import { formatPrice } from '@/lib/format';
import { ShoppingBag, Package, Users, DollarSign, TrendingUp, LayoutGrid } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function AdminDashboard() {
  const { user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!user) {
      router.push('/login?redirect=/admin');
      return;
    }
    if (!isAdmin(user)) {
      router.push('/');
    }
  }, [user, router]);

  if (!user || !isAdmin(user)) {
    return null;
  }

  // Mock statistics
  const stats = {
    totalRevenue: 450000,
    totalOrders: 23,
    totalProducts: mockProducts.length,
    totalCategories: mockCategories.length,
    lowStock: mockProducts.filter((p) => p.stock < 50).length,
  };

  const recentOrders = [
    { id: 'abc123', customer: 'John Doe', total: 45000, status: 'completed', date: '2025-01-15' },
    { id: 'def456', customer: 'Jane Smith', total: 19500, status: 'completed', date: '2025-01-14' },
    { id: 'ghi789', customer: 'Bob Johnson', total: 50000, status: 'pending', date: '2025-01-14' },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1">
        <div className="border-b border-border bg-muted/30">
          <div className="container py-8">
            <h1 className="font-serif text-4xl font-bold mb-2">Dashboard Admin</h1>
            <p className="text-muted-foreground">
              Vue d'ensemble de votre boutique
            </p>
          </div>
        </div>

        <div className="container py-8 space-y-8">
          {/* Quick Actions */}
          <div className="flex flex-wrap gap-4">
            <Button asChild>
              <Link href="/admin/products">Gérer les produits</Link>
            </Button>
            <Button variant="outline" asChild>
              <Link href="/admin/orders">Voir les commandes</Link>
            </Button>
            <Button variant="outline" asChild>
              <Link href="/admin/categories">Gérer les catégories</Link>
            </Button>
          </div>

          {/* Statistics Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Revenu total
                </CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{formatPrice(stats.totalRevenue)}</div>
                <p className="text-xs text-muted-foreground mt-1">
                  <TrendingUp className="inline h-3 w-3 mr-1" />
                  +12% ce mois
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Commandes
                </CardTitle>
                <ShoppingBag className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.totalOrders}</div>
                <p className="text-xs text-muted-foreground mt-1">
                  3 en attente
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Produits
                </CardTitle>
                <Package className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.totalProducts}</div>
                <p className="text-xs text-muted-foreground mt-1">
                  {stats.lowStock} avec stock faible
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Catégories
                </CardTitle>
                <LayoutGrid className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.totalCategories}</div>
                <p className="text-xs text-muted-foreground mt-1">
                  Toutes actives
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Recent Orders */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Commandes récentes</CardTitle>
                <Button variant="ghost" size="sm" asChild>
                  <Link href="/admin/orders">Voir tout</Link>
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentOrders.map((order) => (
                  <div key={order.id} className="flex items-center justify-between py-3 border-b border-border last:border-0">
                    <div className="space-y-1">
                      <p className="font-medium">Commande #{order.id}</p>
                      <p className="text-sm text-muted-foreground">{order.customer}</p>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <p className="font-semibold">{formatPrice(order.total)}</p>
                        <p className="text-xs text-muted-foreground">{order.date}</p>
                      </div>
                      <div className={`px-2 py-1 rounded-full text-xs ${
                        order.status === 'completed' 
                          ? 'bg-green-100 text-green-800 dark:bg-green-950 dark:text-green-200' 
                          : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-950 dark:text-yellow-200'
                      }`}>
                        {order.status === 'completed' ? 'Complétée' : 'En attente'}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Low Stock Alert */}
          {stats.lowStock > 0 && (
            <Card className="bg-yellow-50 dark:bg-yellow-950/20 border-yellow-200 dark:border-yellow-900">
              <CardHeader>
                <CardTitle className="text-yellow-900 dark:text-yellow-100">
                  Alerte stock faible
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-yellow-700 dark:text-yellow-300 mb-4">
                  {stats.lowStock} produit{stats.lowStock > 1 ? 's ont' : ' a'} un stock inférieur à 50 unités
                </p>
                <Button variant="outline" size="sm" asChild>
                  <Link href="/admin/products?filter=low-stock">Voir les produits</Link>
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
