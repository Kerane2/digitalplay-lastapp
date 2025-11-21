'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CategoryModal } from '@/components/category-modal';
import { apiClient } from '@/lib/api-client';
import { Edit, Trash2, Plus } from 'lucide-react';

export default function AdminCategoriesPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<any>(null);
  const [categories, setCategories] = useState<any[]>([]);
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    try {
      const [categoriesData, productsData] = await Promise.all([
        apiClient.getCategories(),
        apiClient.getProducts(),
      ]);
      console.log('[v0] Loaded categories:', categoriesData);
      setCategories(categoriesData);
      setProducts(productsData);
    } catch (error) {
      console.error('[v0] Failed to load data:', error);
    } finally {
      setLoading(false);
    }
  }

  const handleAdd = () => {
    setEditingCategory(null);
    setIsModalOpen(true);
  };

  const handleEdit = (category: any) => {
    setEditingCategory(category);
    setIsModalOpen(true);
  };

  const handleDelete = async (categoryId: string) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer cette catégorie ?')) return;

    try {
      await apiClient.deleteCategory(categoryId);
      console.log('[v0] Category deleted successfully');
      await loadData();
    } catch (error) {
      console.error('[v0] Failed to delete category:', error);
      alert('Erreur lors de la suppression de la catégorie');
    }
  };

  const handleSave = async () => {
    await loadData();
    setIsModalOpen(false);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="text-muted-foreground">Chargement des catégories...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Catégories</h1>
          <p className="text-muted-foreground">
            {categories.length} catégorie{categories.length > 1 ? 's' : ''}
          </p>
        </div>
        <Button onClick={handleAdd} className="gap-2">
          <Plus className="h-4 w-4" />
          Ajouter une catégorie
        </Button>
      </div>

      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="border-b bg-muted/50">
                <tr>
                  <th className="text-left p-4 font-semibold">Catégorie</th>
                  <th className="text-left p-4 font-semibold hidden sm:table-cell">Slug</th>
                  <th className="text-left p-4 font-semibold hidden md:table-cell">Description</th>
                  <th className="text-left p-4 font-semibold">Produits</th>
                  <th className="text-right p-4 font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody>
                {categories.map((category) => {
                  const productCount = products.filter(
                    (p) => p.category_id === category.id
                  ).length;

                  return (
                    <tr key={category.id} className="border-b last:border-0 hover:bg-muted/30 transition-colors">
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
                      <td className="p-4 text-muted-foreground text-sm hidden sm:table-cell">{category.slug}</td>
                      <td className="p-4 text-sm text-muted-foreground max-w-md hidden md:table-cell truncate">
                        {category.description}
                      </td>
                      <td className="p-4">{productCount}</td>
                      <td className="p-4">
                        <div className="flex items-center justify-end gap-2">
                          <Button size="sm" variant="ghost" onClick={() => handleEdit(category)}>
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            className="text-destructive hover:text-destructive"
                            onClick={() => handleDelete(category.id)}
                          >
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

      <CategoryModal
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        category={editingCategory}
        onSave={handleSave}
      />
    </div>
  );
}
