'use client'

import { motion } from 'framer-motion'
import type { Product } from '@/domain/entities'
import { ProductCard } from './product-card'

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05
    }
  }
}

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 }
}

export function AnimatedProductGrid({ products }: { products: Product[] }) {
  if (products.length === 0) {
    return (
      <div className="flex min-h-[300px] items-center justify-center">
        <p className="text-muted-foreground">No products found.</p>
      </div>
    )
  }

  return (
    <motion.div
      className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
      variants={container}
      initial="hidden"
      animate="show"
    >
      {products.map((product) => (
        <motion.div key={product.id} variants={item}>
          <ProductCard product={product} />
        </motion.div>
      ))}
    </motion.div>
  )
}
