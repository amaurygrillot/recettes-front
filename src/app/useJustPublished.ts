import { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router'
import { isJustPublished } from './justPublished'

/**
 * Whether the page is the one a recipe was just created for. It is read once, and the history entry is cleaned at
 * once, so that going back to this page later (from the editor of another recipe, say) does not celebrate again.
 */
export function useJustPublished(): { celebrating: boolean; dismiss: () => void } {
  const location = useLocation()
  const navigate = useNavigate()
  const [celebrating, setCelebrating] = useState(() => isJustPublished(location.state))

  useEffect(() => {
    if (isJustPublished(location.state)) void navigate(location.pathname, { replace: true })
  }, [location.state, location.pathname, navigate])

  return {
    celebrating,
    dismiss: () => {
      setCelebrating(false)
    },
  }
}
