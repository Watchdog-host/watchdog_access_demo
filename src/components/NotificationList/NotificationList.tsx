import { Avatar, List } from 'antd'
import React, { FC, ReactNode } from 'react'

import classes from './NotificationList.module.scss'

type Props = {
  children?: ReactNode
}

const NotificationList: FC<Props> = () => {
  const data = [
    {
      email: 'email',
      picture: 'https://randomuser.me/api/portraits/men/64.jpg',
      name: 'Name',
    },
  ]
  return (
    <>
      <List
        dataSource={data}
        className={classes.list}
        renderItem={(item) => (
          <List.Item key={item.email} className={classes.listItem}>
            <List.Item.Meta
              avatar={<Avatar src={item.picture} className={classes.listAvatar} shape="square" />}
              title={item.name}
              description={item.email}
              //   className={classes.listMeta}
            />
          </List.Item>
        )}
      />
    </>
  )
}

export default NotificationList
