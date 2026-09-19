import { useEffect } from 'react'
import { Link, useParams } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'
import { BlockSkeleton, CardGridSkeleton, EmptyState, ErrorState } from '@/components/common/States'
import { PageHeader } from '@/components/common/PageHeader'
import { StandingsTable } from '@/components/team/StandingsTable'
import { TeamCard } from '@/components/team/TeamCard'
import { useAppDispatch, useAppSelector } from '@/store/hooks'
import { fetchLeagueTable, fetchLeagueTeams, tableKey } from '@/store/slices/catalogSlice'

export function LeaguePage() {
  const { leagueId = '' } = useParams()
  const dispatch = useAppDispatch()
  const teams = useAppSelector((s) => s.catalog.leagueTeams[leagueId])
  const table = useAppSelector((s) => s.catalog.tables[tableKey(leagueId)])

  useEffect(() => {
    dispatch(fetchLeagueTeams(leagueId))
    dispatch(fetchLeagueTable({ leagueId }))
  }, [dispatch, leagueId])

  const leagueName = teams?.data?.[0]?.strLeague ?? 'League'

  return (
    <>
      <Link to="/" className="mb-4 inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground">
        <ArrowLeft className="size-4" /> All leagues
      </Link>
      <PageHeader title={leagueName} subtitle="Teams and current standings" />

      <section aria-labelledby="teams-heading" className="mb-10">
        <h2 id="teams-heading" className="mb-3 text-lg font-semibold">Teams</h2>
        {(!teams || teams.status === 'idle' || teams.status === 'loading') && <CardGridSkeleton count={8} />}
        {teams?.status === 'failed' && (
          <ErrorState message={teams.error ?? 'Could not load teams.'} onRetry={() => dispatch(fetchLeagueTeams(leagueId))} />
        )}
        {teams?.status === 'succeeded' &&
          (teams.data?.length ? (
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
              {teams.data.map((t) => (
                <TeamCard key={t.idTeam} teamId={t.idTeam} name={t.strTeam} badge={t.strBadge} />
              ))}
            </div>
          ) : (
            <EmptyState title="No teams found in this league" />
          ))}
      </section>

      <section aria-labelledby="table-heading">
        <h2 id="table-heading" className="mb-3 text-lg font-semibold">Standings</h2>
        {(!table || table.status === 'idle' || table.status === 'loading') && <BlockSkeleton className="h-64" />}
        {table?.status === 'failed' && <ErrorState message={table.error ?? 'Could not load standings.'} />}
        {table?.status === 'succeeded' &&
          (table.data?.length ? (
            <StandingsTable rows={table.data} />
          ) : (
            <EmptyState title="No standings available">Standings only exist for featured soccer leagues.</EmptyState>
          ))}
      </section>
    </>
  )
}
