import { Button } from '../../../../components/Button/Button'
import { EmptyState } from '../../../../components/EmptyState/EmptyState'
import { Mascot } from '../../../../components/Mascot/Mascot'
import { strings } from '../../strings'

const { invitation } = strings

export interface SearchInvitationProps {
  /** Opens the search over the page. */
  onSearch: () => void
}

/**
 * What the results page says when nothing is left to search for: it does not list the whole library, it
 * invites to search.
 */
export function SearchInvitation({ onSearch }: SearchInvitationProps) {
  return (
    <EmptyState
      illustration={<Mascot mood="happy" size="xl" />}
      title={invitation.title}
      description={invitation.description}
      size="compact"
    >
      <Button icon="search" fullWidth aria-haspopup="dialog" onClick={onSearch}>
        {invitation.action}
      </Button>
    </EmptyState>
  )
}
