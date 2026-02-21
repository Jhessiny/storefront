import { createSupabaseServerClient, createSupabaseServiceClient } from '../api'
import {
  SupabaseProductRepository,
  SupabaseCategoryRepository,
  SupabaseOrderRepository,
  SupabaseCartRepository,
  SupabaseAuthRepository,
  StripePaymentRepository,
  NoopPaymentRepository
} from '../repositories'
import { stripe } from '../api/stripe-server'

export async function makeProductRepository() {
  const client = await createSupabaseServerClient()
  return new SupabaseProductRepository(client)
}

export async function makeCategoryRepository() {
  const client = await createSupabaseServerClient()
  return new SupabaseCategoryRepository(client)
}

export async function makeOrderRepository() {
  const client = await createSupabaseServerClient()
  return new SupabaseOrderRepository(client)
}

export function makeServiceOrderRepository() {
  const client = createSupabaseServiceClient()
  return new SupabaseOrderRepository(client)
}

export async function makeCartRepository() {
  const client = await createSupabaseServerClient()
  return new SupabaseCartRepository(client)
}

export async function makeAuthRepository() {
  const client = await createSupabaseServerClient()
  return new SupabaseAuthRepository(client)
}

export function makePaymentRepository() {
  return stripe ? new StripePaymentRepository() : new NoopPaymentRepository()
}
