// On a phone the row scrolls sideways and bleeds to the screen's edges, the last tile cut off to
// show that there is more; from a tablet up everything wraps and fits. A scrolling box clips what
// overflows it, and the focus ring and the shadow extend 6 px beyond a tile: the top padding is
// grown by 4 px and pulled back by the same margin, so the ring shows and the layout is the design's.
export const TILE_ROW =
  'scrollbar-hidden -mx-4 -mt-1 flex gap-3 overflow-x-auto px-4 pt-1.5 pb-2 tablet:mx-0 tablet:mt-0 tablet:flex-wrap tablet:overflow-visible tablet:px-0.5 tablet:pt-0.5'
