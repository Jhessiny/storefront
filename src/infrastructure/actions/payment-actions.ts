'use server'

import {
  makeAuthRepository,
  makeOrderRepository,
  makePaymentRepository
} from '@/infrastructure/factories'
import { CreateCheckoutSession } from '@/application/use-cases/payment/create-checkout-session'
import { GetSession } from '@/application/use-cases/auth/get-session'
import type { LocalCartItem } from '@/domain/entities'
import { isLeft, isRight } from '@/shared/utils/either'

export async function createCheckoutSessionAction(items: LocalCartItem[]) {
  const authRepository = await makeAuthRepository()
  const sessionResult = await new GetSession(authRepository).execute()

  if (isLeft(sessionResult) || !isRight(sessionResult) || !sessionResult.value) {
    return { error: 'You must be logged in to checkout' }
  }

  const orderRepository = await makeOrderRepository()
  const paymentRepository = makePaymentRepository()
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'

  const result = await new CreateCheckoutSession(
    paymentRepository,
    orderRepository
  ).execute(
    sessionResult.value.user.id,
    items,
    `${appUrl}/success`,
    `${appUrl}/checkout`
  )

  if (isLeft(result)) {
    return { error: result.value.message }
  }

  return { url: result.value.url }
}
