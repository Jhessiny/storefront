import type { SupabaseClient } from '@supabase/supabase-js'
import type { CategoryRepository } from '@/domain/repositories'
import type { Category } from '@/domain/entities'
import type { DomainError } from '@/shared/errors'
import type { Either } from '@/shared/utils/either'
import { left, right } from '@/shared/utils/either'
import { mapSupabaseError } from '../api/error-mapper'

export class SupabaseCategoryRepository implements CategoryRepository {
  constructor(private readonly client: SupabaseClient) {}

  async getAll(): Promise<Either<DomainError, Category[]>> {
    const { data, error } = await this.client
      .from('categories')
      .select('*')
      .order('name')

    if (error) return left(mapSupabaseError(error, 'Category'))

    return right(
      (data ?? []).map((row) => ({
        id: row.id,
        name: row.name,
        slug: row.slug,
        createdAt: row.created_at
      }))
    )
  }
}
