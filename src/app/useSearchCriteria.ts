import { useSearchParams } from 'react-router'
import { criteriaFromParams, criteriaToParams, type SearchCriteria } from './searchCriteria'

/**
 * The criteria of the search in the address bar, and the way to change some of them. A change
 * replaces the history entry instead of adding one, so « back » from a refined search returns to
 * where the reader came from (the home page, a recipe), not through every letter they typed.
 */
export function useSearchCriteria() {
  const [params, setParams] = useSearchParams()

  function update(changes: Partial<SearchCriteria>): void {
    setParams((current) => criteriaToParams({ ...criteriaFromParams(current), ...changes }), {
      replace: true,
    })
  }

  return { criteria: criteriaFromParams(params), update }
}
