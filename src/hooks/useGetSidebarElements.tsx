import { useLocation, useNavigate } from 'react-router-dom'
import {
  Cpu,
  ChartBar,
  Users,
  Layout2,
  ClipboardList,
  Receipt,
  Id,
  Video,
  Printer,
  DeviceTv,
  Scan,
  Map,
  CircuitSwitchOpen,
  Target,
  AlertTriangle,
  ChartInfographic,
  BrandDaysCounter,
  ShoppingCartDiscount,
  Wallet,
} from 'tabler-icons-react'
import { svgVariables } from 'constants/common'
import { isCurrentPath } from 'utils'
import cn from 'classnames'
import { SIDEBAR_LINK_TYPE } from 'types'
import useGetRole from './useGetRole'
import { AccountTypeEnum } from 'constants/enums'
const useGetSidebarElements = () => {
  const navigate = useNavigate()
  const { pathname } = useLocation()

  const pushPathname = (link: string) => {
    navigate(link)
  }

  const renderSubmenuItems = (links: string[]) => {
    const sidebarTypeIcons = {
      Access: <Id color={isCurrentPath(['Access']) ? svgVariables.$dark : svgVariables.$darkGray} />,
      Map: <Map color={isCurrentPath(['Map']) ? svgVariables.$dark : svgVariables.$darkGray} />,
      Camera: <Video color={isCurrentPath(['Camera']) ? svgVariables.$dark : svgVariables.$darkGray} />,
      Printer: <Printer color={isCurrentPath(['Printer']) ? svgVariables.$dark : svgVariables.$darkGray} />,
      BarcodeScanner: <Scan color={isCurrentPath(['BarcodeScanner']) ? svgVariables.$dark : svgVariables.$darkGray} />,
      LEDMatrix: <DeviceTv color={isCurrentPath(['LEDMatrix']) ? svgVariables.$dark : svgVariables.$darkGray} />,
      Trigger: <Target color={isCurrentPath(['Trigger']) ? svgVariables.$dark : svgVariables.$darkGray} />,
      Relay: <CircuitSwitchOpen color={isCurrentPath(['Relay']) ? svgVariables.$dark : svgVariables.$darkGray} />,
      Alerts: <AlertTriangle color={isCurrentPath(['Alerts']) ? svgVariables.$dark : svgVariables.$darkGray} />,
      Revenue: <ChartInfographic color={isCurrentPath(['Revenue']) ? svgVariables.$dark : svgVariables.$darkGray} />,
      Attendance: <BrandDaysCounter color={isCurrentPath(['Attendance']) ? svgVariables.$dark : svgVariables.$darkGray} />,
      Plans: <ShoppingCartDiscount color={isCurrentPath(['Plans']) ? svgVariables.$dark : svgVariables.$darkGray} />,
      Payments: <Wallet color={isCurrentPath(['Payments']) ? svgVariables.$dark : svgVariables.$darkGray} />,
    }
    return links.map((link) => ({
      key: link,
      label: (
        <div className={cn('innerSidebarLink', { active: isCurrentPath([link]) })}>
          {sidebarTypeIcons[link as SIDEBAR_LINK_TYPE]} <span>{link}</span>
        </div>
      ),
      onClick: () => pushPathname(`/${link}`),
    }))
  }
  const menuItems = [
    {
      content: 'Views',
      key: 'Views',
      link: '/Access',
      icon: (
        <div className={cn('sidebarLink', { active: isCurrentPath(['Access', 'Map']) })}>
          <Layout2 color={isCurrentPath(['Access', 'Map']) ? svgVariables.$dark : svgVariables.$darkGray} />
        </div>
      ),
      items: renderSubmenuItems(['Access', 'Map']),
      min_role: AccountTypeEnum.Viewer,
    },
    {
      content: 'Devices',
      key: 'Devices',
      link: '/Camera',
      icon: (
        <div
          className={cn('sidebarLink', {
            active: isCurrentPath(['Camera', 'Printer', 'BarcodeScanner', 'LEDMatrix', 'Trigger', 'Relay']),
          })}
        >
          <Cpu color={isCurrentPath(['Camera', 'Printer', 'BarcodeScanner', 'LEDMatrix', 'Trigger', 'Relay']) ? svgVariables.$dark : svgVariables.$darkGray} />
        </div>
      ),
      style: { color: 'red' },
      items: renderSubmenuItems(['Camera', 'Printer', 'BarcodeScanner', 'LEDMatrix', 'Trigger', 'Relay']),
      min_role: AccountTypeEnum.Operator,
    },
    {
      content: 'Watchlists',
      key: 'Watchlists',
      link: '/Watchlists',
      icon: (
        <div className={cn('sidebarLink', { active: isCurrentPath(['Watchlists']) || pathname.includes('identities') })}>
          <ClipboardList color={isCurrentPath(['Watchlists']) || pathname.includes('identities') ? svgVariables.$dark : svgVariables.$darkGray} />
        </div>
      ),
      min_role: AccountTypeEnum.Operator,
    },
    {
      content: 'Reports',
      key: 'Reports',
      link: '/Alerts',
      icon: (
        <div className={cn('sidebarLink', { active: isCurrentPath(['Alerts', 'Revenue', 'Attendance']) })}>
          <ChartBar color={isCurrentPath(['Alerts', 'Revenue', 'Attendance']) ? svgVariables.$dark : svgVariables.$darkGray} />
        </div>
      ),
      items: renderSubmenuItems([
        'Alerts',
        'Revenue',
        //, 'Attendance'
      ]),
      min_role: AccountTypeEnum.Customer,
    },
    // {
    //   content: 'Plans',
    //   key: 'Plans',
    //   link: '/Plans',
    //   icon: (
    //     <div className={cn('sidebarLink', { active: isCurrentPath(['Plans', 'Payments']) })}>
    //       <Receipt color={isCurrentPath(['Plans', 'Payments']) ? svgVariables.$dark : svgVariables.$darkGray} />
    //     </div>
    //   ),
    //   items: renderSubmenuItems(['Plans', 'Payments']),
    //   min_role: AccountTypeEnum.Viewer
    // },
    {
      content: 'Accounts',
      key: 'Accounts',
      link: '/Accounts',
      icon: (
        <div className={cn('sidebarLink', { active: isCurrentPath(['Accounts']) })}>
          <Users color={isCurrentPath(['Accounts']) ? svgVariables.$dark : svgVariables.$darkGray} />
        </div>
      ),
      min_role: AccountTypeEnum.Customer,
    },
  ]

  return menuItems
}

export default useGetSidebarElements
