import { useEffect, useState } from 'react'
import { SlidersHorizontal } from 'lucide-react'
import { Checkbox } from '@/components/ui/checkbox'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { Skeleton } from '@/components/ui/skeleton'
import type { Category } from '@/types/product'
import type { Filters } from '@/hooks/use-filter-params'

interface FiltersSidebarProps {
  categories: Category[]
  categoriesLoading: boolean
  brands: string[]
  filters: Filters
  onCategoryChange: (slug: string | null) => void
  onPriceChange: (min: number | null, max: number | null) => void
  onBrandToggle: (brand: string) => void
  onReset: () => void
  hasActiveFilters: boolean
}

export function FiltersSidebar({
  categories,
  categoriesLoading,
  brands,
  filters,
  onCategoryChange,
  onPriceChange,
  onBrandToggle,
  onReset,
  hasActiveFilters,
}: FiltersSidebarProps) {
  // Price inputs are local until "Apply" so the user can type both bounds first.
  const [min, setMin] = useState(filters.minPrice?.toString() ?? '')
  const [max, setMax] = useState(filters.maxPrice?.toString() ?? '')

  // Keep local inputs in sync when filters change externally (e.g. Reset).
  useEffect(() => {
    setMin(filters.minPrice?.toString() ?? '')
    setMax(filters.maxPrice?.toString() ?? '')
  }, [filters.minPrice, filters.maxPrice])

  const applyPrice = () => {
    onPriceChange(
      min.trim() === '' ? null : Number(min),
      max.trim() === '' ? null : Number(max),
    )
  }

  return (
    <aside className="space-y-5 rounded-lg border bg-card p-4">
      <div className="flex items-center justify-between">
        <h2 className="flex items-center gap-2 font-semibold">
          <SlidersHorizontal className="size-4" />
          Filters
        </h2>
        {hasActiveFilters && (
          <Button
            variant="ghost"
            size="sm"
            className="h-auto px-2 py-1 text-xs"
            onClick={onReset}
          >
            Clear all
          </Button>
        )}
      </div>

      {/* Categories */}
      <section className="space-y-2">
        <h3 className="text-sm font-medium">Categories</h3>
        {categoriesLoading ? (
          <div className="space-y-2">
            {Array.from({ length: 6 }).map((_, i) => (
              <Skeleton key={i} className="h-5 w-2/3" />
            ))}
          </div>
        ) : (
          <div className="max-h-56 space-y-1.5 overflow-y-auto pr-1">
            {categories.map((c) => (
              <label
                key={c.slug}
                className="flex cursor-pointer items-center gap-2 text-sm"
              >
                <Checkbox
                  checked={filters.category === c.slug}
                  onCheckedChange={(checked) =>
                    onCategoryChange(checked ? c.slug : null)
                  }
                />
                {c.name}
              </label>
            ))}
          </div>
        )}
      </section>

      <Separator />

      {/* Price range */}
      <section className="space-y-2">
        <h3 className="text-sm font-medium">Price Range</h3>
        <div className="flex items-center gap-2">
          <Input
            type="number"
            min={0}
            inputMode="numeric"
            placeholder="Min"
            value={min}
            onChange={(e) => setMin(e.target.value)}
            className="h-9"
            aria-label="Minimum price"
          />
          <Input
            type="number"
            min={0}
            inputMode="numeric"
            placeholder="Max"
            value={max}
            onChange={(e) => setMax(e.target.value)}
            className="h-9"
            aria-label="Maximum price"
          />
        </div>
        <Button size="sm" className="w-full" onClick={applyPrice}>
          Apply
        </Button>
      </section>

      <Separator />

      {/* Brands */}
      <section className="space-y-2">
        <h3 className="text-sm font-medium">Brands</h3>
        {brands.length === 0 ? (
          <p className="text-xs text-muted-foreground">
            No brand data for this selection.
          </p>
        ) : (
          <div className="max-h-56 space-y-1.5 overflow-y-auto pr-1">
            {brands.map((brand) => (
              <div key={brand} className="flex items-center gap-2">
                <Checkbox
                  id={`brand-${brand}`}
                  checked={filters.brands.includes(brand)}
                  onCheckedChange={() => onBrandToggle(brand)}
                />
                <Label
                  htmlFor={`brand-${brand}`}
                  className="cursor-pointer text-sm font-normal"
                >
                  {brand}
                </Label>
              </div>
            ))}
          </div>
        )}
      </section>
    </aside>
  )
}
