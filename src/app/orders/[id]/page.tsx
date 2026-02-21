import { redirect, notFound } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import {
  makeAuthRepository,
  makeOrderRepository
} from '@/infrastructure/factories'
import { GetSession } from '@/application/use-cases/auth'
import { GetOrderById } from '@/application/use-cases/order'
import { isLeft } from '@/shared/utils/either'
import { Badge } from '@/presentation/components/ui/badge'
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
    <div className="container mx-auto px-4 lg:px-8">
      <div className="border-b py-4">
        <Link
          href="/orders"
          className="font-ui text-muted-foreground hover:text-oxblood text-[13px] underline-offset-4 transition-colors hover:underline"
        >
          &larr; Orders
        </Link>
      </div>

      <div className="py-10">
        <div className="flex items-center gap-4">
          <h1 className="font-display text-3xl tracking-tight">
            #{order.id.slice(0, 8)}
          </h1>
          <Badge>{order.status}</Badge>
        </div>
        <p className="font-ui text-muted-foreground/50 mt-2 text-[12px]">
          {new Date(order.createdAt).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
          })}
        </p>

        <div className="mt-10 divide-y">
          {order.items.map((item) => (
            <div key={item.id} className="flex gap-4 py-4">
              {item.product && (
                <div className="film-grain bg-muted/50 relative h-24 w-20 shrink-0 overflow-hidden">
                  <Image
                    src={item.product.thumbnailUrl}
                    alt={item.product.title}
                    fill
                    className="img-warm object-cover"
                  />
                </div>
              )}
              <div className="flex flex-1 justify-between">
                <div>
                  <p className="text-[14px]">
                    {item.product?.title || 'Product'}
                  </p>
                  <p className="font-ui text-muted-foreground mt-0.5 text-[12px]">
                    Qty: {item.quantity} &times;{' '}
                    {formatCurrency(item.unitPrice)}
                  </p>
                </div>
                <p className="font-ui text-[13px] tabular-nums">
                  {formatCurrency(item.unitPrice * item.quantity)}
                </p>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-6 flex justify-between border-t pt-6">
          <span className="font-ui text-muted-foreground text-[11px] tracking-[0.12em] uppercase">
            Total
          </span>
          <span className="font-ui text-lg tabular-nums">
            {formatCurrency(order.total)}
          </span>
        </div>
      </div>
    </div>
  )
}
