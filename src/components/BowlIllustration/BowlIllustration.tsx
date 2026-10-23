export interface BowlIllustrationProps {
  /** `first-visit`: a bowl with a few grains and chopsticks. `no-result`: an empty bowl. */
  variant: 'first-visit' | 'no-result'
  /** `regular` (176 px wide) for a page of its own; `compact` (140 px) for a block among others. */
  size?: 'regular' | 'compact'
}

const WIDTHS = { regular: 176, compact: 140 }

/** Ink-line bowl for empty states (« Retours et chargement » board): never a face, never a character. */
export function BowlIllustration({ variant, size = 'regular' }: BowlIllustrationProps) {
  const hasGrains = variant === 'first-visit'
  const width = WIDTHS[size]

  return (
    <svg
      viewBox="0 0 160 120"
      width={width}
      height={(width * 3) / 4}
      aria-hidden="true"
      className="shrink-0 stroke-ink-900"
    >
      {hasGrains && (
        <g strokeWidth={5} strokeLinecap="round" fill="none">
          <path d="M116 14 L74 54" />
          <path d="M130 22 L92 58" />
        </g>
      )}
      <path
        d="M20 56 H140 C140 92 112 108 80 108 C48 108 20 92 20 56 Z"
        className={hasGrains ? 'fill-butter-300' : 'fill-paper-50'}
        strokeWidth={4.5}
        strokeLinejoin="round"
      />
      <ellipse
        cx="80"
        cy="56"
        rx="60"
        ry="10"
        className={hasGrains ? 'fill-paper-50' : 'fill-paper-200'}
        strokeWidth={4.5}
      />
      <path d="M26 76 C50 86 110 86 134 76" strokeWidth={3} strokeLinecap="round" fill="none" />
      {hasGrains ? (
        <g className="fill-ink-900" stroke="none">
          <ellipse cx="70" cy="58" rx="4" ry="1.8" transform="rotate(-20 70 58)" />
          <ellipse cx="84" cy="60" rx="4" ry="1.8" transform="rotate(15 84 60)" />
          <ellipse cx="96" cy="57" rx="4" ry="1.8" transform="rotate(-8 96 57)" />
        </g>
      ) : (
        <g
          className="stroke-ink-500"
          strokeWidth={3.5}
          strokeLinecap="round"
          strokeDasharray="1 7"
          fill="none"
        >
          <path d="M60 40 C56 32 64 28 60 20" />
          <path d="M80 38 C76 30 84 26 80 16" />
          <path d="M100 40 C96 32 104 28 100 20" />
        </g>
      )}
    </svg>
  )
}
