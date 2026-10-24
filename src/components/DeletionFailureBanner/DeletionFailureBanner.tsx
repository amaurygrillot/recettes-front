import { Button } from '../Button/Button'
import { ErrorBanner } from '../ErrorBanner/ErrorBanner'
import { strings } from './strings'

export interface DeletionFailureBannerProps {
  /** Why the recipe could not be deleted, in a sentence. */
  cause: string
  onRetry: () => void
}

/** What a recipe page says when the deletion did not go through: the cause, and the same deletion again. */
export function DeletionFailureBanner({ cause, onRetry }: DeletionFailureBannerProps) {
  return (
    <ErrorBanner message={`${strings.failed} ${cause}`}>
      <Button variant="secondary" size="medium" onClick={onRetry}>
        {strings.retry}
      </Button>
    </ErrorBanner>
  )
}
