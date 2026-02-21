import { notFound } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { makeProductRepository } from '@/infrastructure/factories'
import { GetProductBySlug } from '@/application/use-cases/product'
import { isLeft } from '@/shared/utils/either'
import { formatCurrency } from '@/shared/utils/format-currency'
import { AddToCartButton } from '@/presentation/components/features/product/add-to-cart-button'
import type { Metadata } from 'next'

type Props = {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const repository = await makeProductRepository()
  const result = await new GetProductBySlug(repository).execute(slug)

  if (isLeft(result)) {
    return { title: 'Product Not Found | Storefront' }
  }

  return {
    title: `${result.value.title} | Storefront`,
    description: result.value.description
  }
}

export default async function ProductDetailPage({ params }: Props) {
  const { slug } = await params
  const repository = await makeProductRepository()
  const result = await new GetProductBySlug(repository).execute(slug)

  if (isLeft(result)) {
    notFound()
  }

  const product = result.value
  const hasDiscount =
    product.compareAtPrice && product.compareAtPrice > product.price

  return (
    <div className="container mx-auto px-4 lg:px-8">
      <div className="border-b py-4">
        <Link
          href="/products"
          className="font-ui text-muted-foreground hover:text-oxblood text-[13px] underline-offset-4 transition-colors hover:underline"
        >
          &larr; Back
        </Link>
      </div>

      <div className="grid gap-12 py-10 md:grid-cols-[1.2fr_1fr] lg:gap-20 lg:py-16">
        <div className="space-y-2">
          <div className="film-grain bg-muted/50 relative aspect-[3/4] overflow-hidden">
            <Image
              src={product.thumbnailUrl}
              alt={product.title}
              fill
              className="img-warm object-cover"
              priority
              sizes="(max-width: 768px) 100vw, 55vw"
            />
          </div>
          {product.images.length > 0 && (
            <div className="grid grid-cols-4 gap-2">
              {product.images.map((image) => (
                <div
                  key={image.id}
                  className="film-grain bg-muted/50 relative aspect-square cursor-pointer overflow-hidden transition-opacity hover:opacity-75"
                >
                  <Image
                    src={image.url}
                    alt={image.altText || product.title}
                    fill
                    className="img-warm object-cover"
                    sizes="15vw"
                  />
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="md:py-4">
          {product.category && (
            <p className="font-ui text-muted-foreground text-[11px] tracking-[0.15em] uppercase">
              {product.category.name}
            </p>
          )}

          <h1 className="font-display mt-3 text-3xl leading-tight tracking-tight">
            {product.title}
          </h1>
          <p className="font-ui text-muted-foreground mt-1 text-[13px]">
            {product.brand}
          </p>

          <div className="mt-6 flex items-baseline gap-3">
            <span className="font-ui text-lg tabular-nums">
              {formatCurrency(product.price)}
            </span>
            {hasDiscount && (
              <span className="font-ui text-muted-foreground/50 text-[13px] tabular-nums line-through">
                {formatCurrency(product.compareAtPrice!)}
              </span>
            )}
          </div>

          <div className="font-ui text-muted-foreground mt-4 flex items-center gap-3 text-[12px]">
            <span>{product.rating}/5</span>
            <span className="text-border">|</span>
            <span>
              {product.stock > 0 ? `${product.stock} in stock` : 'Sold out'}
            </span>
          </div>

          <div className="bg-border my-8 h-px" />

          <p className="text-muted-foreground font-serif text-[15px] leading-[1.9]">
            {product.description}
          </p>

          <div className="mt-8">
            <AddToCartButton product={product} />
          </div>
        </div>
      </div>
    </div>
  )
}
