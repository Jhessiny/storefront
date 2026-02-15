'use client'

import { useState } from 'react'
import { Button } from '@/presentation/components/ui/button'
import { createSupabaseBrowserClient } from '@/infrastructure/api/supabase-browser'

export function GoogleSignInButton() {
  const [isLoading, setIsLoading] = useState(false)

  async function handleGoogleSignIn() {
    setIsLoading(true)
    const supabase = createSupabaseBrowserClient()
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/auth/callback`
      }
    })
  }

  return (
    <Button
      type="button"
      variant="outline"
      className="w-full"
      disabled={isLoading}
      onClick={handleGoogleSignIn}
    >
      {isLoading ? 'Redirecting...' : 'Sign in with Google'}
    </Button>
  )
}
