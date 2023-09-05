import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { API_URL } from 'constants/common'
import { LoginRequest, LoginResponse } from 'types'

export const loginApi = createApi({
  reducerPath: `login`,
  baseQuery: fetchBaseQuery({
    baseUrl: API_URL,
    prepareHeaders(headers) {
      return headers
    },
  }),

  endpoints: (builder) => ({
    login: builder.mutation<LoginResponse, LoginRequest>({
      query(data) {
        return {
          url: `/account/login`,
          method: `POST`,
          body: data,
        }
      },
    }),
  }),
})

export const { useLoginMutation } = loginApi
