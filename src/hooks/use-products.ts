import { useQuery } from '@tanstack/react-query'
import { fetchAllProducts, fetchProductsByCategory } from '@/lib/api'
import type { Product } from '@/types/product'

/**
 * Fetches the product scope for the listing page. When a category is selected we
 * hit the category endpoint, otherwise we fetch all products. Price / brand
 * filtering and pagination are applied on top of this scope in the page.
 */
export function useProducts(category: string | null) {
  return useQuery<Product[]>({
    queryKey: ['products', category ?? 'all'],
    queryFn: () =>
      category ? fetchProductsByCategory(category) : fetchAllProducts(),
    placeholderData: (prev) => prev,
  })
}
