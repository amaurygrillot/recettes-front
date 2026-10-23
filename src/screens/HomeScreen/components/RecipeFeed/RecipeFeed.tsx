import type { ApiFailure } from '../../../../api/failure'
import { failureMessage } from '../../../../app/failureMessage'
import { paths } from '../../../../app/paths'
import { BowlIllustration } from '../../../../components/BowlIllustration/BowlIllustration'
import { Button } from '../../../../components/Button/Button'
import { EmptyState } from '../../../../components/EmptyState/EmptyState'
import { ErrorState } from '../../../../components/ErrorState/ErrorState'
import { LinkButton } from '../../../../components/LinkButton/LinkButton'
import { LoadingRegion } from '../../../../components/LoadingRegion/LoadingRegion'
import { strings } from '../../strings'
import type { RecipeFeed as RecipeFeedState } from '../../useRecipeFeed'
import { FeedGrid } from '../FeedGrid/FeedGrid'
import { LoadMore } from '../LoadMore/LoadMore'
import { RecipeCard } from '../RecipeCard/RecipeCard'
import { RecipeCardSkeletons } from '../RecipeCard/RecipeCardSkeletons'

export interface RecipeFeedProps {
  feed: RecipeFeedState
  /** A member allowed to write recipes: the empty feed invites them to write the first. */
  mayCreate: boolean
}

/** Having no connection is the one cause the design words in its own way; the rest use the cause's sentence. */
function failureText(failure: ApiFailure): { title: string; description: string } {
  if (failure.kind === 'network') return strings.failed.network
  return { title: strings.failed.other.title, description: failureMessage(failure) }
}

/** The recipes under the title, in whichever state they are: loading, failed, empty or listed. */
export function RecipeFeed({ feed, mayCreate }: RecipeFeedProps) {
  switch (feed.status) {
    case 'loading':
      return (
        <LoadingRegion label={strings.feed.loading}>
          <RecipeCardSkeletons />
        </LoadingRegion>
      )

    case 'failed': {
      const { title, description } = failureText(feed.failure)
      return (
        <ErrorState title={title} description={description} size="compact">
          <Button icon="refresh" fullWidth onClick={feed.retry}>
            {strings.failed.retry}
          </Button>
        </ErrorState>
      )
    }

    case 'empty':
      return mayCreate ? (
        <EmptyState
          illustration={<BowlIllustration variant="first-visit" size="compact" />}
          title={strings.empty.member.title}
          description={strings.empty.member.description}
          size="compact"
        >
          <LinkButton to={paths.newRecipe} icon="plus" fullWidth>
            {strings.empty.member.create}
          </LinkButton>
        </EmptyState>
      ) : (
        <EmptyState
          illustration={<BowlIllustration variant="first-visit" size="compact" />}
          title={strings.empty.visitor.title}
          description={strings.empty.visitor.description}
          size="compact"
        >
          <Button
            variant="secondary"
            icon="refresh"
            fullWidth
            busy={feed.refreshing}
            onClick={feed.refresh}
          >
            {feed.refreshing ? strings.empty.visitor.refreshing : strings.empty.visitor.refresh}
          </Button>
        </EmptyState>
      )

    case 'ready':
      return (
        <div className="flex flex-col gap-5.5 tablet:gap-6">
          <FeedGrid>
            {feed.recipes.map((recipe) => (
              <li key={recipe.id}>
                <RecipeCard recipe={recipe} />
              </li>
            ))}
          </FeedGrid>
          {feed.more.status === 'loading' && (
            <div aria-hidden="true">
              <RecipeCardSkeletons />
            </div>
          )}
          <LoadMore
            shown={feed.recipes.length}
            total={feed.total}
            more={feed.more}
            lastBatch={feed.lastBatch}
          />
        </div>
      )
  }
}
