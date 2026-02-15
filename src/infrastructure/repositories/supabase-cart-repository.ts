import type { SupabaseClient } from '@supabase/supabase-js'
import type { CartRepository } from '@/domain/repositories'
import type { CartItem, LocalCartItem } from '@/domain/entities'
import type { DomainError } from '@/shared/errors'
import type { Either } from '@/shared/utils/either'
import { left, right } from '@/shared/utils/either'
import { mapSupabaseError } from '../api/error-mapper'

export class SupabaseCartRepository implements CartRepository {
  constructor(private readonly client: SupabaseClient) {}

  async getByUserId(userId: string): Promise<Either<DomainError, CartItem[]>> {
    const { data, error } = await this.client
      .from('cart_items')
      .select(
        '*, product:products(id, title, slug, price, thumbnail_url, stock, stripe_price_id)'
      )
      .eq('user_id', userId)

    if (error) return left(mapSupabaseError(error, 'CartItem'))

    return right(
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (data ?? []).map((row: any) => ({
        id: row.id,
        userId: row.user_id,
        productId: row.product_id,
        quantity: row.quantity,
        createdAt: row.created_at,
        updatedAt: row.updated_at,
        product: row.product
          ? {
              id: row.product.id,
              title: row.product.title,
              slug: row.product.slug,
              price: Number(row.product.price),
              thumbnailUrl: row.product.thumbnail_url,
              stock: row.product.stock,
              stripePriceId: row.product.stripe_price_id
            }
          : undefined
      }))
    )
  }

  async syncCart(
    userId: string,
    items: LocalCartItem[]
  ): Promise<Either<DomainError, void>> {
    // Clear existing cart
    const { error: deleteError } = await this.client
      .from('cart_items')
      .delete()
      .eq('user_id', userId)

    if (deleteError) return left(mapSupabaseError(deleteError, 'CartItem'))

    if (items.length === 0) return right(undefined)

    // Insert all items
    const rows = items.map((item) => ({
      user_id: userId,
      product_id: item.productId,
      quantity: item.quantity
    }))

    const { error: insertError } = await this.client
      .from('cart_items')
      .insert(rows)

    if (insertError) return left(mapSupabaseError(insertError, 'CartItem'))

    return right(undefined)
  }

  async clearCart(userId: string): Promise<Either<DomainError, void>> {
    const { error } = await this.client
      .from('cart_items')
      .delete()
      .eq('user_id', userId)

    if (error) return left(mapSupabaseError(error, 'CartItem'))

    return right(undefined)
  }
}
