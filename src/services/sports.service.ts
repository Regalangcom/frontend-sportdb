import type { League, Match, Sport, StandingRow, Team } from '@/types/api'
import { request } from './http'

export const sportsService = {
  sports: () => request<Sport[]>('/sports'),
  leagues: (sport?: string) => request<League[]>('/leagues', { query: { sport } }),
  leagueTeams: (leagueId: string) => request<Team[]>(`/leagues/${leagueId}/teams`),
  leagueTable: (leagueId: string, season?: string) =>
    request<StandingRow[]>(`/leagues/${leagueId}/table`, { query: { season } }),
  team: (teamId: string) => request<Team | Team[]>(`/teams/${teamId}`),
  previousMatches: (teamId: string) => request<Match[]>(`/teams/${teamId}/previous-matches`),
}
