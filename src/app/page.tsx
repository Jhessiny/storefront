import Link from 'next/link'
import { Button } from '@/presentation/components/ui/button'
import { ProductGrid } from '@/presentation/components/features/product/product-grid'
import { makeProductRepository } from '@/infrastructure/factories'
import { GetProducts } from '@/application/use-cases/product'
import { isRight } from '@/shared/utils/either'
import { mockProducts } from '@/shared/mocks/products'

export default async function HomePage() {
  const repository = await makeProductRepository()
  const result = await new GetProducts(repository).execute(
    { sortBy: 'newest' },
    { page: 1, pageSize: 8 }
  )

  const products = isRight(result) ? result.value.data : mockProducts

  return (
    <div>
      <section className="from-muted/50 to-background bg-gradient-to-b py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl">
            Welcome to Storefront
          </h1>
          <p className="text-muted-foreground mx-auto mt-4 max-w-2xl text-lg">
            Discover quality products at great prices. From electronics to
            clothing, we have everything you need.
          </p>
          <div className="mt-8 flex justify-center gap-4">
            <Button asChild size="lg">
              <Link href="/products">Shop Now</Link>
            </Button>
          </div>
        </div>
      </section>

      <section className="container mx-auto px-4 py-16">
        <div className="mb-8 flex items-center justify-between">
          <h2 className="text-2xl font-bold">Featured Products</h2>
          <Button variant="ghost" asChild>
            <Link href="/products">View all</Link>
          </Button>
        </div>
        <ProductGrid products={products} />
      </section>
    </div>
  )
}
