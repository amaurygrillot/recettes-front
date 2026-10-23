/**
 * The hand-drawn wavy line that closes the presentation of a recipe, before the ingredients.
 * Decorative: it says nothing a screen reader would need.
 */
export function WavyRule() {
  return (
    <svg
      width="100%"
      height={14}
      viewBox="0 0 300 14"
      preserveAspectRatio="none"
      fill="none"
      strokeWidth={2}
      strokeLinecap="round"
      aria-hidden="true"
      className="stroke-ink-700"
    >
      <path d="M2 7 C 14 0, 26 14, 38 7 S 62 0, 74 7 S 98 14, 110 7 S 134 0, 146 7 S 170 14, 182 7 S 206 0, 218 7 S 242 14, 254 7 S 286 0, 298 7" />
    </svg>
  )
}
