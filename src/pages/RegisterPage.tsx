import { useEffect, useState, type FormEvent } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { FormField } from '@/components/common/FormField'
import { Spinner } from '@/components/common/States'
import { Button } from '@/components/ui/button'
import { useAppDispatch, useAppSelector } from '@/store/hooks'
import { clearAuthErrors, register } from '@/store/slices/authSlice'

export function RegisterPage() {
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const location = useLocation()
  const from = (location.state as { from?: string } | null)?.from ?? '/favorites'
  const { status, error, fieldErrors } = useAppSelector((s) => s.auth)
  const [form, setForm] = useState({ name: '', email: '', password: '', password_confirmation: '' })

  useEffect(() => {
    dispatch(clearAuthErrors())
  }, [dispatch])

  const set = (key: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm({ ...form, [key]: e.target.value })

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault()
    const result = await dispatch(register(form))
    if (register.fulfilled.match(result)) {
      navigate('/login', { replace: true, state: { from, registered: true } })
    }
  }

  return (
    <div className="mx-auto max-w-sm">
      <h1 className="mb-1 text-2xl font-bold">Create account</h1>
      <p className="mb-6 text-sm text-muted-foreground">Save your favorite teams across devices.</p>

      <form onSubmit={onSubmit} className="space-y-4 rounded-2xl border border-border bg-card p-6" noValidate>
        {error && !fieldErrors && (
          <p role="alert" className="rounded-lg bg-destructive/10 px-3 py-2 text-sm text-destructive">{error}</p>
        )}
        <FormField label="Name" name="name" autoComplete="name" value={form.name} onChange={set('name')} errors={fieldErrors?.name} />
        <FormField label="Email" name="email" type="email" autoComplete="email" value={form.email} onChange={set('email')} errors={fieldErrors?.email} />
        <FormField label="Password" name="password" type="password" autoComplete="new-password" value={form.password} onChange={set('password')} errors={fieldErrors?.password} />
        <FormField label="Confirm password" name="password_confirmation" type="password" autoComplete="new-password" value={form.password_confirmation} onChange={set('password_confirmation')} errors={fieldErrors?.password_confirmation} />
        <Button type="submit" className="h-10 w-full" disabled={status === 'loading'}>
          {status === 'loading' ? <Spinner className="text-primary-foreground" /> : 'Sign up'}
        </Button>
      </form>

      <p className="mt-4 text-center text-sm text-muted-foreground">
        Already registered? <Link to="/login" state={{ from }} className="text-primary hover:underline">Log in</Link>
      </p>
    </div>
  )
}
