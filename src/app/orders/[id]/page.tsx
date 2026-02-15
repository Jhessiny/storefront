import { redirect, notFound } from 'next/navigation'
import Image from 'next/image'
import { makeAuthRepository, makeOrderRepository } from '@/infrastructure/factories'
import { GetSession } from '@/application/use-cases/auth'
import { GetOrderById } from '@/application/use-cases/order'
import { isLeft } from '@/shared/utils/either'
import { Badge } from '@/presentation/components/ui/badge'
import { Separator } from '@/presentation/components/ui/separator'
import { formatCurrency } from '@/shared/utils/format-currency'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Order Details | Storefront'
}

type Props = {
  params: Promise<{ id: string }>
}

export default async function OrderDetailPage({ params }: Props) {
  const { id } = await params

  const authRepo = await makeAuthRepository()
  const sessionResult = await new GetSession(authRepo).execute()

  if (isLeft(sessionResult) || !sessionResult.value) {
    redirect('/auth/login')
  }

  const orderRepo = await makeOrderRepository()
  const orderResult = await new GetOrderById(orderRepo).execute(
    id,
    sessionResult.value.user.id
  )

  if (isLeft(orderResult)) {
    notFound()
  }

  const order = orderResult.value

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8 flex items-center justify-between">
        <h1 className="text-3xl font-bold">
          Order #{order.id.slice(0, 8)}
        </h1>
        <Badge>{order.status}</Badge>
      </div>

      <div className="space-y-4">
        {order.items.map((item) => (
          <div key={item.id} className="flex gap-4 rounded-lg border p-4">
            {item.product && (
              <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-md">
                <Image
                  src={item.product.thumbnailUrl}
                  alt={item.product.title}
                  fill
                  className="object-cover"
                />
              </div>
            )}
            <div className="flex flex-1 justify-between">
              <div>
                <p className="font-medium">
                  {item.product?.title || 'Product'}
                </p>
                <p className="text-sm text-muted-foreground">
                  Qty: {item.quantity} x {formatCurrency(item.unitPrice)}
                </p>
              </div>
              <p className="font-medium">
                {formatCurrency(item.unitPrice * item.quantity)}
              </p>
            </div>
          </div>
        ))}
      </div>

      <Separator className="my-6" />

      <div className="flex justify-between text-lg font-semibold">
        <span>Total</span>
        <span>{formatCurrency(order.total)}</span>
      </div>

      <p className="mt-4 text-sm text-muted-foreground">
        Ordered on {new Date(order.createdAt).toLocaleDateString()}
      </p>
    </div>
  )
}
