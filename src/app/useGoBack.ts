import { useLocation, useNavigate } from 'react-router'

/**
 * « Back » as the person means it: to the page they came from when there is one in this app (the
 * search, the home page), else to `fallback`, so a recipe opened from a shared link still has a
 * way back instead of leaving the site.
 */
export function useGoBack(fallback: string): () => void {
  const navigate = useNavigate()
  // The first page of a visit has the key « default »: nothing in the app to go back to.
  const cameFromThisApp = useLocation().key !== 'default'

  return () => {
    if (cameFromThisApp) void navigate(-1)
    else void navigate(fallback)
  }
}
