import { paths } from '../../app/paths'
import { Mascot } from '../../components/Mascot/Mascot'
import { EmptyState } from '../../components/EmptyState/EmptyState'
import { LinkButton } from '../../components/LinkButton/LinkButton'
import { strings } from './strings'

/** Any address the app does not know. */
export function NotFoundScreen() {
  return (
    <main className="mx-auto flex max-w-reading flex-col py-12">
      <EmptyState
        illustration={<Mascot mood="lost" size="xl" />}
        title={strings.title}
        description={strings.description}
      >
        <LinkButton to={paths.home}>{strings.backHome}</LinkButton>
      </EmptyState>
    </main>
  )
}
