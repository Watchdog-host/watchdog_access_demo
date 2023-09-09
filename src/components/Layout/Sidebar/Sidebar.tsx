import { FC, ReactNode, memo, useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { Menu, Popover } from 'antd'
import { Settings, Help, Plus } from 'tabler-icons-react'
import logo from 'assets/icons/logo-icon.png'
import { useGetRole, useGetSidebarElements } from 'hooks'
import { Button } from 'components'

import classes from './Sidebar.module.scss'
import { AccountTypeEnum } from 'constants/enums'
import { useAppDispatch } from 'store/hooks'
import { setAddEdgeModal, setHelpModal, setSettingsModal } from 'store/slices/modals'
import { useLocalStorage } from 'react-use'
import { IProfileDTO } from 'types'

type Props = {
  setFullscreen: (bool: boolean) => void
  children?: ReactNode
}

const Sidebar: FC<Props> = ({ setFullscreen }) => {
  const navigate = useNavigate()
  const dispatch = useAppDispatch()
  const { isOwner, isAdmin } = useGetRole()
  const sidebarElements = useGetSidebarElements()
  const [localProfile] = useLocalStorage<IProfileDTO>('profile')

  const handleSetAddEdgeModal = (bool: boolean) => {
    dispatch(setAddEdgeModal(bool))
  }
  const handleSetHelpModal = (bool: boolean) => {
    dispatch(setHelpModal(bool))
  }
  const handleSetSettingsModal = (bool: boolean) => {
    dispatch(setSettingsModal(bool))
  }

  return (
    <>
      <aside className={classes.sidebar}>
        <section className={classes.sidebarHeader}>
          <div className={classes.headerLogo}>
            <img src={logo} alt="" />
          </div>
          <div className={classes.sidebarContent}>
            {sidebarElements
              .filter((item) => item.min_role >= (localProfile ? localProfile?.type : AccountTypeEnum.Owner))
              .map(({ content, link, icon, items }) => {
                return (
                  <Popover content={items ? <Menu items={items} /> : content} key={link} align={{ offset: [-10] }} placement="right">
                    <div
                      className={`${classes.sidebarItem}`}
                      onClick={() => {
                        navigate({ pathname: link })
                        setFullscreen(false)
                      }}
                    >
                      {icon}
                    </div>
                  </Popover>
                )
              })}
          </div>
        </section>
        <section className={classes.sidebarFooter}>
          {isOwner || isAdmin ? (
            <Popover content="Add" placement="right">
              <Button icon={<Plus />} onlyIcon className={classes.addButton} onClick={() => handleSetAddEdgeModal(true)} />
            </Popover>
          ) : null}
          <Popover content="Help" placement="right">
            <div className={classes.sidebarItem} onClick={() => handleSetHelpModal(true)}>
              <Help />
            </div>
          </Popover>

          {isOwner || isAdmin ? (
            <Popover content="Settings" placement="right">
              <div className={classes.sidebarItem} onClick={() => handleSetSettingsModal(true)}>
                <Settings />
              </div>
            </Popover>
          ) : null}
        </section>
      </aside>
    </>
  )
}

export default memo(Sidebar)
