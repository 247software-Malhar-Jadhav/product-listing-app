import { useQuery } from '@tanstack/react-query'
import { fetchProduct } from '@/lib/api'
import type { Product } from '@/types/product'

export function useProduct(id: string | undefined) {
  return useQuery<Product>({
    queryKey: ['product', id],
    queryFn: () => fetchProduct(id!),
    enabled: Boolean(id),
  })
}
