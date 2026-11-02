import type { ReactNode, SubmitEventHandler } from 'react'
import { Link } from 'react-router'
import { classNames } from '../../lib/classNames'
import { Icon } from '../Icon/Icon'
import { Logo } from '../Logo/Logo'
import { Mascot } from '../Mascot/Mascot'
import { strings } from './strings'

/**
 * `form`: the logo on a 232 px butter band, the way back in its corner. `login`: the logo larger
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
  /** What the band shows: the logo with its name, or (the sign-in) the happy mascot with the welcome sentence. */
  emblem?: 'logo' | 'mascot'
  children: ReactNode
}

const BAND_HEIGHTS: Record<AuthLayout, string> = {
  form: 'h-58',
  login: 'h-62.5',
  welcome: 'h-70',
}

/**
 * The logo's height on a phone, name included. The board gives the cocotte 190 px (228 with the name): the sign-in and the welcome
 * have it. The screens with a way back keep 160, since the « Retour » pill in the corner would cover the steam of a larger one.
 * From a tablet it is 160 px everywhere (300 px beside the sign-in form).
 */
const PHONE_LOGO: Record<AuthLayout, number> = { form: 160, login: 228, welcome: 228 }

const LOGO_SHRINKS: Record<AuthLayout, string> = {
  form: '',
  login: 'tablet:[&_svg]:h-40 tablet:[&_svg]:w-auto desktop:[&_svg]:h-75',
  welcome: 'tablet:[&_svg]:h-40 tablet:[&_svg]:w-auto',
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
 * the logo on a phone; on a tablet and a desktop the logo above a centred 520 px card on calm
 * stripes. No tabs and no top bar: these are tasks of their own, the screen has the whole page.
 */
export function AuthFrame({ layout, back, onSubmit, emblem = 'logo', children }: AuthFrameProps) {
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
          'flex flex-1 flex-col tablet:w-full tablet:max-w-130 tablet:flex-none tablet:gap-5',
          side.card,
        )}
      >
        <div
          className={classNames(
            'flex shrink-0 items-center justify-center border-b-2 border-ink-900 bg-butter-300 tablet:h-auto tablet:border-b-0 tablet:bg-transparent',
            BAND_HEIGHTS[layout],
            LOGO_SHRINKS[layout],
            side.band,
          )}
        >
          {emblem === 'logo' ? (
            <Logo variant="large" tone="on-butter" size={PHONE_LOGO[layout]} />
          ) : (
            <div className="flex flex-col items-center gap-2 px-4 text-center">
              <Mascot mood="happy" size="large" tone="on-butter" />
              <p className="font-title text-label font-extrabold text-balance text-ink-900">
                {strings.welcome}
              </p>
            </div>
          )}
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
