import Link from 'next/link';
import Image from 'next/image';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { formatPrice } from '@/lib/format';
import { Product } from '@/lib/mock-data';
import { ShoppingCart } from 'lucide-react';

interface ProductCardProps {
  product: Product;
  onAddToCart?: (product: Product) => void;
}

export function ProductCard({ product, onAddToCart }: ProductCardProps) {
  return (
    <Card className="group overflow-hidden transition-all hover:shadow-lg">
      <Link href={`/products/${product.slug}`}>
        <div className="aspect-[4/3] overflow-hidden bg-muted">
          <img
            src={product.image_url || "/placeholder.svg"}
            alt={product.name}
            className="h-full w-full object-cover transition-transform group-hover:scale-105"
          />
        </div>
      </Link>
      <CardContent className="p-4">
        <Link href={`/products/${product.slug}`}>
          <div className="mb-2 flex items-start justify-between gap-2">
            <h3 className="font-semibold leading-tight line-clamp-2 group-hover:text-primary transition-colors">
              {product.name}
            </h3>
          </div>
          <div className="flex gap-2 mb-3">
            {product.platform && (
              <Badge variant="secondary" className="text-xs">
                {product.platform}
              </Badge>
            )}
            {product.region && (
              <Badge variant="outline" className="text-xs">
                {product.region}
              </Badge>
            )}
          </div>
        </Link>
        <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed">
          {product.description}
        </p>
      </CardContent>
      <CardFooter className="p-4 pt-0 flex items-center justify-between gap-2">
        <div>
          <p className="text-xl font-bold text-primary">{formatPrice(product.price)}</p>
          <p className="text-xs text-muted-foreground">
            {product.stock > 0 ? `${product.stock} en stock` : 'Rupture de stock'}
          </p>
        </div>
        <Button
          size="sm"
          onClick={() => onAddToCart?.(product)}
          disabled={product.stock === 0}
          className="gap-2"
        >
          <ShoppingCart className="h-4 w-4" />
          Ajouter
        </Button>
      </CardFooter>
    </Card>
  );
}
