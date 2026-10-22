/** Maps a text to an index in `[0, length)`: the same text always gives the same index. */
export function stableIndex(seed: string, length: number): number {
  let hash = 0
  for (const character of seed) {
    hash = (hash * 31 + (character.codePointAt(0) ?? 0)) >>> 0
  }
  return hash % length
}
