import Link from 'next/link'
import Image from 'next/image'
import type { Product } from '@/domain/entities'
import {
  Card,
  CardContent,
  CardFooter
} from '@/presentation/components/ui/card'
import { Badge } from '@/presentation/components/ui/badge'
import { formatCurrency } from '@/shared/utils/format-currency'
import { AddToCartButton } from './add-to-cart-button'

export function ProductCard({ product }: { product: Product }) {
  const hasDiscount = product.compareAtPrice && product.compareAtPrice > product.price

  return (
    <Card className="group overflow-hidden">
      <Link href={`/products/${product.slug}`}>
        <div className="relative aspect-square overflow-hidden">
          <Image
            src={product.thumbnailUrl}
            alt={product.title}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
          {hasDiscount && (
            <Badge className="absolute left-2 top-2" variant="destructive">
              Sale
            </Badge>
          )}
        </div>
      </Link>
      <CardContent className="p-4">
        <Link href={`/products/${product.slug}`}>
          <h3 className="line-clamp-1 font-medium hover:underline">
            {product.title}
          </h3>
        </Link>
        <p className="text-sm text-muted-foreground">{product.brand}</p>
        <div className="mt-1 flex items-center gap-2">
          <span className="font-semibold">
            {formatCurrency(product.price)}
          </span>
          {hasDiscount && (
            <span className="text-sm text-muted-foreground line-through">
              {formatCurrency(product.compareAtPrice!)}
            </span>
          )}
        </div>
      </CardContent>
      <CardFooter className="p-4 pt-0">
        <AddToCartButton product={product} />
      </CardFooter>
    </Card>
  )
}
