'use client'

import Link from 'next/link'
import Image from 'next/image'
import { Minus, Plus, Trash2 } from 'lucide-react'
import { Button } from '@/presentation/components/ui/button'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetFooter
} from '@/presentation/components/ui/sheet'
import { Separator } from '@/presentation/components/ui/separator'
import { useCartStore } from '@/presentation/store/cart-store'
import { formatCurrency } from '@/shared/utils/format-currency'

export function CartSheet({ children }: { children: React.ReactNode }) {
  const { items, removeItem, increaseQuantity, decreaseQuantity } =
    useCartStore()
  const totalPrice = useCartStore((s) => s.totalPrice())
  const totalItems = useCartStore((s) => s.totalItems())

  return (
    <Sheet>
      <SheetTrigger asChild>{children}</SheetTrigger>
      <SheetContent className="flex w-full flex-col sm:max-w-lg">
        <SheetHeader>
          <SheetTitle>Cart ({totalItems})</SheetTitle>
        </SheetHeader>

        {items.length === 0 ? (
          <div className="flex flex-1 items-center justify-center">
            <p className="text-muted-foreground">Your cart is empty</p>
          </div>
        ) : (
          <>
            <div className="flex-1 overflow-y-auto">
              <div className="space-y-4 py-4">
                {items.map((item) => (
                  <div key={item.productId} className="flex gap-4">
                    <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-md">
                      <Image
                        src={item.product.thumbnailUrl}
                        alt={item.product.title}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="flex flex-1 flex-col">
                      <Link
                        href={`/products/${item.product.slug}`}
                        className="text-sm font-medium hover:underline"
                      >
                        {item.product.title}
                      </Link>
                      <p className="text-sm text-muted-foreground">
                        {formatCurrency(item.product.price)}
                      </p>
                      <div className="mt-auto flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="icon"
                          className="h-7 w-7"
                          onClick={() => decreaseQuantity(item.productId)}
                        >
                          <Minus className="h-3 w-3" />
                        </Button>
                        <span className="w-8 text-center text-sm">
                          {item.quantity}
                        </span>
                        <Button
                          variant="outline"
                          size="icon"
                          className="h-7 w-7"
                          onClick={() => increaseQuantity(item.productId)}
                        >
                          <Plus className="h-3 w-3" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="ml-auto h-7 w-7"
                          onClick={() => removeItem(item.productId)}
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <Separator />

            <SheetFooter className="flex-col gap-2 pt-4">
              <div className="flex items-center justify-between text-base font-semibold">
                <span>Total</span>
                <span>{formatCurrency(totalPrice)}</span>
              </div>
              <Button asChild className="w-full">
                <Link href="/checkout">Checkout</Link>
              </Button>
            </SheetFooter>
          </>
        )}
      </SheetContent>
    </Sheet>
  )
}
