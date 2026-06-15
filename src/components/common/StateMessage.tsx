import { AlertCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface StateMessageProps {
  title: string
  description?: string
  onRetry?: () => void
}

/** Centered message block used for error states with an optional retry action. */
export function StateMessage({ title, description, onRetry }: StateMessageProps) {
  return (
    <div className="flex min-h-64 flex-col items-center justify-center gap-3 rounded-lg border border-dashed p-8 text-center">
      <AlertCircle className="size-8 text-destructive" />
      <div>
        <p className="font-medium">{title}</p>
        {description && (
          <p className="text-sm text-muted-foreground">{description}</p>
        )}
      </div>
      {onRetry && (
        <Button variant="outline" size="sm" onClick={onRetry}>
          Try again
        </Button>
      )}
    </div>
  )
}
