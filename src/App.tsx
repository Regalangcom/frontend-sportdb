import { useEffect } from 'react'
import { AppRouter } from '@/routes/AppRouter'
import { useAppDispatch, useAppSelector } from '@/store/hooks'
import { fetchMe } from '@/store/slices/authSlice'

function App() {
  const dispatch = useAppDispatch()
  const hasToken = useAppSelector((s) => Boolean(s.auth.token))
  const initialized = useAppSelector((s) => s.auth.initialized)

  // Validate a stored token once on startup; a 401 logs the user out (see store/index.ts).
  useEffect(() => {
    if (hasToken && !initialized) dispatch(fetchMe())
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return <AppRouter />
}

export default App
