import { strings } from './strings'

/** Stands in for the home screen until it is built (M5). */
export function HomePlaceholder() {
  return (
    <main className="mx-auto max-w-content px-4 py-12">
      <h1 className="font-title text-poster">{strings.appName}</h1>
    </main>
  )
}
