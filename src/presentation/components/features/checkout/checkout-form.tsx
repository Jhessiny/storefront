'use client'

import { useState } from 'react'
import Image from 'next/image'
import { Button } from '@/presentation/components/ui/button'
import { Separator } from '@/presentation/components/ui/separator'
import { useCartStore } from '@/presentation/store/cart-store'
import { useAuth } from '@/main/providers/auth-provider'
import { createCheckoutSessionAction } from '@/infrastructure/actions'
import { formatCurrency } from '@/shared/utils/format-currency'
import Link from 'next/link'

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
      <div className="flex min-h-[400px] flex-col items-center justify-center gap-4">
        <p className="text-muted-foreground">Your cart is empty</p>
        <Button asChild>
          <Link href="/products">Continue Shopping</Link>
        </Button>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="flex min-h-[400px] flex-col items-center justify-center gap-4">
        <p className="text-muted-foreground">
          Please sign in to proceed to checkout
        </p>
        <Button asChild>
          <Link href="/auth/login">Sign In</Link>
        </Button>
      </div>
    )
  }

  return (
    <div className="grid gap-8 lg:grid-cols-2">
      <div>
        <h2 className="mb-4 text-lg font-semibold">Order Summary</h2>
        <div className="space-y-4">
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
              <div className="flex flex-1 justify-between">
                <div>
                  <p className="font-medium">{item.product.title}</p>
                  <p className="text-sm text-muted-foreground">
                    Qty: {item.quantity}
                  </p>
                </div>
                <p className="font-medium">
                  {formatCurrency(item.product.price * item.quantity)}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="rounded-lg border p-6">
        <h2 className="mb-4 text-lg font-semibold">Payment</h2>

        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>Subtotal</span>
            <span>{formatCurrency(totalPrice)}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span>Shipping</span>
            <span>Free</span>
          </div>
          <Separator />
          <div className="flex justify-between font-semibold">
            <span>Total</span>
            <span>{formatCurrency(totalPrice)}</span>
          </div>
        </div>

        {error && <p className="mt-4 text-sm text-destructive">{error}</p>}

        <Button
          className="mt-6 w-full"
          size="lg"
          onClick={handleCheckout}
          disabled={isLoading}
        >
          {isLoading ? 'Processing...' : 'Pay with Stripe'}
        </Button>
      </div>
    </div>
  )
}
