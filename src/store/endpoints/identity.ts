import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { BASE_URL } from 'constants/common'
import { IIdentityDTO, QueryFiltersType } from 'types'

export const identityApi = createApi({
  reducerPath: `identity`,
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
  tagTypes: ['Identities', 'IdentityById'],

  endpoints: (builder) => ({
    // queries
    identities: builder.query<
      IIdentityDTO[],
      {
        watchlist_id?: number
      }
    >({
      query({ watchlist_id }) {
        const filterParams: QueryFiltersType = {
          filter: [[[`watchlist_id`, '=', `${watchlist_id}`]]],
        }
        return {
          url: `/identity`,
          params: {
            filter: JSON.stringify(filterParams),
          },
        }
      },
      providesTags: ['Identities'],
    }),

    identityById: builder.query<IIdentityDTO, { id: any }>({
      keepUnusedDataFor: 1,
      query({ id }) {
        return {
          url: `/identity/${id}`,
        }
      },
      providesTags: ['IdentityById'],
    }),

    // mutations
    addIdentity: builder.mutation<IIdentityDTO, Partial<IIdentityDTO>>({
      query(data) {
        return {
          url: `/identity`,
          method: `POST`,
          body: data,
        }
      },
      invalidatesTags: ['Identities'],
    }),

    updateIdentity: builder.mutation<IIdentityDTO, { identity_id: any }>({
      query({ identity_id, ...variables }) {
        return {
          url: `/identity/${identity_id}`,
          method: `PUT`,
          body: variables,
        }
      },
      invalidatesTags: ['Identities', 'IdentityById'],
    }),

    deleteIdentity: builder.mutation<IIdentityDTO, { id?: number }>({
      query({ id, ...variables }) {
        return {
          url: `/identity/${id}`,
          method: `DELETE`,
          body: variables,
        }
      },
      invalidatesTags: ['Identities'],
    }),
  }),
})

export const { useIdentitiesQuery, useLazyIdentityByIdQuery, useIdentityByIdQuery, useAddIdentityMutation, useUpdateIdentityMutation, useDeleteIdentityMutation } = identityApi
