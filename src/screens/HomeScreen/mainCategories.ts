import type { components } from '../../api/schema'
import type { IconName } from '../../components/Icon/iconShapes'

export interface MainCategory {
  id: string
  name: string
  icon: IconName
}

// The icons the design draws for its five usual categories; the match is on the name's first word,
// without accents or case, so « Entrées », « entree » and « Desserts de fête » all find theirs.
const ICON_BY_FIRST_WORD: ReadonlyMap<string, IconName> = new Map([
  ['entree', 'leaf'],
  ['entrees', 'leaf'],
  ['plat', 'plate'],
  ['plats', 'plate'],
  ['dessert', 'cake'],
  ['desserts', 'cake'],
  ['soupe', 'soup'],
  ['soupes', 'soup'],
  ['pain', 'bread'],
  ['pains', 'bread'],
])
const FALLBACK_ICON: IconName = 'cutlery'

export function categoryIcon(name: string): IconName {
  const firstWord = name
    .normalize('NFD')
    .replace(/\p{M}/gu, '')
    .toLowerCase()
    .split(/[^a-z]+/)
    .find(Boolean)
  if (firstWord === undefined) return FALLBACK_ICON
  return ICON_BY_FIRST_WORD.get(firstWord) ?? FALLBACK_ICON
}

/** The categories a recipe is filed under first (« Entrées », « Plats »), as the home page's shortcuts. */
export function mainCategoriesOf(
  categories: readonly components['schemas']['CategoryResponse'][],
): MainCategory[] {
  return categories.flatMap(({ id, name, categoryType }) =>
    categoryType === 'MAIN' && id && name ? [{ id, name, icon: categoryIcon(name) }] : [],
  )
}
