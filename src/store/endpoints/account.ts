import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { BASE_URL } from 'constants/common'
import { IAccountDTO, QueryFiltersType } from 'types'

export const accountApi = createApi({
  reducerPath: `account`,
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
  tagTypes: ['Profile', 'Accounts', 'AccountById'],

  endpoints: (builder) => ({
    // queries
    accounts: builder.query<
      IAccountDTO[],
      {
        edge_id?: number
        email?: string
        id?: number
        login?: string
        name?: string
        type?: number
      }
    >({
      query({ type, edge_id, email, id, login, name }) {
        const filterParams: QueryFiltersType = {
          filter: [
            [
              [`edge_id`, '=', `${edge_id}`],
              [`type`, '>', `${type}`],
            ],
          ],
        }
        return {
          url: `/account`,
          params: {
            filter: JSON.stringify(filterParams),
          },
        }
      },
      providesTags: ['Accounts'],
    }),

    accountById: builder.query<IAccountDTO, { id?: number }>({
      query({ id }) {
        return {
          url: `/account/${id}`,
        }
      },
      providesTags: ['Accounts', 'AccountById'],
    }),

    // mutations
    addAccount: builder.mutation<IAccountDTO, Partial<IAccountDTO>>({
      query(data) {
        return {
          url: `/account`,
          method: `POST`,
          body: data,
        }
      },
      invalidatesTags: ['Accounts'],
    }),

    updateAccount: builder.mutation<IAccountDTO, { account_id?: number }>({
      query({ account_id, ...variables }) {
        return {
          url: `/account/${account_id}`,
          method: `PUT`,
          body: variables,
        }
      },
      invalidatesTags: ['Accounts', 'AccountById'],
    }),

    updateProfile: builder.mutation<IAccountDTO, { profile_id?: number }>({
      query({ profile_id, ...variables }) {
        return {
          url: `/account/profile`,
          method: `PUT`,
          body: variables,
        }
      },
      invalidatesTags: ['Accounts', 'AccountById'],
    }),

    deleteAccount: builder.mutation<IAccountDTO, { account_id?: number }>({
      query({ account_id }) {
        return {
          url: `/account/${account_id}`,
          method: `DELETE`,
        }
      },
      invalidatesTags: ['Accounts', 'AccountById'],
    }),
  }),
})

export const { useAccountsQuery, useAccountByIdQuery, useAddAccountMutation, useUpdateAccountMutation, useUpdateProfileMutation, useDeleteAccountMutation } = accountApi
