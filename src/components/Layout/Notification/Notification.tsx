import { Col, Form, Row } from 'antd'
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

  const devicesQuery = useDevicesQuery({ filter: { edge_id: currentEdge?.id || 0 } })
  const OPTION_DATA = devicesQuery.data?.map((device) => ({
    label: device.title,
    value: device.id,
  }))

  return (
    <Form initialValues={{ device: OPTION_DATA?.[0].value }}>
      <Row align="middle" justify="space-between" wrap={false}>
        <Col>
          <h2>Notifications</h2>
        </Col>

        <Col>
          <Form.Item name="device">
            <FormElements.Select placeholder="Select device..." options={OPTION_DATA} />
          </Form.Item>
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
    </Form>
  )
}

export default Notification
