import { Icon } from '../../../../components/Icon/Icon'
import type { Problem } from '../../problems'
import { summaryText } from '../../problems'

export interface ProblemSummaryProps {
  problems: readonly Problem[]
  /** A link of the summary was pressed: go to that part of the form. */
  onGoTo: (problem: Problem) => void
}

/**
 * What stops the recipe from being saved, said once at the top and announced (« Il manque 2 choses :
 * une catégorie, une étape. »), with a link of 44 px for each. Under each field the defect is said
 * too: never one without the other.
 */
export function ProblemSummary({ problems, onGoTo }: ProblemSummaryProps) {
  return (
    <div
      role="alert"
      className="flex flex-col gap-2 border-b-2 border-brick bg-brick-bg px-4 py-3 text-brick desktop:px-16"
    >
      <p className="flex items-start gap-2 text-body font-bold">
        <Icon name="alert" size={24} strokeWidth={2.4} />
        {summaryText(problems)}
      </p>
      <ul className="flex flex-wrap gap-x-4">
        {problems.map((problem) => (
          <li key={problem.label}>
            <button
              type="button"
              onClick={() => {
                onGoTo(problem)
              }}
              className="min-h-11 cursor-pointer text-body font-bold underline decoration-2 underline-offset-4"
            >
              {problem.link}
            </button>
          </li>
        ))}
      </ul>
    </div>
  )
}
