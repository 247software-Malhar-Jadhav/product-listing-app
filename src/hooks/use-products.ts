import { useQuery } from '@tanstack/react-query'
import { fetchAllProducts, fetchProductsByCategories } from '@/lib/api'
import type { Product } from '@/types/product'

/**
 * Fetches the product scope for the listing page. With one or more categories
 * selected we fan out to the category endpoint(s) and merge; with none we fetch
 * all products. Price / brand filtering and pagination are applied on top of
 * this scope in the page.
 */
export function useProducts(categories: string[]) {
  // Stable, order-independent key so ['a','b'] and ['b','a'] share a cache entry.
  const key = [...categories].sort()
  return useQuery<Product[]>({
    queryKey: ['products', key.length ? key.join(',') : 'all'],
    queryFn: () =>
      key.length ? fetchProductsByCategories(key) : fetchAllProducts(),
    placeholderData: (prev) => prev,
  })
}
