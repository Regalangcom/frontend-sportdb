import { Heart, LogOut, Trophy, User as UserIcon } from 'lucide-react'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { useAppDispatch, useAppSelector } from '@/store/hooks'
import { logout } from '@/store/slices/authSlice'
import { selectIsAuthenticated } from '@/store/selectors'

const linkClass = ({ isActive }: { isActive: boolean }) =>
  cn(
    'flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium transition-colors hover:bg-muted',
    isActive ? 'text-primary' : 'text-muted-foreground',
  )

export function Navbar() {
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const isAuthenticated = useAppSelector(selectIsAuthenticated)

  const handleLogout = async () => {
    await dispatch(logout())
    navigate('/', { replace: true })
  }

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background/85 backdrop-blur">
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between gap-2 px-4">
        <Link to="/" className="flex items-center gap-2 text-lg font-extrabold tracking-tight">
          <Trophy className="size-5 text-primary" />
          Sport<span className="text-primary">DB</span>
        </Link>

        <nav className="flex items-center gap-1">
          <NavLink to="/" end className={linkClass}>
            Leagues
          </NavLink>
          {isAuthenticated ? (
            <>
              <NavLink to="/favorites" className={linkClass}>
                <Heart className="size-4" />
                <span className="hidden sm:inline">Favorites</span>
              </NavLink>
              <NavLink to="/profile" className={linkClass}>
                <UserIcon className="size-4" />
                <span className="hidden sm:inline">Profile</span>
              </NavLink>
              <Button variant="ghost" size="sm" onClick={handleLogout} aria-label="Log out">
                <LogOut />
                <span className="hidden sm:inline">Log out</span>
              </Button>
            </>
          ) : (
            <>
              <NavLink to="/login" className={linkClass}>
                Log in
              </NavLink>
              <Button size="sm" render={<Link to="/register" />} nativeButton={false}>
                Sign up
              </Button>
            </>
          )}
        </nav>
      </div>
    </header>
  )
}
