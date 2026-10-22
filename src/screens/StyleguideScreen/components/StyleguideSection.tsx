import { useId, type ReactNode } from 'react'

interface StyleguideSectionProps {
  title: string
  children: ReactNode
}

export function StyleguideSection({ title, children }: StyleguideSectionProps) {
  const headingId = useId()

  return (
    <section
      aria-labelledby={headingId}
      className="flex flex-col gap-6 border-t-2 border-dashed border-ink-500 pt-8"
    >
      <h2 id={headingId} className="font-title text-title-2">
        {title}
      </h2>
      {children}
    </section>
  )
}
