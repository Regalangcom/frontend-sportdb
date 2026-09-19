import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { authService } from '@/services/auth.service'
import { tokenStorage } from '@/services/http'
import type { FieldErrors, User } from '@/types/api'
import { toThunkError } from '../thunkError'
import type { Status, ThunkError } from '../types'

interface AuthState {
  user: User | null
  token: string | null
  /** True once the startup token check (GET /me) has finished. */
  initialized: boolean
  status: Status
  error: string | null
  fieldErrors: FieldErrors | null
}

const token = tokenStorage.get()

const initialState: AuthState = {
  user: null,
  token,
  initialized: !token,
  status: 'idle',
  error: null,
  fieldErrors: null,
}

type Credentials = { email: string; password: string }
type RegisterInput = Credentials & { name: string; password_confirmation: string }
type AuthResult = { user: User; token: string }

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
      return await authService.register(body)
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
    /* token is dropped locally regardless */
  }
})

const clearSession = (s: AuthState) => {
  tokenStorage.clear()
  s.user = null
  s.token = null
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
      s.token = a.payload.token
      s.initialized = true
      tokenStorage.set(a.payload.token)
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
        // Registering must not sign the user in: the returned token is deliberately not stored.
        s.status = 'succeeded'
      })
      .addCase(register.rejected, onFail)
      .addCase(fetchMe.fulfilled, (s, a) => {
        s.user = a.payload
        s.initialized = true
      })
      .addCase(fetchMe.rejected, (s) => {
        // A 401 already cleared the session via sessionExpired; other errors keep the token.
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
