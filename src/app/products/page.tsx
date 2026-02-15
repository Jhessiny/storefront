import { Suspense } from 'react'
import { makeProductRepository, makeCategoryRepository } from '@/infrastructure/factories'
import { GetProducts } from '@/application/use-cases/product'
import { GetCategories } from '@/application/use-cases/category'
import { isRight } from '@/shared/utils/either'
import { ProductGrid } from '@/presentation/components/features/product/product-grid'
import { ProductFilters } from '@/presentation/components/features/product/product-filters'
import { Button } from '@/presentation/components/ui/button'
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
  const totalPages = isRight(productsResult) ? productsResult.value.totalPages : 0
  const categories = isRight(categoriesResult) ? categoriesResult.value : []

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="mb-8 text-3xl font-bold">Products</h1>

      <div className="grid gap-8 lg:grid-cols-[250px_1fr]">
        <aside>
          <Suspense>
            <ProductFilters categories={categories} />
          </Suspense>
        </aside>

        <div>
          <ProductGrid products={products} />

          {totalPages > 1 && (
            <div className="mt-8 flex justify-center gap-2">
              {page > 1 && (
                <Button variant="outline" asChild>
                  <Link
                    href={`/products?${new URLSearchParams({ ...Object.fromEntries(Object.entries(params).filter(([, v]) => typeof v === 'string') as [string, string][]), page: String(page - 1) }).toString()}`}
                  >
                    Previous
                  </Link>
                </Button>
              )}
              <span className="flex items-center px-4 text-sm text-muted-foreground">
                Page {page} of {totalPages}
              </span>
              {page < totalPages && (
                <Button variant="outline" asChild>
                  <Link
                    href={`/products?${new URLSearchParams({ ...Object.fromEntries(Object.entries(params).filter(([, v]) => typeof v === 'string') as [string, string][]), page: String(page + 1) }).toString()}`}
                  >
                    Next
                  </Link>
                </Button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
