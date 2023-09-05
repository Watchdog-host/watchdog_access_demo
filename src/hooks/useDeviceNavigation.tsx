import { DropdownMenuTypes } from 'components/Dropdown/Dropdown'
import { useNavigate } from 'react-router-dom'
import { useAppDispatch } from 'store/hooks'
import { setSelectedDeviceType } from 'store/slices/navigation'
import { DEVICE_TYPE } from 'types'

const useDeviceNavigation = () => {
  const navigate = useNavigate()
  const dispatch = useAppDispatch()

  const onClickDropdown = (key: DEVICE_TYPE) => {
    dispatch(setSelectedDeviceType(key))
    navigate({ search: `type=${key?.toLowerCase()}` })
  }

  const dropdownItems: DropdownMenuTypes[] = [
    {
      label: 'Camera',
      key: 'Camera',
      onClick: ({ key }) => onClickDropdown(key),
    },
    {
      label: 'Printer',
      key: 'Printer',
      onClick: ({ key }) => onClickDropdown(key),
    },
  ]

  return { dropdownItems }
}

export default useDeviceNavigation
