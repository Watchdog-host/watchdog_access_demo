import { AccountTypeEnum } from 'constants/enums'
import { useProfileQuery } from 'store/endpoints'

const useGetRole = () => {
  const { data: profileData } = useProfileQuery()

  const isOwner = profileData?.type === AccountTypeEnum.Owner
  const isAdmin = profileData?.type === AccountTypeEnum.Admin
  const isAgent = profileData?.type === AccountTypeEnum.Agent
  const isCustomer = profileData?.type === AccountTypeEnum.Customer
  const isOperator = profileData?.type === AccountTypeEnum.Operator
  return { isOwner, isAdmin, isAgent, isCustomer, isOperator }
}

export default useGetRole
