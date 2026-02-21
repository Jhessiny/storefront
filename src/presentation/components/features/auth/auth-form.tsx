'use client'

import { useActionState } from 'react'
import { Button } from '@/presentation/components/ui/button'
import { Input } from '@/presentation/components/ui/input'
import { Label } from '@/presentation/components/ui/label'
import Link from 'next/link'
import { GoogleSignInButton } from './google-sign-in-button'

type AuthFormProps = {
  type: 'login' | 'register'
  action: (
    state: { error?: string; success?: string } | undefined,
    formData: FormData
  ) => Promise<{ error?: string; success?: string } | undefined>
}

export function AuthForm({ type, action }: AuthFormProps) {
  const [state, formAction, isPending] = useActionState(action, undefined)

  const isLogin = type === 'login'

  return (
    <div className="mx-auto w-full max-w-sm">
      <h1 className="font-display text-3xl tracking-tight">
        {isLogin ? 'Sign in' : 'Create account'}
      </h1>
      <p className="text-muted-foreground mt-2 text-[14px]">
        {isLogin
          ? 'Enter your credentials to continue.'
          : 'Fill in the details to get started.'}
      </p>

      <div className="mt-8 space-y-6">
        <GoogleSignInButton />

        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t" />
          </div>
          <div className="relative flex justify-center">
            <span className="font-ui bg-background text-muted-foreground/40 px-3 text-[11px] tracking-[0.12em] uppercase">
              or
            </span>
          </div>
        </div>

        <form action={formAction} className="space-y-4">
          <div className="space-y-1.5">
            <Label
              htmlFor="email"
              className="font-ui text-muted-foreground/60 text-[11px] tracking-[0.12em] uppercase"
            >
              Email
            </Label>
            <Input
              id="email"
              name="email"
              type="email"
              placeholder="you@example.com"
              required
              className="h-10 text-[13px]"
            />
          </div>
          <div className="space-y-1.5">
            <Label
              htmlFor="password"
              className="font-ui text-muted-foreground/60 text-[11px] tracking-[0.12em] uppercase"
            >
              Password
            </Label>
            <Input
              id="password"
              name="password"
              type="password"
              placeholder="••••••••"
              required
              minLength={6}
              className="h-10 text-[13px]"
            />
          </div>

          {state?.error && (
            <p className="text-destructive text-[13px]">{state.error}</p>
          )}

          {state?.success && (
            <p className="text-foreground text-[13px]">{state.success}</p>
          )}

          <Button
            type="submit"
            className="h-10 w-full text-[12px] tracking-[0.12em] uppercase"
            disabled={isPending}
          >
            {isPending ? 'Loading...' : isLogin ? 'Sign in' : 'Create account'}
          </Button>

          <p className="font-ui text-muted-foreground text-center text-[13px]">
            {isLogin ? (
              <>
                No account?{' '}
                <Link
                  href="/auth/register"
                  className="text-oxblood underline underline-offset-4"
                >
                  Sign up
                </Link>
              </>
            ) : (
              <>
                Have an account?{' '}
                <Link
                  href="/auth/login"
                  className="text-oxblood underline underline-offset-4"
                >
                  Sign in
                </Link>
              </>
            )}
          </p>
        </form>
      </div>
    </div>
  )
}
