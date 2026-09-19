import type { FieldErrors } from '@/types/api'

export type Status = 'idle' | 'loading' | 'succeeded' | 'failed'

export interface Resource<T> {
  data: T | null
  status: Status
  error: string | null
  errorStatus: number | null
}

export interface ThunkError {
  message: string
  status: number
  fieldErrors?: FieldErrors
}
