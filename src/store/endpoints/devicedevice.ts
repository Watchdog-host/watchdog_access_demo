import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { API_URL } from 'constants/common'
import { IDeviceDeviceDTO, QueryFiltersType } from 'types'

export const devicedeviceApi = createApi({
  reducerPath: `devicedevice`,
  baseQuery: fetchBaseQuery({
    baseUrl: API_URL,
    prepareHeaders(headers) {
      const token = localStorage.getItem('token')
      headers.set('Authorization', `Bearer ${token}`)
      return headers
    },
  }),
  tagTypes: ['Devicedevice', 'DevicedeviceById'],

  endpoints: (builder) => ({
    // queries
    devicedevice: builder.query<IDeviceDeviceDTO[], { input_device_id?: number }>({
      query({ input_device_id }) {
        const filterParams: QueryFiltersType = {
          filter: [[[`input_device_id`, '=', `${input_device_id}`]]],
        }
        return {
          url: `/devicedevice`,
          params: {
            filter: JSON.stringify(filterParams),
          },
        }
      },
      providesTags: ['Devicedevice'],
    }),

    devicedeviceById: builder.query<IDeviceDeviceDTO, { id: number }>({
      query({ id }) {
        return {
          url: `/devicedevice/${id}`,
        }
      },
      providesTags: ['DevicedeviceById'],
    }),

    // mutations
    addDevicedevice: builder.mutation<IDeviceDeviceDTO, Partial<IDeviceDeviceDTO>>({
      query(data) {
        return {
          url: `/devicedevice`,
          method: `POST`,
          body: data,
        }
      },
      invalidatesTags: ['Devicedevice'],
    }),

    updateDevicedevice: builder.mutation<IDeviceDeviceDTO, { id: any }>({
      query({ id, ...variables }) {
        return {
          url: `/devicedevice/${id}`,
          method: `PUT`,
          body: variables,
        }
      },
      invalidatesTags: ['Devicedevice', 'DevicedeviceById'],
    }),

    deleteDevicedevice: builder.mutation<IDeviceDeviceDTO, { id?: number }>({
      query({ id, ...variables }) {
        return {
          url: `/devicedevice/${id}`,
          method: `DELETE`,
          body: variables,
        }
      },
      invalidatesTags: ['Devicedevice'],
    }),
  }),
})

export const {
  useDevicedeviceQuery,
  useDevicedeviceByIdQuery,
  useAddDevicedeviceMutation,
  useUpdateDevicedeviceMutation,
  useDeleteDevicedeviceMutation,
} = devicedeviceApi
