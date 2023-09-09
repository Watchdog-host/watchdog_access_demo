import { configureStore } from '@reduxjs/toolkit'
import { setupListeners } from '@reduxjs/toolkit/dist/query'

import { loginApi, edgesApi, accountApi, watchlistApi, identityApi, devicesApi, accessApi, planApi, paymentApi, alertApi, revenueApi } from './endpoints'
import navigationSlice from './slices/navigation'
import modalsSlice from './slices/modals'
import dataSlice from './slices/data'

const store = configureStore({
  reducer: {
    [loginApi.reducerPath]: loginApi.reducer,
    [edgesApi.reducerPath]: edgesApi.reducer,
    [accountApi.reducerPath]: accountApi.reducer,
    [watchlistApi.reducerPath]: watchlistApi.reducer,
    [identityApi.reducerPath]: identityApi.reducer,
    [devicesApi.reducerPath]: devicesApi.reducer,
    [accessApi.reducerPath]: accessApi.reducer,
    [planApi.reducerPath]: planApi.reducer,
    [paymentApi.reducerPath]: paymentApi.reducer,
    [alertApi.reducerPath]: alertApi.reducer,
    [revenueApi.reducerPath]: revenueApi.reducer,
    navigation: navigationSlice.reducer,
    modals: modalsSlice.reducer,
    datas: dataSlice.reducer,
  },

  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({ serializableCheck: false })
      .concat(loginApi.middleware)
      .concat(edgesApi.middleware)
      .concat(accountApi.middleware)
      .concat(watchlistApi.middleware)
      .concat(identityApi.middleware)
      .concat(devicesApi.middleware)
      .concat(accessApi.middleware)
      .concat(planApi.middleware)
      .concat(paymentApi.middleware)
      .concat(alertApi.middleware)
      .concat(revenueApi.middleware),
})

setupListeners(store.dispatch)

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch

export default store
