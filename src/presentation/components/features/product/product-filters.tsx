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

  const hasFilters = searchParams.toString().length > 0

  return (
    <div className="space-y-6">
      <div>
        <Label className="font-ui text-muted-foreground/60 mb-2 block text-[11px] tracking-[0.12em] uppercase">
          Category
        </Label>
        <Select
          value={searchParams.get('category') || 'all'}
          onValueChange={(v) => updateParam('category', v)}
        >
          <SelectTrigger className="font-ui h-9 text-[13px]">
            <SelectValue placeholder="All" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all" className="font-ui">
              All
            </SelectItem>
            {categories.map((category) => (
              <SelectItem
                key={category.id}
                value={category.slug}
                className="font-ui"
              >
                {category.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label className="font-ui text-muted-foreground/60 mb-2 block text-[11px] tracking-[0.12em] uppercase">
          Sort
        </Label>
        <Select
          value={searchParams.get('sort') || 'newest'}
          onValueChange={(v) => updateParam('sort', v)}
        >
          <SelectTrigger className="font-ui h-9 text-[13px]">
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="newest" className="font-ui">
              Newest
            </SelectItem>
            <SelectItem value="price_asc" className="font-ui">
              Price: Low to High
            </SelectItem>
            <SelectItem value="price_desc" className="font-ui">
              Price: High to Low
            </SelectItem>
            <SelectItem value="rating" className="font-ui">
              Highest Rated
            </SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label className="font-ui text-muted-foreground/60 mb-2 block text-[11px] tracking-[0.12em] uppercase">
          Price
        </Label>
        <div className="grid grid-cols-2 gap-2">
          <Input
            type="number"
            placeholder="Min"
            defaultValue={searchParams.get('minPrice') || ''}
            onBlur={(e) => updateParam('minPrice', e.target.value)}
            className="h-9 text-[13px]"
          />
          <Input
            type="number"
            placeholder="Max"
            defaultValue={searchParams.get('maxPrice') || ''}
            onBlur={(e) => updateParam('maxPrice', e.target.value)}
            className="h-9 text-[13px]"
          />
        </div>
      </div>

      {hasFilters && (
        <button
          className="font-ui link-grow text-muted-foreground hover:text-oxblood w-fit text-[12px] transition-colors"
          onClick={clearFilters}
        >
          Clear all
        </button>
      )}
    </div>
  )
}
