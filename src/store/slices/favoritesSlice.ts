import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { favoritesService } from '@/services/favorites.service'
import type { AddFavoritePayload, Favorite } from '@/types/api'
import { toThunkError } from '../thunkError'
import type { Status, ThunkError } from '../types'
import { logout, sessionExpired } from './authSlice'

interface FavoritesState {
  items: Favorite[]
  status: Status
  error: string | null
  /** Last add/remove failure, shown as a message in the UI. */
  actionError: string | null
  busyTeamIds: string[]
  busyFavoriteIds: number[]
}

const initialState: FavoritesState = {
  items: [],
  status: 'idle',
  error: null,
  actionError: null,
  busyTeamIds: [],
  busyFavoriteIds: [],
}

type Cfg = { rejectValue: ThunkError }

export const fetchFavorites = createAsyncThunk<Favorite[], void, Cfg>(
  'favorites/fetch',
  async (_, { rejectWithValue }) => {
    try {
      return await favoritesService.list()
    } catch (e) {
      return rejectWithValue(toThunkError(e))
    }
  },
)

export const addFavorite = createAsyncThunk<Favorite, AddFavoritePayload, Cfg>(
  'favorites/add',
  async (body, { rejectWithValue }) => {
    try {
      return await favoritesService.add(body)
    } catch (e) {
      return rejectWithValue(toThunkError(e))
    }
  },
)

export const removeFavorite = createAsyncThunk<number, number, Cfg>(
  'favorites/remove',
  async (id, { rejectWithValue }) => {
    try {
      await favoritesService.remove(id)
      return id
    } catch (e) {
      return rejectWithValue(toThunkError(e))
    }
  },
)

const favoritesSlice = createSlice({
  name: 'favorites',
  initialState,
  reducers: {
    clearActionError: (s) => {
      s.actionError = null
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchFavorites.pending, (s) => {
        s.status = 'loading'
        s.error = null
      })
      .addCase(fetchFavorites.fulfilled, (s, a) => {
        s.status = 'succeeded'
        s.items = a.payload ?? []
      })
      .addCase(fetchFavorites.rejected, (s, a) => {
        s.status = 'failed'
        s.error = a.payload?.message ?? 'Could not load favorites.'
      })

      .addCase(addFavorite.pending, (s, a) => {
        s.actionError = null
        s.busyTeamIds.push(a.meta.arg.team_id)
      })
      .addCase(addFavorite.fulfilled, (s, a) => {
        s.busyTeamIds = s.busyTeamIds.filter((id) => id !== a.meta.arg.team_id)
        s.items.unshift(a.payload)
      })
      .addCase(addFavorite.rejected, (s, a) => {
        s.busyTeamIds = s.busyTeamIds.filter((id) => id !== a.meta.arg.team_id)
        s.actionError = a.payload?.message ?? 'Could not add favorite.'
      })

      .addCase(removeFavorite.pending, (s, a) => {
        s.actionError = null
        s.busyFavoriteIds.push(a.meta.arg)
      })
      .addCase(removeFavorite.fulfilled, (s, a) => {
        s.busyFavoriteIds = s.busyFavoriteIds.filter((id) => id !== a.payload)
        s.items = s.items.filter((f) => f.id !== a.payload)
      })
      .addCase(removeFavorite.rejected, (s, a) => {
        s.busyFavoriteIds = s.busyFavoriteIds.filter((id) => id !== a.meta.arg)
        s.actionError = a.payload?.message ?? 'Could not remove favorite.'
      })

      .addCase(logout.fulfilled, () => initialState)
      .addCase(sessionExpired, () => initialState)
  },
})

export const { clearActionError } = favoritesSlice.actions
export default favoritesSlice.reducer
