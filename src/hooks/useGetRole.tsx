import { AccountTypeEnum } from 'constants/enums'
import { useLocalStorage } from 'react-use'
import { IProfileDTO } from 'types'

const useGetRole = () => {
  const [localProfile] = useLocalStorage<IProfileDTO>('profile')

  const isOwner = localProfile?.type === AccountTypeEnum.Owner
  const isAdmin = localProfile?.type === AccountTypeEnum.Admin
  const isAgent = localProfile?.type === AccountTypeEnum.Agent
  const isCustomer = localProfile?.type === AccountTypeEnum.Customer
  const isOperator = localProfile?.type === AccountTypeEnum.Operator
  const isViewer = localProfile?.type === AccountTypeEnum.Viewer
  return { isOwner, isAdmin, isAgent, isCustomer, isOperator, isViewer }
}

export default useGetRole
