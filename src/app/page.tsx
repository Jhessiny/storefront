import Link from 'next/link'
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
      <section className="container mx-auto px-4 lg:px-8">
        <div className="border-b py-24 lg:py-32">
          <h1 className="font-display text-[clamp(3rem,8vw,7rem)] leading-[0.95] tracking-tight">
            New arrivals
          </h1>
          <div className="mt-8 flex items-end justify-between">
            <p className="text-muted-foreground max-w-md text-[15px] leading-relaxed">
              Each piece selected with intention. Quality products at considered
              prices, designed to elevate your everyday.
            </p>
            <Link
              href="/products"
              className="text-muted-foreground hover:text-foreground hidden text-[13px] underline underline-offset-4 transition-colors sm:block"
            >
              Shop all
            </Link>
          </div>
        </div>
      </section>

      <section className="container mx-auto px-4 py-16 lg:px-8 lg:py-24">
        <div className="mb-10 flex items-baseline justify-between">
          <h2 className="text-muted-foreground text-[13px] tracking-[0.15em] uppercase">
            Featured
          </h2>
          <Link
            href="/products"
            className="text-muted-foreground hover:text-foreground text-[13px] underline underline-offset-4 transition-colors sm:hidden"
          >
            View all
          </Link>
        </div>
        <ProductGrid products={products} />
      </section>
    </div>
  )
}
