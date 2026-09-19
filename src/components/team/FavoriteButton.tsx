import { Heart } from 'lucide-react'
import { useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { useAppDispatch, useAppSelector } from '@/store/hooks'
import { selectIsAuthenticated } from '@/store/selectors'
import { addFavorite, fetchFavorites, removeFavorite } from '@/store/slices/favoritesSlice'
import type { Team } from '@/types/api'

export function FavoriteButton({ team }: { team: Team }) {
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const location = useLocation()
  const isAuthenticated = useAppSelector(selectIsAuthenticated)
  const { items, status, busyTeamIds, busyFavoriteIds } = useAppSelector((s) => s.favorites)

  useEffect(() => {
    if (isAuthenticated && status === 'idle') dispatch(fetchFavorites())
  }, [isAuthenticated, status, dispatch])

  const favorite = items.find((f) => f.team_id === team.idTeam)
  const busy = busyTeamIds.includes(team.idTeam) || (favorite ? busyFavoriteIds.includes(favorite.id) : false)

  const toggle = () => {
    if (!isAuthenticated) {
      navigate('/login', { state: { from: location.pathname } })
      return
    }
    if (favorite) dispatch(removeFavorite(favorite.id))
    else dispatch(addFavorite({ team_id: team.idTeam, team_name: team.strTeam, team_badge: team.strBadge ?? null }))
  }

  return (
    <Button
      variant={favorite ? 'secondary' : 'default'}
      onClick={toggle}
      disabled={busy || (isAuthenticated && status === 'loading')}
    >
      <Heart className={favorite ? 'fill-primary text-primary' : ''} />
      {favorite ? 'Remove from favorites' : 'Add to favorites'}
    </Button>
  )
}
