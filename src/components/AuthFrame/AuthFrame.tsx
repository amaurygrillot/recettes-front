import type { ReactNode, SubmitEventHandler } from 'react'
import { Link } from 'react-router'
import { classNames } from '../../lib/classNames'
import { Icon } from '../Icon/Icon'
import { Logo } from '../Logo/Logo'

/**
 * `form`: the seal on a 232 px butter band, the way back in its corner. `login`: the seal larger
 * on a 250 px band, no way back (it is a task of its own), and beside the form on a desktop.
 * `welcome`: the largest band, for the first words a new member reads.
 */
export type AuthLayout = 'form' | 'login' | 'welcome'

export interface AuthFrameProps {
  layout: AuthLayout
  /** The way back, a link in the top-left corner of the screen. */
  back?: { to: string; label: string } | undefined
  /** Makes the content a form (validated by the form itself, not by the browser). */
  onSubmit?: SubmitEventHandler<HTMLFormElement> | undefined
  children: ReactNode
}

const BAND_HEIGHTS: Record<AuthLayout, string> = {
  form: 'h-58',
  login: 'h-62.5',
  welcome: 'h-70',
}

/** The seal's size on a phone; from a tablet it is 160 px everywhere (300 px beside the sign-in form). */
const PHONE_SEAL: Record<AuthLayout, number> = { form: 160, login: 196, welcome: 196 }

const SEAL_SHRINKS: Record<AuthLayout, string> = {
  form: '',
  login: 'tablet:[&>svg]:size-40 desktop:[&>svg]:size-75',
  welcome: 'tablet:[&>svg]:size-40',
}

interface SideBySide {
  page: string
  card: string
  band: string
  body: string
}

const NOT_SIDE_BY_SIDE: SideBySide = { page: '', card: '', band: '', body: '' }

/** Only the sign-in has a second layout, from 1024 px: the butter panel and the form side by side. */
const SIDE_BY_SIDE: Record<AuthLayout, SideBySide> = {
  form: NOT_SIDE_BY_SIDE,
  welcome: NOT_SIDE_BY_SIDE,
  login: {
    page: 'desktop:justify-center desktop:bg-paper-100 desktop:bg-none',
    card: 'desktop:min-h-130 desktop:max-w-240 desktop:flex-row desktop:gap-0 desktop:overflow-hidden desktop:rounded-xl desktop:border-3 desktop:border-ink-900 desktop:bg-paper-50 desktop:shadow-stamp',
    band: 'desktop:h-auto desktop:flex-1 desktop:border-r-2 desktop:bg-butter-300',
    body: 'desktop:flex-1 desktop:items-center desktop:justify-center desktop:rounded-none desktop:border-0 desktop:p-8 desktop:shadow-none',
  },
}

/**
 * The frame of the entry screens (sign-in, registration, forgotten password…): a butter band with
 * the seal on a phone; on a tablet and a desktop the seal above a centred 520 px card on calm
 * stripes. No tabs and no top bar: these are tasks of their own, the screen has the whole page.
 */
export function AuthFrame({ layout, back, onSubmit, children }: AuthFrameProps) {
  const side = SIDE_BY_SIDE[layout]

  const bodyClassName = classNames(
    'flex flex-1 flex-col px-5 pt-6.5 pb-6 tablet:flex-none tablet:rounded-xl tablet:border-2 tablet:border-ink-900 tablet:bg-paper-50 tablet:px-8 tablet:py-7 tablet:shadow-sheet',
    side.body,
  )
  const content = (
    <div
      className={classNames(
        'flex w-full flex-col gap-4',
        layout === 'login' && 'desktop:max-w-104',
      )}
    >
      {children}
    </div>
  )

  return (
    <main
      className={classNames(
        'relative flex min-h-dvh flex-col tablet:items-center tablet:bg-calm-stripes tablet:px-6 tablet:pt-9 tablet:pb-6',
        side.page,
      )}
    >
      {back && (
        <Link
          to={back.to}
          className="absolute top-3.5 left-3.5 z-10 inline-flex h-13 items-center gap-1.5 rounded-pill border-2 border-ink-900 bg-paper-50 pr-4 pl-2.5 text-label font-bold text-ink-900 focus-visible:outline-offset-3 active:bg-butter-200 tablet:top-6 tablet:left-6 tablet:pr-4.5"
        >
          <Icon name="chevron-left" size={24} strokeWidth={2.6} />
          {back.label}
        </Link>
      )}
      <div
        className={classNames(
          'flex flex-1 flex-col tablet:w-full tablet:max-w-130 tablet:flex-none tablet:gap-2',
          side.card,
        )}
      >
        <div
          className={classNames(
            'flex shrink-0 items-center justify-center border-b-2 border-ink-900 bg-butter-300 tablet:h-auto tablet:border-b-0 tablet:bg-transparent',
            BAND_HEIGHTS[layout],
            SEAL_SHRINKS[layout],
            side.band,
          )}
        >
          <Logo variant="seal" tone="on-butter" size={PHONE_SEAL[layout]} />
        </div>
        {onSubmit === undefined ? (
          <div className={bodyClassName}>{content}</div>
        ) : (
          <form onSubmit={onSubmit} noValidate className={bodyClassName}>
            {content}
          </form>
        )}
      </div>
    </main>
  )
}
