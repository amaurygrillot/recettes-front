/** Joins the class names that are set, skipping the falsy ones (`condition && 'class'`). */
export function classNames(...parts: readonly (string | false | null | undefined)[]): string {
  return parts.filter(Boolean).join(' ')
}
