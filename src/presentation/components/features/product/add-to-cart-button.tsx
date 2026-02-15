'use client'

import { Minus, Plus, ShoppingCart } from 'lucide-react'
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
      <div className="flex w-full items-center justify-between">
        <Button
          variant="outline"
          size="icon"
          className="h-8 w-8"
          onClick={() => decreaseQuantity(product.id)}
        >
          <Minus className="h-3 w-3" />
        </Button>
        <span className="text-sm font-medium">{cartItem.quantity}</span>
        <Button
          variant="outline"
          size="icon"
          className="h-8 w-8"
          onClick={() => increaseQuantity(product.id)}
        >
          <Plus className="h-3 w-3" />
        </Button>
      </div>
    )
  }

  return (
    <Button
      onClick={handleAdd}
      disabled={product.stock === 0}
      className="w-full"
      size="sm"
    >
      <ShoppingCart className="mr-2 h-4 w-4" />
      {product.stock === 0 ? 'Out of stock' : 'Add to cart'}
    </Button>
  )
}
