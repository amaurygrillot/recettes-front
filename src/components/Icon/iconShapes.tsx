import type { ReactElement } from 'react'

/**
 * The icon set of the design system, drawn on a 24 px grid (« Icônes » board, 49 icons). Each
 * entry is the inside of the <svg>: stroke, caps and joins come from Icon. Elements that are
 * filled dots (grip, more, bullets) set their own fill.
 *
 * `heart`, `share`, `clock` and `users` exist in the set but their features do not exist yet.
 */
const ICON_SHAPES = {
  home: (
    <>
      <path d="M4 11.5 L12 4.5 L20 11.5" />
      <path d="M6 10 V19.5 H18 V10" />
      <path d="M10 19.5 V14 H14 V19.5" />
    </>
  ),
  search: (
    <>
      <circle cx="11" cy="11" r="7" />
      <path d="M16.5 16.5 L21 21" />
    </>
  ),
  book: (
    <>
      <path d="M4 5.5 C7 4.5 10 5 12 7 C14 5 17 4.5 20 5.5 V19 C17 18 14 18.5 12 20.5 C10 18.5 7 18 4 19 Z" />
      <path d="M12 7 V20.5" />
    </>
  ),
  user: (
    <>
      <circle cx="12" cy="8.5" r="4" />
      <path d="M4.5 20.5 C5 15.5 19 15.5 19.5 20.5" />
    </>
  ),
  'log-in': (
    <>
      <path d="M14 4.5 H18.5 a1.5 1.5 0 0 1 1.5 1.5 V18 a1.5 1.5 0 0 1 -1.5 1.5 H14" />
      <path d="M4 12 H15" />
      <path d="M11.5 8 L15.5 12 L11.5 16" />
    </>
  ),
  'log-out': (
    <>
      <path d="M10 4.5 H5.5 a1.5 1.5 0 0 0 -1.5 1.5 V18 a1.5 1.5 0 0 0 1.5 1.5 H10" />
      <path d="M9 12 H20" />
      <path d="M16.5 8 L20.5 12 L16.5 16" />
    </>
  ),
  heart: (
    <path d="M12 20 C4 14.5 3 10 3 8.2 A4.6 4.6 0 0 1 12 6.5 A4.6 4.6 0 0 1 21 8.2 C21 10 20 14.5 12 20 Z" />
  ),
  plus: (
    <>
      <path d="M12 5 V19" />
      <path d="M5 12 H19" />
    </>
  ),
  minus: <path d="M5 12 H19" />,
  close: (
    <>
      <path d="M6 6 L18 18" />
      <path d="M18 6 L6 18" />
    </>
  ),
  check: <path d="M5 12.5 L10 17.5 L19 7" />,
  edit: (
    <>
      <path d="M4 20 L4.8 15.6 L16 4.4 a1.6 1.6 0 0 1 2.3 0 L19.6 5.7 a1.6 1.6 0 0 1 0 2.3 L8.4 19.2 Z" />
      <path d="M14 6.5 L17.5 10" />
    </>
  ),
  trash: (
    <>
      <path d="M4 7 H20" />
      <path d="M9 7 V4.5 H15 V7" />
      <path d="M6 7 L7 20 H17 L18 7" />
      <path d="M10 11 V16" />
      <path d="M14 11 V16" />
    </>
  ),
  share: (
    <>
      <path d="M12 15 V4" />
      <path d="M8 8 L12 4 L16 8" />
      <path d="M5 12 V19 H19 V12" />
    </>
  ),
  filter: <path d="M4 5 H20 L14 12.5 V19 L10 17 V12.5 Z" />,
  upload: (
    <>
      <path d="M12 16 V4" />
      <path d="M8 8 L12 4 L16 8" />
      <path d="M4 16 V19 H20 V16" />
    </>
  ),
  refresh: (
    <>
      <path d="M20 12 a8 8 0 1 1 -2.4 -5.7" />
      <path d="M20 4.5 V9 H15.5" />
    </>
  ),
  'chevron-left': <path d="M14.5 6 L8.5 12 L14.5 18" />,
  'chevron-right': <path d="M9.5 6 L15.5 12 L9.5 18" />,
  'chevron-up': <path d="M6 14.5 L12 8.5 L18 14.5" />,
  'chevron-down': <path d="M6 9.5 L12 15.5 L18 9.5" />,
  warning: (
    <>
      <path d="M12 4 L21 19.5 H3 Z" />
      <path d="M12 10 V14" />
      <path d="M12 17 V17.1" />
    </>
  ),
  alert: (
    <>
      <circle cx="12" cy="12" r="9.5" />
      <path d="M12 7 V13" />
      <path d="M12 16.6 V16.7" />
    </>
  ),
  'check-circle': (
    <>
      <circle cx="12" cy="12" r="9.5" />
      <path d="M7.5 12.5 L10.5 15.5 L16.5 9" />
    </>
  ),
  info: (
    <>
      <circle cx="12" cy="12" r="9.5" />
      <path d="M12 11 V17" />
      <path d="M12 7.4 V7.5" />
    </>
  ),
  clock: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7 V12 L15 14" />
    </>
  ),
  users: (
    <>
      <circle cx="9" cy="8" r="3.5" />
      <path d="M2.5 20 C3 15 15 15 15.5 20" />
      <circle cx="17" cy="9" r="2.5" />
      <path d="M17.5 14 C20 14 21.5 16 21.5 19" />
    </>
  ),
  'chef-hat': (
    <>
      <path d="M7 14 V19 H17 V14" />
      <path d="M7 14 a4 4 0 1 1 1.5 -7.7 a4 4 0 0 1 7 0 A4 4 0 1 1 17 14" />
    </>
  ),
  image: (
    <>
      <rect x="3" y="4" width="18" height="16" rx="3" />
      <circle cx="9" cy="10" r="1.8" />
      <path d="M3.5 17 L9 12.5 L13 16 L16 13 L20.5 17.5" />
    </>
  ),
  camera: (
    <>
      <rect x="3" y="7" width="18" height="13" rx="3" />
      <circle cx="12" cy="13.5" r="3.6" />
      <path d="M8 7 L9.2 4.5 H14.8 L16 7" />
    </>
  ),
  lock: (
    <>
      <rect x="5" y="10.5" width="14" height="10" rx="2.5" />
      <path d="M8 10.5 V8 a4 4 0 0 1 8 0 V10.5" />
      <path d="M12 15 V16.5" />
    </>
  ),
  eye: (
    <>
      <path d="M2.5 12 C5 7 8.5 5.5 12 5.5 C15.5 5.5 19 7 21.5 12 C19 17 15.5 18.5 12 18.5 C8.5 18.5 5 17 2.5 12 Z" />
      <circle cx="12" cy="12" r="3" />
    </>
  ),
  'eye-off': (
    <>
      <path d="M4 4 L20 20" />
      <path d="M9.5 5.9 C10.3 5.6 11.1 5.5 12 5.5 C15.5 5.5 19 7 21.5 12 C20.7 13.6 19.7 14.9 18.6 15.9" />
      <path d="M6.4 8 C4.7 9.2 3.4 10.6 2.5 12 C5 17 8.5 18.5 12 18.5 C13 18.5 14 18.3 14.9 18" />
      <path d="M10 10.2 A3 3 0 0 0 13.8 14" />
    </>
  ),
  grip: (
    <>
      <circle cx="9" cy="6" r="1.4" fill="currentColor" stroke="none" />
      <circle cx="15" cy="6" r="1.4" fill="currentColor" stroke="none" />
      <circle cx="9" cy="12" r="1.4" fill="currentColor" stroke="none" />
      <circle cx="15" cy="12" r="1.4" fill="currentColor" stroke="none" />
      <circle cx="9" cy="18" r="1.4" fill="currentColor" stroke="none" />
      <circle cx="15" cy="18" r="1.4" fill="currentColor" stroke="none" />
    </>
  ),
  grid: (
    <>
      <rect x="4" y="4" width="6.5" height="6.5" rx="1.8" />
      <rect x="13.5" y="4" width="6.5" height="6.5" rx="1.8" />
      <rect x="4" y="13.5" width="6.5" height="6.5" rx="1.8" />
      <rect x="13.5" y="13.5" width="6.5" height="6.5" rx="1.8" />
    </>
  ),
  leaf: (
    <>
      <path d="M5 19 C5 11 11 5 19 5 C19 13 13 19 5 19 Z" />
      <path d="M5 19 L13 11" />
    </>
  ),
  plate: (
    <>
      <circle cx="12" cy="12" r="8.5" />
      <circle cx="12" cy="12" r="4.5" />
    </>
  ),
  cake: (
    <>
      <path d="M3.5 19.5 H20.5 V14 H3.5 Z" />
      <path d="M3.5 14 C6 10 9 12.5 12 10 C15 12.5 18 10 20.5 14" />
      <path d="M12 10 V6.5" />
      <path d="M12 4 V4.1" />
    </>
  ),
  soup: (
    <>
      <path d="M4 11 H20 C20 16 16.5 19.5 12 19.5 C7.5 19.5 4 16 4 11 Z" />
      <path d="M9 8 C8 6.5 10 5.5 9 4" />
      <path d="M12.5 8 C11.5 6.5 13.5 5.5 12.5 4" />
      <path d="M16 8 C15 6.5 17 5.5 16 4" />
    </>
  ),
  bread: (
    <g transform="rotate(-35 12 12)">
      <rect x="2.5" y="8.8" width="19" height="6.4" rx="3.2" />
      <path d="M8 8.8 V11.5" />
      <path d="M12 8.8 V11.5" />
      <path d="M16 8.8 V11.5" />
    </g>
  ),
  more: (
    <>
      <circle cx="5" cy="12" r="1.9" fill="currentColor" stroke="none" />
      <circle cx="12" cy="12" r="1.9" fill="currentColor" stroke="none" />
      <circle cx="19" cy="12" r="1.9" fill="currentColor" stroke="none" />
    </>
  ),
  cutlery: (
    <>
      <path d="M6 4 V9 a2.5 2.5 0 0 0 5 0 V4" />
      <path d="M8.5 11.5 V20" />
      <path d="M16.5 20 V4 C19.5 5.5 19.5 11 16.5 12" />
    </>
  ),
  mail: (
    <>
      <rect x="3" y="5.5" width="18" height="13" rx="3" />
      <path d="M4 7.5 L12 13.5 L20 7.5" />
    </>
  ),
  bold: (
    <>
      <path d="M7 4.5 H13 a3.5 3.5 0 0 1 0 7 H7 Z" />
      <path d="M7 11.5 H14.2 a3.75 3.75 0 0 1 0 7.5 H7 Z" />
    </>
  ),
  italic: (
    <>
      <path d="M10 4.5 H18" />
      <path d="M6 19.5 H14" />
      <path d="M15 4.5 L9 19.5" />
    </>
  ),
  'list-bullet': (
    <>
      <circle cx="5" cy="6.5" r="1.4" fill="currentColor" stroke="none" />
      <circle cx="5" cy="12" r="1.4" fill="currentColor" stroke="none" />
      <circle cx="5" cy="17.5" r="1.4" fill="currentColor" stroke="none" />
      <path d="M10 6.5 H20" />
      <path d="M10 12 H20" />
      <path d="M10 17.5 H20" />
    </>
  ),
  'list-number': (
    <>
      <path d="M3.8 5.2 L5.2 4.2 V8.8" />
      <path d="M3.8 11 a1.4 1.4 0 0 1 2.8 0.3 c0 1 -1.3 1.6 -2.8 2.9 H6.8" />
      <path d="M3.8 16.3 H6.6 L5.1 18 a1.3 1.3 0 1 1 -1.3 1.9" />
      <path d="M10 6.5 H20" />
      <path d="M10 12 H20" />
      <path d="M10 17.5 H20" />
    </>
  ),
  undo: (
    <>
      <path d="M5 9 H14.5 a5 5 0 0 1 0 10 H9" />
      <path d="M8.5 5 L4.5 9 L8.5 13" />
    </>
  ),
  redo: (
    <>
      <path d="M19 9 H9.5 a5 5 0 0 0 0 10 H15" />
      <path d="M15.5 5 L19.5 9 L15.5 13" />
    </>
  ),
} satisfies Record<string, ReactElement>

export type IconName = keyof typeof ICON_SHAPES

function isIconName(name: string): name is IconName {
  return Object.hasOwn(ICON_SHAPES, name)
}

export const ICON_NAMES: readonly IconName[] = Object.keys(ICON_SHAPES).filter(isIconName)

export function iconShape(name: IconName): ReactElement {
  return ICON_SHAPES[name]
}
