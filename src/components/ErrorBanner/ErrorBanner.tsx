import type { ReactNode } from 'react'
import { Icon } from '../Icon/Icon'

export interface ErrorBannerProps {
  /** The cause and what to do, in one sentence: « Le chargement s'est interrompu. » */
  message: string
  /** An optional 56 px action, typically a secondary « Réessayer ». */
  children?: ReactNode
}

/** An error inside a list or a form, announced at once. For a whole block that failed, use ErrorState. */
export function ErrorBanner({ message, children }: ErrorBannerProps) {
  return (
    <div
      role="alert"
      className="flex flex-wrap items-center gap-3 rounded-l border-2 border-brick bg-brick-bg px-4 py-3.5 text-brick"
    >
      <Icon name="alert" size={26} strokeWidth={2.4} />
      {/* On a narrow screen the action drops under the message instead of squeezing it. */}
      <p className="min-w-48 flex-1 text-body font-bold">{message}</p>
      {children}
    </div>
  )
}
