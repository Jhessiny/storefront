import { CheckoutForm } from '@/presentation/components/features/checkout/checkout-form'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Checkout | Storefront'
}

export default function CheckoutPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="mb-8 text-3xl font-bold">Checkout</h1>
      <CheckoutForm />
    </div>
  )
}
