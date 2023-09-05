import { createSlice } from '@reduxjs/toolkit'

interface IModal {
  addIdentityModal: boolean
  updateIdentityModal: {
    visible: boolean
    data: null
  }
}

const initialState: IModal = {
  addIdentityModal: false,
  updateIdentityModal: {
    visible: false,
    data: null,
  },
}

const modalsSlice = createSlice({
  name: 'navigation',
  initialState,
  reducers: {
    setAddIdentityModal: (state, { payload }) => {
      state.addIdentityModal = payload
    },
    setUpdateIdentityModal: (state, { payload }) => {
      state.updateIdentityModal = { visible: payload.visible, data: payload.data }
    },
  },
})

export const { setAddIdentityModal, setUpdateIdentityModal } = modalsSlice.actions

export default modalsSlice
