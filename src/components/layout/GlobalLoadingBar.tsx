import { useAppSelector } from '@/store/hooks'
import { selectGlobalLoading } from '@/store/selectors'

/** Thin animated bar shown while any Redux async thunk is in flight. */
export function GlobalLoadingBar() {
  const loading = useAppSelector(selectGlobalLoading)
  if (!loading) return null
  return (
    <div className="fixed inset-x-0 top-0 z-50 h-0.5 overflow-hidden bg-primary/20" role="progressbar" aria-label="Loading">
      <div className="h-full w-1/3 animate-[loadbar_1s_ease-in-out_infinite] bg-primary" />
    </div>
  )
}
