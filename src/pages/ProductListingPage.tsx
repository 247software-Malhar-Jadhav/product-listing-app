import { useState } from 'react'
import { Header } from '@/components/layout/Header'
import { ProductGrid } from '@/components/products/ProductGrid'
import { StateMessage } from '@/components/common/StateMessage'
import { Button } from '@/components/ui/button'
import { useProducts } from '@/hooks/use-products'

const PAGE_SIZE = 8

export function ProductListingPage() {
  const [page, setPage] = useState(1)
  const { data: products = [], isLoading, isError, refetch } = useProducts(null)

  const totalPages = Math.max(1, Math.ceil(products.length / PAGE_SIZE))
  const pageItems = products.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)

  return (
    <div className="min-h-screen bg-slate-100">
      <Header />
      <main className="mx-auto max-w-6xl px-4 py-6">
        {isError ? (
          <StateMessage
            title="Couldn't load products"
            description="Something went wrong while fetching products."
            onRetry={() => refetch()}
          />
        ) : (
          <>
            <ProductGrid products={pageItems} loading={isLoading} />

            <div className="mt-6 flex items-center justify-center gap-2">
              <Button
                variant="outline"
                size="sm"
                disabled={page <= 1}
                onClick={() => setPage((p) => p - 1)}
              >
                ← Previous
              </Button>
              <span className="text-sm text-muted-foreground">
                Page {page} of {totalPages}
              </span>
              <Button
                variant="outline"
                size="sm"
                disabled={page >= totalPages}
                onClick={() => setPage((p) => p + 1)}
              >
                Next →
              </Button>
            </div>
          </>
        )}
      </main>
    </div>
  )
}
