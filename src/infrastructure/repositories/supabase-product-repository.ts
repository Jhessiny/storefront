import type { SupabaseClient } from '@supabase/supabase-js'
import type { ProductRepository } from '@/domain/repositories'
import type { Product, ProductFilters } from '@/domain/entities'
import type { PaginatedResponse, PaginationParams } from '@/shared/types'
import type { DomainError } from '@/shared/errors'
import type { Either } from '@/shared/utils/either'
import { left, right } from '@/shared/utils/either'
import { mapSupabaseError } from '../api/error-mapper'
import { NotFoundError } from '@/shared/errors'

export class SupabaseProductRepository implements ProductRepository {
  constructor(private readonly client: SupabaseClient) {}

  async getAll(
    filters: ProductFilters,
    pagination: PaginationParams
  ): Promise<Either<DomainError, PaginatedResponse<Product>>> {
    const page = pagination.page ?? 1
    const pageSize = pagination.pageSize ?? 12
    const from = (page - 1) * pageSize
    const to = from + pageSize - 1

    let query = this.client
      .from('products')
      .select(
        '*, category:categories(name, slug), images:product_images(id, product_id, url, alt_text, sort_order)',
        { count: 'exact' }
      )
      .eq('is_active', true)

    if (filters.categorySlug) {
      query = query.eq('category.slug', filters.categorySlug)
    }

    if (filters.search) {
      query = query.textSearch('search_vector', filters.search, {
        type: 'websearch'
      })
    }

    if (filters.minPrice !== undefined) {
      query = query.gte('price', filters.minPrice)
    }

    if (filters.maxPrice !== undefined) {
      query = query.lte('price', filters.maxPrice)
    }

    switch (filters.sortBy) {
      case 'price_asc':
        query = query.order('price', { ascending: true })
        break
      case 'price_desc':
        query = query.order('price', { ascending: false })
        break
      case 'rating':
        query = query.order('rating', { ascending: false })
        break
      case 'newest':
      default:
        query = query.order('created_at', { ascending: false })
        break
    }

    query = query.range(from, to)

    const { data, error, count } = await query

    if (error) return left(mapSupabaseError(error, 'Product'))

    const products = (data ?? []).map(this.mapProduct)
    const total = count ?? 0

    return right({
      data: products,
      total,
      page,
      pageSize,
      totalPages: Math.ceil(total / pageSize)
    })
  }

  async getBySlug(slug: string): Promise<Either<DomainError, Product>> {
    const { data, error } = await this.client
      .from('products')
      .select(
        '*, category:categories(name, slug), images:product_images(id, product_id, url, alt_text, sort_order)'
      )
      .eq('slug', slug)
      .eq('is_active', true)
      .single()

    if (error) return left(mapSupabaseError(error, 'Product'))
    if (!data) return left(new NotFoundError('Product', slug))

    return right(this.mapProduct(data))
  }

  async search(
    query: string,
    pagination: PaginationParams
  ): Promise<Either<DomainError, PaginatedResponse<Product>>> {
    return this.getAll({ search: query }, pagination)
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private mapProduct(row: any): Product {
    return {
      id: row.id,
      title: row.title,
      slug: row.slug,
      description: row.description,
      brand: row.brand,
      price: Number(row.price),
      compareAtPrice: row.compare_at_price
        ? Number(row.compare_at_price)
        : null,
      categoryId: row.category_id,
      thumbnailUrl: row.thumbnail_url,
      rating: Number(row.rating),
      stock: row.stock,
      stripeProductId: row.stripe_product_id,
      stripePriceId: row.stripe_price_id,
      isActive: row.is_active,
      images: (row.images ?? []).map(this.mapImage),
      category: row.category
        ? { name: row.category.name, slug: row.category.slug }
        : undefined,
      createdAt: row.created_at,
      updatedAt: row.updated_at
    }
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private mapImage(row: any) {
    return {
      id: row.id,
      productId: row.product_id,
      url: row.url,
      altText: row.alt_text,
      sortOrder: row.sort_order
    }
  }
}
