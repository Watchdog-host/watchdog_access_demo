import React, { FC, useEffect } from 'react'
import { Breadcrumb as AntBreadcrumb, BreadcrumbProps, Skeleton } from 'antd'

import { DropdownMenuTypes } from 'components/Dropdown/Dropdown'
import { useAppDispatch, useAppSelector } from 'store/hooks'
import { setCurrentEdge, setNavigation, setSelectedEdgeKey } from 'store/slices/navigation'
import { useEdgeByIdQuery, useProfileQuery } from 'store/endpoints'

import classes from './Breadcrumb.module.scss'
import './breadcrumb.scss'

export type BreadcrumbsType = {
  id: number
  title?: string
  path?: string | void
  items?: DropdownMenuTypes[]
  onClick?: (e: any) => void
  disabled?: boolean
}

type Props = BreadcrumbProps & {
  breadCrumb: BreadcrumbsType[]
}

const Breadcrumb: FC<Props> = ({ breadCrumb, ...props }) => {
  const { selectedEdgeKey } = useAppSelector((state) => state.navigation)
  const dispatch = useAppDispatch()

  const profileQuery = useProfileQuery()
  const { data: edgesData, isFetching } = useEdgeByIdQuery(
    {
      edge_id: selectedEdgeKey as number,
    },
    {
      skip: !profileQuery.data?.edge_id || !selectedEdgeKey,
    },
  )

  useEffect(() => {
    dispatch(setCurrentEdge(edgesData?.[edgesData?.length - 1]))
    dispatch(setNavigation(edgesData))
  }, [isFetching])

  return (
    <div className={classes.breadCrumb}>
      <AntBreadcrumb {...props} separator="|">
        {breadCrumb.length ? (
          breadCrumb?.map(({ id, title, items, disabled }) => (
            <AntBreadcrumb.Item key={id} menu={items && { items }}>
              <span
                className={`${classes.text} ${disabled && classes.disabled}`}
                onClick={() => !disabled && dispatch(setSelectedEdgeKey(id))}
              >
                {title}
              </span>
            </AntBreadcrumb.Item>
          ))
        ) : (
          <Skeleton.Input active size="small" />
        )}
      </AntBreadcrumb>
    </div>
  )
}

export default Breadcrumb
