import type { Member } from '../../../../api/sessionStore'
import type { Account } from '../../../../api/users'
import { Avatar } from '../../../../components/Avatar/Avatar'
import { CardPill } from '../../../../components/CardPill/CardPill'
import { strings } from '../../strings'

export interface IdentityBlockProps {
  member: Member
  known: Account | undefined
}

/** Who is signed in: the avatar, the username, the address when it is known, and the role. */
export function IdentityBlock({ member, known }: IdentityBlockProps) {
  const isAdmin = member.roles.includes('ADMIN')
  const fullName = [known?.firstname, known?.lastname].filter(Boolean).join(' ')

  return (
    <div className="flex items-center gap-4">
      {/* The initials of the first and last name when they are known, else of the username. */}
      <Avatar name={fullName === '' ? member.username : fullName} size={96} decorative />
      <div className="flex min-w-0 flex-1 flex-col gap-1">
        <p className="font-title text-section-title [overflow-wrap:anywhere]">{member.username}</p>
        {known?.email && (
          <p className="text-body [overflow-wrap:anywhere] text-ink-800">{known.email}</p>
        )}
        <div className="mt-1">
          <CardPill tone={isAdmin ? 'category' : 'tag'}>
            {isAdmin ? strings.roles.admin : strings.roles.member}
          </CardPill>
        </div>
      </div>
    </div>
  )
}
