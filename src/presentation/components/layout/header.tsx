'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { ShoppingCart, Search, User, LogOut, Package, Menu } from 'lucide-react'
import { Button } from '@/presentation/components/ui/button'
import { Input } from '@/presentation/components/ui/input'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@/presentation/components/ui/dropdown-menu'
import {
  Sheet,
  SheetContent,
  SheetTrigger
} from '@/presentation/components/ui/sheet'
import { useAuth } from '@/main/providers/auth-provider'
import { useCartStore } from '@/presentation/store/cart-store'
import { signOutAction } from '@/infrastructure/actions'
import { CartSheet } from '@/presentation/components/features/cart/cart-sheet'

export function Header() {
  const { user, isLoading } = useAuth()
  const totalItems = useCartStore((s) => s.totalItems())
  const router = useRouter()
  const [searchQuery, setSearchQuery] = useState('')
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      router.push(`/products?search=${encodeURIComponent(searchQuery.trim())}`)
      setSearchQuery('')
    }
  }

  return (
    <header className="bg-espresso border-espresso-foreground/10 sticky top-0 z-50 w-full border-b backdrop-blur-lg">
      <div className="container mx-auto flex h-14 items-center px-4 lg:px-8">
        <Link
          href="/"
          className="font-display text-espresso-foreground text-xl tracking-wide"
        >
          Storefront
        </Link>

        <nav className="ml-10 hidden items-center gap-8 md:flex">
          <Link
            href="/products"
            className="font-ui link-grow text-espresso-foreground/70 hover:text-espresso-foreground text-[13px] tracking-wide transition-colors"
          >
            Shop
          </Link>
        </nav>

        <div className="ml-auto flex items-center gap-0.5">
          <form onSubmit={handleSearch} className="hidden md:block">
            <div className="relative">
              <Search className="text-espresso-foreground/30 absolute top-1/2 left-2.5 h-3.5 w-3.5 -translate-y-1/2" />
              <Input
                type="search"
                placeholder="Search"
                className="font-ui placeholder:text-espresso-foreground/30 text-espresso-foreground focus-visible:bg-espresso-foreground/5 h-8 w-40 border-0 bg-transparent pl-8 text-[13px] focus-visible:ring-0 focus-visible:ring-offset-0"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </form>

          <CartSheet>
            <Button
              variant="ghost"
              size="icon"
              className="text-espresso-foreground/70 hover:text-espresso-foreground hover:bg-espresso-foreground/10 relative h-8 w-8"
            >
              <ShoppingCart className="h-4 w-4" />
              {totalItems > 0 && (
                <span className="bg-oxblood text-oxblood-foreground absolute -top-0.5 -right-0.5 flex h-4 w-4 items-center justify-center rounded-full text-[9px] font-semibold">
                  {totalItems}
                </span>
              )}
            </Button>
          </CartSheet>

          {!isLoading && (
            <>
              {user ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-espresso-foreground/70 hover:text-espresso-foreground hover:bg-espresso-foreground/10 h-8 w-8"
                    >
                      <User className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-48">
                    <DropdownMenuLabel className="font-ui text-muted-foreground text-[11px] font-normal">
                      {user.email}
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild>
                      <Link href="/orders" className="font-ui">
                        <Package className="mr-2 h-3.5 w-3.5" />
                        Orders
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      onClick={() => signOutAction()}
                      className="font-ui cursor-pointer"
                    >
                      <LogOut className="mr-2 h-3.5 w-3.5" />
                      Sign out
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <Link
                  href="/auth/login"
                  className="font-ui link-grow text-espresso-foreground/70 hover:text-espresso-foreground ml-2 text-[13px] transition-colors"
                >
                  Sign in
                </Link>
              )}
            </>
          )}

          <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
            <SheetTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="text-espresso-foreground/70 hover:text-espresso-foreground hover:bg-espresso-foreground/10 ml-1 h-8 w-8 md:hidden"
              >
                <Menu className="h-4 w-4" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-72">
              <nav className="flex flex-col gap-6 pt-12">
                <Link
                  href="/"
                  className="font-display text-2xl"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Storefront
                </Link>
                <div className="bg-border h-px" />
                <Link
                  href="/products"
                  className="font-ui text-sm"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Shop
                </Link>
                <form onSubmit={handleSearch} className="flex gap-2">
                  <Input
                    type="search"
                    placeholder="Search..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="h-9 text-sm"
                  />
                  <Button
                    type="submit"
                    size="icon"
                    variant="outline"
                    className="h-9 w-9"
                  >
                    <Search className="h-3.5 w-3.5" />
                  </Button>
                </form>
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  )
}
