import { createSlice } from '@reduxjs/toolkit'
import { LAYOUT_TYPE } from 'types'

interface ILayout {
  visibleMap: boolean
  layoutType: LAYOUT_TYPE
}

const initialState: ILayout = {
  visibleMap: false,
  layoutType: 'map',
}

const layoutSlice = createSlice({
  name: 'layout',
  initialState,
  reducers: {
    setVisibleMap: (state, action: { payload: boolean }) => {
      state.visibleMap = action.payload
    },
    setLayoutType: (state, action: { payload: LAYOUT_TYPE }) => {
      state.layoutType = action.payload
    },
  },
})

export const { setVisibleMap, setLayoutType } = layoutSlice.actions

export default layoutSlice
