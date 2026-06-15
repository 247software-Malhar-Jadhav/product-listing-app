import { useQuery } from '@tanstack/react-query'
import { fetchCategories } from '@/lib/api'
import type { Category } from '@/types/product'

export function useCategories() {
  return useQuery<Category[]>({
    queryKey: ['categories'],
    queryFn: fetchCategories,
    staleTime: Infinity, // categories are effectively static
  })
}
