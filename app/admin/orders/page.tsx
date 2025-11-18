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
import { Search, Eye } from 'lucide-react';
import Link from 'next/link';

export default function AdminOrdersPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  useEffect(() => {
    if (!user) {
      router.push('/login?redirect=/admin/orders');
      return;
    }
    if (!isAdmin(user)) {
      router.push('/');
    }
  }, [user, router]);

  if (!user || !isAdmin(user)) {
    return null;
  }

  // Mock orders
  const orders = [
    { id: 'abc123', customer: 'John Doe', email: 'john@example.com', total: 45000, status: 'completed', date: new Date('2025-01-15'), items: 1 },
    { id: 'def456', customer: 'Jane Smith', email: 'jane@example.com', total: 19500, status: 'completed', date: new Date('2025-01-14'), items: 2 },
    { id: 'ghi789', customer: 'Bob Johnson', email: 'bob@example.com', total: 50000, status: 'pending', date: new Date('2025-01-14'), items: 1 },
    { id: 'jkl012', customer: 'Alice Brown', email: 'alice@example.com', total: 13000, status: 'completed', date: new Date('2025-01-13'), items: 1 },
    { id: 'mno345', customer: 'Charlie Wilson', email: 'charlie@example.com', total: 25000, status: 'pending', date: new Date('2025-01-12'), items: 1 },
  ];

  const filteredOrders = orders.filter((order) => {
    const matchesSearch = 
      order.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.customer.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || order.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1">
        <div className="border-b border-border bg-muted/30">
          <div className="container py-8">
            <h1 className="font-serif text-4xl font-bold mb-2">Gestion des commandes</h1>
            <p className="text-muted-foreground">
              {filteredOrders.length} commande{filteredOrders.length > 1 ? 's' : ''}
            </p>
          </div>
        </div>

        <div className="container py-8">
          {/* Filters */}
          <div className="flex flex-col md:flex-row gap-4 mb-6">
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
                <SelectItem value="completed">Complétée</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Orders Table */}
          <Card>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="border-b border-border bg-muted/50">
                    <tr>
                      <th className="text-left p-4 font-semibold">Numéro</th>
                      <th className="text-left p-4 font-semibold">Client</th>
                      <th className="text-left p-4 font-semibold">Date</th>
                      <th className="text-left p-4 font-semibold">Articles</th>
                      <th className="text-left p-4 font-semibold">Total</th>
                      <th className="text-left p-4 font-semibold">Statut</th>
                      <th className="text-right p-4 font-semibold">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredOrders.map((order) => (
                      <tr key={order.id} className="border-b border-border last:border-0">
                        <td className="p-4">
                          <p className="font-medium">#{order.id}</p>
                        </td>
                        <td className="p-4">
                          <div>
                            <p className="font-medium">{order.customer}</p>
                            <p className="text-sm text-muted-foreground">{order.email}</p>
                          </div>
                        </td>
                        <td className="p-4 text-sm text-muted-foreground">
                          {formatDate(order.date)}
                        </td>
                        <td className="p-4">
                          {order.items} article{order.items > 1 ? 's' : ''}
                        </td>
                        <td className="p-4 font-semibold">
                          {formatPrice(order.total)}
                        </td>
                        <td className="p-4">
                          <div className={`inline-block px-2 py-1 rounded-full text-xs ${
                            order.status === 'completed' 
                              ? 'bg-green-100 text-green-800 dark:bg-green-950 dark:text-green-200' 
                              : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-950 dark:text-yellow-200'
                          }`}>
                            {order.status === 'completed' ? 'Complétée' : 'En attente'}
                          </div>
                        </td>
                        <td className="p-4">
                          <div className="flex items-center justify-end gap-2">
                            <Button size="sm" variant="ghost" asChild>
                              <Link href={`/orders/${order.id}`}>
                                <Eye className="h-4 w-4" />
                              </Link>
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
