import { configureStore } from '@reduxjs/toolkit'
import { setupListeners } from '@reduxjs/toolkit/dist/query'

import {
  loginApi,
  edgesApi,
  accountApi,
  watchlistApi,
  identityApi,
  descriptorApi,
  devicesApi,
  accessApi,
  devicedeviceApi,
  watchlistdeviceApi,
  planApi,
  paymentApi,
} from './endpoints'
import navigationSlice from './slices/navigation'
import layoutSlice from './slices/layout'
import modalsSlice from './slices/modals'

const store = configureStore({
  reducer: {
    [loginApi.reducerPath]: loginApi.reducer,
    [edgesApi.reducerPath]: edgesApi.reducer,
    [accountApi.reducerPath]: accountApi.reducer,
    [watchlistApi.reducerPath]: watchlistApi.reducer,
    [identityApi.reducerPath]: identityApi.reducer,
    [descriptorApi.reducerPath]: descriptorApi.reducer,
    [devicesApi.reducerPath]: devicesApi.reducer,
    [devicedeviceApi.reducerPath]: devicedeviceApi.reducer,
    [watchlistdeviceApi.reducerPath]: watchlistdeviceApi.reducer,
    [accessApi.reducerPath]: accessApi.reducer,
    [planApi.reducerPath]: planApi.reducer,
    [paymentApi.reducerPath]: paymentApi.reducer,
    navigation: navigationSlice.reducer,
    layout: layoutSlice.reducer,
    modals: modalsSlice.reducer,
  },

  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({ serializableCheck: false })
      .concat(loginApi.middleware)
      .concat(edgesApi.middleware)
      .concat(accountApi.middleware)
      .concat(watchlistApi.middleware)
      .concat(identityApi.middleware)
      .concat(devicesApi.middleware)
      .concat(devicedeviceApi.middleware)
      .concat(watchlistdeviceApi.middleware)
      .concat(descriptorApi.middleware)
      .concat(accessApi.middleware)
      .concat(planApi.middleware)
      .concat(paymentApi.middleware),
})

setupListeners(store.dispatch)

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch

export default store
