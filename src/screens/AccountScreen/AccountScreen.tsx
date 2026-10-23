import { useState } from 'react'
import { useNavigate } from 'react-router'
import { signOut } from '../../api/session'
import type { Member } from '../../api/sessionStore'
import { useKnownAccount } from '../../api/users'
import { useCreateButtonMode } from '../../app/createButtonMode'
import { paths } from '../../app/paths'
import { useMember } from '../../app/useMember'
import { Button } from '../../components/Button/Button'
import { Icon } from '../../components/Icon/Icon'
import { SectionIndex, type SectionIndexItem } from '../../components/SectionIndex/SectionIndex'
import { SECTION_INDEX_ENTRY } from '../../components/SectionIndex/sectionIndexStyles'
import { DESKTOP_QUERY, TABLET_QUERY } from '../../lib/breakpoints'
import { logger } from '../../lib/logger'
import { useActiveSection } from '../../lib/useActiveSection'
import { useMediaQuery } from '../../lib/useMediaQuery'
import { EmailCard } from './components/EmailCard/EmailCard'
import { IdentityBlock } from './components/IdentityBlock/IdentityBlock'
import { LinkRow } from './components/LinkRow/LinkRow'
import { LogoutDialog } from './components/LogoutDialog/LogoutDialog'
import { PasswordCard } from './components/PasswordCard/PasswordCard'
import { ProfileCard } from './components/ProfileCard/ProfileCard'
import { strings } from './strings'

const SECTIONS: readonly SectionIndexItem[] = [
  { id: 'profil', label: strings.sections.profile, icon: 'user' },
  { id: 'email', label: strings.sections.email, icon: 'mail' },
  { id: 'mdp', label: strings.sections.password, icon: 'lock' },
]
const SECTION_IDS = SECTIONS.map(({ id }) => id)

/**
 * `/compte`: who is signed in, and three cards (profile, e-mail, password) each saved on its own.
 * From a tablet the sections have their index in a column, and « Se déconnecter » moves into it.
 */
export function AccountScreen() {
  const member = useMember()
  // Until they are signed out, the page of the member stays, even behind the « session expired » dialog.
  if (member === undefined) return null
  return <AccountPage member={member} />
}

function AccountPage({ member }: { member: Member }) {
  const navigate = useNavigate()
  const known = useKnownAccount(member.userId)
  const tabletOrMore = useMediaQuery(TABLET_QUERY)
  const desktop = useMediaQuery(DESKTOP_QUERY)
  const { active, select } = useActiveSection(SECTION_IDS)
  const [confirmingLogout, setConfirmingLogout] = useState(false)
  // The page has its own buttons; the shell's « + » would only cover them.
  useCreateButtonMode('hidden')

  function goTo(id: string): void {
    select(id)
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  function logOut(): void {
    logger.info('The member signs out')
    signOut()
    void navigate(paths.home)
  }

  const askToLogOut = () => {
    setConfirmingLogout(true)
  }

  return (
    <main className="pt-5 pb-8 tablet:pt-7">
      <h1 className="mb-5.5 font-title text-page-title-lg">{strings.title}</h1>
      <div className="flex flex-col gap-5.5 tablet:grid tablet:grid-cols-[12.5rem_minmax(0,1fr)] tablet:items-start tablet:gap-6">
        {tabletOrMore && (
          <div className="sticky top-6">
            <SectionIndex
              label={strings.sections.label}
              items={SECTIONS}
              activeId={active}
              onSelect={goTo}
            >
              <button type="button" className={SECTION_INDEX_ENTRY} onClick={askToLogOut}>
                <Icon name="log-out" size={24} strokeWidth={2.4} />
                {strings.logout.button}
              </button>
            </SectionIndex>
          </div>
        )}
        <div className="flex min-w-0 flex-col gap-5.5 desktop:max-w-200">
          <IdentityBlock member={member} known={known} />
          <ProfileCard member={member} known={known} wide={desktop} />
          <EmailCard known={known} wide={desktop} />
          <PasswordCard wide={desktop} />
          <LinkRow to={paths.myRecipes} icon="book" label={strings.myRecipes} />
          {!tabletOrMore && (
            <Button variant="secondary" icon="log-out" fullWidth onClick={askToLogOut}>
              {strings.logout.button}
            </Button>
          )}
        </div>
      </div>
      <LogoutDialog
        open={confirmingLogout}
        onStay={() => {
          setConfirmingLogout(false)
        }}
        onConfirm={logOut}
      />
    </main>
  )
}
