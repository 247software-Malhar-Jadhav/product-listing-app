import { useMemo } from 'react'
import { useLocation } from 'react-router-dom'
import { Header } from '@/components/layout/Header'
import { ProductGrid } from '@/components/products/ProductGrid'
import { FiltersSidebar } from '@/components/products/FiltersSidebar'
import { Pagination } from '@/components/products/Pagination'
import { StateMessage } from '@/components/common/StateMessage'
import { useProducts } from '@/hooks/use-products'
import { useCategories } from '@/hooks/use-categories'
import { useFilterParams } from '@/hooks/use-filter-params'

const PAGE_SIZE = 8

export function ProductListingPage() {
  const location = useLocation()
  const {
    filters,
    setCategory,
    setPrice,
    setSearch,
    toggleBrand,
    setPage,
    reset,
    hasActiveFilters,
  } = useFilterParams()

  const {
    data: scope = [],
    isFetching,
    isError,
    refetch,
  } = useProducts(filters.category)
  const { data: categories = [], isLoading: categoriesLoading } = useCategories()

  // Unique brands within the current category scope (case-insensitive, sorted).
  const brands = useMemo(() => {
    const set = new Set<string>()
    for (const p of scope) if (p.brand) set.add(p.brand)
    return Array.from(set).sort((a, b) => a.localeCompare(b))
  }, [scope])

  // Apply price, brand and search filters on top of the fetched scope.
  const filtered = useMemo(() => {
    const q = filters.q.trim().toLowerCase()
    return scope.filter((p) => {
      if (filters.minPrice != null && p.price < filters.minPrice) return false
      if (filters.maxPrice != null && p.price > filters.maxPrice) return false
      if (filters.brands.length > 0 && (!p.brand || !filters.brands.includes(p.brand)))
        return false
      if (q && !p.title.toLowerCase().includes(q)) return false
      return true
    })
  }, [scope, filters.minPrice, filters.maxPrice, filters.brands, filters.q])

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE))
  const page = Math.min(filters.page, totalPages)
  const pageItems = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)

  return (
    <div className="min-h-screen bg-slate-100">
      <Header search={filters.q} onSearchChange={setSearch} />
      <main className="mx-auto grid max-w-6xl gap-6 px-4 py-6 md:grid-cols-[240px_1fr]">
        <FiltersSidebar
          categories={categories}
          categoriesLoading={categoriesLoading}
          brands={brands}
          filters={filters}
          onCategoryChange={setCategory}
          onPriceChange={setPrice}
          onBrandToggle={toggleBrand}
          onReset={reset}
          hasActiveFilters={hasActiveFilters}
        />

        <section>
          {isError ? (
            <StateMessage
              title="Couldn't load products"
              description="Something went wrong while fetching products."
              onRetry={() => refetch()}
            />
          ) : (
            <>
              <div className="mb-4 flex items-center justify-between">
                <p className="text-sm text-muted-foreground">
                  {isFetching ? 'Loading…' : `${filtered.length} products`}
                </p>
              </div>

              <ProductGrid
                products={pageItems}
                loading={isFetching}
                listingSearch={location.search}
              />

              <div className="mt-6">
                <Pagination
                  page={page}
                  totalPages={totalPages}
                  onPageChange={setPage}
                />
              </div>
            </>
          )}
        </section>
      </main>
    </div>
  )
}
