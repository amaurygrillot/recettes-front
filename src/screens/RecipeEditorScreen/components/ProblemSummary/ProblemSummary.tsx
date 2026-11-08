import { Icon } from '../../../../components/Icon/Icon'
import { IconButton } from '../../../../components/IconButton/IconButton'
import type { Problem } from '../../problems'
import { summaryText } from '../../problems'
import { strings } from '../../strings'

export interface ProblemSummaryProps {
  problems: readonly Problem[]
  /** A link of the summary was pressed: go to that part of the form. */
  onGoTo: (problem: Problem) => void
  /** The cross: put the summary away (the fields keep saying what is wrong). */
  onClose: () => void
}

/**
 * What stops the recipe from being saved, said once at the top and announced (« Il manque 2 choses :
 * une catégorie, une étape. »), with a link of 44 px for each. Under each field the defect is said
 * too: never one without the other. It is fixed with the top bar, so it is a box of limited height that
 * scrolls (with the keyboard up it must not leave the page nothing to show), and a cross puts it away.
 */
export function ProblemSummary({ problems, onGoTo, onClose }: ProblemSummaryProps) {
  return (
    <div className="flex items-start gap-1 border-b-2 border-brick bg-brick-bg pr-1 pl-4 text-brick desktop:pr-14 desktop:pl-16">
      <div
        role="alert"
        className="flex max-h-28 min-w-0 flex-1 flex-col gap-2 overflow-y-auto py-3"
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
      <IconButton
        label={strings.summary.close}
        icon="close"
        variant="bare"
        size="medium"
        onClick={onClose}
      />
    </div>
  )
}
