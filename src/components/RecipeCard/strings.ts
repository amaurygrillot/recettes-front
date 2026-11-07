export const strings = {
  byline: (author: string, when: string | undefined) =>
    when === undefined ? `Par ${author}` : `Par ${author} · ${when}`,
  // « +2 » is all the eye needs; assistive technology gets the sentence.
  moreTags: (count: number) => `+${count}`,
  moreTagsSpoken: (count: number) => `et ${count} ${count < 2 ? 'autre tag' : 'autres tags'}`,
  // A recipe with several photos is a small slider.
  counter: (position: number, total: number) => `${position} / ${total}`,
  photoShown: (position: number, total: number) => `Photo ${position} sur ${total}`,
  previousPhoto: 'Photo précédente',
  nextPhoto: 'Photo suivante',
} as const
