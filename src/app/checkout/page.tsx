import { CheckoutForm } from '@/presentation/components/features/checkout/checkout-form'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Checkout | Storefront'
}

export default function CheckoutPage() {
  return (
    <div className="container mx-auto px-4 lg:px-8">
      <div className="border-b py-10">
        <h1 className="font-display text-4xl tracking-tight">Checkout</h1>
      </div>
      <div className="py-10 lg:py-16">
        <CheckoutForm />
      </div>
    </div>
  )
}
