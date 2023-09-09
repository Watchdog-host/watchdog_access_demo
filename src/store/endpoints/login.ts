import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { BASE_URL } from 'constants/common'
import { LoginRequest, IProfileDTO } from 'types'

export const loginApi = createApi({
  reducerPath: `login`,
  baseQuery: fetchBaseQuery({
    baseUrl: `${BASE_URL}/v1`,
    prepareHeaders(headers) {
      return headers
    },
  }),

  endpoints: (builder) => ({
    login: builder.mutation<IProfileDTO, LoginRequest>({
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
