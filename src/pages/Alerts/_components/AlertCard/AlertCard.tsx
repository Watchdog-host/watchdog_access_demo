import { FC, ReactNode } from 'react'

import classes from './AlertCard.module.scss'
import { Col, Divider, Image, Menu, Popover, Row, Typography } from 'antd'
import { svgVariables } from 'constants/common'
import { IAccessDTO } from 'types'
import { AccessTypeEnum, AlertTypeEnum, DescriptorTypeEnum } from 'constants/enums'
import { AccessTypeIcons, AlertTypeIcons, DescriptorTypeIcons, DeviceTypeIcons, VerifyTypeIcons } from 'constants/icons'
import dayjs from 'dayjs'

const AlertCard: FC<IAccessDTO> = ({
  type,
  alert_type,
  verified,
  confidence,
  device_title,
  device_type,
  descriptor_type,
  descriptor,
  identity_title,
  watchlist_title,
  identity_id,
  time,
  image,
}) => {
  return (
    <Row className={classes.card}>
      <Col className={classes.statusBox} span={2}>
        <Row align="middle" justify="center">
          {AlertTypeIcons[alert_type]}
          <Divider className={classes.devider} />
          {AccessTypeIcons[type]}
        </Row>
      </Col>

      <Col className={classes.content} span={22}>
        <Row align="top" justify={'space-between'} gutter={16}>
          <Col>
            <Row gutter={20} align={'middle'}>
              <Col>
                <Row align={'middle'}>
                  <Image src={`data:image/jpg;base64, ${image}`} alt={descriptor} title="Click for preview" />
                </Row>
              </Col>
              <Col>
                <div className={classes.title}>
                  <span> {DescriptorTypeIcons[descriptor_type]}</span>
                  <span>{watchlist_title}</span>
                </div>
                <div className={classes.infoBox}>
                  {identity_id === null && descriptor_type == DescriptorTypeEnum.Plate ? (
                    <p style={{ fontFamily: 'Nummernschild' }}>{descriptor}</p>
                  ) : (
                    <p>{identity_title}</p>
                  )}
                </div>
              </Col>
            </Row>
          </Col>
          <Col className={classes.infoHeader}>
            <p className={classes.date}>
              {dayjs(time).format('HH:mm')} | {dayjs(time).format('DD.MM')}
            </p>
            <div className={classes.confidenceBox}>
              <span>{VerifyTypeIcons[Number(verified) as 1 | 0]}</span>
              <p>{confidence}%</p>
            </div>
          </Col>
        </Row>
      </Col>
    </Row>
  )
}

export default AlertCard
