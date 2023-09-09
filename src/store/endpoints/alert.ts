import { Dayjs } from 'dayjs'
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { BASE_URL } from 'constants/common'
import { FILTER_ACTIONS_TYPE, IAccessAlertsDTO, IAccessDTO, QueryFiltersType } from 'types'
import { AccessTypeEnum, AlertTypeEnum, DescriptorTypeEnum, GrantTypeEnum, PaymentTypeEnum } from 'constants/enums'

type AlertFilter = {
  url: string
  mode?: 'inside' | 'returned' | AlertTypeEnum
  offset?: number
  limit?: number
  sort?: keyof IAccessDTO

  startDate: Dayjs
  endDate: Dayjs
  alert_type?: AlertTypeEnum
  access_type?: AccessTypeEnum
  descriptor_type?: DescriptorTypeEnum
  grant_type?: GrantTypeEnum
  device_id?: number[]
}

export const alertApi = createApi({
  reducerPath: `alert`,
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
  tagTypes: ['Alert', 'AccessAlerts'],

  endpoints: (builder) => ({
    // queries
    alert: builder.query<IAccessDTO[], AlertFilter>({
      query({ url, offset, limit, startDate, endDate, alert_type, access_type, grant_type, descriptor_type, device_id, sort }) {
        const filterParams: QueryFiltersType = {
          filter: [
            [
              [`time`, '>=', startDate],
              [`time`, '<=', endDate],

              ...(typeof alert_type === 'number' ? [['alert_type', '=', alert_type]] : []),
              ...(typeof access_type === 'number' ? [['type', '=', access_type]] : []),
              ...(typeof descriptor_type === 'number' ? [['descriptor_type', '=', descriptor_type]] : []),
              ...(typeof grant_type === 'number' ? [['grant_type', '=', grant_type]] : []),
              ...(device_id ? [['device_id', 'in', device_id]] : []),
            ].filter(Boolean) as FILTER_ACTIONS_TYPE,
          ],
        }

        return {
          url: `${url}/api/v1/access`,
          // url: `http://frp-0.prod.darcyai.edgeworx.io:10015/api/v1/access`,
          params: {
            filter: JSON.stringify(filterParams),
            offset: offset ? offset : 0,
            limit: limit ? limit : 6,
            sort: sort,
          },
        }
      },
      providesTags: ['Alert'],
    }),

    accessAlerts: builder.query<IAccessAlertsDTO, AlertFilter>({
      query({ url, startDate, endDate, alert_type, access_type, grant_type, descriptor_type, device_id }) {
        const filterParams: QueryFiltersType = {
          filter: [
            [
              [`time`, '>=', startDate],
              [`time`, '<=', endDate],

              ...(typeof alert_type === 'number' ? [['alert_type', '=', alert_type]] : []),
              ...(typeof access_type === 'number' ? [['type', '=', access_type]] : []),
              ...(typeof descriptor_type === 'number' ? [['descriptor_type', '=', descriptor_type]] : []),
              ...(typeof grant_type === 'number' ? [['grant_type', '=', grant_type]] : []),
              ...(device_id ? [['device_id', 'in', device_id]] : []),
            ].filter(Boolean) as FILTER_ACTIONS_TYPE,
          ],
        }
        return {
          url: `${url}/api/v1/access/alerts`,
          params: {
            filter: JSON.stringify(filterParams),
          },
        }
      },
      providesTags: ['AccessAlerts'],
    }),
  }),
})

export const { useLazyAlertQuery, useLazyAccessAlertsQuery } = alertApi
