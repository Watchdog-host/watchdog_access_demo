import { createSlice } from '@reduxjs/toolkit'
import { DEVICE_TYPE, IEdgeDTO } from 'types'

interface INavigation {
  currentEdge: IEdgeDTO | null
  edgeStatusData: IEdgeDTO[] | null
}

const initialState: INavigation = {
  currentEdge: null, // this is currently edge, that selected edge, all operations are performed depend on this edge
  edgeStatusData: null,
}

const navigationSlice = createSlice({
  name: 'navigation',
  initialState,
  reducers: {
    setCurrentEdge: (state, { payload }) => {
      state.currentEdge = payload
    },
    setEdgeStatusData: (state, { payload }) => {
      state.edgeStatusData = payload
    },
  },
})

export const { setCurrentEdge, setEdgeStatusData } = navigationSlice.actions

export default navigationSlice
