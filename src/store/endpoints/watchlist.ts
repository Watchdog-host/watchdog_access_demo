import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { BASE_URL } from 'constants/common'
import { IWatchlistDTO, QueryFiltersType } from 'types'

export const watchlistApi = createApi({
  reducerPath: `watchlist`,
  baseQuery: fetchBaseQuery({
    baseUrl: `${BASE_URL}/v1`,
    prepareHeaders(headers) {
      const profileData = localStorage.getItem('profile')
      if (profileData !== null) {
        const profile = JSON.parse(profileData)
        headers.set('Authorization', `Bearer ${profile.token}`)
      }
      return headers
    },
  }),
  tagTypes: ['Watchlists', 'WatchlistById'],

  endpoints: (builder) => ({
    // queries
    watchlists: builder.query<
      IWatchlistDTO[],
      {
        filter: { id?: number }
      }
    >({
      query({ filter: { id } }) {
        const filterParams: QueryFiltersType = {
          filter: [[[`id`, '=', `${id}`]]],
        }

        return {
          url: `/watchlist/path`,
          params: {
            filter: JSON.stringify(filterParams),
          },
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

export const { useWatchlistsQuery, useAddWatchlistMutation, useWatchlistByIdQuery, useUpdateWatchlistMutation, useDeleteWatchlistMutation } = watchlistApi
