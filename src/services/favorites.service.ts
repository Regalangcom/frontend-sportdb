import type { AddFavoritePayload, Favorite } from '@/types/api'
import { request } from './http'

export const favoritesService = {
  list: () => request<Favorite[]>('/favorites'),
  add: (body: AddFavoritePayload) => request<Favorite>('/favorites', { method: 'POST', body }),
  remove: (id: number) => request<null>(`/favorites/${id}`, { method: 'DELETE' }),
}
