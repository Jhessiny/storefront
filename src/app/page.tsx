import Link from 'next/link'
import Image from 'next/image'
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
      <section className="relative min-h-[70vh] overflow-hidden">
        <Image
          src="/hero-cafe.png"
          alt="A warm literary jazz cafe with bookshelves and ambient lighting"
          fill
          className="img-warm object-cover"
          priority
          sizes="100vw"
        />
        <div className="from-background via-espresso/50 to-espresso/30 absolute inset-0 bg-gradient-to-t" />
        <div className="relative container mx-auto flex min-h-[70vh] flex-col justify-end px-4 pb-20 lg:px-8">
          <h1 className="font-display text-[clamp(2.5rem,7vw,5.5rem)] leading-[0.95] tracking-tight text-white drop-shadow-lg">
            New arrivals
          </h1>
          <div className="mt-6 flex items-end justify-between">
            <p className="max-w-lg text-[16px] leading-relaxed text-white/80">
              Each piece selected with intention. Quality products at considered
              prices, designed to elevate your everyday.
            </p>
            <Link
              href="/products"
              className="font-ui link-grow hidden text-[13px] tracking-wide text-white/60 transition-colors hover:text-white sm:block"
            >
              Shop all
            </Link>
          </div>
        </div>
      </section>

      <section className="container mx-auto px-4 py-16 lg:px-8 lg:py-24">
        <div className="mb-10 flex items-baseline justify-between">
          <h2 className="font-ui text-muted-foreground text-[11px] tracking-[0.15em] uppercase">
            Featured
          </h2>
          <Link
            href="/products"
            className="font-ui link-grow text-muted-foreground hover:text-foreground w-fit text-[13px] transition-colors sm:hidden"
          >
            View all
          </Link>
        </div>
        <ProductGrid products={products} />
      </section>
    </div>
  )
}
