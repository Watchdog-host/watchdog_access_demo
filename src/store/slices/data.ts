import { createSlice } from '@reduxjs/toolkit'
import { IAccessDTO, IDeviceDTO } from 'types'

interface IModal {
  selecteData?: IAccessDTO | IDeviceDTO | any
}

const initialState: IModal = {
  selecteData: undefined,
}

const dataSlice = createSlice({
  name: 'navigation',
  initialState,
  reducers: {
    setSelectedData: (state, { payload }) => {
      state.selecteData = payload
    },
  },
})

export const { setSelectedData } = dataSlice.actions

export default dataSlice
