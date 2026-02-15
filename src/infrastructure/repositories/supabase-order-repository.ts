import type { SupabaseClient } from '@supabase/supabase-js'
import type { OrderRepository } from '@/domain/repositories'
import type { Order, OrderStatus } from '@/domain/entities'
import type { LocalCartItem } from '@/domain/entities'
import type { DomainError } from '@/shared/errors'
import type { Either } from '@/shared/utils/either'
import { left, right } from '@/shared/utils/either'
import { mapSupabaseError } from '../api/error-mapper'
import { NotFoundError } from '@/shared/errors'

export class SupabaseOrderRepository implements OrderRepository {
  constructor(private readonly client: SupabaseClient) {}

  async create(
    userId: string,
    items: LocalCartItem[],
    stripeSessionId: string
  ): Promise<Either<DomainError, Order>> {
    const total = items.reduce(
      (sum, item) => sum + item.product.price * item.quantity,
      0
    )

    const { data: order, error: orderError } = await this.client
      .from('orders')
      .insert({
        user_id: userId,
        status: 'pending' as OrderStatus,
        total,
        stripe_session_id: stripeSessionId
      })
      .select()
      .single()

    if (orderError) return left(mapSupabaseError(orderError, 'Order'))

    const orderItems = items.map((item) => ({
      order_id: order.id,
      product_id: item.productId,
      quantity: item.quantity,
      unit_price: item.product.price
    }))

    const { error: itemsError } = await this.client
      .from('order_items')
      .insert(orderItems)

    if (itemsError) return left(mapSupabaseError(itemsError, 'OrderItem'))

    return this.getById(order.id, userId)
  }

  async getByUserId(userId: string): Promise<Either<DomainError, Order[]>> {
    const { data, error } = await this.client
      .from('orders')
      .select(
        '*, items:order_items(*, product:products(title, slug, thumbnail_url))'
      )
      .eq('user_id', userId)
      .order('created_at', { ascending: false })

    if (error) return left(mapSupabaseError(error, 'Order'))

    return right((data ?? []).map(this.mapOrder))
  }

  async getById(
    orderId: string,
    userId: string
  ): Promise<Either<DomainError, Order>> {
    const { data, error } = await this.client
      .from('orders')
      .select(
        '*, items:order_items(*, product:products(title, slug, thumbnail_url))'
      )
      .eq('id', orderId)
      .eq('user_id', userId)
      .single()

    if (error) return left(mapSupabaseError(error, 'Order'))
    if (!data) return left(new NotFoundError('Order', orderId))

    return right(this.mapOrder(data))
  }

  async updateStatus(
    orderId: string,
    status: OrderStatus
  ): Promise<Either<DomainError, void>> {
    const { error } = await this.client
      .from('orders')
      .update({ status, updated_at: new Date().toISOString() })
      .eq('id', orderId)

    if (error) return left(mapSupabaseError(error, 'Order'))

    return right(undefined)
  }

  async getByStripeSessionId(
    sessionId: string
  ): Promise<Either<DomainError, Order>> {
    const { data, error } = await this.client
      .from('orders')
      .select(
        '*, items:order_items(*, product:products(title, slug, thumbnail_url))'
      )
      .eq('stripe_session_id', sessionId)
      .single()

    if (error) return left(mapSupabaseError(error, 'Order'))
    if (!data) return left(new NotFoundError('Order'))

    return right(this.mapOrder(data))
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private mapOrder(row: any): Order {
    return {
      id: row.id,
      userId: row.user_id,
      status: row.status,
      total: Number(row.total),
      stripeSessionId: row.stripe_session_id,
      stripePaymentIntentId: row.stripe_payment_intent_id,
      items: (row.items ?? []).map(
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (item: any) => ({
          id: item.id,
          orderId: item.order_id,
          productId: item.product_id,
          quantity: item.quantity,
          unitPrice: Number(item.unit_price),
          createdAt: item.created_at,
          product: item.product
            ? {
                title: item.product.title,
                slug: item.product.slug,
                thumbnailUrl: item.product.thumbnail_url
              }
            : undefined
        })
      ),
      createdAt: row.created_at,
      updatedAt: row.updated_at
    }
  }
}
