import { Link } from 'react-router-dom'
import { BadgeImage } from '@/components/common/BadgeImage'
import { cn } from '@/lib/utils'
import type { StandingRow } from '@/types/api'

export function StandingsTable({ rows, highlightTeamId }: { rows: StandingRow[]; highlightTeamId?: string }) {
  return (
    <div className="overflow-x-auto rounded-xl border border-border bg-card">
      <table className="w-full min-w-[520px] text-sm">
        <thead className="text-xs uppercase text-muted-foreground">
          <tr className="border-b border-border">
            <th className="w-10 px-3 py-2 text-left">#</th>
            <th className="px-3 py-2 text-left">Team</th>
            {['P', 'W', 'D', 'L', 'GF', 'GA', 'GD'].map((h) => (
              <th key={h} className="px-2 py-2 text-center">{h}</th>
            ))}
            <th className="px-3 py-2 text-center">Pts</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((r) => (
            <tr
              key={r.idStanding ?? r.idTeam}
              className={cn(
                'border-b border-border/50 last:border-0',
                r.idTeam === highlightTeamId && 'bg-primary/10',
              )}
            >
              <td className="px-3 py-2 text-muted-foreground">{r.intRank}</td>
              <td className="px-3 py-2">
                <Link to={`/teams/${r.idTeam}`} className="flex items-center gap-2 font-medium hover:text-primary">
                  <BadgeImage src={r.strBadge} alt="" className="size-5" />
                  {r.strTeam}
                </Link>
              </td>
              <td className="px-2 py-2 text-center">{r.intPlayed ?? '-'}</td>
              <td className="px-2 py-2 text-center">{r.intWin ?? '-'}</td>
              <td className="px-2 py-2 text-center">{r.intDraw ?? '-'}</td>
              <td className="px-2 py-2 text-center">{r.intLoss ?? '-'}</td>
              <td className="px-2 py-2 text-center">{r.intGoalsFor ?? '-'}</td>
              <td className="px-2 py-2 text-center">{r.intGoalsAgainst ?? '-'}</td>
              <td className="px-2 py-2 text-center">{r.intGoalDifference ?? '-'}</td>
              <td className="px-3 py-2 text-center font-bold text-primary">{r.intPoints ?? '-'}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
