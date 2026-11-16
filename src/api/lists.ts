import { useMutation, useQuery, useQueryClient, type QueryClient } from '@tanstack/react-query'
import { logger } from '../lib/logger'
import { useObjectUrl } from '../lib/useObjectUrl'
import { api } from './client'
import { ApiRequestError } from './failure'
import { listCoverKeys, listKeys, type CoverVariant, type ListContentFilters } from './listKeys'
import { multipartFileRequest } from './multipartFile'
import { useRecipePages } from './recipes'
import type { components } from './schema'
import { useSession } from './session'
import { unwrap, unwrapEmpty } from './unwrap'

type Schemas = components['schemas']

export type RecipeList = Schemas['RecipeListResponse']
/** What a list is made of by its owner: the rest (count, photo, mosaic) is the back end's to say. */
export type RecipeListInput = Schemas['RecipeListRequest']

/** The member's lists, sorted by name by the server (50 at most, not paged). */
export function useLists() {
  return useQuery({
    queryKey: listKeys.mine,
    queryFn: ({ signal }) => unwrap(api.GET('/lists', { signal })),
  })
}

/**
 * The same lists, each saying whether it holds the recipe (`containsRecipe`): what « Ajouter à une
 * liste » shows. A recipe that does not exist is a `404`.
 */
export function useListsContaining(recipeId: string, enabled = true) {
  return useQuery({
    enabled,
    queryKey: listKeys.containing(recipeId),
    queryFn: ({ signal }) =>
      unwrap(api.GET('/lists', { params: { query: { containing: recipeId } }, signal })),
  })
}

/** One list. Someone else's list and a list that does not exist are both a `404`. */
export function useList(id: string) {
  return useQuery({
    queryKey: listKeys.detail(id),
    queryFn: ({ signal }) => unwrap(api.GET('/lists/{id}', { params: { path: { id } }, signal })),
  })
}

/**
 * The recipes of a list, read through the recipe search (`listId`) so that its sort, its search and
 * its pages are the library's own. Newest added first unless asked otherwise.
 */
export function useListRecipes(listId: string, filters: ListContentFilters, enabled = true) {
  return useRecipePages(listKeys.content(listId, filters), { ...filters, listId }, enabled)
}

/** Marks everything about the lists stale: counts, mosaics, contents and « déjà dans cette liste ». */
export function invalidateLists(queryClient: QueryClient): void {
  void queryClient.invalidateQueries({ queryKey: listKeys.all })
}

/** A list the back end just answered is the freshest copy of itself, and the lists around it are stale. */
function cacheSavedList(queryClient: QueryClient, list: RecipeList): void {
  queryClient.setQueryData(listKeys.detail(list.id), list)
  invalidateLists(queryClient)
}

export function useCreateList() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (list: RecipeListInput) => unwrap(api.POST('/lists', { body: list })),
    onSuccess: (list) => {
      logger.info('A list was created')
      cacheSavedList(queryClient, list)
    },
  })
}

export interface RecipeListUpdate {
  id: string
  /** Both fields are required: a rename that keeps the emoji sends it again. */
  changes: RecipeListInput
}

export function useUpdateList() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, changes }: RecipeListUpdate) =>
      unwrap(api.PUT('/lists/{id}', { params: { path: { id } }, body: changes })),
    onSuccess: (list) => {
      logger.info('A list was changed')
      cacheSavedList(queryClient, list)
    },
  })
}

/** Deletes the list and its photo, never the recipes it held. */
export function useDeleteList() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: string) =>
      unwrapEmpty(api.DELETE('/lists/{id}', { params: { path: { id } } })),
    onSuccess: (_nothing, id) => {
      logger.info('A list was deleted')
      queryClient.removeQueries({ queryKey: listKeys.detail(id) })
      queryClient.removeQueries({ queryKey: listKeys.contentOf(id) })
      queryClient.removeQueries({ queryKey: listCoverKeys.of(id) })
      invalidateLists(queryClient)
    },
  })
}

export interface ListEntry {
  listId: string
  recipeId: string
}

/**
 * Puts a recipe in a list; asking again changes nothing. A list of 200 recipes refuses another with a
 * `409` (`recipe-list-full`), a recipe that was deleted answers `404`.
 */
export function useAddRecipeToList() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ listId, recipeId }: ListEntry) =>
      unwrapEmpty(
        api.PUT('/lists/{id}/recipes/{recipeId}', { params: { path: { id: listId, recipeId } } }),
      ),
    onSuccess: () => {
      logger.info('A recipe was added to a list')
      invalidateLists(queryClient)
    },
  })
}

/** Takes a recipe out of a list; the recipe not being there is a success too. */
export function useRemoveRecipeFromList() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ listId, recipeId }: ListEntry) =>
      unwrapEmpty(
        api.DELETE('/lists/{id}/recipes/{recipeId}', {
          params: { path: { id: listId, recipeId } },
        }),
      ),
    onSuccess: () => {
      logger.info('A recipe was removed from a list')
      invalidateLists(queryClient)
    },
  })
}

export interface ListCoverUpload {
  listId: string
  file: File
  /** Ends the request when the person gives the photo up (the server may already have the file: read the list again). */
  signal?: AbortSignal
}

export function uploadListCover({ listId, file, signal }: ListCoverUpload) {
  logger.info('Uploading the photo of a list', { sizeBytes: file.size })
  return unwrap(
    api.PUT('/lists/{id}/cover', {
      params: { path: { id: listId } },
      ...(signal === undefined ? {} : { signal }),
      ...multipartFileRequest(file),
    }),
  )
}

/**
 * Sets or replaces the photo of a list, answered with the updated list. Fails with `payload-too-large`
 * (413), `invalid-request` (400: not a JPEG or PNG, unreadable, too big in pixels), `rate-limited` (429)
 * and `unavailable` (503), the last two with a delay from the server.
 */
export function useSetListCover() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: uploadListCover,
    onSuccess: (list) => {
      logger.info('The photo of a list was saved')
      cacheSavedList(queryClient, list)
    },
  })
}

/** Removes the photo of a list, answered with the updated list; a list with no photo is a success too. */
export function useRemoveListCover() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (listId: string) =>
      unwrap(api.DELETE('/lists/{id}/cover', { params: { path: { id: listId } } })),
    onSuccess: (list) => {
      logger.info('The photo of a list was removed')
      cacheSavedList(queryClient, list)
    },
  })
}

/** The query of `GET /lists/{id}/cover` in the one order the browser caches by: `v` first, then the variant. */
function coverQuery(version: string, variant: CoverVariant) {
  return variant === 'thumbnail' ? { v: version, variant } : { v: version }
}

/**
 * A `404` for the version of a photo means the list changed since it was read. The list is read again
 * (once) so that whoever shows it learns the new version; if the list still points at this very
 * version, the photo is missing on the server and is shown as absent, never asked for again.
 */
async function photoMissing(
  queryClient: QueryClient,
  listId: string,
  version: string,
): Promise<null> {
  try {
    const list = await queryClient.query({
      queryKey: listKeys.detail(listId),
      queryFn: ({ signal }) =>
        unwrap(api.GET('/lists/{id}', { params: { path: { id: listId } }, signal })),
      staleTime: 0,
    })
    void queryClient.invalidateQueries({ queryKey: listKeys.mine })
    if (list.coverVersion === version) {
      logger.warn('The photo of a list answers 404 for its current version: shown without it')
    }
  } catch (error) {
    // The list itself is gone or unreachable: the photo is absent either way.
    logger.info('A missing photo could not be explained by its list', {
      reason: error instanceof ApiRequestError ? error.failure.kind : 'unknown',
    })
  }
  return null
}

/**
 * The photo of a list, ready for an `<img src>`, or nothing (the list has none, it is not there yet,
 * it is missing, or the session is over: a private photo is never shown without a member). It is
 * fetched with the token (an `<img>` cannot carry it) and shown from an object URL that is revoked
 * as soon as nothing shows it. Revalidation is left to the browser's own cache: no conditional
 * header is ever set here.
 */
export function useListCover(
  list: Pick<RecipeList, 'id' | 'coverVersion'>,
  variant: CoverVariant,
): string | undefined {
  const queryClient = useQueryClient()
  const isMember = useSession().status === 'member'
  const version = list.coverVersion
  const { data } = useQuery({
    enabled: isMember && version !== null,
    queryKey: listCoverKeys.one(list.id, version ?? '', variant),
    // A version never changes behind its id, so what was fetched stays right.
    staleTime: Infinity,
    queryFn: async ({ signal }) => {
      if (version === null) return null
      try {
        return await unwrap(
          api.GET('/lists/{id}/cover', {
            params: { path: { id: list.id }, query: coverQuery(version, variant) },
            parseAs: 'blob',
            signal,
          }),
        )
      } catch (error) {
        if (error instanceof ApiRequestError && error.failure.kind === 'not-found') {
          return await photoMissing(queryClient, list.id, version)
        }
        throw error
      }
    },
  })
  return useObjectUrl(isMember ? data : undefined)
}
