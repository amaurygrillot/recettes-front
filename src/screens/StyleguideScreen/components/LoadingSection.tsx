import { LoadingRegion } from '../../../components/LoadingRegion/LoadingRegion'
import { Skeleton } from '../../../components/Skeleton/Skeleton'
import { strings } from '../strings'
import { StyleguideSection } from './StyleguideSection'
import { StyleguideSpecimen } from './StyleguideSpecimen'

const { loading } = strings

/** The skeletons keep the footprint of the content they stand for, so nothing moves when it arrives. */
export function LoadingSection() {
  return (
    <StyleguideSection title={loading.title}>
      <LoadingRegion label={loading.announcedAs} delayMs={0}>
        <div className="grid items-start gap-8 tablet:grid-cols-2">
          <StyleguideSpecimen label={loading.recipeCard}>
            <div className="overflow-hidden rounded-xl border-2 border-paper-300 bg-paper-50">
              <Skeleton className="aspect-4/3" />
              <div className="flex flex-col gap-3 px-5 pt-4 pb-5">
                <div className="flex gap-2">
                  <Skeleton className="h-8 w-16 rounded-pill" />
                  <Skeleton className="h-8 w-23 rounded-pill" />
                </div>
                <Skeleton className="h-6 w-11/12 rounded-s" />
                <Skeleton className="h-6 w-2/3 rounded-s" />
                <Skeleton className="h-4.5 w-1/2 rounded-s" />
              </div>
            </div>
          </StyleguideSpecimen>
          <div className="flex flex-col gap-8">
            <StyleguideSpecimen label={loading.chips}>
              <div className="flex gap-3">
                <Skeleton className="h-13 w-24 rounded-pill border-2 border-paper-300" />
                <Skeleton className="h-13 w-31 rounded-pill border-2 border-paper-300" />
                <Skeleton className="h-13 w-22 rounded-pill border-2 border-paper-300" />
              </div>
            </StyleguideSpecimen>
            <StyleguideSpecimen label={loading.compactCard}>
              <div className="flex min-h-32 items-center gap-3.5 rounded-frame border-2 border-paper-300 bg-paper-50 p-3">
                <Skeleton className="size-24 shrink-0 rounded-m" />
                <div className="flex flex-1 flex-col gap-2.5">
                  <Skeleton className="h-5.5 w-4/5 rounded-s" />
                  <Skeleton className="h-4 w-1/2 rounded-s" />
                </div>
              </div>
            </StyleguideSpecimen>
          </div>
        </div>
      </LoadingRegion>
    </StyleguideSection>
  )
}
