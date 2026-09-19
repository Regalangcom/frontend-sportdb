import { useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import { CardGridSkeleton, EmptyState, ErrorState } from '@/components/common/States'
import { PageHeader } from '@/components/common/PageHeader'
import { LeagueCard } from '@/components/league/LeagueCard'
import { cn } from '@/lib/utils'
import { useAppDispatch, useAppSelector } from '@/store/hooks'
import { fetchLeagues, fetchSports } from '@/store/slices/catalogSlice'

const DEFAULT_SPORT = 'Soccer'

export function HomePage() {
  const dispatch = useAppDispatch()
  const [params, setParams] = useSearchParams()
  const sport = params.get('sport') ?? DEFAULT_SPORT

  const sports = useAppSelector((s) => s.catalog.sports)
  const leagues = useAppSelector((s) => s.catalog.leagues[sport])

  useEffect(() => {
    dispatch(fetchSports())
  }, [dispatch])

  useEffect(() => {
    dispatch(fetchLeagues(sport))
  }, [dispatch, sport])

  return (
    <>
      <PageHeader title="Leagues" subtitle="Pick a sport, then choose a league to browse its teams." />

      <div className="mb-6 flex flex-wrap gap-2">
        {sports.status === 'loading' && !sports.data && (
          <div className="h-9 w-64 animate-pulse rounded-lg bg-card" />
        )}
        {sports.data?.map((s) => (
          <button
            key={s.strSport}
            type="button"
            onClick={() => setParams({ sport: s.strSport })}
            className={cn(
              'rounded-full border px-4 py-1.5 text-sm font-medium transition',
              s.strSport === sport
                ? 'border-primary bg-primary text-primary-foreground'
                : 'border-border bg-card text-muted-foreground hover:text-foreground',
            )}
          >
            {s.strSport}
          </button>
        ))}
      </div>

      {(!leagues || leagues.status === 'idle' || leagues.status === 'loading') && <CardGridSkeleton />}
      {leagues?.status === 'failed' && (
        <ErrorState message={leagues.error ?? 'Could not load leagues.'} onRetry={() => dispatch(fetchLeagues(sport))} />
      )}
      {leagues?.status === 'succeeded' &&
        (leagues.data?.length ? (
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
            {leagues.data.map((l) => (
              <LeagueCard key={l.idLeague} league={l} />
            ))}
          </div>
        ) : (
          <EmptyState title={`No leagues found for ${sport}`} />
        ))}
    </>
  )
}
