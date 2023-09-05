import React, { FC, memo } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Avatar, Badge, List as AntdList, Popconfirm } from 'antd'
import _ from 'lodash'
import { useGetStatusWs } from 'hooks'
import { Button } from 'components'
import { svgVariables } from 'constants/common'
import { IListDataSource } from './List'
import { AccessPointOff, Pencil, Trash } from 'tabler-icons-react'
import './list.scss'

type Props = {
  setSelected?: (item: any) => void
  setVisibleModal?: (e: boolean) => void
  onDelete?: Function | null
  list: IListDataSource,
  role_policy?: boolean
}

const ListItem: FC<Props> = ({ list, onDelete, role_policy, setSelected, setVisibleModal }) => {
  const { avatar, title, link, hasAccess, key, description, type } = list
  const { pathname } = useLocation()
  const isStream = !!pathname.includes('devices')

  // const snapshot = useGetStatusWs({
  //   id: key as number,
  //   thumbnail: true,
  //   enabled: false,
  // });

  // const streamDescription = snapshot
  //   ? Math.round(snapshot?.fps) + " fps"
  //   : "Offline";

  const disabled = title?.toLowerCase() === 'unknown'
  return (
    <AntdList.Item
      className={`containerListItem ${link && 'containerListItemHovered'} ${disabled ? 'listDisabled' : ''}`}
      actions={
        (role_policy ? [
          <Button
            onlyIcon
            icon={<Pencil color={svgVariables.$green} />}
            onClick={() => {
              setSelected && setSelected(list.data)
              setVisibleModal && setVisibleModal(true)
            }}
          />,
          <Popconfirm title="Are you sure to delete?" onConfirm={() => onDelete && onDelete()}>
            {!disabled && (
              <Button
                onlyIcon
                icon={<Trash color={svgVariables.$red} />}
                onClick={() => {
                  setSelected && setSelected(list.data)
                }}
              />
            )}
          </Popconfirm>
        ] : null) ||
        []
      }
    >
      {link && !disabled ? (
        <Link to={link} className="containerListItemMetaList">
          <AntdList.Item.Meta
            avatar={avatar && <Avatar size="large" src={<AccessPointOff />} {...avatar} />}
            title={_.upperFirst(title)}
            description={description}
          />
        </Link>
      ) : (
        <AntdList.Item.Meta
          className='containerListItemMeta'
          avatar={
            avatar && (
              <Avatar
                size="large"
                style={{ borderRadius: 5, objectFit: 'cover', marginLeft: -10 }}
                {...avatar}
              />
            )
          }
          title={
            <div>
              {_.upperFirst(title)} &nbsp;
              <small
                style={{
                  fontWeight: 'lighter',
                  color: svgVariables.$darkGray,
                }}
              >
                {type}
              </small>
            </div>
          }
          description={description}
        />
      )}
    </AntdList.Item>
  )
}

export default memo(ListItem)
