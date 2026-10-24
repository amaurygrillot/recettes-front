export const strings = {
  close: 'Fermer la photo',
  previous: 'Photo précédente',
  next: 'Photo suivante',
  title: (position: number, total: number) => `Photo ${position} sur ${total}`,
  /** « 2 / 3 », in the pill at the corner. */
  counter: (position: number, total: number) => `${position} / ${total}`,
} as const
