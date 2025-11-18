'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CategoryModal } from '@/components/category-modal';
import { useAuth } from '@/components/auth-provider';
import { isAdmin } from '@/lib/auth';
import { mockCategories, mockProducts } from '@/lib/mock-data';
import { Edit, Trash2, Plus } from 'lucide-react';

export default function AdminCategoriesPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<any>(null);

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

  const handleAdd = () => {
    setEditingCategory(null);
    setIsModalOpen(true);
  };

  const handleEdit = (category: any) => {
    setEditingCategory(category);
    setIsModalOpen(true);
  };

  const handleDelete = (categoryId: string) => {
    if (confirm('Êtes-vous sûr de vouloir supprimer cette catégorie ?')) {
      console.log('[v0] Deleting category:', categoryId);
      alert('Catégorie supprimée (fonctionnalité mock)');
    }
  };

  const handleSave = (category: any) => {
    console.log('[v0] Saving category:', category);
    alert(editingCategory ? 'Catégorie modifiée (fonctionnalité mock)' : 'Catégorie créée (fonctionnalité mock)');
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1">
        <div className="bg-gradient-to-br from-primary/10 via-accent/10 to-primary/5 border-b animate-fade-in">
          <div className="container mx-auto py-12 md:py-16 px-4">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div className="animate-slide-up">
                <h1 className="font-serif text-4xl md:text-5xl font-bold mb-2">Gestion des catégories</h1>
                <p className="text-muted-foreground">
                  {mockCategories.length} catégorie{mockCategories.length > 1 ? 's' : ''}
                </p>
              </div>
              <Button onClick={handleAdd} className="gap-2 shadow-lg hover:shadow-xl transition-all w-full md:w-auto animate-slide-up" style={{ animationDelay: '0.1s' }}>
                <Plus className="h-4 w-4" />
                Ajouter une catégorie
              </Button>
            </div>
          </div>
        </div>

        <div className="container mx-auto py-12 md:py-16 px-4">
          <Card className="animate-fade-in-scale">
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="border-b border-border bg-muted/50">
                    <tr>
                      <th className="text-left p-3 md:p-4 font-semibold">Catégorie</th>
                      <th className="text-left p-3 md:p-4 font-semibold hidden sm:table-cell">Slug</th>
                      <th className="text-left p-3 md:p-4 font-semibold hidden md:table-cell">Description</th>
                      <th className="text-left p-3 md:p-4 font-semibold">Produits</th>
                      <th className="text-right p-3 md:p-4 font-semibold">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {mockCategories.map((category) => {
                      const productCount = mockProducts.filter(
                        (p) => p.category_id === category.id
                      ).length;

                      return (
                        <tr key={category.id} className="border-b border-border last:border-0 hover:bg-muted/30 transition-colors">
                          <td className="p-3 md:p-4">
                            <div className="flex items-center gap-3">
                              <div className="w-12 h-12 md:w-16 md:h-16 flex-shrink-0 overflow-hidden rounded bg-muted">
                                <img
                                  src={category.image_url || "/placeholder.svg"}
                                  alt={category.name}
                                  className="h-full w-full object-cover"
                                />
                              </div>
                              <p className="font-medium">{category.name}</p>
                            </div>
                          </td>
                          <td className="p-3 md:p-4 text-muted-foreground text-sm hidden sm:table-cell">{category.slug}</td>
                          <td className="p-3 md:p-4 text-sm text-muted-foreground max-w-md hidden md:table-cell truncate">
                            {category.description}
                          </td>
                          <td className="p-3 md:p-4">{productCount}</td>
                          <td className="p-3 md:p-4">
                            <div className="flex items-center justify-end gap-1 md:gap-2">
                              <Button size="sm" variant="ghost" onClick={() => handleEdit(category)}>
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button size="sm" variant="ghost" className="text-destructive hover:text-destructive" onClick={() => handleDelete(category.id)}>
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

      <CategoryModal
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        category={editingCategory}
        onSave={handleSave}
      />

      <Footer />
    </div>
  );
}
