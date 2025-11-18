'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { ProductModal } from '@/components/product-modal';
import { useAuth } from '@/components/auth-provider';
import { isAdmin } from '@/lib/auth';
import { mockProducts } from '@/lib/mock-data';
import { formatPrice } from '@/lib/format';
import { Search, Edit, Trash2, Plus } from 'lucide-react';

export default function AdminProductsPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<any>(null);

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

  const handleAdd = () => {
    setEditingProduct(null);
    setIsModalOpen(true);
  };

  const handleEdit = (product: any) => {
    setEditingProduct(product);
    setIsModalOpen(true);
  };

  const handleDelete = (productId: string) => {
    if (confirm('Êtes-vous sûr de vouloir supprimer ce produit ?')) {
      console.log('[v0] Deleting product:', productId);
      alert('Produit supprimé (fonctionnalité mock)');
    }
  };

  const handleSave = (product: any) => {
    console.log('[v0] Saving product:', product);
    alert(editingProduct ? 'Produit modifié (fonctionnalité mock)' : 'Produit créé (fonctionnalité mock)');
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1">
        <div className="bg-gradient-to-br from-primary/10 via-accent/10 to-primary/5 border-b animate-fade-in">
          <div className="container mx-auto py-12 md:py-16 px-4">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4">
              <div className="animate-slide-up">
                <h1 className="font-serif text-4xl md:text-5xl font-bold mb-2">Gestion des produits</h1>
                <p className="text-muted-foreground">
                  {filteredProducts.length} produit{filteredProducts.length > 1 ? 's' : ''}
                </p>
              </div>
              <Button onClick={handleAdd} className="gap-2 shadow-lg hover:shadow-xl transition-all w-full md:w-auto animate-slide-up" style={{ animationDelay: '0.1s' }}>
                <Plus className="h-4 w-4" />
                Ajouter un produit
              </Button>
            </div>
          </div>
        </div>

        <div className="container mx-auto py-12 md:py-16 px-4">
          <div className="mb-6 animate-fade-in-scale">
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

          <Card className="animate-fade-in-scale" style={{ animationDelay: '0.1s' }}>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="border-b border-border bg-muted/50">
                    <tr>
                      <th className="text-left p-3 md:p-4 font-semibold">Produit</th>
                      <th className="text-left p-3 md:p-4 font-semibold">Prix</th>
                      <th className="text-left p-3 md:p-4 font-semibold hidden sm:table-cell">Stock</th>
                      <th className="text-left p-3 md:p-4 font-semibold hidden md:table-cell">Plateforme</th>
                      <th className="text-left p-3 md:p-4 font-semibold hidden lg:table-cell">Statut</th>
                      <th className="text-right p-3 md:p-4 font-semibold">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredProducts.map((product) => (
                      <tr key={product.id} className="border-b border-border last:border-0 hover:bg-muted/30 transition-colors">
                        <td className="p-3 md:p-4">
                          <div className="flex items-center gap-2 md:gap-3">
                            <div className="w-10 h-10 md:w-12 md:h-12 flex-shrink-0 overflow-hidden rounded bg-muted">
                              <img
                                src={product.image_url || "/placeholder.svg"}
                                alt={product.name}
                                className="h-full w-full object-cover"
                              />
                            </div>
                            <div className="min-w-0">
                              <p className="font-medium truncate">{product.name}</p>
                              <p className="text-xs md:text-sm text-muted-foreground truncate">{product.slug}</p>
                            </div>
                          </div>
                        </td>
                        <td className="p-3 md:p-4 font-semibold whitespace-nowrap">{formatPrice(product.price)}</td>
                        <td className="p-3 md:p-4 hidden sm:table-cell">
                          <span className={product.stock < 50 ? 'text-yellow-600 dark:text-yellow-400' : ''}>
                            {product.stock}
                          </span>
                        </td>
                        <td className="p-3 md:p-4 hidden md:table-cell">
                          <Badge variant="secondary">{product.platform}</Badge>
                        </td>
                        <td className="p-3 md:p-4 hidden lg:table-cell">
                          {product.is_featured && (
                            <Badge>En vedette</Badge>
                          )}
                        </td>
                        <td className="p-3 md:p-4">
                          <div className="flex items-center justify-end gap-1 md:gap-2">
                            <Button size="sm" variant="ghost" onClick={() => handleEdit(product)}>
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button size="sm" variant="ghost" className="text-destructive hover:text-destructive" onClick={() => handleDelete(product.id)}>
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

      <ProductModal
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        product={editingProduct}
        onSave={handleSave}
      />

      <Footer />
    </div>
  );
}
