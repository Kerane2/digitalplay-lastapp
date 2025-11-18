import Link from 'next/link';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { formatPrice } from '@/lib/format';
import { Product } from '@/lib/mock-data';
import { ShoppingCart, Clock } from 'lucide-react';

interface ProductCardProps {
  product: Product;
  onAddToCart?: (product: Product) => void;
}

export function ProductCard({ product, onAddToCart }: ProductCardProps) {
  return (
    <Card className="group overflow-hidden transition-all duration-300 hover:shadow-2xl hover:-translate-y-2 border-border/50 bg-card">
      <Link href={`/products/${product.slug}`}>
        <div className="aspect-[4/3] overflow-hidden bg-gradient-to-br from-primary/5 to-accent/5 relative">
          {product.is_featured && (
            <Badge className="absolute top-3 right-3 bg-primary text-primary-foreground px-3 py-1 shadow-lg z-10 font-semibold text-xs">
              Populaire
            </Badge>
          )}
          
          <img
            src={product.image_url || "/placeholder.svg"}
            alt={product.name}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
          />
        </div>
      </Link>
      <CardContent className="p-4">
        <Link href={`/products/${product.slug}`}>
          <h3 className="font-bold text-lg leading-tight mb-2 group-hover:text-primary transition-colors line-clamp-2">
            {product.name}
          </h3>
        </Link>
        
        <div className="flex items-center gap-2 text-xs text-muted-foreground mb-3">
          <Clock className="h-3 w-3" />
          <span>5-10 minutes</span>
        </div>

        <div className="flex items-center justify-between mb-3">
          <p className="text-2xl font-bold text-primary">{formatPrice(product.price)}</p>
          {product.stock > 0 && (
            <Badge variant="secondary" className="bg-green-500/10 text-green-600 border-green-500/20 font-medium">
              En stock ({product.stock})
            </Badge>
          )}
        </div>
      </CardContent>
      <CardFooter className="p-4 pt-0">
        <Button
          onClick={() => onAddToCart?.(product)}
          disabled={product.stock === 0}
          className="w-full gap-2 shadow-md hover:shadow-xl hover:scale-105 transition-all font-semibold h-11"
        >
          Voir
        </Button>
      </CardFooter>
    </Card>
  );
}
