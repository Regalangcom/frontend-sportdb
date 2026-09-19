import type { RootState } from './index'

export const selectIsAuthenticated = (s: RootState) => Boolean(s.auth.user)
export const selectGlobalLoading = (s: RootState) => s.ui.pendingRequests > 0
