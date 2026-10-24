import type { ApiFailure } from '../../api/failure'
import { BowlIllustration } from '../../components/BowlIllustration/BowlIllustration'
import { Button } from '../../components/Button/Button'
import { EmptyState } from '../../components/EmptyState/EmptyState'
import { ErrorState } from '../../components/ErrorState/ErrorState'
import { LinkButton } from '../../components/LinkButton/LinkButton'
import { failureMessage, feedFailureText } from '../failureMessage'
import { paths } from '../paths'
import { strings } from './strings'

export interface RecipeProblemProps {
  failure: ApiFailure
  retry: () => void
}

/** The wording of a recipe that could not be loaded: no connection has the design's, any other cause says itself. */
function failedText(failure: ApiFailure): { title: string; description: string } {
  if (failure.kind === 'network') return feedFailureText(failure)
  return { title: strings.failed.otherTitle, description: failureMessage(failure) }
}

/**
 * What the page says when the recipe is not there: it does not exist (a 404: the link is old or
 * the author removed it), or it could not be loaded (the cause, and « Réessayer »).
 */
export function RecipeProblem({ failure, retry }: RecipeProblemProps) {
  if (failure.kind === 'not-found') {
    return (
      <EmptyState
        illustration={<BowlIllustration variant="no-result" size="compact" />}
        title={strings.notFound.title}
        description={strings.notFound.description}
        size="compact"
        headingLevel={1}
      >
        <LinkButton to={paths.search} fullWidth>
          {strings.notFound.action}
        </LinkButton>
      </EmptyState>
    )
  }

  const { title, description } = failedText(failure)
  return (
    <ErrorState title={title} description={description} size="compact" headingLevel={1}>
      <Button icon="refresh" fullWidth onClick={retry}>
        {strings.failed.retry}
      </Button>
    </ErrorState>
  )
}
