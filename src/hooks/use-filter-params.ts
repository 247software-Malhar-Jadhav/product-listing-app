import { useCallback, useMemo } from 'react'
import { useSearchParams } from 'react-router-dom'

export interface Filters {
  category: string | null
  minPrice: number | null
  maxPrice: number | null
  brands: string[]
  q: string
  page: number
}

function parseNumber(value: string | null): number | null {
  if (value === null || value.trim() === '') return null
  const n = Number(value)
  return Number.isFinite(n) ? n : null
}

/**
 * Stores all listing filters in the URL query string. Keeping them in the URL
 * means selected filters survive navigation to the detail page and back, are
 * shareable, and reset cleanly. Any change to a filter resets pagination to
 * page 1; only `setPage` preserves the current filters.
 */
export function useFilterParams() {
  const [searchParams, setSearchParams] = useSearchParams()

  const filters = useMemo<Filters>(() => {
    const brands = searchParams.get('brands')
    return {
      category: searchParams.get('category'),
      minPrice: parseNumber(searchParams.get('minPrice')),
      maxPrice: parseNumber(searchParams.get('maxPrice')),
      brands: brands ? brands.split(',').filter(Boolean) : [],
      q: searchParams.get('q') ?? '',
      page: Math.max(1, parseNumber(searchParams.get('page')) ?? 1),
    }
  }, [searchParams])

  /** Merge a partial filter update into the URL, resetting page unless told otherwise. */
  const update = useCallback(
    (patch: Partial<Filters>, resetPage = true) => {
      setSearchParams(
        (prev) => {
          const next = new URLSearchParams(prev)
          const apply = (key: string, value: string | null) => {
            if (value === null || value === '') next.delete(key)
            else next.set(key, value)
          }

          if ('category' in patch) apply('category', patch.category ?? null)
          if ('q' in patch) apply('q', patch.q ?? null)
          if ('minPrice' in patch)
            apply('minPrice', patch.minPrice != null ? String(patch.minPrice) : null)
          if ('maxPrice' in patch)
            apply('maxPrice', patch.maxPrice != null ? String(patch.maxPrice) : null)
          if ('brands' in patch)
            apply('brands', patch.brands?.length ? patch.brands.join(',') : null)
          if ('page' in patch) apply('page', patch.page ? String(patch.page) : null)

          if (resetPage && !('page' in patch)) next.delete('page')
          return next
        },
        { replace: true },
      )
    },
    [setSearchParams],
  )

  const setCategory = useCallback(
    (category: string | null) => update({ category }),
    [update],
  )
  const setPrice = useCallback(
    (minPrice: number | null, maxPrice: number | null) =>
      update({ minPrice, maxPrice }),
    [update],
  )
  const setSearch = useCallback((q: string) => update({ q }), [update])
  const setBrands = useCallback((brands: string[]) => update({ brands }), [update])
  const toggleBrand = useCallback(
    (brand: string) => {
      const next = filters.brands.includes(brand)
        ? filters.brands.filter((b) => b !== brand)
        : [...filters.brands, brand]
      update({ brands: next })
    },
    [filters.brands, update],
  )
  const setPage = useCallback(
    (page: number) => update({ page }, false),
    [update],
  )
  const reset = useCallback(() => setSearchParams({}, { replace: true }), [
    setSearchParams,
  ])

  const hasActiveFilters =
    Boolean(filters.category) ||
    filters.minPrice != null ||
    filters.maxPrice != null ||
    filters.brands.length > 0 ||
    filters.q !== ''

  return {
    filters,
    setCategory,
    setPrice,
    setSearch,
    setBrands,
    toggleBrand,
    setPage,
    reset,
    hasActiveFilters,
  }
}
