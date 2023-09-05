import { FC, ReactNode, memo, useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { Avatar, Col, DatePicker, Popconfirm, Row, Select, Table } from 'antd'
import _ from 'lodash'
import { AlertOctagon, AlertTriangle, InfoCircle, Pencil, Trash } from 'tabler-icons-react'
import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'

import { useAccessCountQuery, useDevicesQuery, useAccessQuery } from 'store/endpoints'
import { useAppSelector } from 'store/hooks'
import { svgVariables } from 'constants/common'

import { AlertTypeEnum, DescriptorTypeEnum, DeviceTypeEnum, GrantTypeEnum, PaymentTypeEnum } from 'constants/enums'

import classes from './Alerts.module.scss'
import { ColumnsType } from 'antd/es/table'
import { Button } from 'components'
import { IAccessDTO } from 'types'
import AlertCard from './_components/AlertCard'

type Props = {
  children?: ReactNode
}
dayjs.extend(utc)

const { RangePicker } = DatePicker
const Alerts: FC<Props> = () => {
  const [devices, setDevices] = useState<number[]>([])
  const [time, setTime] = useState({
    start: dayjs().utc(),
    end: dayjs().utc(),
  })

  const navigate = useNavigate()
  const { pathname } = useLocation()
  const { currentEdge } = useAppSelector((state) => state.navigation)

  const params = {
    device_id: devices,
    startDate: time.start.startOf('day'),
    endDate: time.end.endOf('day'),
  }

  const { data: accessData } = useAccessQuery({ ...params, offset: 0, limit: 10 })
  const { data: devicesData } = useDevicesQuery({ filter: { edge_id: currentEdge?.id } })
  const { data: insideData } = useAccessCountQuery({
    mode: 'inside',
    ...params,
  })
  const { data: returnedData } = useAccessCountQuery({
    mode: 'returned',
    ...params,
  })
  const { data: informationData } = useAccessCountQuery({
    mode: 'information',
    ...params,
  })
  const { data: warningData } = useAccessCountQuery({
    mode: 'warning',
    ...params,
  })
  const { data: criticalData } = useAccessCountQuery({
    mode: 'critical',
    ...params,
  })

  const groupedOptions = _.groupBy(devicesData, 'type')
  const deviceOptions = _.map(groupedOptions, (data, key) => ({
    label: DeviceTypeEnum[key as any],
    options: data?.map((device) => ({
      label: device.title,
      value: device.id,
    })),
  }))

  const infoCard1 = [
    {
      label: 'All',
      value: Number(insideData?.count) + Number(returnedData?.count) || 0,
      isMain: true,
    },
    { label: 'Inside', value: insideData?.count || 0 },
    { label: 'Returned', value: returnedData?.count || 0 },
  ]

  const infoCard2 = [
    {
      label: 'Informations',
      value: informationData?.count || 0,
      icon: <InfoCircle size={28} color={svgVariables.$blue} />,
      color: svgVariables.$blue,
    },
    {
      label: 'Warnings',
      value: warningData?.count || 0,
      icon: <AlertTriangle size={28} color={svgVariables.$yellow} />,
      color: svgVariables.$yellow,
    },
    {
      label: 'Criticals',
      value: criticalData?.count || 0,
      icon: <AlertOctagon size={28} color={svgVariables.$red} />,
      color: svgVariables.$red,
    },
  ]

  const data: IAccessDTO[] = [
    {
      image: 'img',
      type: 1,
      time: '2023/06/21',
      descriptor: 'descriptor',
      descriptor_type: DescriptorTypeEnum.Plate,
      confidence: 50,
      verified: true,
      device_title: 'Camera',
      device_type: DeviceTypeEnum.Camera,
      alert_type: AlertTypeEnum.Critical,
      grant_type: GrantTypeEnum.Deny,
      watchlist_title: 'Dog',
      identity_title: 'User',
      identity_id: null,
    },
  ]
  return (
    <div className={`fade container`}>
      <Row gutter={16} className={'navigation'} align="middle" justify="space-between" wrap={false}>
        <Col>
          <Row align="middle" wrap={false}>
            <Col>
              <h2>Alerts</h2>
            </Col>

            <Col>
              <span className={'navigationFoundText'}>{[] ? `Found ${[]?.length} Alerts` : 'No found Alerts'}</span>
            </Col>
          </Row>
        </Col>
        <Col>
          {/* <Row gutter={12}> */}
          {/* <Col span={14}> */}
          <RangePicker value={[time.start, time.end]} onChange={(e: any) => setTime({ start: e[0], end: e[1] })} />
          {/* </Col> */}
          {/* <Col span={10}>
                <Select
                  placeholder="Select filter"
                  mode="multiple"
                  maxTagCount={1}
                  options={deviceOptions}
                  onChange={(e) => setDevices(e)}
                  />
              </Col> */}
          {/* </Row> */}
        </Col>
      </Row>

      <div className="dataWrapper">
        <Row justify="space-between" gutter={16} className={classes.statusBox}>
          <Col span={10}>
            <div className={classes.card}>
              <Row align="middle" justify="space-between" className={classes.cardInside}>
                {infoCard1.map(({ label, value, isMain }) => (
                  <Col key={label} className={`${classes.cardInfo} ${isMain && classes.cardInfoMain}`} span={8}>
                    <p>{label}</p>
                    <h3>{value}</h3>
                  </Col>
                ))}
              </Row>
            </div>
          </Col>

          <Col span={14}>
            <div className={classes.card}>
              <Row align="middle" justify="space-between" className={classes.cardInside}>
                {pathname.slice(1) === 'income' ? (
                  <div className={classes.cardRevenue}>
                    <p>Total income</p>
                    <h1>{Number(4500).toLocaleString('ru')} UZS</h1>
                  </div>
                ) : (
                  infoCard2.map(({ label, value, icon, color }) => (
                    <Col key={label} className={classes.cardInfo} span={6}>
                      <p style={{ color }}>{label}</p>
                      <Row align="middle" gutter={8}>
                        <Col>
                          <Row>{icon}</Row>
                        </Col>
                        <Col>
                          <h3 style={{ color }}>{value}</h3>
                        </Col>
                      </Row>
                    </Col>
                  ))
                )}
              </Row>
            </div>
          </Col>
        </Row>
        {/* <div>
          {reports?.map(({ id, device_title, time, watchlist_title, identity_title }) => (
            <ReportsList
              key={id}
              title={device_title}
              time={time}
              description={{
                label: watchlist_title,
                value: identity_title,
              }}
            />
          ))}
        </div> */}
        {data.map((i) => (
          <AlertCard
            type={i.type}
            alert_type={i.alert_type}
            verified={i.verified}
            confidence={i.confidence}
            device_title={i.device_title}
            device_type={i.device_type}
            descriptor={i.descriptor}
            identity_title={i.identity_title}
            descriptor_type={i.descriptor_type}
            watchlist_title={i.watchlist_title}
            identity_id={i.identity_id}
            time={i.time}
          />
        ))}
      </div>
    </div>
  )
}

export default memo(Alerts)
