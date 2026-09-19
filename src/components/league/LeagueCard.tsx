import { Link } from 'react-router-dom'
import { BadgeImage } from '@/components/common/BadgeImage'
import type { League } from '@/types/api'

export function LeagueCard({ league }: { league: League }) {
  return (
    <Link
      to={`/leagues/${league.idLeague}`}
      className="group flex flex-col items-center gap-3 rounded-xl border border-border bg-card p-4 text-center transition hover:-translate-y-0.5 hover:border-primary/60"
    >
      <BadgeImage src={league.strBadge} alt={league.strLeague} className="size-16" />
      <span className="line-clamp-2 text-sm font-semibold group-hover:text-primary">{league.strLeague}</span>
    </Link>
  )
}
