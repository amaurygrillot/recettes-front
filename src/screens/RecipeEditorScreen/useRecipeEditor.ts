import { zodResolver } from '@hookform/resolvers/zod'
import { useEffect, useEffectEvent, useState } from 'react'
import { useForm, useWatch } from 'react-hook-form'
import { useNavigate } from 'react-router'
import { useSession } from '../../api/session'
import { paths } from '../../app/paths'
import { useGoBack } from '../../app/useGoBack'
import { useToasts } from '../../app/useToasts'
import { logger } from '../../lib/logger'
import {
  clearDraft,
  draftKey,
  forgetInterrupted,
  markInterrupted,
  readBeginning,
  wasInterrupted,
} from './editorDraft'
import { sameValues, type EditorValues } from './editorModel'
import { editorSchema } from './editorSchema'
import { problemCounts, problemsOf } from './problems'
import { strings } from './strings'
import { useDraftOffer } from './useDraftOffer'
import { useDraftSaving } from './useDraftSaving'
import { useLeaveGuard } from './useLeaveGuard'
import { useSaveRecipe } from './useSaveRecipe'
import { useUploadsOnTheirWay } from './uploadTracker'

export interface RecipeEditorOptions {
  /** The recipe being changed, or nothing for a new one. */
  recipeId: string | undefined
  /** What the form holds before anything is typed: blank, or the recipe as it is stored. */
  initial: EditorValues
}

/**
 * Everything the editor does besides drawing: the form, the draft kept on the device and offered
 * again, the sending, what is missing after a failed « Enregistrer », and the guard against
 * leaving with something unsaved. A lost session is not a loss: the draft is kept at once and
 * taken up again, without asking, when the member is back.
 */
export function useRecipeEditor({ recipeId, initial: given }: RecipeEditorOptions) {
  const storageKey = draftKey(recipeId)
  // What the recipe held when the editor opened: a copy refreshed behind the person's back must not become the reference.
  const [initial] = useState(given)
  const navigate = useNavigate()
  const toasts = useToasts()
  const sessionStatus = useSession().status
  const sessionExpired = sessionStatus === 'expired'
  const goBack = useGoBack(recipeId === undefined ? paths.home : paths.recipe(recipeId))

  const [beginning] = useState(() => readBeginning(storageKey, initial))
  // The sections are drawn again from the values the form was given when this changes.
  const [version, setVersion] = useState(0)
  const [attempted, setAttempted] = useState(false)
  const form = useForm<EditorValues>({
    resolver: zodResolver(editorSchema),
    defaultValues: beginning.values,
  })

  const changed = useWatch({ control: form.control, compute: (all) => !sameValues(all, initial) })
  const missing = useWatch({ control: form.control, compute: problemsOf })
  const countsBySection = useWatch({ control: form.control, compute: problemCounts })

  const saving = useSaveRecipe(recipeId)
  const uploads = useUploadsOnTheirWay()
  const offer = useDraftOffer(beginning.offered, {
    onResume: (values) => {
      logger.info('Taking up the draft of a recipe')
      form.reset(values)
      setVersion((current) => current + 1)
    },
    onStartOver: () => {
      logger.info('Erasing the draft of a recipe')
      clearDraft(storageKey)
      form.reset(initial)
      setAttempted(false)
      setVersion((current) => current + 1)
    },
  })
  const draft = useDraftSaving({
    form,
    storageKey,
    initial,
    // Not while the draft waits for an answer: typing must not replace it before it was chosen.
    enabled: offer.offer === undefined && saving.savedId === undefined,
  })
  const guard = useLeaveGuard(
    // Without a session the way out is the login, and the draft is kept: nothing is left to ask about.
    changed && saving.savedId === undefined && sessionStatus === 'member',
  )

  const announceReturn = useEffectEvent(() => {
    if (!wasInterrupted(storageKey)) return
    forgetInterrupted(storageKey)
    if (beginning.resumed) toasts.success(strings.draft.resumedAfterLogin)
  })
  useEffect(() => {
    announceReturn()
  }, [])

  const keepForTheReturn = useEffectEvent(() => {
    // A draft that waits for its answer is already what is kept: the form must not replace it.
    if (offer.offer !== undefined) return
    logger.info('The session ended with a recipe open: keeping its draft')
    draft.keepNow()
    markInterrupted(storageKey)
  })
  useEffect(() => {
    if (sessionExpired) keepForTheReturn()
  }, [sessionExpired])

  const leaveForRecipe = useEffectEvent((id: string) => {
    draft.discard()
    void navigate(paths.recipe(id), { replace: true })
  })
  useEffect(() => {
    if (saving.savedId !== undefined) leaveForRecipe(saving.savedId)
  }, [saving.savedId])

  const submit = form.handleSubmit(
    (values) => {
      setAttempted(false)
      if (uploads.count > 0) {
        // A picture still on its way would be left out of the recipe without a word.
        toasts.failure({ message: strings.photos.stillSending })
      } else if (!saving.pending) {
        saving.save(values)
      }
    },
    () => {
      logger.info('The recipe cannot be saved yet: something is missing')
      setAttempted(true)
    },
  )

  return {
    form,
    version,
    offer,
    draftState: draft.state,
    /** What is missing, once « Enregistrer » found something, until it is all there. */
    problems: attempted ? missing : [],
    /** The same, counted for each section, for the index. */
    problemCounts: attempted ? countsBySection : {},
    submit,
    uploadTracker: uploads.tracker,
    pending: saving.pending,
    refusal: saving.refusal,
    guard,
    close: goBack,
  }
}
