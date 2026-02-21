import { AuthForm } from '@/presentation/components/features/auth/auth-form'
import { signUpAction } from '@/infrastructure/actions'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Create Account | Storefront'
}

export default function RegisterPage() {
  return (
    <div className="container mx-auto flex min-h-[600px] items-center justify-center px-4 py-16">
      <AuthForm type="register" action={signUpAction} />
    </div>
  )
}
