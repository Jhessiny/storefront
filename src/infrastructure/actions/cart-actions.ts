'use server'

import { makeCartRepository, makeAuthRepository } from '@/infrastructure/factories'
import { SyncCart } from '@/application/use-cases/cart/sync-cart'
import { GetSession } from '@/application/use-cases/auth/get-session'
import type { LocalCartItem } from '@/domain/entities'
import { isLeft, isRight } from '@/shared/utils/either'

export async function syncCartAction(items: LocalCartItem[]) {
  const authRepository = await makeAuthRepository()
  const sessionResult = await new GetSession(authRepository).execute()

  if (isLeft(sessionResult) || !isRight(sessionResult) || !sessionResult.value) {
    return { error: 'Not authenticated' }
  }

  const cartRepository = await makeCartRepository()
  const result = await new SyncCart(cartRepository).execute(
    sessionResult.value.user.id,
    items
  )

  if (isLeft(result)) {
    return { error: result.value.message }
  }

  return { success: true }
}
