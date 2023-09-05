import {
  AccessTypeEnum,
  AccountTypeEnum,
  AlertTypeEnum,
  DescriptorTypeEnum,
  DeviceTypeEnum,
  GrantTypeEnum,
  PaymentTypeEnum,
  PlanTypeEnum,
  StatusTypeEnum,
} from 'constants/enums'
import { FILTER_ACTIONS_TYPE, GENDER_TYPE, STATE_NUMBERS } from './common'

export interface LoginRequest {
  email: string
  password: string
}

export interface LoginResponse {
  token: string
}

export interface IEdgeDTO {
  children: IEdgeDTO[]
  enabled: boolean
  extra_field: any
  id: number
  private_ip: string
  public_ip: string
  latitude: number
  longitude: number
  edge_id: number
  title: string
}

export interface IAccountDTO {
  edge_id: number
  email: string
  extra_field: any
  id: number
  title: string
  password: string
  type: 0 | 1 | 2 | 3 | 4 |5
  edges: IEdgeDTO
}

export interface IWatchlistDTO {
  title: string
  id?: number
  extra_field?: any
  watchlists?: IWatchlistDTO[]
}

export interface IIdentityDTO {
  id: number
  title: string
  type: GENDER_TYPE
  birthdate: any
  image: string
  extra_field: any
}

export interface IDescriptorDTO {
  id: number
  type: number
  data: string
  extra_field: any
  identity_id: number
}
export interface IDeviceDeviceDTO {
  id: number
  extra_field?: any
  input_device_id: number
  output_device_id: number
}

export interface IWatchlistdeviceDTO {
  id?: number
  alert_type: number
  grant_type: number
  extra_field?: any
  watchlist_id: number
  device_id: number
}

export type IPlanDTO = {
  id: number
  edge_id: number
  type: PlanTypeEnum
  title: string
  price: number
  discount: number
  agent_share: number
  extra_field?: any
  expiry?: string
}

export interface IPaymentDTO {
  id: number
  type: PaymentTypeEnum
  edge_id: number
  days: number
  plan_type: PlanTypeEnum
  plan_title: string
  amount: number
  discount: number
  agent_share: number
  paid_at?: string
  canceled_at?: string
  extra_field?: any
}

export interface IDeviceDTO {
  id: number
  title: string
  type: STATE_NUMBERS
  model: number
  access_type: number
  direction: number
  state: boolean
  source: string
  latitude: number
  longitude: number
  extra_field?: any
}

export interface IAccessDTO {
  id?: number
  type: AccessTypeEnum
  time?: string
  descriptor: string
  descriptor_type: DescriptorTypeEnum
  confidence?: number
  verified: boolean
  device_type: DeviceTypeEnum
  alert_type: AlertTypeEnum
  grant_type?: GrantTypeEnum
  paid_at?: string | null
  paid_amount?: number | null
  payment_type?: PaymentTypeEnum | null
  debt?: number | null
  elapsed_minutes?: number | null
  device_title: string
  watchlist_title?: string
  identity_title: string
  image?: string | null
  extra_field?: any

  access_id?: number | null
  access_time?: string
  device_id?: number
  identity_id?: number | null
}

export type QueryFiltersType = {
  filter?: FILTER_ACTIONS_TYPE[]
  offset?: number
  limit?: number
}

export type WsStatusTypes = {
  command: number
  description: string
  device_id: number
  extra_field: any
  time: string
  type: StatusTypeEnum
}
