import { createClient } from '@supabase/supabase-js'
import Stripe from 'stripe'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-04-30.basil'
})

const categories = [
  { name: 'Electronics', slug: 'electronics' },
  { name: 'Clothing', slug: 'clothing' },
  { name: 'Home & Garden', slug: 'home-garden' },
  { name: 'Sports', slug: 'sports' },
  { name: 'Books', slug: 'books' }
]

const products = [
  {
    title: 'Wireless Noise-Cancelling Headphones',
    slug: 'wireless-noise-cancelling-headphones',
    description:
      'Premium over-ear headphones with active noise cancellation, 30-hour battery life, and crystal-clear audio.',
    brand: 'AudioTech',
    price: 299.99,
    compareAtPrice: 349.99,
    categorySlug: 'electronics',
    thumbnailUrl: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500',
    rating: 4.7,
    stock: 50
  },
  {
    title: 'Smart Fitness Watch',
    slug: 'smart-fitness-watch',
    description:
      'Track your health and fitness with GPS, heart rate monitor, sleep tracking, and 7-day battery life.',
    brand: 'FitPro',
    price: 199.99,
    compareAtPrice: null,
    categorySlug: 'electronics',
    thumbnailUrl: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500',
    rating: 4.5,
    stock: 75
  },
  {
    title: 'Organic Cotton T-Shirt',
    slug: 'organic-cotton-t-shirt',
    description:
      'Soft, sustainable organic cotton t-shirt. Available in multiple colors. Fair trade certified.',
    brand: 'EcoWear',
    price: 29.99,
    compareAtPrice: 39.99,
    categorySlug: 'clothing',
    thumbnailUrl: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=500',
    rating: 4.3,
    stock: 200
  },
  {
    title: 'Premium Denim Jacket',
    slug: 'premium-denim-jacket',
    description:
      'Classic denim jacket with modern fit. Durable construction with brass hardware.',
    brand: 'UrbanStyle',
    price: 89.99,
    compareAtPrice: null,
    categorySlug: 'clothing',
    thumbnailUrl: 'https://images.unsplash.com/photo-1576995853123-5a10305d93c0?w=500',
    rating: 4.6,
    stock: 100
  },
  {
    title: 'Minimalist Desk Lamp',
    slug: 'minimalist-desk-lamp',
    description:
      'Sleek LED desk lamp with adjustable brightness and color temperature. USB charging port included.',
    brand: 'LumiDesign',
    price: 59.99,
    compareAtPrice: 79.99,
    categorySlug: 'home-garden',
    thumbnailUrl: 'https://images.unsplash.com/photo-1507473885765-e6ed057ab6fe?w=500',
    rating: 4.4,
    stock: 120
  },
  {
    title: 'Ceramic Plant Pot Set',
    slug: 'ceramic-plant-pot-set',
    description:
      'Set of 3 handcrafted ceramic pots in varying sizes. Perfect for succulents and small plants.',
    brand: 'GreenHome',
    price: 44.99,
    compareAtPrice: null,
    categorySlug: 'home-garden',
    thumbnailUrl: 'https://images.unsplash.com/photo-1485955900006-10f4d324d411?w=500',
    rating: 4.8,
    stock: 80
  },
  {
    title: 'Yoga Mat Premium',
    slug: 'yoga-mat-premium',
    description:
      'Extra thick, non-slip yoga mat made from eco-friendly TPE material. Includes carrying strap.',
    brand: 'ZenFit',
    price: 49.99,
    compareAtPrice: 64.99,
    categorySlug: 'sports',
    thumbnailUrl: 'https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f?w=500',
    rating: 4.6,
    stock: 150
  },
  {
    title: 'Running Shoes Ultra',
    slug: 'running-shoes-ultra',
    description:
      'Lightweight running shoes with responsive cushioning and breathable mesh upper.',
    brand: 'SpeedRun',
    price: 129.99,
    compareAtPrice: 159.99,
    categorySlug: 'sports',
    thumbnailUrl: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500',
    rating: 4.5,
    stock: 90
  },
  {
    title: 'The Art of Clean Code',
    slug: 'the-art-of-clean-code',
    description:
      'A comprehensive guide to writing maintainable, scalable, and elegant code. Essential for every developer.',
    brand: 'TechPress',
    price: 34.99,
    compareAtPrice: null,
    categorySlug: 'books',
    thumbnailUrl: 'https://images.unsplash.com/photo-1532012197267-da84d127e765?w=500',
    rating: 4.9,
    stock: 300
  },
  {
    title: 'Portable Bluetooth Speaker',
    slug: 'portable-bluetooth-speaker',
    description:
      'Waterproof portable speaker with 360-degree sound, 12-hour battery, and built-in microphone.',
    brand: 'AudioTech',
    price: 79.99,
    compareAtPrice: 99.99,
    categorySlug: 'electronics',
    thumbnailUrl: 'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=500',
    rating: 4.4,
    stock: 65
  },
  {
    title: 'Stainless Steel Water Bottle',
    slug: 'stainless-steel-water-bottle',
    description:
      'Double-wall vacuum insulated bottle. Keeps drinks cold for 24h or hot for 12h. BPA free.',
    brand: 'HydroLife',
    price: 24.99,
    compareAtPrice: null,
    categorySlug: 'sports',
    thumbnailUrl: 'https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=500',
    rating: 4.7,
    stock: 250
  },
  {
    title: 'Leather Crossbody Bag',
    slug: 'leather-crossbody-bag',
    description:
      'Genuine leather crossbody bag with adjustable strap. Multiple compartments for organization.',
    brand: 'UrbanStyle',
    price: 69.99,
    compareAtPrice: 89.99,
    categorySlug: 'clothing',
    thumbnailUrl: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=500',
    rating: 4.5,
    stock: 60
  }
]

async function seed() {
  console.log('Seeding database...')

  // Insert categories
  console.log('Creating categories...')
  const { data: categoryData, error: categoryError } = await supabase
    .from('categories')
    .upsert(categories, { onConflict: 'slug' })
    .select()

  if (categoryError) {
    console.error('Error inserting categories:', categoryError)
    process.exit(1)
  }

  const categoryMap = new Map(
    categoryData!.map((c: { slug: string; id: string }) => [c.slug, c.id])
  )

  // Create Stripe products and insert DB products
  console.log('Creating products with Stripe prices...')
  for (const product of products) {
    const categoryId = categoryMap.get(product.categorySlug)
    if (!categoryId) {
      console.error(`Category not found: ${product.categorySlug}`)
      continue
    }

    // Create Stripe product + price
    let stripeProduct
    let stripePrice
    try {
      stripeProduct = await stripe.products.create({
        name: product.title,
        description: product.description,
        images: [product.thumbnailUrl]
      })

      stripePrice = await stripe.prices.create({
        product: stripeProduct.id,
        unit_amount: Math.round(product.price * 100),
        currency: 'usd'
      })
    } catch (err) {
      console.error(`Stripe error for ${product.title}:`, err)
      continue
    }

    // Insert product into DB
    const { error: productError } = await supabase.from('products').upsert(
      {
        title: product.title,
        slug: product.slug,
        description: product.description,
        brand: product.brand,
        price: product.price,
        compare_at_price: product.compareAtPrice,
        category_id: categoryId,
        thumbnail_url: product.thumbnailUrl,
        rating: product.rating,
        stock: product.stock,
        stripe_product_id: stripeProduct.id,
        stripe_price_id: stripePrice.id,
        is_active: true
      },
      { onConflict: 'slug' }
    )

    if (productError) {
      console.error(`Error inserting product ${product.title}:`, productError)
    } else {
      console.log(`  ✓ ${product.title} ($${product.price})`)
    }
  }

  console.log('Seeding complete!')
}

seed().catch(console.error)
