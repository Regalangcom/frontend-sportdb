import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { authService } from '@/services/auth.service'
import type { FieldErrors, User } from '@/types/api'
import { toThunkError } from '../thunkError'
import type { Status, ThunkError } from '../types'

interface AuthState {
  /** Logged-in user. The token itself lives in an HttpOnly cookie and is never visible to JS. */
  user: User | null
  /** True once the startup session check (GET /me) has finished. */
  initialized: boolean
  status: Status
  error: string | null
  fieldErrors: FieldErrors | null
}

const initialState: AuthState = {
  user: null,
  initialized: false,
  status: 'idle',
  error: null,
  fieldErrors: null,
}

type Credentials = { email: string; password: string }
type RegisterInput = Credentials & { name: string; password_confirmation: string }
type AuthResult = { user: User }

export const login = createAsyncThunk<AuthResult, Credentials, { rejectValue: ThunkError }>(
  'auth/login',
  async (body, { rejectWithValue }) => {
    try {
      return await authService.login(body)
    } catch (e) {
      return rejectWithValue(toThunkError(e))
    }
  },
)

export const register = createAsyncThunk<AuthResult, RegisterInput, { rejectValue: ThunkError }>(
  'auth/register',
  async (body, { rejectWithValue }) => {
    try {
      const result = await authService.register(body)
      // The API also logs the new user in via cookie. Registering must not sign them in,
      // so drop that session and let them log in from the login form.
      await authService.logout().catch(() => undefined)
      return result
    } catch (e) {
      return rejectWithValue(toThunkError(e))
    }
  },
)

export const fetchMe = createAsyncThunk<User, void, { rejectValue: ThunkError }>(
  'auth/fetchMe',
  async (_, { rejectWithValue }) => {
    try {
      return await authService.me()
    } catch (e) {
      return rejectWithValue(toThunkError(e))
    }
  },
)

export const logout = createAsyncThunk('auth/logout', async () => {
  try {
    await authService.logout()
  } catch {
    /* the local session is cleared regardless */
  }
})

const clearSession = (s: AuthState) => {
  s.user = null
}

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    /** Dispatched by the http layer on 401. */
    sessionExpired: (s) => clearSession(s),
    clearAuthErrors: (s) => {
      s.error = null
      s.fieldErrors = null
    },
  },
  extraReducers: (builder) => {
    const onPending = (s: AuthState) => {
      s.status = 'loading'
      s.error = null
      s.fieldErrors = null
    }
    const onSuccess = (s: AuthState, a: { payload: AuthResult }) => {
      s.status = 'succeeded'
      s.user = a.payload.user
      s.initialized = true
    }
    const onFail = (s: AuthState, a: { payload?: ThunkError }) => {
      s.status = 'failed'
      s.error = a.payload?.message ?? 'Something went wrong.'
      s.fieldErrors = a.payload?.fieldErrors ?? null
    }

    builder
      .addCase(login.pending, onPending)
      .addCase(login.fulfilled, onSuccess)
      .addCase(login.rejected, onFail)
      .addCase(register.pending, onPending)
      .addCase(register.fulfilled, (s) => {
        s.status = 'succeeded'
      })
      .addCase(register.rejected, onFail)
      .addCase(fetchMe.fulfilled, (s, a) => {
        s.user = a.payload
        s.initialized = true
      })
      .addCase(fetchMe.rejected, (s) => {
        // 401 just means "not logged in" (sessionExpired already cleared the user).
        s.initialized = true
      })
      .addCase(logout.fulfilled, (s) => {
        clearSession(s)
        s.status = 'idle'
      })
  },
})

export const { sessionExpired, clearAuthErrors } = authSlice.actions
export default authSlice.reducer
