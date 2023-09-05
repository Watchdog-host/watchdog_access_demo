import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { API_URL } from 'constants/common'
import { IWatchlistDTO } from 'types'

export const watchlistApi = createApi({
  reducerPath: `watchlist`,
  baseQuery: fetchBaseQuery({
    baseUrl: API_URL,
    prepareHeaders(headers) {
      const token = localStorage.getItem('token')
      headers.set('Authorization', `Bearer ${token}`)
      return headers
    },
  }),
  tagTypes: ['Watchlists', 'WatchlistById'],

  endpoints: (builder) => ({
    // queries
    watchlists: builder.query<IWatchlistDTO[], void>({
      query() {
        return {
          url: `/watchlist/path`,
        }
      },
      providesTags: ['Watchlists'],
    }),

    watchlistById: builder.query<IWatchlistDTO, { id: number }>({
      query({ id }) {
        return {
          url: `/watchlist/${id}`,
        }
      },
      providesTags: ['WatchlistById'],
    }),

    // mutations
    addWatchlist: builder.mutation<IWatchlistDTO, Partial<IWatchlistDTO>>({
      query(data) {
        return {
          url: `/watchlist`,
          method: `POST`,
          body: data,
        }
      },
      invalidatesTags: ['Watchlists'],
    }),

    updateWatchlist: builder.mutation<IWatchlistDTO, { watchlist_id: any }>({
      query({ watchlist_id, ...variables }) {
        return {
          url: `/watchlist/${watchlist_id}`,
          method: `PUT`,
          body: variables,
        }
      },
      invalidatesTags: ['Watchlists', 'WatchlistById'],
    }),

    deleteWatchlist: builder.mutation<IWatchlistDTO, { id?: number }>({
      query({ id, ...variables }) {
        return {
          url: `/watchlist/${id}`,
          method: `DELETE`,
          body: variables,
        }
      },
      invalidatesTags: ['Watchlists'],
    }),
  }),
})

export const {
  useWatchlistsQuery,
  useAddWatchlistMutation,
  useWatchlistByIdQuery,
  useUpdateWatchlistMutation,
  useDeleteWatchlistMutation,
} = watchlistApi
