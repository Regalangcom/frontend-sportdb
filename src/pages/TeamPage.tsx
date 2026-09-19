import { useEffect } from 'react'
import { ArrowLeft, MapPin } from 'lucide-react'
import { Link, useParams } from 'react-router-dom'
import { BadgeImage } from '@/components/common/BadgeImage'
import { BlockSkeleton, EmptyState, ErrorState } from '@/components/common/States'
import { FavoriteButton } from '@/components/team/FavoriteButton'
import { MatchList } from '@/components/team/MatchList'
import { StandingsTable } from '@/components/team/StandingsTable'
import { useAppDispatch, useAppSelector } from '@/store/hooks'
import {
  fetchLeagueTable,
  fetchPreviousMatches,
  fetchTeam,
  tableKey,
} from '@/store/slices/catalogSlice'

export function TeamPage() {
  const { teamId = '' } = useParams()
  const dispatch = useAppDispatch()

  const team = useAppSelector((s) => s.catalog.teams[teamId])
  const matches = useAppSelector((s) => s.catalog.matches[teamId])
  const leagueId = team?.data?.idLeague ?? ''
  const table = useAppSelector((s) => s.catalog.tables[tableKey(leagueId)])

  useEffect(() => {
    dispatch(fetchTeam(teamId))
    dispatch(fetchPreviousMatches(teamId))
  }, [dispatch, teamId])

  // The standings need the league id, which only comes from the team details.
  useEffect(() => {
    if (leagueId) dispatch(fetchLeagueTable({ leagueId }))
  }, [dispatch, leagueId])

  const t = team?.data

  return (
    <>
      <Link to="/" className="mb-4 inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground">
        <ArrowLeft className="size-4" /> Leagues
      </Link>

      {(!team || team.status === 'idle' || team.status === 'loading') && <BlockSkeleton className="h-48" />}
      {team?.status === 'failed' && (
        <ErrorState
          message={team.errorStatus === 404 ? 'Team not found.' : (team.error ?? 'Could not load team.')}
          onRetry={team.errorStatus === 404 ? undefined : () => dispatch(fetchTeam(teamId))}
        />
      )}

      {t && (
        <>
          <section className="flex flex-col gap-6 rounded-2xl border border-border bg-card p-6 sm:flex-row sm:items-start">
            <BadgeImage src={t.strBadge} alt={t.strTeam} className="size-28 shrink-0 self-center sm:self-start" />
            <div className="min-w-0 flex-1 space-y-3">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <h1 className="text-2xl font-bold sm:text-3xl">{t.strTeam}</h1>
                  <p className="text-sm text-muted-foreground">
                    {[t.strLeague, t.strCountry].filter(Boolean).join(' · ')}
                  </p>
                </div>
                <FavoriteButton team={t} />
              </div>
              {(t.strStadium || t.intFormedYear) && (
                <p className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-muted-foreground">
                  {t.strStadium && (
                    <span className="inline-flex items-center gap-1">
                      <MapPin className="size-4" /> {t.strStadium}
                    </span>
                  )}
                  {t.intFormedYear && <span>Founded {t.intFormedYear}</span>}
                </p>
              )}
              {t.strDescriptionEN && (
                <p className="line-clamp-6 text-sm leading-relaxed text-muted-foreground">{t.strDescriptionEN}</p>
              )}
            </div>
          </section>

          <section className="mt-10" aria-labelledby="matches-heading">
            <h2 id="matches-heading" className="mb-1 text-lg font-semibold">Previous matches</h2>
            <p className="mb-3 text-xs text-muted-foreground">Times in WIB (Western Indonesia Time)</p>
            {(!matches || matches.status === 'idle' || matches.status === 'loading') && <BlockSkeleton />}
            {matches?.status === 'failed' && (
              <ErrorState message={matches.error ?? 'Could not load matches.'} onRetry={() => dispatch(fetchPreviousMatches(teamId))} />
            )}
            {matches?.status === 'succeeded' &&
              (matches.data?.length ? <MatchList matches={matches.data} /> : <EmptyState title="No previous matches" />)}
          </section>

          <section className="mt-10" aria-labelledby="standings-heading">
            <h2 id="standings-heading" className="mb-3 text-lg font-semibold">
              {t.strLeague ? `${t.strLeague} standings` : 'Standings'}
            </h2>
            {!leagueId && <EmptyState title="No league information for this team" />}
            {leagueId && (!table || table.status === 'idle' || table.status === 'loading') && <BlockSkeleton className="h-64" />}
            {table?.status === 'failed' && <ErrorState message={table.error ?? 'Could not load standings.'} />}
            {table?.status === 'succeeded' &&
              (table.data?.length ? (
                <StandingsTable rows={table.data} highlightTeamId={teamId} />
              ) : (
                <EmptyState title="No standings available">Standings only exist for featured soccer leagues.</EmptyState>
              ))}
          </section>
        </>
      )}
    </>
  )
}
