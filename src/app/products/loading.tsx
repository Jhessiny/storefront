import { Skeleton } from '@/presentation/components/ui/skeleton'

export default function ProductsLoading() {
  return (
    <div className="container mx-auto px-4 lg:px-8">
      <div className="border-b py-10 lg:py-16">
        <Skeleton className="h-12 w-32" />
      </div>
      <div className="grid gap-12 py-10 lg:grid-cols-[180px_1fr] lg:py-16">
        <aside className="space-y-6">
          <div className="space-y-2">
            <Skeleton className="h-3 w-16" />
            <Skeleton className="h-9 w-full" />
          </div>
          <div className="space-y-2">
            <Skeleton className="h-3 w-12" />
            <Skeleton className="h-9 w-full" />
          </div>
          <div className="space-y-2">
            <Skeleton className="h-3 w-14" />
            <div className="grid grid-cols-2 gap-2">
              <Skeleton className="h-9 w-full" />
              <Skeleton className="h-9 w-full" />
            </div>
          </div>
        </aside>
        <div className="grid grid-cols-2 gap-x-4 gap-y-10 md:grid-cols-3 lg:grid-cols-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="space-y-3">
              <Skeleton className="aspect-[3/4] w-full" />
              <Skeleton className="h-3.5 w-3/4" />
              <Skeleton className="h-3 w-1/3" />
              <Skeleton className="h-3.5 w-1/4" />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
