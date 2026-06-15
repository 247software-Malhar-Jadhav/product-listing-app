import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

interface PaginationProps {
  page: number
  totalPages: number
  onPageChange: (page: number) => void
  /** Max numbered buttons to render before collapsing with ellipses. */
  windowSize?: number
}

/** Builds the list of page numbers to show, inserting `'…'` gaps when needed. */
function getPageItems(page: number, total: number, windowSize: number) {
  if (total <= windowSize) {
    return Array.from({ length: total }, (_, i) => i + 1)
  }

  const items: (number | '…')[] = [1]
  const side = Math.floor((windowSize - 2) / 2)
  let start = Math.max(2, page - side)
  let end = Math.min(total - 1, page + side)

  if (page - side <= 2) end = windowSize - 1
  if (page + side >= total - 1) start = total - windowSize + 2

  if (start > 2) items.push('…')
  for (let i = start; i <= end; i++) items.push(i)
  if (end < total - 1) items.push('…')
  items.push(total)
  return items
}

export function Pagination({
  page,
  totalPages,
  onPageChange,
  windowSize = 7,
}: PaginationProps) {
  if (totalPages <= 1) return null
  const items = getPageItems(page, totalPages, windowSize)

  return (
    <nav
      className="flex flex-wrap items-center justify-center gap-1"
      aria-label="Pagination"
    >
      <Button
        variant="outline"
        size="sm"
        disabled={page <= 1}
        onClick={() => onPageChange(page - 1)}
      >
        ← Previous
      </Button>

      {items.map((item, i) =>
        item === '…' ? (
          <span key={`gap-${i}`} className="px-2 text-sm text-muted-foreground">
            …
          </span>
        ) : (
          <Button
            key={item}
            variant={item === page ? 'default' : 'outline'}
            size="sm"
            className={cn('min-w-9', item === page && 'pointer-events-none')}
            aria-current={item === page ? 'page' : undefined}
            onClick={() => onPageChange(item)}
          >
            {item}
          </Button>
        ),
      )}

      <Button
        variant="outline"
        size="sm"
        disabled={page >= totalPages}
        onClick={() => onPageChange(page + 1)}
      >
        Next →
      </Button>
    </nav>
  )
}
