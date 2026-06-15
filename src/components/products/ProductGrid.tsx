import { ProductCard } from '@/components/products/ProductCard'
import { Card } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import type { Product } from '@/types/product'

interface ProductGridProps {
  products: Product[]
  loading?: boolean
  listingSearch?: string
}

const SKELETON_COUNT = 8

export function ProductGrid({ products, loading, listingSearch }: ProductGridProps) {
  if (loading) {
    return (
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
        {Array.from({ length: SKELETON_COUNT }).map((_, i) => (
          <Card key={i} className="overflow-hidden py-0">
            <Skeleton className="aspect-square w-full rounded-none" />
            <div className="space-y-2 p-4">
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-4 w-1/2" />
            </div>
          </Card>
        ))}
      </div>
    )
  }

  if (products.length === 0) {
    return (
      <div className="flex min-h-64 flex-col items-center justify-center rounded-lg border border-dashed text-center">
        <p className="font-medium">No products found</p>
        <p className="text-sm text-muted-foreground">
          Try adjusting your filters.
        </p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
      {products.map((product) => (
        <ProductCard
          key={product.id}
          product={product}
          listingSearch={listingSearch}
        />
      ))}
    </div>
  )
}
