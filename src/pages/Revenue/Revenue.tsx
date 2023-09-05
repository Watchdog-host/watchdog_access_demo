import { FC, ReactNode, memo, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { Col, DatePicker, Grid, Row } from 'antd'
import _ from 'lodash'
import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'
import { useAccessCountQuery, useAccessQuery, useAccessRevenueQuery } from 'store/endpoints'
import classes from './Revenue.module.scss'
import RevenueCard from './_components/RevenueCard'
import { Loader, NoData, Button } from 'components'
import { ChevronLeft, ChevronRight } from 'tabler-icons-react'

type Props = {
  children?: ReactNode
}
dayjs.extend(utc)

const { RangePicker } = DatePicker
const Revenue: FC<Props> = () => {
  const [offset, setOffset] = useState(0)
  const [limit, setLimit] = useState(5)
  const [time, setTime] = useState({
    start: dayjs().utc(),
    end: dayjs().utc(),
  })

  const { pathname } = useLocation()
  const { useBreakpoint } = Grid
  const { xs } = useBreakpoint()

  const params = {
    // device_id: devices,
    startDate: time.start.startOf('day'),
    endDate: time.end.endOf('day'),
  }

  const revenueQuery = useAccessQuery({ ...params, offset, limit })
  const { data: accessRevenueData } = useAccessRevenueQuery(params)

  const { data: insideData } = useAccessCountQuery({
    mode: 'inside',
    ...params,
  })

  const { data: returnedData } = useAccessCountQuery({
    mode: 'returned',
    ...params,
  })

  const handlePrevClick = () => {
    if (offset > 0) {
      setOffset(offset - 5)
      setLimit(limit - 5)
    }
  }

  const handleNextClick = () => {
    setOffset(offset + 5)
    setLimit(limit + 5)
  }

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
      label: 'Total revenue',
      value: accessRevenueData?.revenue,
    },
  ]

  return (
    <div className={`fade container`}>
      <Row className={'navigation'} align="middle" justify="space-between" wrap={xs}>
        <Col>
          <Row align="middle" wrap={false}>
            <Col>
              <h2>Revenues</h2>
            </Col>

            <Col>
              <span className={'navigationFoundText'}>{[] ? `Found ${[]?.length} Revenues` : 'No found Revenues'}</span>
            </Col>
          </Row>
        </Col>
        <Col span={xs ? 24 : undefined} style={{ marginTop: xs ? '1rem' : undefined }}>
          {/* <Row gutter={12}> */}
          {/* <Col span={14}> */}
          <RangePicker
            style={{ width: xs ? '100%' : undefined }}
            value={[time.start, time.end]}
            onChange={(e: any) => setTime({ start: e[0], end: e[1] })}
          />
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

      <div className={classes.dataWrapper}>
        <Row justify="space-between" gutter={16} className={classes.statusBox}>
          <Col span={xs ? 24 : 10}>
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
          <Col span={xs ? 24 : 14}>
            <div className={classes.card}>
              <Row align="middle" justify="space-between" className={classes.cardInside}>
                {pathname.slice(1) === 'income' ? (
                  <div className={classes.cardRevenue}>
                    <p>Total income</p>
                    <h1>{Number(4500).toLocaleString('ru')} UZS</h1>
                  </div>
                ) : (
                  infoCard2.map(({ label, value }) => (
                    <Col key={label} className={classes.cardInfo} span={24}>
                      <p>{label}</p>
                      <h3 className={classes.totalRevenue}>{value?.toLocaleString('ru') || 0} UZS</h3>
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
        {!revenueQuery.isSuccess ? (
          <Loader />
        ) : revenueQuery.data?.length ? (
          <Row gutter={[12, 12]}>
            {revenueQuery.data?.map((revenue) => (
              <Col className="fade" span={24} key={revenue.id}>
                <RevenueCard
                  type={revenue.type}
                  alert_type={revenue.alert_type}
                  verified={revenue.verified}
                  confidence={revenue.confidence}
                  device_title={revenue.device_title}
                  device_type={revenue.device_type}
                  descriptor={revenue.descriptor}
                  identity_title={revenue.identity_title}
                  descriptor_type={revenue.descriptor_type}
                  watchlist_title={revenue.watchlist_title}
                  identity_id={revenue.identity_id}
                  elapsed_minutes={revenue.elapsed_minutes}
                  paid_amount={revenue.paid_amount}
                  payment_type={revenue.payment_type}
                  time={revenue.time}
                  image={revenue.image}
                />
              </Col>
            ))}
          </Row>
        ) : (
          <NoData />
        )}

        <Row gutter={10} className={classes.pagination} justify={'end'}>
          <Col>
            <button disabled={offset === 0} className={classes.paginationBtn} onClick={handlePrevClick}>
              <ChevronLeft size={30} />
            </button>
          </Col>
          <Col>
            <button disabled={!!!revenueQuery.data?.length} className={classes.paginationBtn} onClick={handleNextClick}>
              <ChevronRight size={30} />
            </button>
          </Col>
        </Row>
      </div>
    </div>
  )
}

export default memo(Revenue)
