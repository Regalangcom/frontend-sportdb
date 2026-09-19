import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { Spinner } from '@/components/common/States'
import { useAppSelector } from '@/store/hooks'
import { selectIsAuthenticated } from '@/store/selectors'

/** Renders child routes only when logged in; otherwise redirects to /login and remembers where the user wanted to go. */
export function ProtectedRoute() {
  const location = useLocation()
  const isAuthenticated = useAppSelector(selectIsAuthenticated)
  const initialized = useAppSelector((s) => s.auth.initialized)

  if (!initialized) {
    return (
      <div className="flex justify-center py-24">
        <Spinner className="size-8" />
      </div>
    )
  }
  if (!isAuthenticated) {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />
  }
  return <Outlet />
}

/** Login/register pages bounce already-logged-in users away. */
export function GuestRoute() {
  const isAuthenticated = useAppSelector(selectIsAuthenticated)
  return isAuthenticated ? <Navigate to="/favorites" replace /> : <Outlet />
}
