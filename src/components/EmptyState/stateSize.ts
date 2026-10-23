/** `regular` fills a page; `compact` is a block among others (a feed's), with tighter padding. */
export type StateSize = 'regular' | 'compact'

/** The padding and spacing shared by the empty and error blocks, so the two stay in step. */
export const STATE_FRAMES: Record<StateSize, string> = {
  regular: 'gap-3.5 px-6 py-7',
  compact: 'gap-3 px-4.5 py-5',
}
