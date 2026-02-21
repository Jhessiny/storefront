import Link from 'next/link'

export function Footer() {
  return (
    <footer className="border-t">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="grid gap-10 py-12 md:grid-cols-[1fr_auto_auto] md:gap-20">
          <div>
            <Link href="/" className="font-display text-lg">
              Storefront
            </Link>
            <p className="text-muted-foreground mt-3 max-w-xs text-[13px] leading-relaxed">
              Curated products, thoughtfully selected.
            </p>
          </div>

          <nav className="flex flex-col gap-2.5">
            <span className="text-muted-foreground/50 text-[11px] tracking-[0.15em] uppercase">
              Shop
            </span>
            <Link
              href="/products"
              className="text-muted-foreground hover:text-foreground text-[13px] transition-colors"
            >
              All products
            </Link>
          </nav>

          <nav className="flex flex-col gap-2.5">
            <span className="text-muted-foreground/50 text-[11px] tracking-[0.15em] uppercase">
              Account
            </span>
            <Link
              href="/auth/login"
              className="text-muted-foreground hover:text-foreground text-[13px] transition-colors"
            >
              Sign in
            </Link>
            <Link
              href="/orders"
              className="text-muted-foreground hover:text-foreground text-[13px] transition-colors"
            >
              Orders
            </Link>
          </nav>
        </div>

        <div className="border-t py-6">
          <p className="text-muted-foreground/50 text-[11px]">
            &copy; {new Date().getFullYear()} Storefront
          </p>
        </div>
      </div>
    </footer>
  )
}
