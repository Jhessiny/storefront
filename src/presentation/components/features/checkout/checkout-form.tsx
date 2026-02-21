'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Button } from '@/presentation/components/ui/button'
import { useCartStore } from '@/presentation/store/cart-store'
import { useAuth } from '@/main/providers/auth-provider'
import { createCheckoutSessionAction } from '@/infrastructure/actions'
import { formatCurrency } from '@/shared/utils/format-currency'

export function CheckoutForm() {
  const { items } = useCartStore()
  const totalPrice = useCartStore((s) => s.totalPrice())
  const { user } = useAuth()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleCheckout = async () => {
    if (!user) return
    setIsLoading(true)
    setError(null)

    const result = await createCheckoutSessionAction(items)

    if (result.error) {
      setError(result.error)
      setIsLoading(false)
      return
    }

    if (result.url) {
      window.location.href = result.url
    }
  }

  if (items.length === 0) {
    return (
      <div className="flex min-h-[400px] flex-col items-center justify-center gap-3">
        <p className="text-muted-foreground text-[14px]">Your bag is empty.</p>
        <Link
          href="/products"
          className="font-ui link-grow hover:text-oxblood w-fit text-[13px] transition-colors"
        >
          Continue shopping
        </Link>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="flex min-h-[400px] flex-col items-center justify-center gap-3">
        <p className="text-muted-foreground text-[14px]">
          Sign in to complete your purchase.
        </p>
        <Link
          href="/auth/login"
          className="font-ui link-grow hover:text-oxblood w-fit text-[13px] transition-colors"
        >
          Sign in
        </Link>
      </div>
    )
  }

  return (
    <div className="grid gap-16 lg:grid-cols-[1fr_340px]">
      <div>
        <h2 className="font-ui text-muted-foreground text-[11px] tracking-[0.12em] uppercase">
          Order summary
        </h2>
        <div className="mt-6 divide-y">
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
              <div className="flex flex-1 justify-between">
                <div>
                  <p className="text-[14px]">{item.product.title}</p>
                  <p className="font-ui text-muted-foreground mt-0.5 text-[12px]">
                    Qty: {item.quantity}
                  </p>
                </div>
                <p className="font-ui text-[13px] tabular-nums">
                  {formatCurrency(item.product.price * item.quantity)}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="lg:sticky lg:top-20 lg:self-start">
        <h2 className="font-ui text-muted-foreground text-[11px] tracking-[0.12em] uppercase">
          Payment
        </h2>

        <div className="font-ui mt-6 space-y-3 text-[13px]">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Subtotal</span>
            <span className="tabular-nums">{formatCurrency(totalPrice)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Shipping</span>
            <span>Free</span>
          </div>
          <div className="bg-border h-px" />
          <div className="flex justify-between pt-1">
            <span>Total</span>
            <span className="tabular-nums">{formatCurrency(totalPrice)}</span>
          </div>
        </div>

        {error && <p className="text-destructive mt-4 text-[13px]">{error}</p>}

        <Button
          className="mt-8 h-10 w-full text-[12px] tracking-[0.12em] uppercase"
          onClick={handleCheckout}
          disabled={isLoading}
        >
          {isLoading ? 'Processing...' : 'Proceed to payment'}
        </Button>
      </div>
    </div>
  )
}
