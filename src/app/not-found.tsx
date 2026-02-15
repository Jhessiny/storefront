import Link from 'next/link'
import { Button } from '@/presentation/components/ui/button'

export default function NotFound() {
  return (
    <div className="container mx-auto flex min-h-[600px] flex-col items-center justify-center px-4 py-8 text-center">
      <h1 className="text-6xl font-bold">404</h1>
      <p className="mt-4 text-lg text-muted-foreground">Page not found</p>
      <Button asChild className="mt-8">
        <Link href="/">Go Home</Link>
      </Button>
    </div>
  )
}
