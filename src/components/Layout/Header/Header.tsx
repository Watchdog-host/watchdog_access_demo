import { FC, memo, useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Col, Row, Grid, Avatar } from 'antd'
import { Menu2, User, UserCircle } from 'tabler-icons-react'
import { Dropdown, Button, Breadcrumb } from 'components'
import { DropdownMenuTypes } from 'components/Dropdown/Dropdown'
import UpdateProfileModal from './_components/UpdateProfileModal'
import MobileDrawer from './_components/MobileDrawer'

import classes from './Header.module.scss'
import { svgVariables } from 'constants/common'
import { useLocalStorage } from 'react-use'
import EdgeStatusBar from './_components/EdgeStatusBar'
import { IProfileDTO } from 'types'
import { logOut } from 'utils'
import { AvatarIcon } from 'assets/icons'
type Props = {}

const LayoutHeader: FC<Props> = ({}) => {
  const [updateAccountModal, setUpdateAccountModal] = useState<boolean>(false)
  const [mobileDrawer, setMobileDrawer] = useState<boolean>(false)
  const { useBreakpoint } = Grid
  const { xs } = useBreakpoint()
  const [localProfile] = useLocalStorage<IProfileDTO>('profile')

  const navigate = useNavigate()

  const avatarMenu: DropdownMenuTypes[] = [
    {
      label: 'Edit my profile',
      key: 1,
      onClick: () => setUpdateAccountModal(true),
    },
    {
      label: 'Logout',
      key: 2,
      onClick: () => {
        logOut()
      },
    },
  ]

  useEffect(() => {
    if (!xs) {
      setMobileDrawer(false)
    }
  }, [xs])

  return (
    <header className={classes.header}>
      <Row align="middle" justify="space-between" className={classes.headerWrapper} wrap={false}>
        <Col span={18} className={classes.infoBox}>
          {xs && (
            <Col className={classes.headerDrawerBox}>
              <Button onlyIcon icon={<Menu2 />} onClick={() => setMobileDrawer((prev) => !prev)} />
            </Col>
          )}
          <Breadcrumb />
          {!xs && <EdgeStatusBar />}
        </Col>
        <Col span={6} className={classes.headerInfo}>
          <Row justify="end" align={'middle'}>
            <Col>
              <Dropdown dropdownItems={avatarMenu}>
                <Row align={'middle'} gutter={[6, 0]} wrap={false}>
                  <Col style={{ fontWeight: 500 }}>
                    {localProfile?.title
                      .split(' ')
                      .map((item) => item[0])
                      .join('. ')}
                    .
                  </Col>
                  <Col style={{ display: 'flex', alignItems: 'center' }}>
                    {localProfile?.image ? <img src={localProfile?.image} className={classes.avatar} alt="img" /> : <AvatarIcon />}
                  </Col>
                </Row>
              </Dropdown>
            </Col>
          </Row>
        </Col>
      </Row>

      {localProfile && <UpdateProfileModal visible={updateAccountModal} setVisible={setUpdateAccountModal} />}
      {mobileDrawer && <MobileDrawer visible={mobileDrawer} setVisible={setMobileDrawer} />}
    </header>
  )
}

export default memo(LayoutHeader)
