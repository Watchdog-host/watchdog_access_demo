import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { API_URL } from 'constants/common'
import { IEdgeDTO } from 'types'

export const edgesApi = createApi({
  reducerPath: `edges`,
  keepUnusedDataFor: 0,
  baseQuery: fetchBaseQuery({
    baseUrl: API_URL,
    prepareHeaders(headers) {
      const token = localStorage.getItem('token')
      headers.set('Authorization', `Bearer ${token}`)
      return headers
    },
  }),
  tagTypes: ['Edges', 'EdgeById'],

  endpoints: (builder) => ({
    // queries
    edges: builder.query<IEdgeDTO[], void>({
      query() {
        return {
          url: `/edge`,
        }
      },
      providesTags: ['Edges'],
    }),

    edgeById: builder.query<IEdgeDTO[], { edge_id?: number }>({
      query({ edge_id }) {
        return {
          url: `/edge/path/${edge_id}`,
        }
      },
      providesTags: ['Edges', 'EdgeById'],
    }),

    // mutations
    addEdge: builder.mutation<IEdgeDTO, Partial<IEdgeDTO>>({
      query(data) {
        return {
          url: `/edge`,
          method: `POST`,
          body: data,
        }
      },
      invalidatesTags: ['Edges'],
    }),

    updateEdge: builder.mutation<IEdgeDTO, { edge_id: number }>({
      query({ edge_id, ...variables }) {
        return {
          url: `/edge/${edge_id}`,
          method: `PUT`,
          body: variables,
        }
      },
      invalidatesTags: ['Edges', 'EdgeById'],
    }),

    deleteEdge: builder.mutation<IEdgeDTO, { edge_id: number }>({
      query({ edge_id, ...variables }) {
        return {
          url: `/edge/${edge_id}`,
          method: `DELETE`,
          body: variables,
        }
      },
      invalidatesTags: ['Edges', 'EdgeById'],
    }),
  }),
})

export const { useEdgesQuery, useEdgeByIdQuery, useAddEdgeMutation, useUpdateEdgeMutation, useDeleteEdgeMutation } =
  edgesApi
