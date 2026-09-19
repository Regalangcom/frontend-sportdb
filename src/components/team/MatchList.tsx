import { toMatchView } from '@/lib/match'
import type { Match } from '@/types/api'

export function MatchList({ matches }: { matches: Match[] }) {
  return (
    <ul className="divide-y divide-border rounded-xl border border-border bg-card">
      {matches.map(toMatchView).map((m) => (
        <li key={m.key} className="flex flex-wrap items-center justify-between gap-2 px-4 py-3">
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold">{m.title}</p>
            {m.league && <p className="truncate text-xs text-muted-foreground">{m.league}</p>}
          </div>
          <div className="flex items-center gap-4 text-right">
            {m.homeScore !== null && m.awayScore !== null && (
              <span className="rounded-md bg-secondary px-2 py-1 text-sm font-bold tabular-nums">
                {m.homeScore} - {m.awayScore}
              </span>
            )}
            <time className="text-xs text-muted-foreground">{m.timeLabel}</time>
          </div>
        </li>
      ))}
    </ul>
  )
}
