import React, { FC, ReactNode, useEffect, useState } from 'react'
import { Col, Divider, Grid, Image, Menu, Popover, Row, Typography } from 'antd'

import { svgVariables } from 'constants/common'

import classes from './AccessCard.module.scss'
import { AccessTypeIcons, AlertTypeIcons, DescriptorTypeIcons } from 'constants/icons'
import { IAccessDTO } from 'types'
import dayjs from 'dayjs'
import { AccessTypeEnum, AlertTypeEnum, DescriptorTypeEnum, GrantTypeEnum } from 'constants/enums'
import cn from 'classnames'
import { isCurrentPath, prettifiedMinutes } from 'utils'
import Button from 'components/Button'
import { Dots } from 'tabler-icons-react'
import { useAppDispatch, useAppSelector } from 'store/hooks'
import { setSelectedData } from 'store/slices/data'
import { setDescriptorModal, setIdentityModal } from 'store/slices/modals'

type Props = {
  data: IAccessDTO
}

const AccessCard: FC<Props> = ({ data }) => {
  const [accessType, setAccessType] = useState<ReactNode>()
  const { descriptorModal, identityModal } = useAppSelector((store) => store.modals)
  const isAccess = isCurrentPath(['Access'])
  const dispatch = useAppDispatch()
  const { useBreakpoint } = Grid
  const { xs } = useBreakpoint()

  useEffect(() => {
    // if (data.type !== AccessTypeEnum.CheckOut) {
    //   if (data.grant_type == GrantTypeEnum.Undefined) {
    //     setAccessType(
    //       <p className={classes.alertTitle} style={{ color: svgVariables.$yellow }}>
    //         Undefined
    //       </p>,
    //     )
    //   }
    //   if (data.grant_type == GrantTypeEnum.Allow) {
    //     setAccessType(
    //       <p className={classes.alertTitle} style={{ color: svgVariables.$green }}>
    //         Allow
    //       </p>,
    //     )
    //   }
    //   if (data.grant_type == GrantTypeEnum.Deny) {
    //     setAccessType(
    //       <p className={classes.alertTitle} style={{ color: svgVariables.$red }}>
    //         Deny
    //       </p>,
    //     )
    //   }
    // } else {
    //   if (data.grant_type == GrantTypeEnum.Undefined) {
    //     if (data.access_id == data.id) {
    //       setAccessType(
    //         <p className={classes.alertTitle} style={{ color: svgVariables.$yellow }}>
    //           Not found
    //         </p>,
    //       )
    //     } else {
    //       setAccessType(
    //         <div className={classes.alertRow}>
    //           <p className={cn(classes.alertTitle, classes.slash)}>{prettifiedMinutes(data.elapsed_minutes)}</p>
    //           <p className={classes.debt}>{data.debt} </p>
    //           <p className={classes.debtPrefix}>UZS</p>
    //         </div>,
    //       )
    //     }
    //   } else if (data.grant_type == GrantTypeEnum.Allow) {
    //     if (data.access_id == data.id) {
    //       setAccessType(
    //         <p className={classes.alertTitle} style={{ color: svgVariables.$green }}>
    //           Allow
    //         </p>,
    //       )
    //     } else {
    //       setAccessType(
    //         <div className={classes.alertRow}>
    //           <p className={classes.alertTitle} style={{ color: svgVariables.$green }}>
    //             Allow
    //           </p>
    //           <p>{prettifiedMinutes(data.elapsed_minutes)}</p>
    //         </div>,
    //       )
    //     }
    //   } else if (data.grant_type == GrantTypeEnum.Deny) {
    //     if (data.access_id == data.id) {
    //       setAccessType(
    //         <p className={classes.alertTitle} style={{ color: svgVariables.$red }}>
    //           Deny
    //         </p>,
    //       )
    //     } else {
    //       setAccessType(
    //         <div className={classes.alertRow}>
    //           <p className={cn(classes.alertTitle, classes.slash)}>{prettifiedMinutes(data.elapsed_minutes)}</p>{' '}
    //           <p className={classes.alertTitle} style={{ color: svgVariables.$red }}>
    //             Deny
    //           </p>
    //         </div>,
    //       )
    //     }
    //   }
    // }

    if (data.type == null) {
      setAccessType(
        <p
          className={classes.alertTitle}
          style={{
            color:
              data.alert_type === AlertTypeEnum.Critical
                ? svgVariables.$red
                : data.alert_type === AlertTypeEnum.Information
                ? svgVariables.$blue
                : data.alert_type === AlertTypeEnum.Warning
                ? svgVariables.$yellow
                : svgVariables.$dark,
          }}
        >
          {data.alert_type ? AlertTypeEnum[data.alert_type] : 'None'}
        </p>,
      )
    } else if (data.grant_type == null) {
      if (data.debt && data.debt > 0) {
        setAccessType(
          <div className={classes.alertRow}>
            <p className={cn(classes.debt, classes.slash)}>{data.debt.toLocaleString('ru')} </p>
            {/* <p className={cn(classes.debtPrefix,classes.slash)}>UZS</p> */}
            <p className={classes.alertTitle}>{prettifiedMinutes(data.elapsed_minutes)}</p>
          </div>,
        )
      } else if (data.access_id === null || data.access_id !== data.id) {
        setAccessType(
          <p className={classes.alertTitle} style={{ color: svgVariables.$green }}>
            Allow
          </p>,
        )
      } else {
        setAccessType(
          <p className={classes.alertTitle} style={{ color: svgVariables.$yellow }}>
            Not found
          </p>,
        )
      }
    } else {
      setAccessType(
        <p
          className={classes.alertTitle}
          style={{ color: data.grant_type === GrantTypeEnum.Deny ? svgVariables.$red : data.grant_type === GrantTypeEnum.Allow ? svgVariables.$green : svgVariables.$yellow }}
        >
          {GrantTypeEnum[data.grant_type as GrantTypeEnum]}
        </p>,
      )
    }
  }, [data])

  const menuItems = [
    {
      label: `Check`,
      key: 1,
      onClick: () => {
        dispatch(setDescriptorModal(true))
        dispatch(setSelectedData(data))
      },
    },
    // {
    //   label: `New identity`,
    //   key: 2,
    //   onClick: () => {
    //     dispatch(setIdentityModal(true))
    //     dispatch(setSelectedData(data))
    //   },
    // },
  ]
  return (
    <>
      <Row style={{ margin: !isAccess ? '0 0 0 50px' : '' }} className={classes.accessCard}>
        <Col className={classes.statusBox} span={xs ? 3 : 2}>
          <Row align="middle" justify={'center'} style={{ height: '100%' }}>
            {typeof data.alert_type === 'number' ? AlertTypeIcons[data.alert_type] : null}
            {typeof data.alert_type === 'number' ? <Divider className={classes.devider} /> : null}
            {AccessTypeIcons[data.type ?? 'None']}
          </Row>
        </Col>
        <Col className={classes.content} span={xs ? 21 : 22}>
          <div className={classes.item1}>
            <div>
              {data.image ? (
                <Image src={`data:image/jpg;base64, ${data.image}`} alt={data.descriptor} title="Click for preview" className={classes.img} />
              ) : (
                <div className={classes.imgIcon}>{DescriptorTypeIcons[data.descriptor_type as DescriptorTypeEnum]}</div>
              )}
            </div>
            <div>
              <div className={classes.title}>
                <span> {DescriptorTypeIcons[data.descriptor_type]}</span>
                <span>{data.watchlist_title}</span>
              </div>
              <div className={classes.infoBox}>
                {data.identity_id === null && (data.descriptor_type == DescriptorTypeEnum.Plate || data.descriptor_type == DescriptorTypeEnum.Barcode) ? (
                  <Typography.Text className={classes.descriptor} ellipsis={{ suffix: '', tooltip: true }}>
                    {data.descriptor}
                  </Typography.Text>
                ) : (
                  <span className={classes.identity}>{data.identity_title}</span>
                )}
              </div>
              {accessType}
            </div>
          </div>
          <div className={classes.dateBox}>
            <div className={classes.date}>
              {dayjs(data.time).format('HH:mm')} | {dayjs(data.time).format('DD.MM')}
            </div>
            {data.confidence && (
              <div className={classes.confidenceBox}>
                <p style={{ color: data.verified ? svgVariables.$green : svgVariables.$red }}>{data.confidence?.toFixed()}%</p>
              </div>
            )}
          </div>
          <Popover trigger="click" placement="rightTop" zIndex={descriptorModal || identityModal ? 1 : 9999} content={<Menu style={{ width: 150 }} items={menuItems} />}>
            <Button className={classes.moreBox} icon={<Dots />} onlyIcon />
          </Popover>
        </Col>
      </Row>
    </>
  )
}

export default AccessCard
