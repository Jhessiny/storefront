import { createClient } from '@supabase/supabase-js'
import Stripe from 'stripe'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2026-01-28.clover'
})

async function syncStripe() {
  console.log('Fetching products missing Stripe IDs...')

  const { data: products, error } = await supabase
    .from('products')
    .select('id, title, description, price, thumbnail_url, stripe_price_id')
    .is('stripe_price_id', null)

  if (error) {
    console.error('Error fetching products:', error)
    process.exit(1)
  }

  if (!products || products.length === 0) {
    console.log('All products already have Stripe IDs.')
    return
  }

  console.log(`Found ${products.length} products to sync.\n`)

  for (const product of products) {
    try {
      const stripeProduct = await stripe.products.create({
        name: product.title,
        description: product.description ?? undefined,
        images: product.thumbnail_url ? [product.thumbnail_url] : undefined
      })

      const stripePrice = await stripe.prices.create({
        product: stripeProduct.id,
        unit_amount: Math.round(product.price * 100),
        currency: 'usd'
      })

      const { error: updateError } = await supabase
        .from('products')
        .update({
          stripe_product_id: stripeProduct.id,
          stripe_price_id: stripePrice.id
        })
        .eq('id', product.id)

      if (updateError) {
        console.error(`  ✗ ${product.title}: DB update failed -`, updateError)
      } else {
        console.log(`  ✓ ${product.title} → ${stripePrice.id}`)
      }
    } catch (err) {
      console.error(`  ✗ ${product.title}: Stripe error -`, err)
    }
  }

  console.log('\nSync complete!')
}

syncStripe().catch(console.error)
