import { Col, Row } from 'antd'
import { FormElements } from 'components'
import NotificationList from 'components/NotificationList'
import React, { FC, ReactNode } from 'react'
import { useDevicesQuery } from 'store/endpoints'
import { useAppSelector } from 'store/hooks'

import classes from './Notification.module.scss'

type Props = {
  children?: ReactNode
}

const Notification: FC<Props> = () => {
  const { currentEdge } = useAppSelector((state) => state.navigation)

  const devicesQuery = useDevicesQuery({ filter: { edge_id: currentEdge?.id } })
  const devicesData = devicesQuery.data

  return (
    <main>
      <Row align="middle" justify="space-between" wrap={false}>
        <Col>
          <h2>Notifications</h2>
        </Col>

        <Col>
          <FormElements.Select
            placeholder="Select device..."
            options={devicesData?.map((device) => ({
              label: device.title,
              value: device.id,
            }))}
          />
        </Col>
      </Row>

      <div className={classes.notificationsContainer}>
        <NotificationList />
        <NotificationList />
        <NotificationList />
        <NotificationList />
        <NotificationList />
        <NotificationList />
        <NotificationList />
        <NotificationList />
        <NotificationList />
      </div>
    </main>
  )
}

export default Notification
