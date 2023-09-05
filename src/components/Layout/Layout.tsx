import { FC, ReactNode, useEffect, useMemo } from 'react'
import { Col, Grid, Row } from 'antd'
import Header from './Header'
import Sidebar from './Sidebar'
import { useAppDispatch, useAppSelector } from 'store/hooks'
import { useEdgeByIdQuery, useEdgesQuery } from 'store/endpoints'
import { setCurrentEdge, setNavigation } from 'store/slices/navigation'
import Views, { IDataMap } from './Views/Views'
import classes from './Layout.module.scss'
import cn from 'classnames'
import { isCurrentPath } from 'utils'

type Props = {
  children?: ReactNode
}

const PageLayout: FC<Props> = ({ children }) => {
  const dispatch = useAppDispatch()
  const {
    layout: { visibleMap },
    navigation: { currentEdge },
  } = useAppSelector((state) => state)
  const { useBreakpoint } = Grid
  const { lg } = useBreakpoint()
  const edgesQuery = useEdgesQuery()
  const edgeByIdQuery = useEdgeByIdQuery({
    //fixme
    edge_id: currentEdge?.id || 0,
  })

  const edgesData = edgesQuery.data
  const edgeByIdData = edgeByIdQuery.data

  const isMap = isCurrentPath(['Map'])
  const isAccess = isCurrentPath(['Access'])

  useEffect(() => {
    dispatch(setNavigation(edgeByIdData))
  }, [edgeByIdData])

  const mapData =
    useMemo(
      () =>
        edgesData?.map((item) => ({
          id: item.id,
          longitude: item.longitude,
          latitude: item.latitude,
          title: item.title,
          onClick: () => {
            dispatch(setCurrentEdge(item))
          },
        })) as IDataMap[],
      [edgesData],
    ) || []

  return (
    <>
      <div className={classes.contentWrapper}>
        <Sidebar />
        <main>
          <Header />
          <div className={classes.mainWrapper}>
            <section
              className={cn(classes.content, {
                [classes.full]: !lg,
                [classes.hide]: isMap || isAccess,
              })}
            >
              {children}
            </section>
            {lg || isAccess || isMap ? (
              <section
                className={cn(classes.map, {
                  [classes.full]: isMap || isAccess,
                })}
              >
                {/* <Button
                onlyIcon
                icon={<ChevronsLeft />}
                className={`${classes.mapBtn} ${visibleMap && classes.active}`}
                onClick={() => { dispatch(setVisibleMap(!visibleMap)); navigate('/view') }}
              /> */}
                <Views data={mapData} />
              </section>
            ) : null}
          </div>
        </main>
      </div>
    </>
  )
}

export default PageLayout
