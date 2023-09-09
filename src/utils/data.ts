import { DescriptorTypeEnum } from 'constants/enums'
import { DescriptorTagObject, DescriptorTagType, IEdgeDTO, IWatchlistdevice, watchlistObject } from 'types'

export const createDescriptorObject = (dataArray: DescriptorTagType[]): DescriptorTagObject => {
  return dataArray.reduce((result: DescriptorTagObject, item: DescriptorTagType) => {
    const type = item.type as DescriptorTypeEnum
    if (!result[type]) {
      result[type] = []
    }
    result[type].push({ descriptor: item.descriptor })
    return result
  }, {})
}

export const fromDescriptorObject = (descriptorObject: DescriptorTagObject): DescriptorTagType[] => {
  const result: DescriptorTagType[] = []
  for (const [typeStr, array] of Object.entries(descriptorObject)) {
    const type = parseInt(typeStr)
    array.forEach((item: DescriptorTagType) => {
      result.push({ ...item, type })
    })
  }
  return result
}

export function createWatchlistObject(input: IWatchlistdevice[]): watchlistObject {
  return input?.reduce((result: watchlistObject, item: IWatchlistdevice) => {
    if (item && item.active) {
      const { watchlist_id, alert_type, grant_type } = item
      result[watchlist_id] = { alert_type, grant_type }
    }
    return result
  }, {})
}

export function fromWatchlistObject(output: watchlistObject): IWatchlistdevice[] | undefined {
  return Object.keys(output || {}).map((key) => {
    const watchlist_id = parseInt(key)
    const { alert_type, grant_type } = output[watchlist_id]
    return { alert_type, grant_type, watchlist_id }
  })
}

export function flattenEdgeObject(obj: IEdgeDTO | undefined): IEdgeDTO[] {
  let result: IEdgeDTO[] = []
  if (obj) {
    result.push(obj)
    if (obj.children && Array.isArray(obj.children)) {
      for (const child of obj.children) {
        result = result.concat(flattenEdgeObject(child))
      }
    }
  }
  return result
}
