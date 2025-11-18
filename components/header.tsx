'use client';

import Link from 'next/link';
import { ShoppingCart, User, LogOut, LogIn, Menu, Gamepad2, Search, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useAuth } from '@/components/auth-provider';
import { logout, isAdmin } from '@/lib/auth';
import { useState, useEffect, useRef } from 'react';
import { getCartCount } from '@/lib/cart';
import { useRouter } from 'next/navigation';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { getProducts } from '@/lib/products-manager';

export function Header() {
  const { user } = useAuth();
  const router = useRouter();
  const [cartCount, setCartCount] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [showSearchResults, setShowSearchResults] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [isSearchExpanded, setIsSearchExpanded] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setCartCount(getCartCount());

    const handleCartUpdate = () => {
      setCartCount(getCartCount());
    };

    window.addEventListener('cart-updated', handleCartUpdate);
    return () => window.removeEventListener('cart-updated', handleCartUpdate);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsSearchExpanded(false);
        setShowSearchResults(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    if (searchQuery.trim().length > 0) {
      const products = getProducts();
      const filtered = products.filter(p => 
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.description.toLowerCase().includes(searchQuery.toLowerCase())
      ).slice(0, 5);
      setSearchResults(filtered);
      setShowSearchResults(true);
    } else {
      setSearchResults([]);
      setShowSearchResults(false);
    }
  }, [searchQuery]);

  const handleLogout = () => {
    logout();
    router.push('/');
  };

  const handleProductClick = (slug: string) => {
    setSearchQuery('');
    setShowSearchResults(false);
    setIsSearchExpanded(false);
    router.push(`/products/${slug}`);
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-white/95 backdrop-blur-xl shadow-sm animate-slide-down">
      <div className="container mx-auto flex h-16 md:h-20 items-center justify-between gap-2 md:gap-4 px-3 md:px-4">
        <Link href="/" className="flex items-center gap-1.5 md:gap-2.5 group shrink-0">
          <div className="relative flex h-9 w-9 md:h-11 md:w-11 items-center justify-center rounded-xl bg-gradient-to-br from-primary via-accent to-primary shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-105">
            <Gamepad2 className="h-5 w-5 md:h-6 md:w-6 text-white animate-float" />
            <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-primary/20 to-accent/20 blur-lg group-hover:blur-xl transition-all" />
          </div>
          <span className="text-base md:text-2xl font-bold bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent font-sans tracking-tight whitespace-nowrap">
            Digital Play
          </span>
        </Link>

        <nav className="hidden lg:flex items-center gap-1">
          <Button variant="ghost" asChild className="font-semibold hover:bg-primary/10 hover:text-primary transition-all font-sans">
            <Link href="/categories">Catégories</Link>
          </Button>
          <Button variant="ghost" asChild className="font-semibold hover:bg-primary/10 hover:text-primary transition-all font-sans">
            <Link href="/products">Produits</Link>
          </Button>
          <Button variant="ghost" asChild className="font-semibold hover:bg-primary/10 hover:text-primary transition-all font-sans">
            <Link href="/about">À propos</Link>
          </Button>
          <Button variant="ghost" asChild className="font-semibold hover:bg-primary/10 hover:text-primary transition-all font-sans">
            <Link href="/contact">Contact</Link>
          </Button>
        </nav>

        <div className="flex items-center gap-1 md:gap-2 shrink-0">
          <Link href="/cart">
            <Button variant="ghost" size="icon" className="relative hover:bg-primary/10 hover:text-primary transition-all h-9 w-9 md:h-10 md:w-10">
              <ShoppingCart className="h-4 w-4 md:h-5 md:w-5" />
              {cartCount > 0 && (
                <Badge className="absolute -right-1 -top-1 h-4 min-w-4 md:h-5 md:min-w-5 flex items-center justify-center p-0 px-0.5 md:px-1 text-[10px] md:text-xs animate-pulse-glow">
                  {cartCount}
                </Badge>
              )}
            </Button>
          </Link>

          <div ref={searchRef} className="hidden md:flex items-center relative">
            {!isSearchExpanded ? (
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={() => setIsSearchExpanded(true)}
                className="hover:bg-primary/10 hover:text-primary transition-all"
              >
                <Search className="h-5 w-5 md:h-6 md:w-6" />
              </Button>
            ) : (
              <div className="relative w-80 animate-fade-in-scale">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Rechercher un produit..."
                  className="pl-10 pr-4 h-10 font-sans"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  autoFocus
                />
                
                {showSearchResults && searchResults.length > 0 && (
                  <div className="absolute top-full mt-2 w-full bg-white rounded-lg shadow-xl border border-border max-h-96 overflow-y-auto z-50 animate-slide-down">
                    {searchResults.map((product) => (
                      <button
                        key={product.id}
                        onClick={() => handleProductClick(product.slug)}
                        className="w-full flex items-center gap-3 p-3 hover:bg-primary/10 hover:text-primary transition-all text-left border-b last:border-b-0"
                      >
                        <img src={product.image || "/placeholder.svg"} alt={product.name} className="w-12 h-12 object-cover rounded" />
                        <div className="flex-1 min-w-0">
                          <p className="font-semibold text-sm truncate font-sans">{product.name}</p>
                          <p className="text-xs text-muted-foreground font-mono">{product.price.toLocaleString()} FCFA</p>
                        </div>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>

          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="hover:bg-primary/10 hover:text-primary transition-all h-9 w-9 md:h-10 md:w-10">
                  <User className="h-4 w-4 md:h-5 md:w-5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56 font-sans">
                <div className="flex flex-col gap-1 p-2">
                  <p className="text-sm font-semibold">{user.full_name}</p>
                  <p className="text-xs text-muted-foreground">{user.email}</p>
                </div>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild className="hover:bg-primary/10 hover:text-primary transition-all cursor-pointer">
                  <Link href="/orders">Mes commandes</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild className="hover:bg-primary/10 hover:text-primary transition-all cursor-pointer">
                  <Link href="/profile">Mon profil</Link>
                </DropdownMenuItem>
                {isAdmin(user) && (
                  <>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild className="hover:bg-primary/10 hover:text-primary transition-all cursor-pointer">
                      <Link href="/admin">Admin Dashboard</Link>
                    </DropdownMenuItem>
                  </>
                )}
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout} className="text-destructive hover:bg-destructive/10 transition-all cursor-pointer">
                  <LogOut className="mr-2 h-4 w-4" />
                  Déconnexion
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Button size="sm" asChild className="gap-2 shadow-lg hover:shadow-xl transition-all font-sans hidden md:flex">
              <Link href="/login">
                <LogIn className="h-4 w-4" />
                Connexion
              </Link>
            </Button>
          )}

          <Button 
            variant="ghost" 
            size="icon" 
            className="lg:hidden hover:bg-primary/10 hover:text-primary transition-all h-9 w-9"
            onClick={() => setShowMobileMenu(!showMobileMenu)}
          >
            {showMobileMenu ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>
      </div>

      {showMobileMenu && (
        <div className="lg:hidden border-t bg-white/95 backdrop-blur-xl animate-slide-down">
          <div className="container mx-auto px-3 py-4 space-y-3">
            {/* Mobile search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Rechercher..."
                className="pl-10 pr-4 h-11 font-sans text-base"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            {/* Mobile search results */}
            {searchResults.length > 0 && searchQuery && (
              <div className="bg-muted/30 rounded-lg p-2 space-y-1 max-h-64 overflow-y-auto">
                {searchResults.map((product) => (
                  <button
                    key={product.id}
                    onClick={() => {
                      handleProductClick(product.slug);
                      setShowMobileMenu(false);
                    }}
                    className="w-full flex items-center gap-3 p-3 hover:bg-primary/10 hover:text-primary rounded transition-all text-left min-h-[60px]"
                  >
                    <img src={product.image || "/placeholder.svg"} alt={product.name} className="w-12 h-12 object-cover rounded flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-sm truncate font-sans">{product.name}</p>
                      <p className="text-xs text-muted-foreground font-mono">{product.price.toLocaleString()} FCFA</p>
                    </div>
                  </button>
                ))}
              </div>
            )}

            <nav className="flex flex-col gap-2">
              <Button 
                variant="ghost" 
                asChild 
                className="justify-start font-semibold font-sans hover:bg-primary/10 hover:text-primary transition-all h-12 text-base"
                onClick={() => setShowMobileMenu(false)}
              >
                <Link href="/categories">Catégories</Link>
              </Button>
              <Button 
                variant="ghost" 
                asChild 
                className="justify-start font-semibold font-sans hover:bg-primary/10 hover:text-primary transition-all h-12 text-base"
                onClick={() => setShowMobileMenu(false)}
              >
                <Link href="/products">Produits</Link>
              </Button>
              <Button 
                variant="ghost" 
                asChild 
                className="justify-start font-semibold font-sans hover:bg-primary/10 hover:text-primary transition-all h-12 text-base"
                onClick={() => setShowMobileMenu(false)}
              >
                <Link href="/about">À propos</Link>
              </Button>
              <Button 
                variant="ghost" 
                asChild 
                className="justify-start font-semibold font-sans hover:bg-primary/10 hover:text-primary transition-all h-12 text-base"
                onClick={() => setShowMobileMenu(false)}
              >
                <Link href="/contact">Contact</Link>
              </Button>
              {!user && (
                <Button 
                  asChild 
                  className="justify-start gap-2 font-sans mt-2 h-12 text-base"
                  onClick={() => setShowMobileMenu(false)}
                >
                  <Link href="/login">
                    <LogIn className="h-5 w-5" />
                    Connexion
                  </Link>
                </Button>
              )}
            </nav>
          </div>
        </div>
      )}
    </header>
  );
}
