import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { BASE_URL } from 'constants/common'
import { IPaymentDTO } from 'types'

export const paymentApi = createApi({
  reducerPath: `payment`,
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
  tagTypes: ['Payment', 'PaymentById'],

  endpoints: (builder) => ({
    // queries
    payments: builder.query<IPaymentDTO[], void>({
      query() {
        return {
          url: `/payment`,
        }
      },
      providesTags: ['Payment'],
    }),

    paymentById: builder.query<IPaymentDTO, { id: number }>({
      query({ id }) {
        return {
          url: `/payment/${id}`,
        }
      },
      providesTags: ['PaymentById'],
    }),

    // mutations
    addPayment: builder.mutation<IPaymentDTO, Partial<IPaymentDTO>>({
      query(data) {
        return {
          url: `/payment`,
          method: `POST`,
          body: data,
        }
      },
      invalidatesTags: ['Payment'],
    }),

    updatePayment: builder.mutation<IPaymentDTO, { payment_id: any }>({
      query({ payment_id, ...variables }) {
        return {
          url: `/payment/${payment_id}`,
          method: `PUT`,
          body: variables,
        }
      },
      invalidatesTags: ['Payment', 'PaymentById'],
    }),

    deletePayment: builder.mutation<IPaymentDTO, { id?: number }>({
      query({ id, ...variables }) {
        return {
          url: `/payment/${id}`,
          method: `DELETE`,
          body: variables,
        }
      },
      invalidatesTags: ['Payment'],
    }),
  }),
})

export const { usePaymentsQuery, usePaymentByIdQuery, useAddPaymentMutation, useUpdatePaymentMutation, useDeletePaymentMutation } = paymentApi
