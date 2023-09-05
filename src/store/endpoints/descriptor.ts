import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { API_URL } from 'constants/common'
import { IDescriptorDTO, QueryFiltersType } from 'types'

export const descriptorApi = createApi({
  reducerPath: `descriptor`,
  baseQuery: fetchBaseQuery({
    baseUrl: API_URL,
    prepareHeaders(headers) {
      const token = localStorage.getItem('token')
      headers.set('Authorization', `Bearer ${token}`)
      return headers
    },
  }),
  tagTypes: ['Descriptor', 'DescriptorById'],

  endpoints: (builder) => ({
    // queries
    descriptor: builder.query<
      IDescriptorDTO[],
      {
        identity_id?: number | null | undefined
      }
    >({
      query({ identity_id }) {
        const filterParams: QueryFiltersType = {
          filter: [[[`identity_id`, '=', `${identity_id}`]]],
        }
        return {
          url: `/descriptor`,
          params: {
            filter: JSON.stringify(filterParams),
          },
        }
      },
      providesTags: ['Descriptor'],
    }),

    descriptorById: builder.query<IDescriptorDTO, { id: any }>({
      keepUnusedDataFor: 1,
      query({ id }) {
        return {
          url: `/descriptor/${id}`,
        }
      },
      providesTags: ['DescriptorById'],
    }),

    // mutations
    addDescriptor: builder.mutation<IDescriptorDTO, Partial<IDescriptorDTO>>({
      query(data) {
        return {
          url: `/descriptor`,
          method: `POST`,
          body: data,
        }
      },
      invalidatesTags: ['Descriptor'],
    }),

    deleteDescriptor: builder.mutation<IDescriptorDTO, { id: number | null }>({
      query({ id, ...variables }) {
        return {
          url: `/descriptor/${id}`,
          method: `DELETE`,
          body: variables,
        }
      },
      invalidatesTags: ['Descriptor'],
    }),
  }),
})

export const { useDescriptorQuery, useDescriptorByIdQuery, useAddDescriptorMutation, useDeleteDescriptorMutation } =
  descriptorApi
