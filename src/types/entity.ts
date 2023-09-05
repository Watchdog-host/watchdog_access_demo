import { DefaultOptionType } from 'antd/es/select'

export interface IWatchlistdevice {
  title?: string
  watchlist_id?: number
  device_id?: number
  active?: boolean
  alert_type: number
  grant_type: number
}

type IOption = DefaultOptionType & {
  edge_id: number
  title: string
}

export type IGroupOptions = {
  label: string
  options: IOption[]
}
