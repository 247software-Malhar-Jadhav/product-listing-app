import { Star } from 'lucide-react'
import { cn } from '@/lib/utils'

interface RatingProps {
  value: number
  /** Hide the numeric "(4.5)" label when false. */
  showValue?: boolean
  className?: string
}

/** Five-star rating display with partial-star fill based on the rating value. */
export function Rating({ value, showValue = true, className }: RatingProps) {
  return (
    <div className={cn('flex items-center gap-1', className)}>
      <div className="flex">
        {Array.from({ length: 5 }).map((_, i) => {
          const fill = Math.max(0, Math.min(1, value - i))
          return (
            <span key={i} className="relative inline-block">
              <Star className="size-3.5 text-slate-300" />
              <span
                className="absolute inset-0 overflow-hidden"
                style={{ width: `${fill * 100}%` }}
              >
                <Star className="size-3.5 fill-star text-star" />
              </span>
            </span>
          )
        })}
      </div>
      {showValue && (
        <span className="text-xs text-muted-foreground">
          ({value.toFixed(1)})
        </span>
      )}
    </div>
  )
}
