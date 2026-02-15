'use client'

import { Button } from '@/presentation/components/ui/button'

export default function Error({
  error,
  reset
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <div className="container mx-auto flex min-h-[600px] flex-col items-center justify-center px-4 py-8 text-center">
      <h1 className="text-3xl font-bold">Something went wrong</h1>
      <p className="mt-4 text-muted-foreground">
        {error.message || 'An unexpected error occurred.'}
      </p>
      <Button className="mt-8" onClick={reset}>
        Try again
      </Button>
    </div>
  )
}
