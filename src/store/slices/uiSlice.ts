import { createSlice, isFulfilled, isPending, isRejected } from '@reduxjs/toolkit'

interface UiState {
  /** Number of in-flight async thunks; drives the global loading bar. */
  pendingRequests: number
}

const uiSlice = createSlice({
  name: 'ui',
  initialState: { pendingRequests: 0 } as UiState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addMatcher(isPending, (s) => {
        s.pendingRequests += 1
      })
      .addMatcher(isFulfilled, (s) => {
        s.pendingRequests = Math.max(0, s.pendingRequests - 1)
      })
      .addMatcher(isRejected, (s) => {
        s.pendingRequests = Math.max(0, s.pendingRequests - 1)
      })
  },
})

export default uiSlice.reducer
