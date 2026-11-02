/** `color` on paper, `on-butter` on a yellow background, `mono` for one ink colour. */
export type LogoTone = 'color' | 'on-butter' | 'mono'

// What changes with the tone is painted through CSS variables; ink is always ink-900, brick is brick but for the one-colour tone.
const INK = '[--logo-ink:var(--color-ink-900)]'

/** The variables the cocotte's drawings read (`--logo-*`), set on the SVG: the logo's and the mascot's. */
export const LOGO_TONES: Record<LogoTone, string> = {
  color: `${INK} [--logo-gold:var(--color-butter-300)] [--logo-gold-deep:var(--color-butter-400)] [--logo-cream:var(--color-paper-50)] [--logo-blush:var(--color-brick-bg)] [--logo-brick:var(--color-brick)]`,
  'on-butter': `${INK} [--logo-gold:var(--color-paper-50)] [--logo-gold-deep:var(--color-butter-200)] [--logo-cream:var(--color-paper-50)] [--logo-blush:var(--color-brick-bg)] [--logo-brick:var(--color-brick)]`,
  mono: `${INK} [--logo-gold:var(--color-paper-50)] [--logo-gold-deep:var(--color-paper-50)] [--logo-cream:var(--color-paper-50)] [--logo-blush:var(--color-paper-50)] [--logo-brick:var(--color-ink-900)]`,
}
