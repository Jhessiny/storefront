import { redirect } from 'next/navigation'
import {
  makeAuthRepository,
  makeOrderRepository
} from '@/infrastructure/factories'
import { GetSession } from '@/application/use-cases/auth'
import { GetOrders } from '@/application/use-cases/order'
import { isLeft, isRight } from '@/shared/utils/either'
import { OrderList } from '@/presentation/components/features/orders/order-list'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Orders | Storefront'
}

export default async function OrdersPage() {
  const authRepo = await makeAuthRepository()
  const sessionResult = await new GetSession(authRepo).execute()

  if (isLeft(sessionResult) || !sessionResult.value) {
    redirect('/auth/login')
  }

  const orderRepo = await makeOrderRepository()
  const ordersResult = await new GetOrders(orderRepo).execute(
    sessionResult.value.user.id
  )

  const orders = isRight(ordersResult) ? ordersResult.value : []

  return (
    <div className="container mx-auto px-4 lg:px-8">
      <div className="border-b py-10">
        <h1 className="font-display text-4xl tracking-tight">Orders</h1>
      </div>
      <div className="py-10">
        <OrderList orders={orders} />
      </div>
    </div>
  )
}
