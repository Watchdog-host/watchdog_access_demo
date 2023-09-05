import { FC, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Avatar, Col, Row, Space, Grid, Popover } from 'antd'
import { Menu2, User } from 'tabler-icons-react'
import { useAppDispatch, useAppSelector } from 'store/hooks'
import { useEdgeByIdQuery, useProfileQuery } from 'store/endpoints'
import { setCurrentEdge, setNavigation, setSelectedEdgeKey } from 'store/slices/navigation'
import { Dropdown, Button, Breadcrumb } from 'components'
import { DropdownMenuTypes } from 'components/Dropdown/Dropdown'
import UpdateProfileModal from './_components/UpdateProfileModal'
import MobileDrawer from './_components/MobileDrawer'

import classes from './Header.module.scss'
import { svgVariables } from 'constants/common'
type Props = {}

const LayoutHeader: FC<Props> = () => {
  const [updateAccountModal, setUpdateAccountModal] = useState<boolean>(false)
  const [mobileDrawer, setMobileDrawer] = useState<boolean>(false)
  const { useBreakpoint } = Grid
  const { sm, xs } = useBreakpoint()

  const {
    navigation: { navigation, selectedEdgeKey },
    layout: { visibleMap },
  } = useAppSelector((state) => state)
  const dispatch = useAppDispatch()
  const navigate = useNavigate()

  const { data: profileData } = useProfileQuery()
  const edgesQuery = useEdgeByIdQuery(
    {
      //fixme
      edge_id: (selectedEdgeKey as number) || 0,
    },
    {
      skip: !profileData?.edge_id || !selectedEdgeKey,
    },
  )
  const edgesData = edgesQuery.data

  useEffect(() => {
    dispatch(setSelectedEdgeKey(profileData?.edge_id))
  }, [profileData])

  useEffect(() => {
    dispatch(setCurrentEdge(edgesData?.[edgesData?.length - 1]))
    dispatch(setNavigation(edgesData))
  }, [edgesQuery.isFetching, selectedEdgeKey])

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
        localStorage.clear()
        navigate('/login')
      },
    },
  ]

  const breadCrumbData = navigation?.map((item) => ({
    id: item.id,
    title: item.title,
    disabled: !item.enabled,
    items: item?.children?.map((item) => ({
      key: item.id,
      label: item.title,
      onClick: (e: DropdownMenuTypes) => dispatch(setSelectedEdgeKey(+e.key)),
    })),
  }))

  return (
    <header className={classes.header}>
      <Row align="middle" justify="space-between" className={classes.headerWrapper}>
        <Col>
          <Row align="middle" gutter={16}>
            <Col className={classes.headerBreadcrumbs}>
              <Breadcrumb breadCrumb={breadCrumbData || []} />
            </Col>
          </Row>
        </Col>

        {sm ? (
          <Col span={10} className={classes.headerInfo}>
            <Row justify="end" align={'middle'} gutter={12}>
              {/* <Col>
                <Popover
                  trigger="click"
                  placement="bottom"
                  content="There are no extensions available"
                  showArrow={false}
                  align={{ offset: [-70, -5] }}
                  overlayInnerStyle={{
                    width: 320,
                    minHeight: 320,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <Button icon={<GridDots />} onlyIcon />
                </Popover>
              </Col> */}
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
          </Col>
        ) : (
          <Col>
            <Button
              onlyIcon
              icon={<Menu2 />}
              onClick={() => setMobileDrawer(true)}
              className={classes.headerDrawerBox}
            />
          </Col>
        )}
      </Row>

      {profileData && <UpdateProfileModal visible={updateAccountModal} setVisible={setUpdateAccountModal} />}

      {mobileDrawer && (
        <MobileDrawer
          visible={mobileDrawer}
          setUpdateAccountModal={setUpdateAccountModal}
          setVisible={setMobileDrawer}
        />
      )}
    </header>
  )
}

export default LayoutHeader
