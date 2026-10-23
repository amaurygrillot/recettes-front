import { useCategories } from '../../api/referenceData'
import { mainCategoriesOf, type MainCategory } from './mainCategories'

export type MainCategories = { status: 'loading' } | { status: 'ready'; categories: MainCategory[] }

/**
 * The shortcuts under the search field. They are a convenience, never a gate: if they cannot be
 * loaded the page still shows its feed, so a failure reads as « no shortcuts », not as an error.
 */
export function useMainCategories(): MainCategories {
  const { data, isPending } = useCategories()
  if (isPending) return { status: 'loading' }
  return { status: 'ready', categories: mainCategoriesOf(data ?? []) }
}
