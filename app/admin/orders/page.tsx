'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useAuth } from '@/components/auth-provider';
import { isAdmin } from '@/lib/auth';
import { formatPrice, formatDate } from '@/lib/format';
import { getOrders, updateOrder, deleteOrder } from '@/lib/orders';
import { Search, Eye, Trash2, Edit } from 'lucide-react';
import Link from 'next/link';
import { useToast } from '@/hooks/use-toast';

export default function AdminOrdersPage() {
  const { user } = useAuth();
  const router = useRouter();
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [orders, setOrders] = useState(getOrders());

  useEffect(() => {
    if (!user) {
      router.push('/login?redirect=/admin/orders');
      return;
    }
    if (!isAdmin(user)) {
      router.push('/');
    }
  }, [user, router]);

  const handleDelete = (orderId: string) => {
    if (confirm('Êtes-vous sûr de vouloir supprimer cette commande ?')) {
      const success = deleteOrder(orderId);
      if (success) {
        setOrders(getOrders());
        toast({
          title: 'Commande supprimée',
          description: 'La commande a été supprimée avec succès.',
        });
      }
    }
  };

  const handleStatusChange = (orderId: string, newStatus: string) => {
    updateOrder(orderId, { status: newStatus as any });
    setOrders(getOrders());
    toast({
      title: 'Statut mis à jour',
      description: `Le statut de la commande a été changé en "${newStatus}".`,
    });
  };

  if (!user || !isAdmin(user)) {
    return null;
  }

  const filteredOrders = orders.filter((order) => {
    const matchesSearch = 
      order.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.customer_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.customer_email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || order.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="min-h-screen flex flex-col font-sans">
      <Header />
      
      <main className="flex-1">
        <div className="bg-gradient-to-br from-primary/10 via-accent/10 to-primary/5 border-b animate-fade-in">
          <div className="container mx-auto py-12 md:py-16 px-4">
            <h1 className="font-serif text-4xl md:text-5xl font-bold mb-2 animate-slide-up">Gestion des commandes</h1>
            <p className="text-muted-foreground animate-slide-up" style={{ animationDelay: '0.1s' }}>
              {filteredOrders.length} commande{filteredOrders.length > 1 ? 's' : ''}
            </p>
          </div>
        </div>

        <div className="container mx-auto py-12 md:py-16 px-4">
          {/* Filters */}
          <div className="flex flex-col md:flex-row gap-4 mb-6 animate-fade-in-scale">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Rechercher par numéro, client ou email..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full md:w-[200px]">
                <SelectValue placeholder="Statut" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tous les statuts</SelectItem>
                <SelectItem value="pending">En attente</SelectItem>
                <SelectItem value="processing">En traitement</SelectItem>
                <SelectItem value="completed">Complétée</SelectItem>
                <SelectItem value="cancelled">Annulée</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Orders Table */}
          <Card className="animate-fade-in-scale" style={{ animationDelay: '0.1s' }}>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="border-b border-border bg-muted/50">
                    <tr>
                      <th className="text-left p-3 md:p-4 font-semibold">Numéro</th>
                      <th className="text-left p-3 md:p-4 font-semibold">Client</th>
                      <th className="text-left p-3 md:p-4 font-semibold hidden sm:table-cell">Date</th>
                      <th className="text-left p-3 md:p-4 font-semibold hidden md:table-cell">Articles</th>
                      <th className="text-left p-3 md:p-4 font-semibold">Total</th>
                      <th className="text-left p-3 md:p-4 font-semibold">Statut</th>
                      <th className="text-right p-3 md:p-4 font-semibold">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredOrders.map((order) => (
                      <tr key={order.id} className="border-b border-border last:border-0 hover:bg-muted/30 transition-colors">
                        <td className="p-3 md:p-4">
                          <p className="font-medium">#{order.id}</p>
                        </td>
                        <td className="p-3 md:p-4">
                          <div>
                            <p className="font-medium">{order.customer_name}</p>
                            <p className="text-xs md:text-sm text-muted-foreground">{order.customer_email}</p>
                            <p className="text-xs text-muted-foreground">{order.customer_phone}</p>
                          </div>
                        </td>
                        <td className="p-3 md:p-4 text-sm text-muted-foreground hidden sm:table-cell">
                          {formatDate(order.created_at)}
                        </td>
                        <td className="p-3 md:p-4 hidden md:table-cell">
                          {order.items.length} article{order.items.length > 1 ? 's' : ''}
                        </td>
                        <td className="p-3 md:p-4 font-semibold">
                          {formatPrice(order.total)}
                        </td>
                        <td className="p-3 md:p-4">
                          <Select
                            value={order.status}
                            onValueChange={(value) => handleStatusChange(order.id, value)}
                          >
                            <SelectTrigger className="w-[130px] h-8 text-xs">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="pending">En attente</SelectItem>
                              <SelectItem value="processing">En traitement</SelectItem>
                              <SelectItem value="completed">Complétée</SelectItem>
                              <SelectItem value="cancelled">Annulée</SelectItem>
                            </SelectContent>
                          </Select>
                        </td>
                        <td className="p-3 md:p-4">
                          <div className="flex items-center justify-end gap-2">
                            <Button size="sm" variant="ghost" asChild>
                              <Link href={`/orders/${order.id}`}>
                                <Eye className="h-4 w-4" />
                              </Link>
                            </Button>
                            <Button
                              size="sm"
                              variant="ghost"
                              className="text-destructive hover:text-destructive"
                              onClick={() => handleDelete(order.id)}
                            >
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
