import { DefaultOptionType } from 'antd/es/select'
import { DescriptorTypeEnum } from 'constants/enums'

export interface IWatchlistdevice {
  title?: string
  watchlist_id: number
  device_id?: number
  active?: boolean
  alert_type: number
  grant_type: number
}

interface IOption extends DefaultOptionType {
  edge_id: number
  title: string
}

export type IGroupOptions = {
  label: string
  options: IOption[]
}
export type DescriptorTagType = {
  descriptor: string
  type?: DescriptorTypeEnum
}
export interface DescriptorTagObject {
  [key: number]: DescriptorTagType[]
}

export interface watchlistObject {
  [key: number]: {
    alert_type: number
    grant_type: number
  }
}
