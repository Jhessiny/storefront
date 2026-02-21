'use client'

import { Minus, Plus } from 'lucide-react'
import { Button } from '@/presentation/components/ui/button'
import { useCartStore } from '@/presentation/store/cart-store'
import { useToast } from '@/presentation/hooks/use-toast'
import type { Product } from '@/domain/entities'

export function AddToCartButton({
  product,
  quantity = 1
}: {
  product: Product
  quantity?: number
}) {
  const addItem = useCartStore((s) => s.addItem)
  const increaseQuantity = useCartStore((s) => s.increaseQuantity)
  const decreaseQuantity = useCartStore((s) => s.decreaseQuantity)
  const cartItem = useCartStore((s) =>
    s.items.find((i) => i.productId === product.id)
  )
  const { toast } = useToast()

  const handleAdd = () => {
    if (product.stock === 0) return

    addItem({
      productId: product.id,
      quantity,
      product: {
        id: product.id,
        title: product.title,
        slug: product.slug,
        price: product.price,
        thumbnailUrl: product.thumbnailUrl,
        stock: product.stock,
        stripePriceId: product.stripePriceId
      }
    })

    toast({
      title: 'Added to cart',
      description: `${product.title} has been added to your cart.`
    })
  }

  if (cartItem) {
    return (
      <div className="inline-flex items-center gap-3">
        <button
          className="border-border hover:border-oxblood/40 hover:text-oxblood flex h-8 w-8 items-center justify-center border transition-colors"
          onClick={() => decreaseQuantity(product.id)}
        >
          <Minus className="h-3 w-3" />
        </button>
        <span className="font-ui w-6 text-center text-[13px] tabular-nums">
          {cartItem.quantity}
        </span>
        <button
          className="border-border hover:border-oxblood/40 hover:text-oxblood flex h-8 w-8 items-center justify-center border transition-colors"
          onClick={() => increaseQuantity(product.id)}
        >
          <Plus className="h-3 w-3" />
        </button>
      </div>
    )
  }

  return (
    <Button
      onClick={handleAdd}
      disabled={product.stock === 0}
      variant="outline"
      className="h-9 px-6 text-[12px] tracking-[0.12em] uppercase"
    >
      {product.stock === 0 ? 'Sold out' : 'Add to bag'}
    </Button>
  )
}
