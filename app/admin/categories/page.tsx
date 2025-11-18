'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/components/auth-provider';
import { isAdmin } from '@/lib/auth';
import { mockCategories, mockProducts } from '@/lib/mock-data';
import { Edit, Trash2, Plus } from 'lucide-react';

export default function AdminCategoriesPage() {
  const { user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!user) {
      router.push('/login?redirect=/admin/categories');
      return;
    }
    if (!isAdmin(user)) {
      router.push('/');
    }
  }, [user, router]);

  if (!user || !isAdmin(user)) {
    return null;
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1">
        <div className="border-b border-border bg-muted/30">
          <div className="container py-8">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h1 className="font-serif text-4xl font-bold mb-2">Gestion des catégories</h1>
                <p className="text-muted-foreground">
                  {mockCategories.length} catégorie{mockCategories.length > 1 ? 's' : ''}
                </p>
              </div>
              <Button className="gap-2">
                <Plus className="h-4 w-4" />
                Ajouter une catégorie
              </Button>
            </div>
          </div>
        </div>

        <div className="container py-8">
          <Card>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="border-b border-border bg-muted/50">
                    <tr>
                      <th className="text-left p-4 font-semibold">Catégorie</th>
                      <th className="text-left p-4 font-semibold">Slug</th>
                      <th className="text-left p-4 font-semibold">Description</th>
                      <th className="text-left p-4 font-semibold">Produits</th>
                      <th className="text-right p-4 font-semibold">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {mockCategories.map((category) => {
                      const productCount = mockProducts.filter(
                        (p) => p.category_id === category.id
                      ).length;

                      return (
                        <tr key={category.id} className="border-b border-border last:border-0">
                          <td className="p-4">
                            <div className="flex items-center gap-3">
                              <div className="w-16 h-16 flex-shrink-0 overflow-hidden rounded bg-muted">
                                <img
                                  src={category.image_url || "/placeholder.svg"}
                                  alt={category.name}
                                  className="h-full w-full object-cover"
                                />
                              </div>
                              <p className="font-medium">{category.name}</p>
                            </div>
                          </td>
                          <td className="p-4 text-muted-foreground">{category.slug}</td>
                          <td className="p-4 text-sm text-muted-foreground max-w-md">
                            {category.description}
                          </td>
                          <td className="p-4">{productCount}</td>
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
                      );
                    })}
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
