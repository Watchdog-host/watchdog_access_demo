import { FC, memo } from 'react'
import { Col, Drawer, Menu, MenuProps, Popover, Row } from 'antd'

import classes from './MobileDrawer.module.scss'
import { useGetRole, useGetSidebarElements } from 'hooks'
import { Help, Plus, Settings } from 'tabler-icons-react'
import { VERSIONS } from 'constants/common'
import { useNavigate } from 'react-router-dom'
import Button from 'components/Button'
import EdgeStatusBar from '../EdgeStatusBar'
import { useAppDispatch } from 'store/hooks'
import { setAddEdgeModal, setHelpModal, setSettingsModal } from 'store/slices/modals'
import logo from 'assets/icons/logo-icon.png'
import cn from 'classnames'
import { AccountTypeEnum } from 'constants/enums'
import { IProfileDTO } from 'types'
import { useLocalStorage } from 'react-use'

type Props = {
  visible: boolean
  setVisible: (bool: boolean) => void
}

const MobileDrawer: FC<Props> = ({ visible, setVisible }) => {
  const navigate = useNavigate()
  const dispatch = useAppDispatch()
  const { isOwner, isAdmin } = useGetRole()
  const [localProfile] = useLocalStorage<IProfileDTO>('profile')

  const sidebarElements = useGetSidebarElements()

  const handleSetAddEdgeModal = (bool: boolean) => {
    dispatch(setAddEdgeModal(bool))
    setVisible(false)
  }
  const handleSetHelpModal = (bool: boolean) => {
    dispatch(setHelpModal(bool))
    setVisible(false)
  }
  const handleSetSettingsModal = (bool: boolean) => {
    dispatch(setSettingsModal(bool))
    setVisible(false)
  }

  const onClick: MenuProps['onClick'] = (e) => {
    navigate(`/${e.key}`)
  }

  return (
    <Drawer
      placement="left"
      style={{ position: 'relative' }}
      title={
        <Row align={'top'} justify={'space-between'}>
          <Col>
            <Row align={'middle'} gutter={13}>
              <Col>
                <img src={logo} alt="Watchdog Access™" height={36} />
              </Col>
              <Col>
                <Row>
                  <Col span={24} className={classes.logoText}>
                    watchdog
                  </Col>
                  <Col span={24} className={classes.logoSubtext}>
                    <b>access™</b>
                  </Col>
                </Row>
              </Col>
            </Row>
          </Col>
          <Col className={classes.version}>v {VERSIONS.ACCESS_WEB}</Col>
        </Row>
      }
      footer={
        <footer>
          {isOwner || isAdmin ? (
            <Popover content="Add" placement="right">
              <Button icon={<Plus />} onlyIcon className={classes.addButton} onClick={() => handleSetAddEdgeModal(true)} />
            </Popover>
          ) : null}
          <Col>
            <Popover content="Help" placement="right">
              <div className={classes.sidebarItem} onClick={() => handleSetSettingsModal(true)}>
                <Settings />
              </div>
            </Popover>
          </Col>
          {isOwner || isAdmin ? (
            <Popover content="Settings" placement="right">
              <div className={cn(classes.sidebarItem, classes.right)} onClick={() => handleSetHelpModal(true)}>
                <Help />
              </div>
            </Popover>
          ) : null}
        </footer>
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
        items={sidebarElements
          .filter((item) => item.min_role >= (localProfile ? localProfile?.type : AccountTypeEnum.Owner))
          .map(({ content, icon, items }) => {
            return {
              label: content,
              key: content,
              icon: icon,
              children: items,
            }
          })}
      />
      <div className={classes.statusWrapper}>
        <div className={classes.statusBox}>
          <EdgeStatusBar />
        </div>
      </div>
    </Drawer>
  )
}

export default memo(MobileDrawer)
