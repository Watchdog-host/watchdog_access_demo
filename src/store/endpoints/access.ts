import { Dayjs } from 'dayjs'
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { BASE_URL } from 'constants/common'
import { FILTER_ACTIONS_TYPE, IAccessDTO, QueryFiltersType } from 'types'
import { AccessTypeEnum, AlertTypeEnum, DescriptorTypeEnum, GrantTypeEnum, PaymentTypeEnum } from 'constants/enums'

type CountType = {
  count: number
}

type AccessFilterType = {
  url: string
  mode?: 'inside' | 'returned' | AlertTypeEnum
  offset?: number
  limit?: number

  startDate: Dayjs
  endDate: Dayjs
  startPaidDate?: Dayjs
  endPaidDate?: Dayjs
  alert_type?: AlertTypeEnum
  access_type?: AccessTypeEnum
  descriptor_type?: DescriptorTypeEnum
  grant_type?: GrantTypeEnum
  payment_type?: PaymentTypeEnum
  device_id?: number[]
  sort?: keyof IAccessDTO
}

export const accessApi = createApi({
  reducerPath: `access`,
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
  tagTypes: ['Access', 'AccessRevenue', 'Checkin', 'Payment'],

  endpoints: (builder) => ({
    // queries
    accessCount: builder.query<CountType, AccessFilterType>({
      query({ url, mode = 'inside', startDate, endDate, startPaidDate, endPaidDate, alert_type, access_type, descriptor_type, grant_type, payment_type, device_id }) {
        const insideParams: QueryFiltersType = {
          filter: [
            [
              [`access_id`, '=', null],
              [`type`, '=', AccessTypeEnum.CheckIn],
              [`verified`, '=', true],

              [`time`, '>=', startDate],
              [`time`, '<=', endDate],

              ...(startPaidDate ? [['paid_at', '>=', startPaidDate]] : []),
              ...(endPaidDate ? [['paid_at', '<=', endPaidDate]] : []),
              ...(typeof alert_type === 'number' ? [['alert_type', '=', alert_type]] : []),
              ...(typeof access_type === 'number' ? [['type', '=', access_type]] : []),
              ...(typeof descriptor_type === 'number' ? [['descriptor_type', '=', descriptor_type]] : []),
              ...(typeof grant_type === 'number' ? [['grant_type', '=', grant_type]] : []),
              ...(typeof payment_type === 'number' ? [['payment_type', '=', payment_type]] : []),
              ...(device_id ? [['device_id', 'in', device_id]] : []),
            ].filter(Boolean) as FILTER_ACTIONS_TYPE,
          ],
        }
        const returnedParams: QueryFiltersType = {
          filter: [
            [
              [`access_id`, '>', 0],
              [`type`, '=', AccessTypeEnum.CheckOut],
              [`verified`, '=', true],

              [`time`, '>=', startDate],
              [`time`, '<=', endDate],
              ...(startPaidDate ? [['paid_at', '>=', startPaidDate]] : []),
              ...(endPaidDate ? [['paid_at', '<=', endPaidDate]] : []),
              ...(typeof alert_type === 'number' ? [['alert_type', '=', alert_type]] : []),
              ...(typeof access_type === 'number' ? [['type', '=', access_type]] : []),
              ...(typeof descriptor_type === 'number' ? [['descriptor_type', '=', descriptor_type]] : []),
              ...(typeof grant_type === 'number' ? [['grant_type', '=', grant_type]] : []),
              ...(typeof payment_type === 'number' ? [['payment_type', '=', payment_type]] : []),
              ...(device_id ? [['device_id', 'in', device_id]] : []),
            ].filter(Boolean) as FILTER_ACTIONS_TYPE,
          ],
        }
        const alertParams: QueryFiltersType = {
          filter: [
            [
              [`alert_type`, '=', mode],

              [`time`, '>=', startDate],
              [`time`, '<=', endDate],

              ...(startPaidDate ? [['paid_at', '>=', startPaidDate]] : []),
              ...(endPaidDate ? [['paid_at', '<=', endPaidDate]] : []),
              ...(typeof alert_type === 'number' ? [['alert_type', '=', alert_type]] : []),
              ...(typeof access_type === 'number' ? [['type', '=', access_type]] : []),
              ...(typeof descriptor_type === 'number' ? [['descriptor_type', '=', descriptor_type]] : []),
              ...(typeof grant_type === 'number' ? [['grant_type', '=', grant_type]] : []),
              ...(device_id ? [['device_id', 'in', device_id]] : []),
            ].filter(Boolean) as FILTER_ACTIONS_TYPE,
          ],
        }

        let filterParams
        if (mode === 'inside') {
          filterParams = insideParams
        } else if (mode === 'returned') {
          filterParams = returnedParams
        } else {
          filterParams = alertParams
        }

        return {
          url: `${url}/api/v1/access/count`,
          params: {
            filter: JSON.stringify(filterParams),
          },
        }
      },
      providesTags: ['Access'],
    }),

    checkin: builder.query<
      IAccessDTO[],
      {
        descriptor: string
        descriptor_type: number
        url: string
      }
    >({
      query({ url, descriptor, descriptor_type }) {
        return {
          url: `${url}/api/v1/access/checkin`,
          params: { descriptor, descriptor_type },
        }
      },
      providesTags: ['Checkin'],
    }),

    //mutations
    addCheckin: builder.mutation<IAccessDTO[], { url: string; type: AccessTypeEnum; descriptor: string; descriptor_type: number }>({
      query({ url, ...variables }) {
        return {
          url: `${url}/api/v1/access/checkin`,
          method: `POST`,
          body: variables,
        }
      },
      invalidatesTags: ['Checkin'],
    }),
    addAccessPayment: builder.mutation<{ url: string; id: number; paid_amount: number; payment_type: PaymentTypeEnum }, any>({
      query({ url, ...variables }) {
        return {
          url: `${url}/api/v1/access/payment`,
          method: `POST`,
          body: variables,
        }
      },
      invalidatesTags: ['Payment'],
    }),
  }),
})

export const {
  useAccessCountQuery,
  useLazyAccessCountQuery,

  useLazyCheckinQuery,
  useAddCheckinMutation,
  useAddAccessPaymentMutation,
} = accessApi
