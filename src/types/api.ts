export interface ApiEnvelope<T> {
  success: boolean
  message: string
  data: T
}

export type FieldErrors = Record<string, string[]>

export interface User {
  id: number
  name: string
  email: string
  email_verified_at?: string | null
  created_at?: string
  updated_at?: string
}

/** Login/register: the token itself arrives as an HttpOnly cookie, not in the body. */
export interface AuthPayload {
  user: User
}

export interface Sport {
  idSport?: string
  strSport: string
  strSportThumb?: string | null
  strSportIconGreen?: string | null
  strSportDescription?: string | null
}

export interface League {
  idLeague: string
  strLeague: string
  strSport: string
  strLeagueAlternate?: string | null
  strBadge?: string | null
}

export interface Team {
  idTeam: string
  strTeam: string
  strBadge?: string | null
  strLeague?: string | null
  idLeague?: string | null
  strStadium?: string | null
  strCountry?: string | null
  intFormedYear?: string | null
  strDescriptionEN?: string | null
  strBanner?: string | null
  strWebsite?: string | null
}

export interface Match {
  id: string | null
  event: string | null
  league: string | null
  home_team: string | null
  away_team: string | null
  home_score: string | null
  away_score: string | null
  /** Already Asia/Jakarta, e.g. "2026-01-01 19:00:00", no timezone suffix. */
  match_time_wib: string | null
  venue: string | null
}

export interface StandingRow {
  idStanding?: string
  intRank: string
  idTeam: string
  strTeam: string
  strBadge?: string | null
  strSeason?: string
  strForm?: string | null
  intPlayed?: string
  intWin?: string
  intDraw?: string
  intLoss?: string
  intGoalsFor?: string
  intGoalsAgainst?: string
  intGoalDifference?: string
  intPoints?: string
}

export interface Favorite {
  id: number
  team_id: string
  team_name: string
  team_badge?: string | null
  created_at?: string
}

export interface AddFavoritePayload {
  team_id: string
  team_name: string
  team_badge?: string | null
}
