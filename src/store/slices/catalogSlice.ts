import {
  createAsyncThunk,
  createSlice,
  type ActionReducerMapBuilder,
  type AsyncThunk,
} from '@reduxjs/toolkit'
import { sportsService } from '@/services/sports.service'
import type { League, Match, Sport, StandingRow, Team } from '@/types/api'
import { toThunkError } from '../thunkError'
import type { Resource, ThunkError } from '../types'

/**
 * Public TheSportsDB data. Each bucket is keyed (by sport / league / team id)
 * and holds a Resource, so pages read loading, error and data independently.
 */
interface CatalogState {
  sports: Resource<Sport[]>
  leagues: Record<string, Resource<League[]>>
  leagueTeams: Record<string, Resource<Team[]>>
  teams: Record<string, Resource<Team>>
  matches: Record<string, Resource<Match[]>>
  tables: Record<string, Resource<StandingRow[]>>
}

const blank = <T>(): Resource<T> => ({ data: null, status: 'idle', error: null, errorStatus: null })

const initialState: CatalogState = {
  sports: blank(),
  leagues: {},
  leagueTeams: {},
  teams: {},
  matches: {},
  tables: {},
}

type Cfg = { state: { catalog: CatalogState }; rejectValue: ThunkError }
type TableArg = { leagueId: string; season?: string }

export const tableKey = (leagueId: string, season?: string) => `${leagueId}|${season ?? 'current'}`

/** Skips the request when that key is already loading or loaded (protects the 30 req/min limit). */
const skipIfCached =
  <A>(read: (s: CatalogState, arg: A) => Resource<unknown> | undefined) =>
  (arg: A, { getState }: { getState: () => { catalog: CatalogState } }) => {
    const r = read(getState().catalog, arg)
    return !(r && (r.status === 'loading' || r.status === 'succeeded'))
  }

export const fetchSports = createAsyncThunk<Sport[], void, Cfg>(
  'catalog/fetchSports',
  async (_, { rejectWithValue }) => {
    try {
      return (await sportsService.sports()) ?? []
    } catch (e) {
      return rejectWithValue(toThunkError(e))
    }
  },
  { condition: skipIfCached((s) => s.sports) },
)

export const fetchLeagues = createAsyncThunk<League[], string, Cfg>(
  'catalog/fetchLeagues',
  async (sport, { rejectWithValue }) => {
    try {
      return (await sportsService.leagues(sport)) ?? []
    } catch (e) {
      return rejectWithValue(toThunkError(e))
    }
  },
  { condition: skipIfCached((s, sport: string) => s.leagues[sport]) },
)

export const fetchLeagueTeams = createAsyncThunk<Team[], string, Cfg>(
  'catalog/fetchLeagueTeams',
  async (leagueId, { rejectWithValue }) => {
    try {
      return (await sportsService.leagueTeams(leagueId)) ?? []
    } catch (e) {
      return rejectWithValue(toThunkError(e))
    }
  },
  { condition: skipIfCached((s, id: string) => s.leagueTeams[id]) },
)

export const fetchTeam = createAsyncThunk<Team, string, Cfg>(
  'catalog/fetchTeam',
  async (teamId, { rejectWithValue }) => {
    try {
      const data = await sportsService.team(teamId)
      const team = Array.isArray(data) ? data[0] : data
      if (!team) return rejectWithValue({ message: 'Team not found.', status: 404 })
      return team
    } catch (e) {
      return rejectWithValue(toThunkError(e))
    }
  },
  { condition: skipIfCached((s, id: string) => s.teams[id]) },
)

export const fetchPreviousMatches = createAsyncThunk<Match[], string, Cfg>(
  'catalog/fetchPreviousMatches',
  async (teamId, { rejectWithValue }) => {
    try {
      return (await sportsService.previousMatches(teamId)) ?? []
    } catch (e) {
      return rejectWithValue(toThunkError(e))
    }
  },
  { condition: skipIfCached((s, id: string) => s.matches[id]) },
)

export const fetchLeagueTable = createAsyncThunk<StandingRow[], TableArg, Cfg>(
  'catalog/fetchLeagueTable',
  async ({ leagueId, season }, { rejectWithValue }) => {
    try {
      return (await sportsService.leagueTable(leagueId, season)) ?? []
    } catch (e) {
      return rejectWithValue(toThunkError(e))
    }
  },
  { condition: skipIfCached((s, a: TableArg) => s.tables[tableKey(a.leagueId, a.season)]) },
)

function keyed<T>(bucket: Record<string, Resource<T>>, key: string): Resource<T> {
  return (bucket[key] ??= blank<T>())
}

/** Wires pending/fulfilled/rejected of one thunk into one keyed Resource. */
function bind<T, Arg>(
  builder: ActionReducerMapBuilder<CatalogState>,
  thunk: AsyncThunk<T, Arg, Cfg>,
  slot: (s: CatalogState, arg: Arg) => Resource<T>,
) {
  builder
    .addCase(thunk.pending, (s, a) => {
      const r = slot(s, a.meta.arg)
      r.status = 'loading'
      r.error = null
      r.errorStatus = null
    })
    .addCase(thunk.fulfilled, (s, a) => {
      const r = slot(s, a.meta.arg)
      r.status = 'succeeded'
      r.data = a.payload
    })
    .addCase(thunk.rejected, (s, a) => {
      const r = slot(s, a.meta.arg)
      r.status = 'failed'
      r.error = a.payload?.message ?? 'Something went wrong.'
      r.errorStatus = a.payload?.status ?? null
    })
}

const catalogSlice = createSlice({
  name: 'catalog',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    bind(builder, fetchSports, (s) => s.sports)
    bind(builder, fetchLeagues, (s, sport) => keyed(s.leagues, sport))
    bind(builder, fetchLeagueTeams, (s, id) => keyed(s.leagueTeams, id))
    bind(builder, fetchTeam, (s, id) => keyed(s.teams, id))
    bind(builder, fetchPreviousMatches, (s, id) => keyed(s.matches, id))
    bind(builder, fetchLeagueTable, (s, a) => keyed(s.tables, tableKey(a.leagueId, a.season)))
  },
})

export default catalogSlice.reducer
