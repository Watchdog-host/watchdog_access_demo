import { FC, ReactNode } from 'react'

import classes from './RevenueCard.module.scss'
import { Col, Divider, Grid, Image, Menu, Popover, Row, Typography } from 'antd'
import { svgVariables } from 'constants/common'
import { IAccessDTO } from 'types'
import { AccessTypeEnum, AlertTypeEnum, DescriptorTypeEnum, PaymentTypeEnum } from 'constants/enums'
import { AccessTypeIcons, AlertTypeIcons, DescriptorTypeIcons, DeviceTypeIcons, PaymentTypeIcons } from 'constants/icons'
import { Alarm, CashOff, ClockHour3, Dots, Hourglass, HourglassLow } from 'tabler-icons-react'
import dayjs, { Dayjs } from 'dayjs'
import { prettifiedMinutes } from 'utils'
import { Button } from 'components'
import { useAppDispatch, useAppSelector } from 'store/hooks'
import { setDescriptorModal, setIdentityModal } from 'store/slices/modals'
import { setSelectedData } from 'store/slices/data'

type Props = {
  data: IAccessDTO
}
const RevenueCard: FC<Props> = ({ data }) => {
  const { descriptorModal, identityModal } = useAppSelector((store) => store.modals)
  const dispatch = useAppDispatch()
  const { useBreakpoint } = Grid
  const { xs } = useBreakpoint()
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
    <Row className={classes.card}>
      <Col className={classes.statusBox} span={xs ? 3 : 2}>
        <Row align="middle" justify="center">
          {typeof data.alert_type === 'number'  ? AlertTypeIcons[data.alert_type] : null}
          {typeof data.alert_type === 'number'  ? <Divider className={classes.devider} /> : null}
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
          </div>
        </div>
        <div className={classes.paymentBox}>
          {data.elapsed_minutes ? (
            <div className={classes.elapsed_minutesBox}>
              <ClockHour3 size={20} color={svgVariables.$darkGray} />
              <p className={classes.elapsed_minutes}>{prettifiedMinutes(data.elapsed_minutes)}</p>
            </div>
          ) : null}
          {data.paid_amount || data.debt ? (
            <div className={classes.elapsed_minutesBox}>
              <div className={classes.iconBox}>
                {data.paid_amount ? PaymentTypeIcons[data.payment_type as PaymentTypeEnum] : null}
                {data.paid_amount && data.debt ? <span className={classes.slash}>/</span> : null}
                {data.debt ? <CashOff size={20} color={svgVariables.$darkGray} /> : null}
              </div>
              <div className={classes.priceBox}>
                {data.paid_amount ? <p className={classes.paid_amount}>{data.paid_amount?.toLocaleString('ru')}</p> : null}
                {data.paid_amount && data.debt ? <span className={classes.slash}>/</span> : null}
                {data.debt ? <p className={classes.debt}>{data.debt?.toLocaleString('ru')}</p> : null}
              </div>
            </div>
          ) : null}
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
  )
}

export default RevenueCard
