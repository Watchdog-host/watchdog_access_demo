import { FC, useState } from 'react'
import { Avatar, Col, Drawer, Menu, MenuProps, Row } from 'antd'

import classes from './MobileDrawer.module.scss'
import { useGetSidebarElements } from 'hooks'
import { Apps, User } from 'tabler-icons-react'
import { svgVariables } from 'constants/common'
import Dropdown from 'components/Dropdown'
import { DropdownMenuTypes } from 'components/Dropdown/Dropdown'
import { useNavigate } from 'react-router-dom'
import { useProfileQuery } from 'store/endpoints'

type Props = {
  visible: boolean
  setVisible: (bool: boolean) => void
  setUpdateAccountModal: (bool: boolean) => void
}

const MobileDrawer: FC<Props> = ({ visible, setVisible, setUpdateAccountModal }) => {
  const navigate = useNavigate()
  const onClick: MenuProps['onClick'] = (e) => {
    navigate(`/${e.key}`)
  }
  const { data: profileData } = useProfileQuery()

  const menuItems = useGetSidebarElements()

  const avatarMenu: DropdownMenuTypes[] = [
    {
      label: 'Edit my profile',
      key: 1,
      onClick: () => {
        setUpdateAccountModal(true)
        setVisible(false)
      },
    },
    {
      label: 'Logout',
      key: 2,
      onClick: () => {
        localStorage.clear()
        navigate('/login')
      },
    },
  ]
  return (
    <Drawer
      placement="left"
      title={
        <Row justify={'end'}>
          <Col>
            <Dropdown dropdownItems={avatarMenu}>
              <Row align={'middle'} gutter={12}>
                <Col>{profileData?.title}</Col>
                <Col style={{ display: 'flex', alignItems: 'center' }}>
                  <User color={svgVariables.$dark} size={25} />
                </Col>
              </Row>
            </Dropdown>
          </Col>
        </Row>
      }
      onClose={() => setVisible(false)}
      closable={false}
      open={visible}
      width={'85vw'}
      bodyStyle={{
        paddingLeft: 0,
        paddingRight: 0,
      }}
    >
      <Menu
        onClick={onClick}
        mode="inline"
        items={menuItems.map((item) => ({
          label: item.content,
          key: item.content,
          icon: item.icon,
          children: item.items,
        }))}
      />
    </Drawer>
  )
}

export default MobileDrawer
