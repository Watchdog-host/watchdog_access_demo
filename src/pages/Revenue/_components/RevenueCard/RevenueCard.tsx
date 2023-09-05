import { FC, ReactNode } from 'react'

import classes from './RevenueCard.module.scss'
import { Col, Divider, Grid, Image, Menu, Popover, Row, Typography } from 'antd'
import { svgVariables } from 'constants/common'
import { IAccessDTO } from 'types'
import { AccessTypeEnum, AlertTypeEnum, DescriptorTypeEnum, PaymentTypeEnum } from 'constants/enums'
import {
  AccessTypeIcons,
  AlertTypeIcons,
  DescriptorTypeIcons,
  DeviceTypeIcons,
  PaymentTypeIcons,
  VerifyTypeIcons,
} from 'constants/icons'
import { Alarm, ClockHour3, Hourglass, HourglassLow } from 'tabler-icons-react'
import dayjs, { Dayjs } from 'dayjs'

const RevenueCard: FC<IAccessDTO> = ({
  type,
  alert_type,
  descriptor_type,
  descriptor,
  identity_title,
  watchlist_title,
  identity_id,
  elapsed_minutes,
  payment_type,
  paid_amount,
  time,
  image,
}) => {
  const { useBreakpoint } = Grid
  const { xs } = useBreakpoint()

  return (
    <Row className={classes.card}>
      <Col className={classes.statusBox} span={2}>
        <Row align="middle" justify="center">
          {AlertTypeIcons[alert_type]}
          {AlertTypeEnum.None !== alert_type && <Divider className={classes.devider} />}
          {AccessTypeIcons[type]}
        </Row>
      </Col>

      <Col className={classes.content} span={22}>
        <Row align="top" justify={'space-between'} gutter={16}>
          <Col>
            <Row gutter={20} align={'middle'}>
              <Col>
                <Image
                  className={classes.img}
                  src={`data:image/jpg;base64, ${image}`}
                  alt={descriptor}
                  title="Click for preview"
                />
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

          {type == AccessTypeEnum.Checkout && (
            <Col>
              <Row>
                <Col span={24}>
                  <ClockHour3 size={20} color={svgVariables.$dark} />
                </Col>
                <Col className={classes.elapsed_minutes} span={24}>
                  {elapsed_minutes}m
                </Col>
              </Row>
            </Col>
          )}
          <Col>
            <Row>
              <Row gutter={5}>
                {' '}
                <Col span={24}>{PaymentTypeIcons[payment_type as PaymentTypeEnum]}</Col>{' '}
                <Col className={classes.paid_amount} span={24}>
                  {paid_amount?.toLocaleString('ru')}
                </Col>{' '}
              </Row>
            </Row>
          </Col>
          <Col className={classes.date}>
            {dayjs(time).format('HH:mm')} | {dayjs(time).format('DD.MM')}
          </Col>
        </Row>
      </Col>
    </Row>
  )
}

export default RevenueCard
