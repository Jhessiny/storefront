import type { ProductFilters } from '@/domain/entities'
import type { PaginationParams } from '@/shared/types'

export const queryKeys = {
  products: {
    all: ['products'] as const,
    list: (filters: ProductFilters, pagination: PaginationParams) =>
      ['products', 'list', filters, pagination] as const,
    detail: (slug: string) => ['products', 'detail', slug] as const,
    search: (query: string, pagination: PaginationParams) =>
      ['products', 'search', query, pagination] as const
  },
  categories: {
    all: ['categories'] as const
  },
  orders: {
    all: ['orders'] as const,
    detail: (id: string) => ['orders', id] as const
  }
}
