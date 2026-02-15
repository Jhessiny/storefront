'use client'

import { useEffect } from 'react'
import Link from 'next/link'
import { CheckCircle } from 'lucide-react'
import { Button } from '@/presentation/components/ui/button'
import { useCartStore } from '@/presentation/store/cart-store'

export default function SuccessPage() {
  const clearCart = useCartStore((s) => s.clearCart)

  useEffect(() => {
    clearCart()
  }, [clearCart])

  return (
    <div className="container mx-auto flex min-h-[600px] flex-col items-center justify-center px-4 py-8 text-center">
      <CheckCircle className="mb-4 h-16 w-16 text-green-500" />
      <h1 className="mb-2 text-3xl font-bold">Payment Successful!</h1>
      <p className="mb-8 text-muted-foreground">
        Thank you for your purchase. Your order has been placed.
      </p>
      <div className="flex gap-4">
        <Button asChild>
          <Link href="/orders">View Orders</Link>
        </Button>
        <Button variant="outline" asChild>
          <Link href="/products">Continue Shopping</Link>
        </Button>
      </div>
    </div>
  )
}
