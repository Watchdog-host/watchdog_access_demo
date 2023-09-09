import {
  AccessTypeEnum,
  AccountTypeEnum,
  AlertTypeEnum,
  DescriptorTypeEnum,
  DeviceTypeEnum,
  EdgeStatusEnum,
  EdgeTypeEnum,
  GrantTypeEnum,
  PaymentTypeEnum,
  PlanTypeEnum,
  StatusTypeEnum,
  WatchlistTypeEnum,
} from 'constants/enums'
import { FILTER_ACTIONS_TYPE, GENDER_TYPE, STATE_NUMBERS } from './common'

export interface IEdgeStatus {
  edge_status: EdgeStatusEnum
  degraded_devices: number
  offline_devices: number
  online_devices: number
  timestamp: string
  version: string
  system_info: {
    cpu: number
    cpu_temperature: 71
    disk: number
    memory: number
    swap: number
    timestamp: string
  }
}

export interface IEdgeDTO {
  id: number
  type: EdgeTypeEnum
  title: string
  private_ip: string
  public_ip: string
  latitude: number
  longitude: number
  extra_field: any

  edge_id: number

  children?: IEdgeDTO[]
  enabled?: boolean
  status?: IEdgeStatus | null
}

export interface IAccountDTO {
  edge_id: number
  email: string
  extra_field: any
  id: number
  title: string
  password: string
  type: AccountTypeEnum
  edges: IEdgeDTO
  image: string
}
export interface IProfileDTO {
  edge_id: number
  email: string
  extra_field: any
  id: number
  title: string
  token: string
  type: AccountTypeEnum
  image: string
}

export interface LoginRequest {
  email: string
  password: string
  remember: boolean
}

export interface IWatchlistDTO {
  id?: number
  type: WatchlistTypeEnum
  title: string
  extra_field?: any
  image: string

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
  type: DeviceTypeEnum
  model: DeviceTypeEnum
  access_type: AccessTypeEnum
  source: string
  latitude: number
  longitude: number
  extra_field?: any

  //question
  direction: number
  state: boolean
}

export interface IAccessDTO {
  id?: number
  type: AccessTypeEnum | null
  time?: string
  descriptor: string
  descriptor_type: DescriptorTypeEnum
  confidence?: number
  verified: boolean
  device_type: DeviceTypeEnum
  alert_type: AlertTypeEnum | null
  grant_type?: GrantTypeEnum | null
  paid_at?: string | null
  paid_amount?: number | null
  payment_type?: PaymentTypeEnum | null
  debt?: number | null
  elapsed_minutes?: number | null
  device_title: string
  watchlist_title?: string
  identity_title: string
  image: string | null
  extra_field?: any
  access_id?: number | null
  watchlist_id?: number | null
  device_id?: number
  identity_id?: number | null
}

export interface IAccessAlertsDTO {
  inside_count: number
  outside_count: number
  total_count: number
  information_amount: number
  warning_amount: number
  critical_amount: number
  groups?: {
    device_id: number
    information_amount: number
    warning_amount: number
    critical_amount: number
  }[]
}

export interface IAccessRevenueDTO {
  inside_count: number
  outside_count: number
  total_count: number
  paid_amount: number
  debt_amount: number
  groups: {
    device_id: number
    paid_amount: number
    debt_amount: number
  }[]
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
