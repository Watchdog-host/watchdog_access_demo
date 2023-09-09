// import React, { FC, memo } from 'react'
// import { Breadcrumb as AntBreadcrumb, BreadcrumbProps, Skeleton } from 'antd'

// import { DropdownMenuTypes } from 'components/Dropdown/Dropdown'
// import { useAppDispatch } from 'store/hooks'
// import { setSelectedEdgeKey } from 'store/slices/navigation'

// import classes from './Breadcrumb.module.scss'
// import './breadcrumb.scss'
// import { useLocalStorage } from 'react-use'
// import { ChevronDown } from 'tabler-icons-react'
// import cn from 'classnames'
// import { useEdgeEdgePathQuery } from 'store/endpoints'
// export type BreadcrumbsType = {
//   id: number
//   title?: string
//   path?: string | void
//   items?: DropdownMenuTypes[]
//   onClick?: (e: any) => void
//   disabled?: boolean
// }

// type Props = BreadcrumbProps & {
//   breadCrumb: BreadcrumbsType[] | undefined
// }

// const Breadcrumb: FC<Props> = ({ breadCrumb, ...props }) => {
//   const dispatch = useAppDispatch()
//   const [_, setLocalEdges] = useLocalStorage('edge')

//   const handleEdgeClick = (id: number) => {
//     dispatch(setSelectedEdgeKey(id))
//     setLocalEdges(id)
//   }
//   return (
//     <div className={classes.breadCrumb}>
//       {breadCrumb?.length ? (
//         breadCrumb?.map(({ id, title, items, disabled }, index) => {
//           return (
//             <AntBreadcrumb.Item {...props} separator={false} key={id} menu={items && { items }}>
//               <span
//                 className={cn(classes.text, { [classes.disabled]: disabled, [classes.separator]: breadCrumb && index !== breadCrumb.length - 1 })}
//                 onClick={() => !disabled && handleEdgeClick(id)}
//               >
//                 {title}
//                 {items?.length && <ChevronDown className={classes.arrowIcon} color={svgVariables.$darkGray} size={18} />}
//               </span>
//             </AntBreadcrumb.Item>
//           )
//         })
//       ) : (
//         <Skeleton.Input active size="small" />
//       )}
//     </div>
//   )
// }

// export default memo(Breadcrumb)

import React, { FC, memo, useEffect, useRef, useState } from 'react'
import { Breadcrumb as AntBreadcrumb, BreadcrumbProps, Col, Grid, Row, Skeleton, Typography } from 'antd'

import { DropdownMenuTypes } from 'components/Dropdown/Dropdown'
import { useAppDispatch, useAppSelector } from 'store/hooks'
import { setCurrentEdge } from 'store/slices/navigation'

import classes from './Breadcrumb.module.scss'
import './breadcrumb.scss'
import { useClickAway, useLocalStorage } from 'react-use'
import { ChevronDown, ChevronLeft, ChevronRight, ChevronUp } from 'tabler-icons-react'
import { useEdgePathQuery } from 'store/endpoints'
import { IEdgeDTO, IProfileDTO } from 'types'
import { flattenEdgeObject } from 'utils/data'
import cn from 'classnames'
import { svgVariables } from 'constants/common'
export type BreadcrumbsType = {
  id: number
  title?: string
  path?: string | void
  items?: DropdownMenuTypes[]
  onClick?: (e: any) => void
  disabled?: boolean
}

type Props = {}

const Breadcrumb: FC<Props> = ({}) => {
  const { useBreakpoint } = Grid
  const { xs } = useBreakpoint()
  const dispatch = useAppDispatch()
  const [visible, setVisible] = useState(false)
  const ref = useRef(null)
  useClickAway(ref, () => {
    setVisible(false)
  })
  const [localEdge, setLocalEdge] = useLocalStorage<IEdgeDTO>('edge')
  const { data: EdgePath } = useEdgePathQuery()
  const [edges, setEdges] = useState<IEdgeDTO | undefined>(EdgePath || undefined)
  const [localProfile] = useLocalStorage<IProfileDTO>('profile')
  const parentEdge = flattenEdgeObject(EdgePath).find(({ id }) => id === localEdge?.edge_id)

  const [prev, setPrev] = useState(false)
  const [next, setNext] = useState(false)

  const handleEdgeClick = (edge: IEdgeDTO | undefined) => {
    dispatch(setCurrentEdge(edge))
    setLocalEdge(edge)
  }
  const handleBack = (edge: IEdgeDTO | undefined) => {
    setEdges(flattenEdgeObject(EdgePath).find(({ id }) => id === edge?.edge_id))
    setPrev(true)
    setTimeout(() => {
      setPrev(false)
    }, 50)
  }
  const handleNext = (edge: IEdgeDTO) => {
    setEdges(edge)
    setNext(true)
    setTimeout(() => {
      setNext(false)
    }, 50)
  }

  const handleNavigate = () => {
    setLocalEdge(EdgePath)
    setVisible(false)
    setEdges(undefined)
  }

  useEffect(() => {
    setEdges(parentEdge)
  }, [localEdge, visible])

  useEffect(() => {
    dispatch(setCurrentEdge(localEdge))
  }, [localEdge, visible])

  useEffect(() => {
    setLocalEdge(localEdge || flattenEdgeObject(EdgePath).find(({ id }) => id === localProfile?.edge_id))
  }, [EdgePath])

  return (
    <div ref={ref} className={classes.breadCrumb}>
      <div className={classes.main}>
        <div className={classes.mainTitle}>
          <div className={cn({ [classes.disabled]: !EdgePath?.enabled })} onClick={() => (EdgePath?.enabled ? handleNavigate() : null)}>
            {EdgePath?.title}
          </div>
          {EdgePath?.children?.length ? (
            <div onClick={() => setVisible((prev) => !prev)} className={cn(classes.arrowIcon, { [classes.active]: visible })}>
              <ChevronDown color={svgVariables.$darkGray} size={18} />
            </div>
          ) : null}
        </div>
        {localEdge && EdgePath?.id !== localEdge.id ? (
          xs ? (
            <Typography.Text className={classes.mainTitle} ellipsis={{ suffix: '' }}>
              {localEdge?.title}
            </Typography.Text>
          ) : (
            <div className={classes.mainTitle}>{localEdge?.title}</div>
          )
        ) : null}

        <ul className={`${cn(classes.content, { [classes.active]: visible })}`}>
          {edges?.edge_id && (
            <li onClick={() => handleBack(edges || localEdge)} className={cn(classes.li, classes.prevIcon)}>
              <ChevronLeft color={svgVariables.$darkGray} size={24} />
            </li>
          )}
          {(
            edges ||
            //  parentEdge ||
            EdgePath
          )?.children?.map((edge: IEdgeDTO) => {
            return (
              <li key={edge.id} className={cn(classes.li, { [classes.active]: localEdge?.id === edge.id, [classes.next]: next, [classes.prev]: prev })}>
                <div onClick={() => (edge?.enabled ? handleEdgeClick(edge) : null)} className={cn(classes.title, { [classes.disabled]: !edge?.enabled })}>
                  {edge.title}
                </div>
                {edge.children?.length ? (
                  <div onClick={() => handleNext(edge)} className={classes.nextIcon}>
                    <span>
                      <ChevronRight color={svgVariables.$darkGray} size={24} />
                    </span>
                  </div>
                ) : null}
              </li>
            )
          })}
        </ul>
      </div>
    </div>
  )
}

export default memo(Breadcrumb)
