import { AuthForm } from '@/presentation/components/features/auth/auth-form'
import { signInAction } from '@/infrastructure/actions'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Sign In | Storefront'
}

export default function LoginPage() {
  return (
    <div className="container mx-auto flex min-h-[600px] items-center justify-center px-4 py-8">
      <AuthForm type="login" action={signInAction} />
    </div>
  )
}
