import { FC, ReactNode, useEffect } from 'react'
import { Grid } from 'antd'
import Header from './Header'
import Sidebar from './Sidebar'
import Views from './Views/Views'
import classes from './Layout.module.scss'
import cn from 'classnames'
import { isCurrentPath } from 'utils'
import { useGetRole } from 'hooks'
import { ChevronsLeft, ChevronsRight, Id, Map } from 'tabler-icons-react'
import { svgVariables } from 'constants/common'
import { ViewTypeEnum } from 'constants/enums'
import { VIEW_TYPE } from 'types'
import { useLocalStorage } from 'react-use'
import SettingsModal from './SettingsModal'
import { useAppDispatch, useAppSelector } from 'store/hooks'
import { setAddEdgeModal, setHelpModal, setSettingsModal } from 'store/slices/modals'
import HelpModal from './HelpModal'
import AddEdgeModal from './AddEdgeModal'
import AddDescriptorModal from './AddDescriptorModal'
import AddIdentityModal from 'pages/Watchlist/_pages/Identities/_components/AddIdentityModal'
import { useNavigate } from 'react-router-dom'
type Props = {
  children?: ReactNode
}

const PageLayout: FC<Props> = ({ children }) => {
  const { useBreakpoint } = Grid
  const navigate = useNavigate()
  const dispatch = useAppDispatch()
  const { addEdgeModal, settingsModal, helpModal, descriptorModal, identityModal } = useAppSelector((store) => store.modals)
  const { lg } = useBreakpoint()
  const { isOwner, isAdmin, isAgent, isCustomer, isOperator, isViewer } = useGetRole()
  const [view, setView] = useLocalStorage('view')
  const [isFullscreen, setFullscreen] = useLocalStorage('fullscreen')
  const isMap = isCurrentPath(['Map'])
  const isAccess = isCurrentPath(['Access'])

  const handleSetView = (type: ViewTypeEnum) => {
    if (type == ViewTypeEnum.Access) {
      setView(ViewTypeEnum[type])
    }
    if (type == ViewTypeEnum.Map) {
      setView(ViewTypeEnum[type])
    }
  }
  const handleFullscreen = () => {
    setFullscreen(!isFullscreen)
  }

  useEffect(() => {
    if (isOperator || isViewer) {
      handleSetView(ViewTypeEnum.Access)
      navigate('/')
    }
  }, [isOperator])

  if (isOwner || isAdmin || isAgent || isCustomer) {
    return (
      <>
        <div className={classes.contentWrapper}>
          <Sidebar setFullscreen={setFullscreen} />
          <main>
            <Header />
            <div className={classes.mainWrapper}>
              <section
                className={cn(classes.content, {
                  [classes.full]: !lg,
                  [classes.hide]: isFullscreen || isMap || isAccess || isViewer,
                })}
              >
                {children}
              </section>
              {lg || isAccess || isMap ? (
                <section
                  className={cn(classes.view, {
                    [classes.full]: isFullscreen || isMap || isAccess || isViewer,
                    [classes.asd]: !isAccess && !isMap,
                  })}
                >
                  {!isAccess && !isMap ? (
                    <div className={classes.navigateBox}>
                      <div onClick={() => handleSetView(ViewTypeEnum.Access)}>
                        <Id color={view === 'Access' ? svgVariables.$dark : svgVariables.$darkGray} />
                      </div>
                      <div onClick={() => handleSetView(ViewTypeEnum.Map)}>
                        <Map color={view === 'Map' ? svgVariables.$dark : svgVariables.$darkGray} />
                      </div>
                      <div onClick={handleFullscreen}>
                        {isFullscreen ? (
                          <ChevronsRight color={isFullscreen ? svgVariables.$dark : svgVariables.$darkGray} />
                        ) : (
                          <ChevronsLeft color={isFullscreen ? svgVariables.$dark : svgVariables.$darkGray} />
                        )}
                      </div>
                    </div>
                  ) : null}
                  <Views view={view as VIEW_TYPE} setView={setView} />
                </section>
              ) : null}
            </div>
          </main>
        </div>
        {addEdgeModal && <AddEdgeModal />}
        {helpModal && <HelpModal />}
        {settingsModal && <SettingsModal />}
        {descriptorModal && <AddDescriptorModal />}
        {identityModal && <AddIdentityModal />}
      </>
    )
  } else {
    return <Views view={view as VIEW_TYPE} setView={setView} />
  }
}

export default PageLayout
