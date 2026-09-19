import type { Match } from '@/types/api'

export interface MatchView {
  key: string
  title: string
  homeScore: string | null
  awayScore: string | null
  league: string | null
  timeLabel: string
}

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

/**
 * `match_time_wib` is already Indonesian time ("2026-01-01 19:00:00", no zone marker).
 * It is formatted by string only: passing it to `new Date()` would shift it to the browser timezone.
 */
export function formatWib(value?: string | null): string {
  if (!value) return 'TBA'
  const m = value.match(/^(\d{4})-(\d{2})-(\d{2})(?:[ T](\d{2}):(\d{2}))?/)
  if (!m) return value
  const [, y, mo, d, hh, mm] = m
  const date = `${Number(d)} ${MONTHS[Number(mo) - 1] ?? mo} ${y}`
  return hh ? `${date}, ${hh}:${mm} WIB` : date
}

export function toMatchView(m: Match, index: number): MatchView {
  return {
    key: m.id ?? String(index),
    title: m.event ?? `${m.home_team ?? '?'} vs ${m.away_team ?? '?'}`,
    homeScore: m.home_score,
    awayScore: m.away_score,
    league: m.league,
    timeLabel: formatWib(m.match_time_wib),
  }
}
