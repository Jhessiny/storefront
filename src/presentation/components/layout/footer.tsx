import Link from 'next/link'

export function Footer() {
  return (
    <footer className="bg-espresso text-espresso-foreground">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="grid gap-10 py-14 md:grid-cols-[1fr_auto_auto] md:gap-20">
          <div>
            <Link href="/" className="font-display text-lg tracking-wide">
              Storefront
            </Link>
            <p className="text-espresso-foreground/50 mt-3 max-w-xs text-[14px] leading-relaxed">
              Curated products, thoughtfully selected.
            </p>
          </div>

          <nav className="flex flex-col gap-2.5">
            <span className="font-ui text-espresso-foreground/30 text-[11px] tracking-[0.15em] uppercase">
              Shop
            </span>
            <Link
              href="/products"
              className="font-ui link-grow text-espresso-foreground/60 hover:text-espresso-foreground w-fit text-[13px] transition-colors"
            >
              All products
            </Link>
          </nav>

          <nav className="flex flex-col gap-2.5">
            <span className="font-ui text-espresso-foreground/30 text-[11px] tracking-[0.15em] uppercase">
              Account
            </span>
            <Link
              href="/auth/login"
              className="font-ui link-grow text-espresso-foreground/60 hover:text-espresso-foreground w-fit text-[13px] transition-colors"
            >
              Sign in
            </Link>
            <Link
              href="/orders"
              className="font-ui link-grow text-espresso-foreground/60 hover:text-espresso-foreground w-fit text-[13px] transition-colors"
            >
              Orders
            </Link>
          </nav>
        </div>

        <div className="border-espresso-foreground/10 border-t py-6">
          <p className="font-ui text-espresso-foreground/25 text-[11px]">
            &copy; {new Date().getFullYear()} Storefront
          </p>
        </div>
      </div>
    </footer>
  )
}
