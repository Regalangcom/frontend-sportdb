import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import { MainLayout } from '@/layouts/MainLayout'
import { FavoritesPage } from '@/pages/FavoritesPage'
import { HomePage } from '@/pages/HomePage'
import { LeaguePage } from '@/pages/LeaguePage'
import { LoginPage } from '@/pages/LoginPage'
import { NotFoundPage } from '@/pages/NotFoundPage'
import { ProfilePage } from '@/pages/ProfilePage'
import { RegisterPage } from '@/pages/RegisterPage'
import { TeamPage } from '@/pages/TeamPage'
import { GuestRoute, ProtectedRoute } from './ProtectedRoute'

const router = createBrowserRouter([
  {
    element: <MainLayout />,
    children: [
      { path: '/', element: <HomePage /> },
      { path: '/leagues/:leagueId', element: <LeaguePage /> },
      { path: '/teams/:teamId', element: <TeamPage /> },
      {
        element: <GuestRoute />,
        children: [
          { path: '/login', element: <LoginPage /> },
          { path: '/register', element: <RegisterPage /> },
        ],
      },
      {
        element: <ProtectedRoute />,
        children: [
          { path: '/favorites', element: <FavoritesPage /> },
          { path: '/profile', element: <ProfilePage /> },
        ],
      },
      { path: '*', element: <NotFoundPage /> },
    ],
  },
])

export function AppRouter() {
  return <RouterProvider router={router} />
}
