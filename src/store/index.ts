import { configureStore } from '@reduxjs/toolkit'
import { setUnauthorizedHandler } from '@/services/http'
import authReducer, { sessionExpired } from './slices/authSlice'
import catalogReducer from './slices/catalogSlice'
import favoritesReducer from './slices/favoritesSlice'
import uiReducer from './slices/uiSlice'

export const store = configureStore({
  reducer: {
    auth: authReducer,
    catalog: catalogReducer,
    favorites: favoritesReducer,
    ui: uiReducer,
  },
})

// 401 from any protected call: drop the session; ProtectedRoute then redirects to /login.
setUnauthorizedHandler(() => store.dispatch(sessionExpired()))

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
