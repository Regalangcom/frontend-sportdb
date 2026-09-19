import { API_URL, TOKEN_STORAGE_KEY } from '@/config/env'
import type { ApiEnvelope, FieldErrors } from '@/types/api'

export class ApiError extends Error {
  status: number
  fieldErrors?: FieldErrors

  constructor(message: string, status: number, fieldErrors?: FieldErrors) {
    super(message)
    this.name = 'ApiError'
    this.status = status
    this.fieldErrors = fieldErrors
  }
}

const FRIENDLY: Record<number, string> = {
  404: 'Not found.',
  409: 'Already in your favorites.',
  502: 'Sports data is unavailable right now. Please try again later.',
}

let onUnauthorized: (() => void) | null = null

/** Store registers this so the http layer can log out on 401 without importing the store. */
export const setUnauthorizedHandler = (handler: () => void) => {
  onUnauthorized = handler
}

export const tokenStorage = {
  get: () => {
    try {
      return localStorage.getItem(TOKEN_STORAGE_KEY)
    } catch {
      return null
    }
  },
  set: (token: string) => localStorage.setItem(TOKEN_STORAGE_KEY, token),
  clear: () => localStorage.removeItem(TOKEN_STORAGE_KEY),
}

interface RequestOptions {
  method?: 'GET' | 'POST' | 'DELETE'
  body?: unknown
  query?: Record<string, string | undefined>
  /** Login/register: a 401 means wrong credentials, not an expired session. */
  skipUnauthorizedHandler?: boolean
}

export async function request<T>(
  path: string,
  { method = 'GET', body, query, skipUnauthorizedHandler }: RequestOptions = {},
): Promise<T> {
  const url = new URL(API_URL.replace(/\/$/, '') + path)
  Object.entries(query ?? {}).forEach(([k, v]) => {
    if (v) url.searchParams.set(k, v)
  })

  const headers: Record<string, string> = { Accept: 'application/json' }
  if (body !== undefined) headers['Content-Type'] = 'application/json'
  const token = tokenStorage.get()
  if (token) headers.Authorization = `Bearer ${token}`

  let res: Response
  try {
    res = await fetch(url, {
      method,
      headers,
      body: body !== undefined ? JSON.stringify(body) : undefined,
    })
  } catch {
    throw new ApiError('Cannot reach the server. Check your connection.', 0)
  }

  let json: Partial<ApiEnvelope<T>> | null = null
  try {
    json = await res.json()
  } catch {
    /* empty body */
  }

  if (!res.ok || json?.success === false) {
    if (res.status === 401 && !skipUnauthorizedHandler) onUnauthorized?.()
    const fieldErrors =
      res.status === 422 ? (json?.data as unknown as FieldErrors) : undefined
    throw new ApiError(
      json?.message || FRIENDLY[res.status] || 'Something went wrong.',
      res.status,
      fieldErrors,
    )
  }

  return json?.data as T
}
