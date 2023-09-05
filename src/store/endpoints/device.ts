import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { API_URL } from 'constants/common'
import { QueryFiltersType, IDeviceDTO } from 'types'

export const devicesApi = createApi({
  reducerPath: `device`,
  keepUnusedDataFor: 0.1,
  baseQuery: fetchBaseQuery({
    baseUrl: API_URL,
    prepareHeaders(headers) {
      const token = localStorage.getItem('token')
      headers.set('Authorization', `Bearer ${token}`)
      headers.set('cache-control', `must-revalidate,no-cache,no-store`)
      return headers
    },
  }),
  tagTypes: ['Devices', 'DeviceById'],

  endpoints: (builder) => ({
    // queries
    devices: builder.query<
      IDeviceDTO[],
      {
        filter: { edge_id?: number; type?: string; id?: number[] }
        sort?: keyof IDeviceDTO
      }
    >({
      query({ filter: { edge_id, type, id }, sort }) {
        const filterParams: QueryFiltersType = {
          filter: [[[`edge_id`, '=', `${edge_id}`]]],
        }
        type && filterParams.filter?.[0].push([`type`, '=', `${type}`])
        id && id.length && filterParams.filter?.[0].push([`id`, 'in', id])
        return {
          url: `/device`,
          params: {
            filter: JSON.stringify(filterParams),
            sort,
          },
        }
      },
      providesTags: ['Devices'],
    }),

    deviceById: builder.query<IDeviceDTO, { id?: number }>({
      query({ id }) {
        return {
          url: `/device/${id}`,
        }
      },
      providesTags: ['Devices', 'DeviceById'],
    }),

    deviceSnapshot: builder.query<IDeviceDTO, { id: number; thumbnail?: boolean }>({
      query({ id, thumbnail }) {
        return {
          url: `/device/${id}/snapshot`,
          params: { thumbnail },
        }
      },
    }),

    // mutations
    addDevice: builder.mutation<IDeviceDTO, Partial<IDeviceDTO> & any>({
      query(data) {
        return {
          url: `/device`,
          method: `POST`,
          body: data,
        }
      },
      invalidatesTags: ['Devices'],
    }),

    updateDevice: builder.mutation<IDeviceDTO, { device_id?: number }>({
      query({ device_id, ...variables }) {
        return {
          url: `/device/${device_id}`,
          method: `PUT`,
          body: variables,
        }
      },
      invalidatesTags: ['Devices', 'DeviceById'],
    }),

    deleteDevice: builder.mutation<IDeviceDTO, { id?: number }>({
      query({ id }) {
        return {
          url: `/device/${id}`,
          method: `DELETE`,
        }
      },
      invalidatesTags: ['Devices', 'DeviceById'],
    }),

    addDeviceDescriptor: builder.mutation<IDeviceDTO, { id: number }>({
      query({ id, ...variables }) {
        return {
          url: `/device/${id}/descriptor`,
          method: `POST`,
          body: variables,
        }
      },
      invalidatesTags: ['Devices'],
    }),
  }),
})

export const {
  useDevicesQuery,
  useDeviceByIdQuery,
  useDeviceSnapshotQuery,
  useAddDeviceMutation,
  useUpdateDeviceMutation,
  useDeleteDeviceMutation,
  useAddDeviceDescriptorMutation,
} = devicesApi
