import type { Match } from '@/types/api'

export interface MatchView {
  key: string
  title: string
  home: string
  away: string
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

const pick = (m: Match, keys: string[]): string | null => {
  for (const k of keys) {
    const v = m[k]
    if (v !== undefined && v !== null && v !== '') return String(v)
  }
  return null
}

/** The match payload is loosely typed, so accept both TheSportsDB and snake_case key styles. */
export function toMatchView(m: Match, index: number): MatchView {
  const home = pick(m, ['strHomeTeam', 'home_team', 'home_team_name', 'home']) ?? ''
  const away = pick(m, ['strAwayTeam', 'away_team', 'away_team_name', 'away']) ?? ''
  const title = pick(m, ['strEvent', 'event', 'event_name', 'name', 'title']) ?? `${home} vs ${away}`
  return {
    key: String(m.id ?? pick(m, ['idEvent', 'event_id']) ?? index),
    title,
    home,
    away,
    homeScore: pick(m, ['intHomeScore', 'home_score']),
    awayScore: pick(m, ['intAwayScore', 'away_score']),
    league: pick(m, ['strLeague', 'league', 'league_name']),
    timeLabel: formatWib(m.match_time_wib),
  }
}
