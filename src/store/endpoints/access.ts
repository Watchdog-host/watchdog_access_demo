import { Dayjs } from 'dayjs'
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { API_URL } from 'constants/common'
import { IAccessDTO, QueryFiltersType } from 'types'
import { AccessTypeEnum } from 'constants/enums'

type CountType = {
  count: number
}

export const accessApi = createApi({
  reducerPath: `access`,
  baseQuery: fetchBaseQuery({
    baseUrl: API_URL,
    prepareHeaders(headers) {
      const token = localStorage.getItem('token')
      headers.set('Authorization', `Bearer ${token}`)
      return headers
    },
  }),
  tagTypes: ['Access'],

  endpoints: (builder) => ({
    // queries
    accessCount: builder.query<
      CountType,
      {
        mode?: 'inside' | 'returned' | 'information' | 'warning' | 'critical'
        // device_id: number[]
        startDate: Dayjs
        endDate: Dayjs
      }
    >({
      query({
        mode = 'inside',
        //  device_id,
        startDate,
        endDate,
      }) {
        const insideParams: QueryFiltersType = {
          filter: [
            [
              [`access_id`, '=', null],
              [`type`, '=', AccessTypeEnum.Registration],
              [`verified`, '=', true],
              [`time`, '>=', `${startDate}`],
              [`time`, '<=', `${endDate}`],
            ],
          ],
        }
        const returnedParams: QueryFiltersType = {
          filter: [
            [
              [`access_id`, '>', 0],
              [`type`, '=', AccessTypeEnum.Checkout],
              [`verified`, '=', true],
              [`time`, '>=', `${startDate}`],
              [`time`, '<=', `${endDate}`],
            ],
          ],
        }
        const infoParams: QueryFiltersType = {
          filter: [
            [
              [`alert`, '=', mode === 'information' ? 1 : mode === 'warning' ? 2 : 3],
              [`time`, '>=', `${startDate}`],
              [`time`, '<=', `${endDate}`],
            ],
          ],
        }

        let filterParams
        if (mode === 'inside') {
          filterParams = insideParams
        } else if (mode === 'returned') {
          filterParams = returnedParams
        } else {
          filterParams = infoParams
        }
        // device_id.length && filterParams.filter?.[0].push([`device_id`, 'in', device_id])
        return {
          url: `/access/count`,
          params: {
            filter: JSON.stringify(filterParams),
          },
        }
      },
    }),

    access: builder.query<
      IAccessDTO[],
      {
        // device_id: number[]
        startDate: Dayjs
        endDate: Dayjs
        offset: number
        limit: number
      }
    >({
      query({ startDate, endDate, offset, limit }) {
        const filterParams: QueryFiltersType = {
          filter: [
            [
              [`verified`, '=', true],
              [`time`, '>=', `${startDate}`],
              [`time`, '<=', `${endDate}`],
            ],
          ],
        }
        return {
          url: `/access`,
          params: {
            filter: JSON.stringify(filterParams),
            offset: offset ? offset : 0,
            limit: limit ? limit : 6,
          },
        }
      },
      providesTags: ['Access'],
    }),

    accessRevenue: builder.query<
      {
        revenue: number
      },
      {
        startDate: Dayjs
        endDate: Dayjs
      }
    >({
      query({ startDate, endDate }) {
        return {
          url: `/access/revenue`,
          params: {
            from: startDate.valueOf(),
            to: endDate.valueOf(),
          },
        }
      },
      providesTags: ['Access'],
    }),
  }),
})

export const { useAccessCountQuery, useAccessQuery, useAccessRevenueQuery } = accessApi
