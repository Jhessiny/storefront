'use client'

export default function Error({
  error,
  reset
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <div className="container mx-auto flex min-h-[600px] flex-col items-center justify-center px-4 py-16 text-center">
      <h1 className="font-display text-2xl tracking-tight">
        Something went wrong
      </h1>
      <p className="text-muted-foreground mt-3 max-w-sm text-[14px]">
        {error.message || 'An unexpected error occurred.'}
      </p>
      <button
        className="font-ui link-grow hover:text-oxblood mt-8 w-fit text-[13px] transition-colors"
        onClick={reset}
      >
        Try again
      </button>
    </div>
  )
}
