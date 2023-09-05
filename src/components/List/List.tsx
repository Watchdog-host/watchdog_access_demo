import React, { FC } from 'react'
import { To } from 'react-router-dom'
import { AvatarProps, List as AntdList, Empty } from 'antd'

import ListItem from './ListItem'
import classes from './List.module.scss'
import './list.scss'

export interface IListDataSource {
  key: string | number
  avatar?: AvatarProps
  title: string
  description?: string
  type?: string
  link?: To
  data?: object
  hasAccess?: boolean
}

type Props = {
  dataSource: IListDataSource[]
  setSelected?: (item: any) => void
  setVisibleModal?: (e: boolean) => void
  onDelete?: Function | null,
  role_policy?:boolean
}

const List: FC<Props> = ({ dataSource, setVisibleModal, setSelected, role_policy, onDelete, ...props }) => {
  return (
    <>
      <AntdList
        size="large"
        split={false}
        className="containerList"
        dataSource={dataSource}
        locale={{ emptyText: <Empty /> }}
        renderItem={(list) => (
          <ListItem list={list} setSelected={setSelected} setVisibleModal={setVisibleModal} onDelete={onDelete} role_policy={role_policy}/>
        )}
        {...props}
      />
    </>
  )
}

export default List
