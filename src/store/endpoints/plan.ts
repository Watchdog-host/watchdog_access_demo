import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { BASE_URL } from 'constants/common'
import { IPlanDTO } from 'types'

export const planApi = createApi({
  reducerPath: `plan`,
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
  tagTypes: ['Plan', 'PlanById'],

  endpoints: (builder) => ({
    // queries
    plans: builder.query<IPlanDTO[], void>({
      query() {
        return {
          url: `/plan/expiry`,
        }
      },
      providesTags: ['Plan'],
    }),

    planById: builder.query<IPlanDTO, { id: number }>({
      query({ id }) {
        return {
          url: `/plan/${id}`,
        }
      },
      providesTags: ['PlanById'],
    }),

    // mutations
    addPlan: builder.mutation<IPlanDTO, Partial<IPlanDTO>>({
      query(data) {
        return {
          url: `/plan`,
          method: `POST`,
          body: data,
        }
      },
      invalidatesTags: ['Plan'],
    }),

    updatePlan: builder.mutation<IPlanDTO, { plan_id: any }>({
      query({ plan_id, ...variables }) {
        return {
          url: `/plan/${plan_id}`,
          method: `PUT`,
          body: variables,
        }
      },
      invalidatesTags: ['Plan', 'PlanById'],
    }),

    deletePlan: builder.mutation<IPlanDTO, { id?: number }>({
      query({ id, ...variables }) {
        return {
          url: `/plan/${id}`,
          method: `DELETE`,
          body: variables,
        }
      },
      invalidatesTags: ['Plan'],
    }),
  }),
})

export const { usePlansQuery, usePlanByIdQuery, useAddPlanMutation, useUpdatePlanMutation, useDeletePlanMutation } = planApi
