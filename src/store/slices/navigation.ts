import { createSlice } from '@reduxjs/toolkit'
import { DEVICE_TYPE, IEdgeDTO } from 'types'

interface INavigation {
  currentEdge: IEdgeDTO | null
  selectedEdgeKey: number | null
  navigation: IEdgeDTO[] | null
  selectedDeviceType: DEVICE_TYPE
}

const initialState: INavigation = {
  currentEdge: null, // this is currently edge, that selected edge, all operations are performed depend on this edge
  selectedEdgeKey: null,
  navigation: null,
  selectedDeviceType: 'Camera',
}

const navigationSlice = createSlice({
  name: 'navigation',
  initialState,
  reducers: {
    setCurrentEdge: (state, { payload }) => {
      state.currentEdge = payload
    },
    setSelectedEdgeKey: (state, { payload }) => {
      state.selectedEdgeKey = payload
    },
    setNavigation: (state, { payload }) => {
      state.navigation = payload
    },
    setSelectedDeviceType: (state, { payload }) => {
      state.selectedDeviceType = payload
    },
  },
})

export const { setCurrentEdge, setNavigation, setSelectedDeviceType, setSelectedEdgeKey } = navigationSlice.actions

export default navigationSlice
