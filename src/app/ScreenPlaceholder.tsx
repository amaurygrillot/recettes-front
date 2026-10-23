import type { ReactNode } from 'react'
import { strings } from './strings'

interface ScreenPlaceholderProps {
  title: string
  children?: ReactNode
}

/** Stands in for a screen that is not built yet; each one is replaced by its own screen. */
export function ScreenPlaceholder({ title, children }: ScreenPlaceholderProps) {
  return (
    <main className="flex flex-col items-start gap-3 py-12">
      <h1 className="font-title text-poster">{title}</h1>
      <p className="text-body text-ink-700">{strings.placeholder.comingSoon}</p>
      {children}
    </main>
  )
}
