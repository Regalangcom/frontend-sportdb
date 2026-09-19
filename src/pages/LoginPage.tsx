import { useEffect, useState, type FormEvent } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { FormField } from '@/components/common/FormField'
import { Spinner } from '@/components/common/States'
import { Button } from '@/components/ui/button'
import { useAppDispatch, useAppSelector } from '@/store/hooks'
import { clearAuthErrors, login } from '@/store/slices/authSlice'

export function LoginPage() {
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const location = useLocation()
  const state = location.state as { from?: string; registered?: boolean } | null
  const from = state?.from ?? '/favorites'
  const { status, error, fieldErrors } = useAppSelector((s) => s.auth)
  const [form, setForm] = useState({ email: '', password: '' })

  useEffect(() => {
    dispatch(clearAuthErrors())
  }, [dispatch])

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault()
    const result = await dispatch(login(form))
    if (login.fulfilled.match(result)) navigate(from, { replace: true })
  }

  return (
    <div className="mx-auto max-w-sm">
      <h1 className="mb-1 text-2xl font-bold">Welcome back</h1>
      <p className="mb-6 text-sm text-muted-foreground">Log in to manage your favorite teams.</p>

      <form onSubmit={onSubmit} className="space-y-4 rounded-2xl border border-border bg-card p-6" noValidate>
        {state?.registered && !error && (
          <p role="status" className="rounded-lg bg-primary/10 px-3 py-2 text-sm text-primary">
            Account created. Please log in.
          </p>
        )}
        {error && !fieldErrors && (
          <p role="alert" className="rounded-lg bg-destructive/10 px-3 py-2 text-sm text-destructive">{error}</p>
        )}
        <FormField label="Email" name="email" type="email" autoComplete="email" value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })} errors={fieldErrors?.email} />
        <FormField label="Password" name="password" type="password" autoComplete="current-password" value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })} errors={fieldErrors?.password} />
        <Button type="submit" className="h-10 w-full" disabled={status === 'loading'}>
          {status === 'loading' ? <Spinner className="text-primary-foreground" /> : 'Log in'}
        </Button>
      </form>

      <p className="mt-4 text-center text-sm text-muted-foreground">
        No account? <Link to="/register" state={{ from }} className="text-primary hover:underline">Sign up</Link>
      </p>
    </div>
  )
}
