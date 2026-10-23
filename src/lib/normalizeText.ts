/**
 * The text as it is compared when searching: lower case and without accents, so « ete » finds
 * « Été » and « CREME » finds « crème ».
 */
export function normalizeText(text: string): string {
  return text.normalize('NFD').replace(/\p{M}/gu, '').toLowerCase()
}

/**
 * Where, in `candidate`, a word starts with `typed` (the whole of what was typed, accents and case
 * ignored): « pom » finds the start of « Pommes de terre » and of « Tarte aux pommes », not of
 * « Compote ». The length is that of what was typed, since accents do not change how many
 * letters there are.
 */
export function findWordStart(
  candidate: string,
  typed: string,
): { start: number; length: number } | undefined {
  const wanted = normalizeText(typed).trim()
  if (wanted === '') return undefined
  for (const word of candidate.matchAll(/[\p{L}\p{N}]+/gu)) {
    if (normalizeText(word[0]).startsWith(wanted))
      return { start: word.index, length: wanted.length }
  }
  return undefined
}

/** Whether `candidate` has a word that starts with `typed`. */
export function startsAWord(candidate: string, typed: string): boolean {
  return findWordStart(candidate, typed) !== undefined
}
