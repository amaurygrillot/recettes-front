import type { ReactNode } from 'react'

interface StyleguideSpecimenProps {
  label: string
  children: ReactNode
}

/** One thing on display, with a caption under it. */
export function StyleguideSpecimen({ label, children }: StyleguideSpecimenProps) {
  return (
    <figure className="flex flex-col gap-2">
      {children}
      <figcaption className="text-caption text-ink-700">{label}</figcaption>
    </figure>
  )
}
