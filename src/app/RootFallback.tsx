import { LoadingRegion } from '../components/LoadingRegion/LoadingRegion'
import { strings } from './strings'

/** Shown while the router decides the first page (its loaders, a lazy screen): nothing but the announcement. */
export function RootFallback() {
  return <LoadingRegion label={strings.loading}>{null}</LoadingRegion>
}
