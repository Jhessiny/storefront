'use client'

import { useActionState } from 'react'
import { Button } from '@/presentation/components/ui/button'
import { Input } from '@/presentation/components/ui/input'
import { Label } from '@/presentation/components/ui/label'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/presentation/components/ui/card'
import Link from 'next/link'

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
    <Card className="mx-auto w-full max-w-md">
      <CardHeader>
        <CardTitle>{isLogin ? 'Sign In' : 'Create Account'}</CardTitle>
        <CardDescription>
          {isLogin
            ? 'Enter your credentials to access your account'
            : 'Fill in the details to create your account'}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form action={formAction} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              name="email"
              type="email"
              placeholder="you@example.com"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              name="password"
              type="password"
              placeholder="••••••••"
              required
              minLength={6}
            />
          </div>

          {state?.error && (
            <p className="text-sm text-destructive">{state.error}</p>
          )}

          {state?.success && (
            <p className="text-sm text-green-600">{state.success}</p>
          )}

          <Button type="submit" className="w-full" disabled={isPending}>
            {isPending
              ? 'Loading...'
              : isLogin
                ? 'Sign In'
                : 'Create Account'}
          </Button>

          <p className="text-center text-sm text-muted-foreground">
            {isLogin ? (
              <>
                Don&apos;t have an account?{' '}
                <Link href="/auth/register" className="underline">
                  Sign up
                </Link>
              </>
            ) : (
              <>
                Already have an account?{' '}
                <Link href="/auth/login" className="underline">
                  Sign in
                </Link>
              </>
            )}
          </p>
        </form>
      </CardContent>
    </Card>
  )
}
