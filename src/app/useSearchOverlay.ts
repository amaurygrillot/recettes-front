import { createContext, use } from 'react'

export interface SearchOverlayRequest {
  /** What takes the focus: the text field (the keyboard comes up), or, from a « Filtres » button, the filters. */
  focus?: 'text' | 'filters'
  /** A printable key typed on a field that is not the search's own: it is written at the end of the text. */
  typed?: string
}

export type OpenSearch = (request?: SearchOverlayRequest) => void

/** The app provides the opener; outside it (a screen under test) opening the search does nothing. */
export const SearchOverlayContext = createContext<OpenSearch>(() => undefined)

/**
 * Opens the search over the page. The app owns the one overlay, so every entry point (the home page's field,
 * the bar's, the « Rechercher » tab, the results page's « Filtres ») only asks.
 */
export function useSearchOverlay(): OpenSearch {
  return use(SearchOverlayContext)
}
