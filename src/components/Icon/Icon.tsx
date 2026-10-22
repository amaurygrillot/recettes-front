import { iconShape, type IconName } from './iconShapes'

export interface IconProps {
  name: IconName
  /** Rendered width and height in px: 24 by default, 20 when dense, 32 to stand out, 48 in empty states. */
  size?: number
  /** 2.2 by default; 2.5 for the icon of an active tab. */
  strokeWidth?: number
}

/**
 * A decorative icon, hidden from assistive technology. A button that shows only an icon carries
 * its own accessible name. Colour comes from the surrounding text (`currentColor`).
 */
export function Icon({ name, size = 24, strokeWidth = 2.2 }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      width={size}
      height={size}
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className="shrink-0"
    >
      {iconShape(name)}
    </svg>
  )
}
