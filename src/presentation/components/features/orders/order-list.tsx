import Link from 'next/link'
import type { Order } from '@/domain/entities'
import { Badge } from '@/presentation/components/ui/badge'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle
} from '@/presentation/components/ui/card'
import { formatCurrency } from '@/shared/utils/format-currency'

const statusVariant: Record<string, 'default' | 'secondary' | 'destructive' | 'outline'> = {
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
        <p className="text-muted-foreground">No orders yet.</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {orders.map((order) => (
        <Link key={order.id} href={`/orders/${order.id}`}>
          <Card className="transition-colors hover:bg-muted/50">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">
                Order #{order.id.slice(0, 8)}
              </CardTitle>
              <Badge variant={statusVariant[order.status] || 'outline'}>
                {order.status}
              </Badge>
            </CardHeader>
            <CardContent>
              <div className="flex justify-between text-sm text-muted-foreground">
                <span>{order.items.length} item(s)</span>
                <span>{formatCurrency(order.total)}</span>
              </div>
              <p className="mt-1 text-xs text-muted-foreground">
                {new Date(order.createdAt).toLocaleDateString()}
              </p>
            </CardContent>
          </Card>
        </Link>
      ))}
    </div>
  )
}
