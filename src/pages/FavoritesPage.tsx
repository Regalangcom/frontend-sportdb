import { Trash2 } from 'lucide-react'
import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { CardGridSkeleton, EmptyState, ErrorState } from '@/components/common/States'
import { PageHeader } from '@/components/common/PageHeader'
import { TeamCard } from '@/components/team/TeamCard'
import { Button } from '@/components/ui/button'
import { useAppDispatch, useAppSelector } from '@/store/hooks'
import { clearActionError, fetchFavorites, removeFavorite } from '@/store/slices/favoritesSlice'

export function FavoritesPage() {
  const dispatch = useAppDispatch()
  const { items, status, error, actionError, busyFavoriteIds } = useAppSelector((s) => s.favorites)

  useEffect(() => {
    dispatch(fetchFavorites())
    return () => {
      dispatch(clearActionError())
    }
  }, [dispatch])

  return (
    <>
      <PageHeader title="Favorite teams" subtitle="Saved to your account." />

      {actionError && (
        <p role="alert" className="mb-4 rounded-lg bg-destructive/10 px-3 py-2 text-sm text-destructive">{actionError}</p>
      )}

      {status === 'loading' && items.length === 0 && <CardGridSkeleton count={4} />}
      {status === 'failed' && <ErrorState message={error ?? 'Could not load favorites.'} onRetry={() => dispatch(fetchFavorites())} />}
      {status === 'succeeded' && items.length === 0 && (
        <EmptyState title="No favorite teams yet">
          Browse <Link to="/" className="text-primary hover:underline">leagues</Link> and tap the heart on a team.
        </EmptyState>
      )}
      {items.length > 0 && (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
          {items.map((f) => (
            <TeamCard
              key={f.id}
              teamId={f.team_id}
              name={f.team_name}
              badge={f.team_badge}
              action={
                <Button
                  variant="destructive"
                  size="sm"
                  disabled={busyFavoriteIds.includes(f.id)}
                  onClick={() => dispatch(removeFavorite(f.id))}
                >
                  <Trash2 /> Remove
                </Button>
              }
            />
          ))}
        </div>
      )}
    </>
  )
}
