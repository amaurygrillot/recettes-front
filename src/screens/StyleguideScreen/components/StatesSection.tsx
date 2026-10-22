import { BowlIllustration } from '../../../components/BowlIllustration/BowlIllustration'
import { Button } from '../../../components/Button/Button'
import { EmptyState } from '../../../components/EmptyState/EmptyState'
import { ErrorBanner } from '../../../components/ErrorBanner/ErrorBanner'
import { ErrorState } from '../../../components/ErrorState/ErrorState'
import { strings } from '../strings'
import { StyleguideSection } from './StyleguideSection'
import { StyleguideSpecimen } from './StyleguideSpecimen'

const { states } = strings

export function StatesSection() {
  return (
    <StyleguideSection title={states.title}>
      <div className="grid gap-x-6 gap-y-8 tablet:grid-cols-2">
        <StyleguideSpecimen label={states.firstVisit}>
          <EmptyState
            illustration={<BowlIllustration variant="first-visit" />}
            title={states.emptyBook}
            description={states.emptyBookText}
          >
            <Button icon="plus">{states.createRecipe}</Button>
          </EmptyState>
        </StyleguideSpecimen>
        <StyleguideSpecimen label={states.noResult}>
          <EmptyState
            illustration={<BowlIllustration variant="no-result" />}
            title={states.nothingMatches}
            description={states.nothingMatchesText}
          >
            <Button variant="secondary">{states.clearFilters}</Button>
          </EmptyState>
        </StyleguideSpecimen>
        <StyleguideSpecimen label={states.pageError}>
          <ErrorState title={states.cannotLoad} description={states.cannotLoadText}>
            <Button icon="refresh">{states.retry}</Button>
            <Button variant="quiet" size="medium">
              {states.backHome}
            </Button>
          </ErrorState>
        </StyleguideSpecimen>
        <StyleguideSpecimen label={states.banner}>
          <ErrorBanner message={states.interrupted}>
            <Button variant="secondary" size="medium">
              {states.retry}
            </Button>
          </ErrorBanner>
        </StyleguideSpecimen>
      </div>
    </StyleguideSection>
  )
}
