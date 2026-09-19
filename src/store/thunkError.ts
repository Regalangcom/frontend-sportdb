import { ApiError } from '@/services/http'
import type { ThunkError } from './types'

export const toThunkError = (e: unknown): ThunkError =>
  e instanceof ApiError
    ? { message: e.message, status: e.status, fieldErrors: e.fieldErrors }
    : { message: 'Something went wrong.', status: 0 }
