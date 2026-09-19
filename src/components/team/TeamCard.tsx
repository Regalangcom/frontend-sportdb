import { Link } from 'react-router-dom'
import { BadgeImage } from '@/components/common/BadgeImage'

interface Props {
  teamId: string
  name: string
  badge?: string | null
  /** Slot for an action, e.g. a remove button on the favorites page. */
  action?: React.ReactNode
}

export function TeamCard({ teamId, name, badge, action }: Props) {
  return (
    <div className="relative flex flex-col items-center gap-3 rounded-xl border border-border bg-card p-4 text-center transition hover:border-primary/60">
      <Link to={`/teams/${teamId}`} className="flex flex-col items-center gap-3 after:absolute after:inset-0">
        <BadgeImage src={badge} alt={name} className="size-16" />
        <span className="line-clamp-2 text-sm font-semibold">{name}</span>
      </Link>
      {action && <div className="relative z-10">{action}</div>}
    </div>
  )
}
