import { FC, ReactNode, memo, useEffect, useState } from 'react'
import { Badge, Col, Image, Menu, Popconfirm, Popover, Row, Typography, Grid } from 'antd'
import { toast } from 'react-hot-toast'

import { Button } from 'components'
import { DEVICE_BADGE_TYPE, DEVICE_STATUS_TYPE, DEVICE_TYPE, IDeviceDTO } from 'types'
import { useDeviceStatus, useGetStatusWs } from 'hooks'
import { CircuitSwitchClosed, Dots, Plus } from 'tabler-icons-react'

import classes from './DeviceCard.module.scss'
import { AccessTypeEnum, DescriptorTypeEnum, DeviceTypeEnum, StatusTypeEnum } from 'constants/enums'
import { DEVICE_STATUS_INDICATOR, statusMapping, svgVariables } from 'constants/common'
import cn from 'classnames'
import { isCurrentPath, logOut } from 'utils'
import { useDeleteDeviceMutation } from 'store/endpoints'
import { useLocation } from 'react-router-dom'
import { useAppDispatch } from 'store/hooks'
import { setSelectedData } from 'store/slices/data'
import { setDescriptorModal } from 'store/slices/modals'

type Props = {
  children?: ReactNode
  title: string
  data?: IDeviceDTO
  visible?: boolean
  setVisibleModal?: (e: boolean) => void
  role_policy?: boolean
}

const DeviceCard: FC<Props> = ({ title, data, visible, setVisibleModal, role_policy }) => {
  const [menuItems, setMenuItems] = useState<any>([])
  const descriptor = JSON.parse(data?.extra_field)?.descriptor_type as DescriptorTypeEnum
  const isBarcode = data?.type == DeviceTypeEnum.BarcodeScanner
  const isCamera = data?.type == DeviceTypeEnum.Camera
  const dispatch = useAppDispatch()
  const { useBreakpoint } = Grid
  const { xs, md } = useBreakpoint()

  const params = {
    Camera: {
      params: {
        id: data?.id,
        frame: false,
      },
      message: {
        command: 0,
        width: 160,
      },
    },
    Printer: {
      params: {
        id: data?.id,
        data: false,
      },
      message: {
        command: 0,
      },
    },
    BarcodeScanner: {
      params: {
        id: data?.id,
        barcode: false,
      },
      message: {
        command: 0,
      },
    },
    LEDMatrix: {
      params: {
        id: data?.id,
        text: false,
        image: false,
      },
      message: {
        command: 0,
      },
    },
    Trigger: {
      params: {
        id: data?.id,
        impulse: false,
      },
      message: {
        command: 0,
      },
    },
    Relay: {
      params: {
        id: data?.id,
        state: false,
      },
      message: {
        command: 0,
      },
    },
  }

  const { status } = useGetStatusWs({
    type: DeviceTypeEnum[data?.type as number] as DEVICE_TYPE,
    data: params[DeviceTypeEnum[data?.type as number] as DEVICE_TYPE],
  })

  const { icon } = useDeviceStatus({
    status: (statusMapping[status?.type as StatusTypeEnum] as DEVICE_STATUS_TYPE) || statusMapping[2],
    type: DeviceTypeEnum[data?.type as number] as DEVICE_TYPE,
  })
  const { pathname } = useLocation()
  const [deleteMutation] = useDeleteDeviceMutation()

  const handleDelete = () => {
    const mutationPromise = deleteMutation({
      id: data?.id,
    }).unwrap()
    toast.promise(mutationPromise, {
      loading: `deleting ${pathname.slice(1)}...`,
      success: `successfully delete`,
      error: (error) => {
        if (error?.status == 'FETCH_ERROR') {
          logOut()
          return error?.error
        }
        return error?.data?.error
      },
    })
  }
  useEffect(() => {
    if (isCurrentPath(['Access'])) {
      setMenuItems(
        data?.access_type === AccessTypeEnum.CheckIn
          ? [
              {
                label: `Add ${isBarcode ? 'Barcode' : DescriptorTypeEnum[descriptor]}`,
                key: 1,
                onClick: () => {
                  dispatch(setSelectedData(data))
                  dispatch(setDescriptorModal(true))
                },
              },
            ]
          : [],
      )
    } else {
      setMenuItems([
        {
          label: 'Edit',
          key: 1,
          onClick: () => {
            dispatch(setSelectedData(data))
            setVisibleModal && setVisibleModal(true)
          },
        },
        {
          label: (
            <Popconfirm title="Are you sure to delete?" onConfirm={handleDelete}>
              Delete
            </Popconfirm>
          ),
          key: 2,
          onClick: () => {
            dispatch(setSelectedData(data))
          },
          style: {
            color: 'red',
          },
        },
      ])
    }
  }, [data])

  const handleVisible = () => {
    dispatch(setDescriptorModal(true))
    dispatch(setSelectedData(data))
  }

  return (
    <div className={cn('fade', classes.card)}>
      {status?.extra_field && JSON.parse(status?.extra_field)?.frame ? (
        <div className={classes.imgBox}>
          <Image src={`data:image/jpg;base64, ${JSON.parse(status?.extra_field)?.frame}`} preview={!!status} alt={title} className={classes.img} title="Click for preview" />
        </div>
      ) : (
        <div className={classes.iconBox}>
          {status?.extra_field && JSON.parse(status?.extra_field)?.state == '1' ? (
            <CircuitSwitchClosed
              color={svgVariables.$darkGray}
              style={{
                width: '100%',
                height: '80%',
              }}
            />
          ) : (
            icon
          )}
        </div>
      )}
      {role_policy &&
        (isCurrentPath(['Access']) ? (
          (isCamera || isBarcode) && (descriptor === DescriptorTypeEnum.Barcode || descriptor === DescriptorTypeEnum.Plate) ? (
            <Button onClick={handleVisible} className={classes.moreBox} icon={<Plus />} onlyIcon />
          ) : null
        ) : (
          <Popover trigger="click" placement="rightTop" zIndex={visible ? -1 : 1} content={<Menu style={{ width: 150 }} items={menuItems} />}>
            {/* //   isCamera || isBarcode ? (
      //     descriptor !== DescriptorTypeEnum.Face && (data?.access_type === AccessTypeEnum.CheckIn || data?.access_type === AccessTypeEnum.CheckOut) ? ( */}
            <Button className={classes.moreBox} icon={<Dots />} onlyIcon />
          </Popover>
        ))}
      <section className={classes.cardFooter}>
        <Row wrap={false} gutter={5}>
          <Col>
            <Badge status={(DEVICE_STATUS_INDICATOR[status?.type as StatusTypeEnum] as DEVICE_BADGE_TYPE) || 'error'} />
          </Col>
          <Col className={classes.resolutionText}>
            <div>
              {status
                ? (status?.type === StatusTypeEnum.Online &&
                    ((DeviceTypeEnum[data?.type as number] as DEVICE_TYPE) === 'Camera' ? `${JSON.parse(status?.extra_field)?.fps} fps` : 'Online')) ||
                  (status?.type === StatusTypeEnum.Offline && 'Offline') ||
                  (status?.type === StatusTypeEnum.Degraded && (
                    <Typography.Text className={classes.description} ellipsis={{ suffix: '', tooltip: true }}>
                      {status?.description}
                    </Typography.Text>
                  ))
                : 'Offline'}
            </div>
          </Col>
        </Row>
        <h3>{title}</h3>
      </section>
    </div>
  )
}

export default memo(DeviceCard)
