import { Suspense } from 'react'
import {
  makeProductRepository,
  makeCategoryRepository
} from '@/infrastructure/factories'
import { GetProducts } from '@/application/use-cases/product'
import { GetCategories } from '@/application/use-cases/category'
import { isRight } from '@/shared/utils/either'
import { ProductGrid } from '@/presentation/components/features/product/product-grid'
import { ProductFilters } from '@/presentation/components/features/product/product-filters'
import Link from 'next/link'
import type { ProductFilters as ProductFiltersType } from '@/domain/entities'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Products | Storefront'
}

type Props = {
  searchParams: Promise<Record<string, string | string[] | undefined>>
}

export default async function ProductsPage({ searchParams }: Props) {
  const params = await searchParams
  const page = Number(params.page) || 1
  const filters: ProductFiltersType = {
    categorySlug: params.category as string | undefined,
    search: params.search as string | undefined,
    minPrice: params.minPrice ? Number(params.minPrice) : undefined,
    maxPrice: params.maxPrice ? Number(params.maxPrice) : undefined,
    sortBy: (params.sort as ProductFiltersType['sortBy']) || 'newest'
  }

  const [productRepo, categoryRepo] = await Promise.all([
    makeProductRepository(),
    makeCategoryRepository()
  ])

  const [productsResult, categoriesResult] = await Promise.all([
    new GetProducts(productRepo).execute(filters, { page, pageSize: 12 }),
    new GetCategories(categoryRepo).execute()
  ])

  const products = isRight(productsResult) ? productsResult.value.data : []
  const totalPages = isRight(productsResult)
    ? productsResult.value.totalPages
    : 0
  const categories = isRight(categoriesResult) ? categoriesResult.value : []

  return (
    <div className="container mx-auto px-4 lg:px-8">
      <div className="border-b py-10 lg:py-16">
        <h1 className="font-display text-4xl tracking-tight lg:text-5xl">
          Shop
        </h1>
      </div>

      <div className="grid gap-12 py-10 lg:grid-cols-[180px_1fr] lg:py-16">
        <aside>
          <Suspense>
            <ProductFilters categories={categories} />
          </Suspense>
        </aside>

        <div>
          <ProductGrid products={products} />

          {totalPages > 1 && (
            <div className="mt-16 flex items-center justify-center gap-6">
              {page > 1 && (
                <Link
                  href={`/products?${new URLSearchParams({ ...Object.fromEntries(Object.entries(params).filter(([, v]) => typeof v === 'string') as [string, string][]), page: String(page - 1) }).toString()}`}
                  className="font-ui link-grow text-muted-foreground hover:text-oxblood w-fit text-[13px] transition-colors"
                >
                  Previous
                </Link>
              )}
              <span className="font-ui text-muted-foreground/50 text-[12px] tabular-nums">
                {page} / {totalPages}
              </span>
              {page < totalPages && (
                <Link
                  href={`/products?${new URLSearchParams({ ...Object.fromEntries(Object.entries(params).filter(([, v]) => typeof v === 'string') as [string, string][]), page: String(page + 1) }).toString()}`}
                  className="font-ui link-grow text-muted-foreground hover:text-oxblood w-fit text-[13px] transition-colors"
                >
                  Next
                </Link>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
