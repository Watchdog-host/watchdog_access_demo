import { FC, ReactNode, memo, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { Menu, Popover } from 'antd'
import { toast } from 'react-hot-toast'
import { Settings, Help, CircleCheck, Plus } from 'tabler-icons-react'
import logo from 'assets/icons/logo-icon.png'
import { useGetRole, useGetSidebarElements } from 'hooks'
import { Button } from 'components'
import AddEdgeModal from './_components/AddEdgeModal'
import SettingsModal from './_components/SettingsModal'
import HelpModal from './_components/HelpModal'

import classes from './Sidebar.module.scss'

type Props = {
  children?: ReactNode
}

const Sidebar: FC<Props> = () => {
  const [addEdgeModal, setAddEdgeModal] = useState<boolean>(false)
  const [settingsModal, setSettingsModal] = useState<boolean>(false)
  const [helpModal, setHelpModal] = useState<boolean>(false)
  const navigate = useNavigate()
  const types = useGetRole()
  const { isOwner , isAdmin} = types
  const sidebarElements = useGetSidebarElements()

  return (
    <>
      <aside className={classes.sidebar}>
        <section className={classes.sidebarHeader}>
          <div className={classes.headerLogo}>
            <img src={logo} alt="" />
          </div>
          <div className={classes.sidebarContent}>
            {sidebarElements.map(({ content, link, icon, items }) => {
              return (
                <Popover
                  content={items ? <Menu items={items} /> : content}
                  key={link}
                  align={{ offset: [-10] }}
                  placement="right"
                >
                  <div className={`${classes.sidebarItem}`} onClick={() => navigate({ pathname: link })}>
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
              <Button icon={<Plus />} onlyIcon className={classes.addButton} onClick={() => setAddEdgeModal(true)} />
            </Popover>
          ) : null}
          <Popover content="Help" placement="right">
            <div className={classes.sidebarItem} onClick={() => setHelpModal(true)}>
              <Help />
            </div>
          </Popover>

          {isOwner || isAdmin ? (
          <Popover content="Settings" placement="right">
            <div className={classes.sidebarItem} onClick={() => setSettingsModal(true)}>
              <Settings />
            </div>
          </Popover>):null}
          {addEdgeModal && <AddEdgeModal visible={addEdgeModal} setVisible={setAddEdgeModal} />}
          {helpModal && <HelpModal visible={helpModal} setVisible={setHelpModal} />}
          {settingsModal && <SettingsModal visible={settingsModal} setVisible={setSettingsModal} />}
        </section>
      </aside>
    </>
  )
}

export default memo(Sidebar)
  