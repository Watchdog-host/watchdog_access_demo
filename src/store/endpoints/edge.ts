import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { BASE_URL } from 'constants/common'
import { IEdgeDTO, IEdgeStatus } from 'types'

export const edgesApi = createApi({
  reducerPath: `edges`,
  keepUnusedDataFor: 0,
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
  tagTypes: ['Edges', 'EdgeStatus', 'EdgePath', 'EdgeById'],
  endpoints: (builder) => ({
    // queries
    edgePath: builder.query<IEdgeDTO, void>({
      query() {
        return {
          url: `/edge/path`,
        }
      },
      providesTags: ['EdgePath'],
    }),

    edgeById: builder.query<IEdgeDTO, { edge_id: number }>({
      query({ edge_id }) {
        return {
          url: `/edge/${edge_id}`,
        }
      },
      providesTags: ['EdgeById'],
    }),
    edgeStatus: builder.query<IEdgeStatus, void>({
      query() {
        return {
          url: `/edge/status`,
        }
      },
      providesTags: ['EdgeStatus'],
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

export const { useEdgeStatusQuery, useEdgePathQuery, useLazyEdgePathQuery, useAddEdgeMutation, useUpdateEdgeMutation, useDeleteEdgeMutation } = edgesApi
