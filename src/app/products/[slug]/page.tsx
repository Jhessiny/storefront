import { notFound } from 'next/navigation'
import Image from 'next/image'
import { makeProductRepository } from '@/infrastructure/factories'
import { GetProductBySlug } from '@/application/use-cases/product'
import { isLeft } from '@/shared/utils/either'
import { formatCurrency } from '@/shared/utils/format-currency'
import { Badge } from '@/presentation/components/ui/badge'
import { Separator } from '@/presentation/components/ui/separator'
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
    <div className="container mx-auto px-4 py-8">
      <div className="grid gap-8 md:grid-cols-2">
        <div className="space-y-4">
          <div className="relative aspect-square overflow-hidden rounded-lg">
            <Image
              src={product.thumbnailUrl}
              alt={product.title}
              fill
              className="object-cover"
              priority
              sizes="(max-width: 768px) 100vw, 50vw"
            />
          </div>
          {product.images.length > 0 && (
            <div className="grid grid-cols-4 gap-2">
              {product.images.map((image) => (
                <div
                  key={image.id}
                  className="relative aspect-square overflow-hidden rounded-md"
                >
                  <Image
                    src={image.url}
                    alt={image.altText || product.title}
                    fill
                    className="object-cover"
                    sizes="25vw"
                  />
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="space-y-6">
          {product.category && (
            <Badge variant="secondary">{product.category.name}</Badge>
          )}

          <div>
            <h1 className="text-3xl font-bold">{product.title}</h1>
            <p className="text-lg text-muted-foreground">{product.brand}</p>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-3xl font-bold">
              {formatCurrency(product.price)}
            </span>
            {hasDiscount && (
              <span className="text-lg text-muted-foreground line-through">
                {formatCurrency(product.compareAtPrice!)}
              </span>
            )}
          </div>

          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <span>Rating: {product.rating}/5</span>
            <span>|</span>
            <span>
              {product.stock > 0
                ? `${product.stock} in stock`
                : 'Out of stock'}
            </span>
          </div>

          <Separator />

          <p className="leading-relaxed text-muted-foreground">
            {product.description}
          </p>

          <AddToCartButton product={product} />
        </div>
      </div>
    </div>
  )
}
