import { Dayjs } from 'dayjs'
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { BASE_URL } from 'constants/common'
import { FILTER_ACTIONS_TYPE, IAccessDTO, IAccessRevenueDTO, QueryFiltersType } from 'types'
import { AccessTypeEnum, AlertTypeEnum, DescriptorTypeEnum, GrantTypeEnum, PaymentTypeEnum } from 'constants/enums'

type RevenueFilter = {
  url: string
  mode?: 'inside' | 'returned' | AlertTypeEnum
  offset?: number
  limit?: number

  startDate: Dayjs
  endDate: Dayjs
  // startPaidDate?: Dayjs
  // endPaidDate?: Dayjs
  alert_type?: AlertTypeEnum
  access_type?: AccessTypeEnum
  descriptor_type?: DescriptorTypeEnum
  grant_type?: GrantTypeEnum
  payment_type?: PaymentTypeEnum
  device_id?: number[]
  sort?: keyof IAccessDTO
}

export const revenueApi = createApi({
  reducerPath: `revenue`,
  baseQuery: fetchBaseQuery({
    // baseUrl: `${BASE_URL}/v1`,
    timeout: 5000,
    prepareHeaders(headers) {
      const profileData = localStorage.getItem('profile')
      if (profileData !== null) {
        const profile = JSON.parse(profileData)
        headers.set('Authorization', `Bearer ${profile.token}`)
      }
      return headers
    },
  }),
  tagTypes: ['Revenue', 'AccessRevenue'],

  endpoints: (builder) => ({
    // queries
    revenue: builder.query<IAccessDTO[], RevenueFilter>({
      query({ url, offset, limit, startDate, endDate, payment_type, descriptor_type, device_id, sort }) {
        const filterParams: QueryFiltersType = {
          filter: [
            [
              [`time`, '>=', startDate],
              [`time`, '<=', endDate],

              // ...(startPaidDate ? [['paid_at', '>=', startPaidDate]] : []),
              // ...(endPaidDate ? [['paid_at', '<=', endPaidDate]] : []),
              ...(typeof descriptor_type === 'number' ? [['descriptor_type', '=', descriptor_type]] : []),
              ...(typeof payment_type === 'number' ? [['payment_type', '=', payment_type]] : []),
              ...(device_id ? [['device_id', 'in', device_id]] : []),
            ].filter(Boolean) as FILTER_ACTIONS_TYPE,
          ],
        }
        return {
          url: `${url}/api/v1/access`,
          params: {
            filter: JSON.stringify(filterParams),
            offset: offset ? offset : 0,
            limit: limit ? limit : 6,
            sort: sort,
          },
        }
      },
      providesTags: ['Revenue'],
    }),
    accessRevenue: builder.query<IAccessRevenueDTO, RevenueFilter>({
      query({ url, startDate, endDate, payment_type, descriptor_type, device_id }) {
        const filterParams: QueryFiltersType = {
          filter: [
            [
              [`time`, '>=', startDate],
              [`time`, '<=', endDate],

              // ...(startPaidDate ? [['paid_at', '>=', startPaidDate]] : []),
              // ...(endPaidDate ? [['paid_at', '<=', endPaidDate]] : []),
              ...(typeof descriptor_type === 'number' ? [['descriptor_type', '=', descriptor_type]] : []),
              ...(typeof payment_type === 'number' ? [['payment_type', '=', payment_type]] : []),
              ...(device_id ? [['device_id', 'in', device_id]] : []),
            ].filter(Boolean) as FILTER_ACTIONS_TYPE,
          ],
        }
        return {
          url: `${url}/api/v1/access/revenue`,
          params: {
            filter: JSON.stringify(filterParams),
          },
        }
      },
      providesTags: ['AccessRevenue'],
    }),
  }),
})

export const { useLazyRevenueQuery, useLazyAccessRevenueQuery } = revenueApi
