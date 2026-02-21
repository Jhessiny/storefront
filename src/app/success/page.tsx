'use client'

import { useEffect } from 'react'
import Link from 'next/link'
import { Button } from '@/presentation/components/ui/button'
import { useCartStore } from '@/presentation/store/cart-store'

export default function SuccessPage() {
  const clearCart = useCartStore((s) => s.clearCart)

  useEffect(() => {
    clearCart()
  }, [clearCart])

  return (
    <div className="container mx-auto flex min-h-[600px] flex-col items-center justify-center px-4 py-16 text-center">
      <h1 className="font-display text-3xl tracking-tight">Thank you</h1>
      <p className="text-muted-foreground mt-3 max-w-sm text-[14px] leading-relaxed">
        Your order has been placed and is being processed.
      </p>
      <div className="mt-10 flex gap-4">
        <Button
          asChild
          className="h-10 text-[12px] tracking-[0.12em] uppercase"
        >
          <Link href="/orders">View orders</Link>
        </Button>
        <Link
          href="/products"
          className="text-muted-foreground hover:text-foreground inline-flex h-10 items-center text-[13px] underline underline-offset-4 transition-colors"
        >
          Continue shopping
        </Link>
      </div>
    </div>
  )
}
