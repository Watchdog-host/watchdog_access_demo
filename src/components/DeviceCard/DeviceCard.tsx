import React, { FC, ReactNode, useEffect } from 'react'
import { Badge, Col, Image, Menu, Popconfirm, Popover, Row, BadgeProps } from 'antd'
import { toast } from 'react-hot-toast'

import { Button } from 'components'
import { DEVICE_BADGE_TYPE, DEVICE_STATUS_TYPE, DEVICE_TYPE, IDeviceDTO } from 'types'
import { useDeviceStatus, useGetRole, useGetStatusWs } from 'hooks'
import { Dots, VideoOff } from 'tabler-icons-react'

import classes from './DeviceCard.module.scss'
import { DeviceTypeEnum, StatusTypeEnum } from 'constants/enums'
import { DEVICE_STATUS_INDICATOR, statusMapping } from 'constants/common'
import cn from 'classnames'
import { isCurrentPath } from 'utils'

type Props = {
  children?: ReactNode
  title: string
  data?: IDeviceDTO
  visible?: boolean
  setSelected?: (item?: IDeviceDTO) => void
  setVisibleModal?: (e: boolean) => void
  setDescriptorModal: (e: boolean) => void
  onDelete?: Function
  role_policy?:boolean
}

const DeviceCard: FC<Props> = ({
  title,
  data,
  visible,
  setSelected,
  setVisibleModal,
  setDescriptorModal,
  onDelete,
  role_policy
}) => {
  const { isOwner, isAdmin } = useGetRole()
  const wsStatus = useGetStatusWs({
    params: {
      id: data?.id,
      frame: false,
    },
    message: {
      command: 0,
      width: 250,
    },
  })
  const { icon } = useDeviceStatus({
    status: (statusMapping[wsStatus.status || StatusTypeEnum.Offline] as DEVICE_STATUS_TYPE) || 'offline',
    type: DeviceTypeEnum[data?.type as number] as DEVICE_TYPE,
  })

  const handleDelete = () => {
    if (onDelete) {
      if (isOwner || isAdmin) {
        onDelete()
      } else {
        toast.error('Permission denied!')
      }
    }
  }
  return (
    <div className={cn('fade', classes.card)}>
      {wsStatus.frame ? (
        <Image
          src={`data:image/jpg;base64, ${wsStatus.frame?.frame}`}
          preview={!!wsStatus}
          alt={title}
          className={classes.img}
          title="Click for preview"
        />
      ) : (
        <Row justify="center" align="middle">
          <Col span={24} className={classes.warning}>
            {icon}
          </Col>
        </Row>
      )}

      <Popover
        trigger="click"
        placement="rightTop"
        zIndex={visible ? -1 : 1}
        content={
          <Menu
            style={{
              width: 150,
            }}
            items={role_policy ? !isCurrentPath(['Access']) ? [
              // {
              //   label: 'Add descriptor',
              //   key: 1,
              //   onClick: () => {
              //   setSelected &&  setSelected(data)
              //     setDescriptorModal(true)
              //   },
              // },
              {
                label: 'Edit',
                key: 1,
                onClick: () => {
                  setSelected && setSelected(data)
                  setVisibleModal && setVisibleModal(true)
                },
              },
              {
                label: (
                  <Popconfirm title="Are you sure to delete?" onConfirm={handleDelete}>
                    Delete
                  </Popconfirm>
                ),
                key: 3,
                onClick: () => {
                  setSelected && setSelected(data)
                },
                style: {
                  color: 'red',
                },
              },
            ] : [{
              label: 'Add descriptor',
              key: 1,
              onClick: () => {
                setSelected && setSelected(data)
                setDescriptorModal(true)
              },
            },]:[{
              label: 'Add descriptor',
              key: 1,
              onClick: () => {
                setSelected && setSelected(data)
                setDescriptorModal(true)
              },
            },]}
          />
        }
      >
        <Button className={classes.moreBox} icon={<Dots />} onlyIcon />
      </Popover>
      <section className={classes.cardFooter}>
        <Row wrap={false} gutter={5}>
          <Col>
            <Badge
              status={(DEVICE_STATUS_INDICATOR[wsStatus.status as StatusTypeEnum] as DEVICE_BADGE_TYPE) || 'error'}
            />
          </Col>
          <Col className={classes.resolutionText}>
            <span>
              {wsStatus
                ? (wsStatus.status === StatusTypeEnum.Online && `${wsStatus.frame?.fps} fps`) ||
                (wsStatus.status === StatusTypeEnum.Offline && wsStatus.description) ||
                (wsStatus.status === StatusTypeEnum.Degraded && 'Offline')
                : 'Offline'}
            </span>
          </Col>
        </Row>
        <h3>{title}</h3>
      </section>
    </div>
  )
}

export default DeviceCard
