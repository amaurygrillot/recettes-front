export const strings = {
  previous: 'Photo précédente',
  next: 'Photo suivante',
  counter: (position: number, total: number) => `${position} / ${total}`,
  photo: (position: number, total: number, shown: boolean) =>
    `Photo ${position} sur ${total}${shown ? ', affichée' : ''}`,
} as const
