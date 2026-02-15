'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { useCallback } from 'react'
import type { Category } from '@/domain/entities'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/presentation/components/ui/select'
import { Input } from '@/presentation/components/ui/input'
import { Button } from '@/presentation/components/ui/button'
import { Label } from '@/presentation/components/ui/label'

export function ProductFilters({ categories }: { categories: Category[] }) {
  const router = useRouter()
  const searchParams = useSearchParams()

  const updateParam = useCallback(
    (key: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString())
      if (value && value !== 'all') {
        params.set(key, value)
      } else {
        params.delete(key)
      }
      params.delete('page')
      router.push(`/products?${params.toString()}`)
    },
    [router, searchParams]
  )

  const clearFilters = () => {
    router.push('/products')
  }

  return (
    <div className="space-y-4">
      <div>
        <Label className="mb-2 block text-sm">Category</Label>
        <Select
          value={searchParams.get('category') || 'all'}
          onValueChange={(v) => updateParam('category', v)}
        >
          <SelectTrigger>
            <SelectValue placeholder="All categories" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All categories</SelectItem>
            {categories.map((category) => (
              <SelectItem key={category.id} value={category.slug}>
                {category.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label className="mb-2 block text-sm">Sort by</Label>
        <Select
          value={searchParams.get('sort') || 'newest'}
          onValueChange={(v) => updateParam('sort', v)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="newest">Newest</SelectItem>
            <SelectItem value="price_asc">Price: Low to High</SelectItem>
            <SelectItem value="price_desc">Price: High to Low</SelectItem>
            <SelectItem value="rating">Highest Rated</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="grid grid-cols-2 gap-2">
        <div>
          <Label className="mb-2 block text-sm">Min Price</Label>
          <Input
            type="number"
            placeholder="0"
            defaultValue={searchParams.get('minPrice') || ''}
            onBlur={(e) => updateParam('minPrice', e.target.value)}
          />
        </div>
        <div>
          <Label className="mb-2 block text-sm">Max Price</Label>
          <Input
            type="number"
            placeholder="999"
            defaultValue={searchParams.get('maxPrice') || ''}
            onBlur={(e) => updateParam('maxPrice', e.target.value)}
          />
        </div>
      </div>

      <Button variant="outline" className="w-full" onClick={clearFilters}>
        Clear filters
      </Button>
    </div>
  )
}
