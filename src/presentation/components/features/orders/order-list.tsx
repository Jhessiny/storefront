import Link from 'next/link'
import type { Order } from '@/domain/entities'
import { Badge } from '@/presentation/components/ui/badge'
import { formatCurrency } from '@/shared/utils/format-currency'

const statusVariant: Record<
  string,
  'default' | 'secondary' | 'destructive' | 'outline'
> = {
  pending: 'outline',
  paid: 'default',
  shipped: 'secondary',
  delivered: 'default',
  cancelled: 'destructive'
}

export function OrderList({ orders }: { orders: Order[] }) {
  if (orders.length === 0) {
    return (
      <div className="flex min-h-[300px] items-center justify-center">
        <p className="text-muted-foreground text-[13px]">No orders yet.</p>
      </div>
    )
  }

  return (
    <div className="divide-y">
      {orders.map((order) => (
        <Link
          key={order.id}
          href={`/orders/${order.id}`}
          className="group block"
        >
          <div className="group-hover:text-muted-foreground flex items-center justify-between py-5 transition-colors">
            <div className="flex items-center gap-4">
              <span className="text-muted-foreground font-mono text-[12px]">
                #{order.id.slice(0, 8)}
              </span>
              <Badge variant={statusVariant[order.status] || 'outline'}>
                {order.status}
              </Badge>
            </div>
            <div className="flex items-center gap-6 text-[13px]">
              <span className="text-muted-foreground hidden sm:block">
                {order.items.length} item{order.items.length !== 1 ? 's' : ''}
              </span>
              <span className="text-muted-foreground/50 hidden sm:block">
                {new Date(order.createdAt).toLocaleDateString()}
              </span>
              <span className="tabular-nums">
                {formatCurrency(order.total)}
              </span>
            </div>
          </div>
        </Link>
      ))}
    </div>
  )
}
