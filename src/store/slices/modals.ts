import { createSlice } from '@reduxjs/toolkit'

interface IModal {
  addEdgeModal: boolean
  settingsModal: boolean
  helpModal: boolean
  descriptorModal: boolean
  identityModal: boolean
}

const initialState: IModal = {
  addEdgeModal: false,
  settingsModal: false,
  helpModal: false,
  descriptorModal: false,
  identityModal: false,
}

const modalsSlice = createSlice({
  name: 'navigation',
  initialState,
  reducers: {
    setAddEdgeModal: (state, { payload }) => {
      state.addEdgeModal = payload
    },
    setSettingsModal: (state, { payload }) => {
      state.settingsModal = payload
    },
    setHelpModal: (state, { payload }) => {
      state.helpModal = payload
    },
    setDescriptorModal: (state, { payload }) => {
      state.descriptorModal = payload
    },
    setIdentityModal: (state, { payload }) => {
      state.identityModal = payload
    },
  },
})

export const { setAddEdgeModal, setSettingsModal, setHelpModal, setDescriptorModal, setIdentityModal } = modalsSlice.actions

export default modalsSlice
