'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/components/auth-provider';
import { isAdmin } from '@/lib/auth';
import { mockProducts } from '@/lib/mock-data';
import { formatPrice } from '@/lib/format';
import { Search, Edit, Trash2, Plus } from 'lucide-react';
import Link from 'next/link';

export default function AdminProductsPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    if (!user) {
      router.push('/login?redirect=/admin/products');
      return;
    }
    if (!isAdmin(user)) {
      router.push('/');
    }
  }, [user, router]);

  if (!user || !isAdmin(user)) {
    return null;
  }

  const filteredProducts = mockProducts.filter((product) =>
    product.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1">
        <div className="border-b border-border bg-muted/30">
          <div className="container py-8">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h1 className="font-serif text-4xl font-bold mb-2">Gestion des produits</h1>
                <p className="text-muted-foreground">
                  {filteredProducts.length} produit{filteredProducts.length > 1 ? 's' : ''}
                </p>
              </div>
              <Button className="gap-2">
                <Plus className="h-4 w-4" />
                Ajouter un produit
              </Button>
            </div>
          </div>
        </div>

        <div className="container py-8">
          {/* Search */}
          <div className="mb-6">
            <div className="relative max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Rechercher un produit..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          {/* Products Table */}
          <Card>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="border-b border-border bg-muted/50">
                    <tr>
                      <th className="text-left p-4 font-semibold">Produit</th>
                      <th className="text-left p-4 font-semibold">Prix</th>
                      <th className="text-left p-4 font-semibold">Stock</th>
                      <th className="text-left p-4 font-semibold">Plateforme</th>
                      <th className="text-left p-4 font-semibold">Statut</th>
                      <th className="text-right p-4 font-semibold">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredProducts.map((product) => (
                      <tr key={product.id} className="border-b border-border last:border-0">
                        <td className="p-4">
                          <div className="flex items-center gap-3">
                            <div className="w-12 h-12 flex-shrink-0 overflow-hidden rounded bg-muted">
                              <img
                                src={product.image_url || "/placeholder.svg"}
                                alt={product.name}
                                className="h-full w-full object-cover"
                              />
                            </div>
                            <div>
                              <p className="font-medium">{product.name}</p>
                              <p className="text-sm text-muted-foreground">{product.slug}</p>
                            </div>
                          </div>
                        </td>
                        <td className="p-4 font-semibold">{formatPrice(product.price)}</td>
                        <td className="p-4">
                          <span className={product.stock < 50 ? 'text-yellow-600 dark:text-yellow-400' : ''}>
                            {product.stock}
                          </span>
                        </td>
                        <td className="p-4">
                          <Badge variant="secondary">{product.platform}</Badge>
                        </td>
                        <td className="p-4">
                          {product.is_featured && (
                            <Badge>En vedette</Badge>
                          )}
                        </td>
                        <td className="p-4">
                          <div className="flex items-center justify-end gap-2">
                            <Button size="sm" variant="ghost">
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button size="sm" variant="ghost" className="text-destructive hover:text-destructive">
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>

      <Footer />
    </div>
  );
}
