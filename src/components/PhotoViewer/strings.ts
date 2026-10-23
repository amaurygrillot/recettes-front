export const strings = {
  close: 'Fermer la photo',
  previous: 'Photo précédente',
  next: 'Photo suivante',
  title: (position: number, total: number) => `Photo ${position} sur ${total}`,
} as const
