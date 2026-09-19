import { useEffect } from 'react'
import { AppRouter } from '@/routes/AppRouter'
import { useAppDispatch } from '@/store/hooks'
import { fetchMe } from '@/store/slices/authSlice'

function App() {
  const dispatch = useAppDispatch()

  // The cookie is invisible to JS, so login state is only known by asking the API on startup.
  useEffect(() => {
    dispatch(fetchMe())
  }, [dispatch])

  return <AppRouter />
}

export default App
