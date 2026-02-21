import { Skeleton } from '@/presentation/components/ui/skeleton'

export default function Loading() {
  return (
    <div className="container mx-auto px-4 py-10 lg:px-8">
      <Skeleton className="mb-10 h-12 w-40" />
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
  )
}
