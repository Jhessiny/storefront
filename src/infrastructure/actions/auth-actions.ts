'use server'

import { makeAuthRepository } from '@/infrastructure/factories'
import { SignIn } from '@/application/use-cases/auth/sign-in'
import { SignUp } from '@/application/use-cases/auth/sign-up'
import { SignOut } from '@/application/use-cases/auth/sign-out'
import { isLeft } from '@/shared/utils/either'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

export async function signInAction(formData: FormData) {
  const email = formData.get('email') as string
  const password = formData.get('password') as string

  const repository = await makeAuthRepository()
  const result = await new SignIn(repository).execute(email, password)

  if (isLeft(result)) {
    return { error: result.value.message }
  }

  revalidatePath('/', 'layout')
  redirect('/')
}

export async function signUpAction(formData: FormData) {
  const email = formData.get('email') as string
  const password = formData.get('password') as string

  const repository = await makeAuthRepository()
  const result = await new SignUp(repository).execute(email, password)

  if (isLeft(result)) {
    return { error: result.value.message }
  }

  return { success: 'Check your email to confirm your account' }
}

export async function signOutAction() {
  const repository = await makeAuthRepository()
  await new SignOut(repository).execute()

  revalidatePath('/', 'layout')
  redirect('/auth/login')
}
