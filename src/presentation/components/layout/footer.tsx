import Link from 'next/link'

export function Footer() {
  return (
    <footer className="border-t">
      <div className="container mx-auto flex flex-col items-center gap-4 px-4 py-8 md:flex-row md:justify-between">
        <p className="text-sm text-muted-foreground">
          &copy; {new Date().getFullYear()} Storefront. All rights reserved.
        </p>
        <nav className="flex gap-4">
          <Link
            href="/products"
            className="text-sm text-muted-foreground hover:text-foreground"
          >
            Products
          </Link>
        </nav>
      </div>
    </footer>
  )
}
