import Link from 'next/link'
import Image from 'next/image'
import type { Product } from '@/domain/entities'
import { formatCurrency } from '@/shared/utils/format-currency'
import { AddToCartButton } from './add-to-cart-button'

export function ProductCard({ product }: { product: Product }) {
  const hasDiscount =
    product.compareAtPrice && product.compareAtPrice > product.price
  const discountPct = hasDiscount
    ? Math.round((1 - product.price / product.compareAtPrice!) * 100)
    : 0

  return (
    <div className="group">
      <Link href={`/products/${product.slug}`} className="block">
        <div className="film-grain bg-muted/50 relative aspect-[3/4] overflow-hidden">
          <Image
            src={product.thumbnailUrl}
            alt={product.title}
            fill
            className="img-warm object-cover transition-transform duration-700 ease-out group-hover:scale-[1.03]"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
          {hasDiscount && (
            <span className="font-ui bg-oxblood text-oxblood-foreground absolute top-4 left-0 px-2.5 py-1 text-[10px] font-medium tracking-wider">
              -{discountPct}%
            </span>
          )}
        </div>
      </Link>
      <div className="mt-3 space-y-0.5">
        <Link href={`/products/${product.slug}`}>
          <h3 className="group-hover:text-oxblood text-[14px] leading-snug transition-colors">
            {product.title}
          </h3>
        </Link>
        <p className="font-ui text-muted-foreground/60 text-[11px]">
          {product.brand}
        </p>
        <div className="flex items-center gap-2">
          <span className="font-ui text-[13px] tabular-nums">
            {formatCurrency(product.price)}
          </span>
          {hasDiscount && (
            <span className="font-ui text-muted-foreground/40 text-[11px] tabular-nums line-through">
              {formatCurrency(product.compareAtPrice!)}
            </span>
          )}
        </div>
      </div>
      <div className="mt-3">
        <AddToCartButton product={product} />
      </div>
    </div>
  )
}
