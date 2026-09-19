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
}

export interface AuthPayload {
  user: User
  token: string
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
  id?: string | number
  match_time_wib?: string | null
  [key: string]: unknown
}

export interface StandingRow {
  idStanding?: string
  intRank: string
  idTeam: string
  strTeam: string
  strBadge?: string | null
  intPlayed: string
  intWin: string
  intDraw: string
  intLoss: string
  intGoalsFor: string
  intGoalsAgainst: string
  intGoalDifference: string
  intPoints: string
}

export interface Favorite {
  id: number
  team_id: string
  team_name: string
  team_badge?: string | null
}

export interface AddFavoritePayload {
  team_id: string
  team_name: string
  team_badge?: string | null
}
