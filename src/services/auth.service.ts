import type { AuthPayload, User } from '@/types/api'
import { request } from './http'

export const authService = {
  register: (body: {
    name: string
    email: string
    password: string
    password_confirmation: string
  }) => request<AuthPayload>('/register', { method: 'POST', body, skipUnauthorizedHandler: true }),

  login: (body: { email: string; password: string }) =>
    request<AuthPayload>('/login', { method: 'POST', body, skipUnauthorizedHandler: true }),

  me: () => request<User>('/me'),

  logout: () => request<null>('/logout', { method: 'POST', skipUnauthorizedHandler: true }),
}
