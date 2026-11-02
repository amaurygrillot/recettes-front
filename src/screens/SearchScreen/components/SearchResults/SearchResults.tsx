import { feedFailureText } from '../../../../app/failureMessage'
import { failureIllustration } from '../../../../app/failureIllustration'
import { paths } from '../../../../app/paths'
import { isNarrowed, type SearchCriteria } from '../../../../app/searchCriteria'
import type { RecipeFeed } from '../../../../app/useRecipeFeed'
import { Mascot } from '../../../../components/Mascot/Mascot'
import { Button } from '../../../../components/Button/Button'
import { EmptyState } from '../../../../components/EmptyState/EmptyState'
import { ErrorState } from '../../../../components/ErrorState/ErrorState'
import { FeedGrid } from '../../../../components/FeedGrid/FeedGrid'
import { LinkButton } from '../../../../components/LinkButton/LinkButton'
import { LoadingRegion } from '../../../../components/LoadingRegion/LoadingRegion'
import { LoadMore } from '../../../../components/LoadMore/LoadMore'
import { RecipeCard } from '../../../../components/RecipeCard/RecipeCard'
import { RecipeCardSkeletons } from '../../../../components/RecipeCard/RecipeCardSkeletons'
import type { SearchScope } from '../../recipeFilters'
import { strings } from '../../strings'

const { states } = strings

export interface SearchResultsProps {
  feed: RecipeFeed
  criteria: SearchCriteria
  scope: SearchScope
  /** A filter is in force, so « Effacer les filtres » means something. */
  hasFilters: boolean
  onClearFilters: () => void
  /** 3 beside the filters' column of a desktop, 4 otherwise. */
  desktopColumns: 3 | 4
}

function EmptyResults({
  criteria,
  scope,
  hasFilters,
  onClearFilters,
}: Pick<SearchResultsProps, 'criteria' | 'scope' | 'hasFilters' | 'onClearFilters'>) {
  // Everybody's recipes are never listed without a criterion, so only the member's own can be empty of them.
  if (scope.kind === 'mine' && !isNarrowed(criteria)) {
    return (
      <EmptyState
        illustration={<Mascot mood="happy" size="xl" />}
        title={states.emptyMine.title}
        description={states.emptyMine.description}
        size="compact"
      >
        <LinkButton to={paths.newRecipe} icon="plus" fullWidth>
          {states.emptyMine.create}
        </LinkButton>
      </EmptyState>
    )
  }

  const query = criteria.query.trim()
  return (
    <EmptyState
      illustration={<Mascot mood="lost" size="xl" />}
      title={states.emptySearch.title}
      description={
        query === ''
          ? states.emptySearch.descriptionFilters
          : states.emptySearch.descriptionFor(query, hasFilters)
      }
      size="compact"
    >
      {hasFilters && (
        <Button variant="secondary" fullWidth onClick={onClearFilters}>
          {states.emptySearch.clearFilters}
        </Button>
      )}
    </EmptyState>
  )
}

/** The answer of the search, in whichever state it is: loading, failed, nothing found, or listed. */
export function SearchResults({
  feed,
  criteria,
  scope,
  hasFilters,
  onClearFilters,
  desktopColumns,
}: SearchResultsProps) {
  switch (feed.status) {
    case 'loading':
      return (
        <LoadingRegion label={strings.results.loading}>
          <RecipeCardSkeletons desktopColumns={desktopColumns} />
        </LoadingRegion>
      )

    case 'failed': {
      const { title, description } = feedFailureText(feed.failure)
      return (
        <ErrorState
          title={title}
          description={description}
          size="compact"
          illustration={failureIllustration(feed.failure)}
        >
          <Button icon="refresh" fullWidth onClick={feed.retry}>
            {states.failedRetry}
          </Button>
        </ErrorState>
      )
    }

    case 'empty':
      return (
        <EmptyResults
          criteria={criteria}
          scope={scope}
          hasFilters={hasFilters}
          onClearFilters={onClearFilters}
        />
      )

    case 'ready':
      return (
        <div className="flex flex-col gap-5.5 tablet:gap-6">
          <h2 className="sr-only">{strings.results.heading}</h2>
          <FeedGrid desktopColumns={desktopColumns}>
            {feed.recipes.map((recipe) => (
              <li key={recipe.id}>
                <RecipeCard recipe={recipe} />
              </li>
            ))}
          </FeedGrid>
          {feed.more.status === 'loading' && (
            <div aria-hidden="true">
              <RecipeCardSkeletons desktopColumns={desktopColumns} />
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
