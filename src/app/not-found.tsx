import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="container mx-auto flex min-h-[600px] flex-col items-center justify-center px-4 py-16 text-center">
      <span className="font-display text-border/60 text-[8rem] leading-none tracking-tighter">
        404
      </span>
      <p className="text-muted-foreground mt-2 text-[13px]">
        This page doesn&apos;t exist.
      </p>
      <Link
        href="/"
        className="hover:text-muted-foreground mt-8 text-[13px] underline underline-offset-4 transition-colors"
      >
        Go home
      </Link>
    </div>
  )
}
