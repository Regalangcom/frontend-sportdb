import { Mail } from 'lucide-react'
import { useNavigate, Link } from 'react-router-dom'
import { PageHeader } from '@/components/common/PageHeader'
import { Spinner } from '@/components/common/States'
import { Button } from '@/components/ui/button'
import { useAppDispatch, useAppSelector } from '@/store/hooks'
import { logout } from '@/store/slices/authSlice'

export function ProfilePage() {
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const user = useAppSelector((s) => s.auth.user)

  const handleLogout = async () => {
    await dispatch(logout())
    navigate('/', { replace: true })
  }

  if (!user) {
    return (
      <div className="flex justify-center py-24">
        <Spinner className="size-8" />
      </div>
    )
  }

  return (
    <>
      <PageHeader title="My profile" />
      <div className="max-w-md space-y-5 rounded-2xl border border-border bg-card p-6">
        <div className="flex items-center gap-4">
          <div className="flex size-14 items-center justify-center rounded-full bg-primary text-xl font-bold text-primary-foreground">
            {user.name.charAt(0).toUpperCase()}
          </div>
          <div className="min-w-0">
            <p className="truncate text-lg font-semibold">{user.name}</p>
            <p className="flex items-center gap-1.5 truncate text-sm text-muted-foreground">
              <Mail className="size-4" /> {user.email}
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button render={<Link to="/favorites" />} nativeButton={false}>My favorites</Button>
          <Button variant="outline" onClick={handleLogout}>Log out</Button>
        </div>
      </div>
    </>
  )
}
