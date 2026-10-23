import { useEffect } from 'react'
import { useRouteError } from 'react-router'
import { Button } from '../components/Button/Button'
import { ErrorState } from '../components/ErrorState/ErrorState'
import { LinkButton } from '../components/LinkButton/LinkButton'
import { logger } from '../lib/logger'
import { paths } from './paths'
import { strings } from './strings'

const { routeError } = strings

/** The error boundary of a route: one screen failing never blanks the app. */
export function RouteError() {
  const error = useRouteError()

  useEffect(() => {
    logger.error('A page failed to render', {
      message: error instanceof Error ? error.message : 'Unknown error',
    })
  }, [error])

  return (
    <main className="mx-auto flex max-w-reading flex-col gap-4 px-4 py-12">
      <ErrorState title={routeError.title} description={routeError.description}>
        <Button
          icon="refresh"
          onClick={() => {
            window.location.reload()
          }}
        >
          {routeError.retry}
        </Button>
        <LinkButton to={paths.home} variant="quiet" size="medium">
          {routeError.backHome}
        </LinkButton>
      </ErrorState>
    </main>
  )
}
