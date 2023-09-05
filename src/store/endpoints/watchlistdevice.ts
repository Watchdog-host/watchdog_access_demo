import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { API_URL } from 'constants/common'
import { IWatchlistdeviceDTO, QueryFiltersType } from 'types'

export const watchlistdeviceApi = createApi({
  reducerPath: `watchlistdevice`,
  baseQuery: fetchBaseQuery({
    baseUrl: API_URL,
    prepareHeaders(headers) {
      const token = localStorage.getItem('token')
      headers.set('Authorization', `Bearer ${token}`)
      return headers
    },
  }),
  tagTypes: ['Watchlistdevice', 'WatchlistdeviceById'],

  endpoints: (builder) => ({
    // queries
    watchlistdevice: builder.query<IWatchlistdeviceDTO[], { device_id?: number }>({
      query({ device_id }) {
        const filterParams: QueryFiltersType = {
          filter: [[[`device_id`, '=', `${device_id}`]]],
        }
        return {
          url: `/watchlistdevice`,
          params: {
            filter: JSON.stringify(filterParams),
          },
        }
      },
      providesTags: ['Watchlistdevice'],
    }),

    watchlistdeviceById: builder.query<IWatchlistdeviceDTO, { id: number }>({
      query({ id }) {
        return {
          url: `/watchlistdevice/${id}`,
        }
      },
      providesTags: ['WatchlistdeviceById'],
    }),

    // mutations
    addWatchlistdevice: builder.mutation<IWatchlistdeviceDTO, Partial<IWatchlistdeviceDTO>>({
      query(data) {
        return {
          url: `/watchlistdevice`,
          method: `POST`,
          body: data,
        }
      },
      invalidatesTags: ['Watchlistdevice'],
    }),

    updateWatchlistdevice: builder.mutation<IWatchlistdeviceDTO, { watchlistdevice_id?: number }>({
      query({ watchlistdevice_id, ...variables }) {
        return {
          url: `/watchlistdevice/${watchlistdevice_id}`,
          method: `PUT`,
          body: variables,
        }
      },
      invalidatesTags: ['Watchlistdevice', 'WatchlistdeviceById'],
    }),

    deleteWatchlistdevice: builder.mutation<IWatchlistdeviceDTO, { id?: number }>({
      query({ id, ...variables }) {
        return {
          url: `/watchlistdevice/${id}`,
          method: `DELETE`,
          body: variables,
        }
      },
      invalidatesTags: ['Watchlistdevice'],
    }),
  }),
})

export const {
  useWatchlistdeviceQuery,
  useWatchlistdeviceByIdQuery,
  useAddWatchlistdeviceMutation,
  useUpdateWatchlistdeviceMutation,
  useDeleteWatchlistdeviceMutation,
} = watchlistdeviceApi
