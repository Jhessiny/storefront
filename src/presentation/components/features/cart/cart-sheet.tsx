'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Minus, Plus, X } from 'lucide-react'
import { Button } from '@/presentation/components/ui/button'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetFooter
} from '@/presentation/components/ui/sheet'
import { useCartStore } from '@/presentation/store/cart-store'
import { formatCurrency } from '@/shared/utils/format-currency'

export function CartSheet({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false)
  const { items, removeItem, increaseQuantity, decreaseQuantity } =
    useCartStore()
  const totalPrice = useCartStore((s) => s.totalPrice())
  const totalItems = useCartStore((s) => s.totalItems())

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>{children}</SheetTrigger>
      <SheetContent className="flex w-full flex-col sm:max-w-sm">
        <SheetHeader>
          <SheetTitle className="font-ui text-[13px] tracking-[0.12em] uppercase">
            Bag ({totalItems})
          </SheetTitle>
        </SheetHeader>

        {items.length === 0 ? (
          <div className="flex flex-1 items-center justify-center">
            <p className="text-muted-foreground text-[14px]">
              Your bag is empty.
            </p>
          </div>
        ) : (
          <>
            <div className="flex-1 overflow-y-auto">
              <div className="divide-y">
                {items.map((item) => (
                  <div key={item.productId} className="flex gap-4 py-4">
                    <div className="film-grain bg-muted/50 relative h-24 w-20 shrink-0 overflow-hidden">
                      <Image
                        src={item.product.thumbnailUrl}
                        alt={item.product.title}
                        fill
                        className="img-warm object-cover"
                      />
                    </div>
                    <div className="flex flex-1 flex-col justify-between">
                      <div className="flex justify-between">
                        <div>
                          <Link
                            href={`/products/${item.product.slug}`}
                            className="hover:text-oxblood text-[14px] leading-snug transition-colors"
                            onClick={() => setOpen(false)}
                          >
                            {item.product.title}
                          </Link>
                          <p className="font-ui text-muted-foreground mt-0.5 text-[12px] tabular-nums">
                            {formatCurrency(item.product.price)}
                          </p>
                        </div>
                        <button
                          className="text-muted-foreground/40 hover:text-oxblood h-5 w-5 transition-colors"
                          onClick={() => removeItem(item.productId)}
                        >
                          <X className="h-3.5 w-3.5" />
                        </button>
                      </div>
                      <div className="flex items-center gap-2.5">
                        <button
                          className="border-border text-muted-foreground hover:border-oxblood/40 hover:text-oxblood flex h-6 w-6 items-center justify-center border transition-colors"
                          onClick={() => decreaseQuantity(item.productId)}
                        >
                          <Minus className="h-2.5 w-2.5" />
                        </button>
                        <span className="font-ui w-4 text-center text-[12px] tabular-nums">
                          {item.quantity}
                        </span>
                        <button
                          className="border-border text-muted-foreground hover:border-oxblood/40 hover:text-oxblood flex h-6 w-6 items-center justify-center border transition-colors"
                          onClick={() => increaseQuantity(item.productId)}
                        >
                          <Plus className="h-2.5 w-2.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <SheetFooter className="flex-col gap-4 border-t pt-4">
              <div className="flex items-baseline justify-between">
                <span className="font-ui text-muted-foreground text-[11px] tracking-[0.12em] uppercase">
                  Total
                </span>
                <span className="font-ui text-[15px] tabular-nums">
                  {formatCurrency(totalPrice)}
                </span>
              </div>
              <Button
                asChild
                className="h-10 w-full text-[12px] tracking-[0.12em] uppercase"
                onClick={() => setOpen(false)}
              >
                <Link href="/checkout">Checkout</Link>
              </Button>
            </SheetFooter>
          </>
        )}
      </SheetContent>
    </Sheet>
  )
}
