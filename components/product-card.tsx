import Link from 'next/link';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { formatPrice } from '@/lib/format';
import { Product } from '@/lib/mock-data';
import { ShoppingCart, Zap, Play } from 'lucide-react';
import { useState } from 'react';

interface ProductCardProps {
  product: Product;
  onAddToCart?: (product: Product) => void;
}

export function ProductCard({ product, onAddToCart }: ProductCardProps) {
  const [isHovering, setIsHovering] = useState(false);

  return (
    <Card className="group overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1 border-border/50">
      <Link href={`/products/${product.slug}`}>
        <div 
          className="aspect-[3/2] overflow-hidden bg-gradient-to-br from-primary/5 to-accent/5 relative"
          onMouseEnter={() => setIsHovering(true)}
          onMouseLeave={() => setIsHovering(false)}
        >
          {product.is_featured && (
            <Badge className="absolute top-3 left-3 bg-accent text-accent-foreground gap-1 shadow-lg z-10 animate-pulse-glow">
              <Zap className="h-3 w-3" />
              Populaire
            </Badge>
          )}
          
          {product.video_url ? (
            <>
              {isHovering ? (
                <video
                  src={product.video_url}
                  autoPlay
                  loop
                  muted
                  playsInline
                  className="h-full w-full object-cover transition-opacity duration-300"
                />
              ) : (
                <div className="relative h-full w-full">
                  <img
                    src={product.image_url || "/placeholder.svg"}
                    alt={product.name}
                    className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 flex items-center justify-center bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white/90 backdrop-blur-sm">
                      <Play className="h-6 w-6 text-primary ml-0.5" />
                    </div>
                  </div>
                </div>
              )}
            </>
          ) : (
            <img
              src={product.image_url || "/placeholder.svg"}
              alt={product.name}
              className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-110"
            />
          )}
        </div>
      </Link>
      <CardContent className="p-4 md:p-5">
        <Link href={`/products/${product.slug}`}>
          <div className="flex flex-wrap gap-1.5 md:gap-2 mb-2 md:mb-3">
            {product.platform && (
              <Badge variant="secondary" className="text-[10px] md:text-xs font-medium">
                {product.platform}
              </Badge>
            )}
            {product.region && (
              <Badge variant="outline" className="text-[10px] md:text-xs">
                {product.region}
              </Badge>
            )}
          </div>
          <h3 className="font-bold text-base md:text-lg leading-tight line-clamp-2 mb-2 group-hover:text-primary transition-colors">
            {product.name}
          </h3>
        </Link>
        <p className="text-xs md:text-sm text-muted-foreground line-clamp-2 leading-relaxed">
          {product.description}
        </p>
      </CardContent>
      <CardFooter className="p-4 md:p-5 pt-0 flex items-center justify-between gap-2 md:gap-3">
        <div className="flex flex-col">
          <p className="text-xl md:text-2xl font-bold text-primary">{formatPrice(product.price)}</p>
          <p className="text-[10px] md:text-xs text-muted-foreground">
            {product.stock > 0 ? (
              <span className="text-success font-medium">En stock</span>
            ) : (
              <span className="text-destructive">Rupture</span>
            )}
          </p>
        </div>
        <Button
          size="sm"
          onClick={() => onAddToCart?.(product)}
          disabled={product.stock === 0}
          className="gap-1.5 md:gap-2 shadow-md hover:shadow-lg hover:scale-105 transition-all h-9 md:h-auto text-xs md:text-sm"
        >
          <ShoppingCart className="h-3 w-3 md:h-4 md:w-4" />
          <span className="hidden sm:inline">Ajouter</span>
          <span className="sm:hidden">+</span>
        </Button>
      </CardFooter>
    </Card>
  );
}
