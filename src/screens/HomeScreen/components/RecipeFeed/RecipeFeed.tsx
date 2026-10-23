import { feedFailureText } from '../../../../app/failureMessage'
import { paths } from '../../../../app/paths'
import type { RecipeFeed as RecipeFeedState } from '../../../../app/useRecipeFeed'
import { BowlIllustration } from '../../../../components/BowlIllustration/BowlIllustration'
import { Button } from '../../../../components/Button/Button'
import { EmptyState } from '../../../../components/EmptyState/EmptyState'
import { ErrorState } from '../../../../components/ErrorState/ErrorState'
import { FeedGrid } from '../../../../components/FeedGrid/FeedGrid'
import { LinkButton } from '../../../../components/LinkButton/LinkButton'
import { LoadingRegion } from '../../../../components/LoadingRegion/LoadingRegion'
import { LoadMore } from '../../../../components/LoadMore/LoadMore'
import { RecipeCard } from '../../../../components/RecipeCard/RecipeCard'
import { RecipeCardSkeletons } from '../../../../components/RecipeCard/RecipeCardSkeletons'
import { strings } from '../../strings'

export interface RecipeFeedProps {
  feed: RecipeFeedState
  /** A member allowed to write recipes: the empty feed invites them to write the first. */
  mayCreate: boolean
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
      const { title, description } = feedFailureText(feed.failure)
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
