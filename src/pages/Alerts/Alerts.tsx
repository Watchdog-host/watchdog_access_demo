import { FC, ReactNode, UIEvent, memo, useEffect, useMemo, useRef, useState } from 'react'
import { Col, Grid, Row } from 'antd'
import _, { debounce } from 'lodash'
import { AlertOctagon, AlertTriangle, ChevronLeft, ChevronRight, Filter, H1, InfoCircle } from 'tabler-icons-react'
import dayjs, { Dayjs } from 'dayjs'
import utc from 'dayjs/plugin/utc'

import { useLazyAccessAlertsQuery, useLazyAccessCountQuery, useLazyAlertQuery } from 'store/endpoints'
import { useAppSelector } from 'store/hooks'
import { svgVariables } from 'constants/common'

import { AlertTypeEnum, DescriptorTypeEnum, GrantTypeEnum } from 'constants/enums'

import classes from './Alerts.module.scss'
import { Button, Loader, NoData } from 'components'
import AlertCard from './_components/AlertCard'
import AlertFilterModal from './_components/AlertFilterModal'
import { useDebounce, useLocalStorage } from 'react-use'
import { logOut } from 'utils'
import { IAccessDTO } from 'types'
import Chart from './_components/Chart'

type Props = {
  children?: ReactNode
}

export interface ILocalData {
  range_date?: Dayjs[]
  access_type?: string
  descriptor_type?: DescriptorTypeEnum
  grant_type?: GrantTypeEnum
  alert_type?: AlertTypeEnum
  device_id?: number[]
}
dayjs.extend(utc)

const Alerts: FC<Props> = () => {
  const [filterModal, setFilterModal] = useState(false)
  const [offset, setOffset] = useState(0)
  const [limit, setLimit] = useState(15)
  const { useBreakpoint } = Grid
  const { xs } = useBreakpoint()
  const { currentEdge } = useAppSelector((state) => state.navigation)
  const [localData, setLocalData] = useLocalStorage<ILocalData>('alerts_filter')
  const [alertsData, setAlertsData] = useState<IAccessDTO[]|undefined>([])
  const scrollSection = useRef<HTMLDivElement>(null)
  const url = useRef('')
  const isFetch = useRef(true)

  
  const [getLazyAlerts, alertQuery] = useLazyAlertQuery()
  const [getLazyAccessAlerts, accessAlertQuery] = useLazyAccessAlertsQuery()
  const params: any = useMemo(() => {
    setAlertsData(alertQuery.data)
    return {
      ...localData,
      startDate: localData?.range_date ? dayjs(localData.range_date[0]).toDate() : dayjs().startOf('day').toDate(),
      endDate: localData?.range_date ? dayjs(localData.range_date[1]).toDate() : dayjs().endOf('day').toDate(),
    }
  }, [localData,alertQuery.isSuccess])

  useEffect(() => {
    if (currentEdge) {
      getLazyAlerts({ ...params, offset, limit, sort: '-time', url: url.current || currentEdge?.private_ip }).then((res) => {
        if ((res.error as any)?.message === 'Aborted') {
          url.current = currentEdge?.public_ip
          getLazyAlerts({ ...params, offset, limit, sort: '-time', url: currentEdge?.public_ip })
        }
      })
    }
  }, [currentEdge, params, offset, limit])


  useEffect(() => {
    if (currentEdge) {

      getLazyAccessAlerts({ ...params, url: url.current || currentEdge?.private_ip }).then((res) => {
        if ((res.error as any)?.message === 'Aborted') {
          url.current = currentEdge?.public_ip
          getLazyAccessAlerts({ ...params, url: currentEdge?.public_ip })
        }
      })
    }
  }, [currentEdge, params])

  useEffect(() => {
    url.current = ''
  }, [currentEdge])

  const infoCard1 = [
    {
      label: 'All',
      value: accessAlertQuery.data?.total_count || 0,
    },
    { label: 'Inside', value: accessAlertQuery.data?.inside_count || 0 },
    { label: 'Returned', value: accessAlertQuery.data?.outside_count || 0 },
  ]
  const infoCard2 = [
    {
      label: 'Informations',
      value: accessAlertQuery.data?.information_amount || 0,
      icon: <InfoCircle size={28} color={svgVariables.$blue} />,
      color: svgVariables.$blue,
    },
    {
      label: 'Warnings',
      value: accessAlertQuery.data?.warning_amount || 0,
      icon: <AlertTriangle size={28} color={svgVariables.$yellow} />,
      color: svgVariables.$yellow,
    },
    {
      label: 'Criticals',
      value: accessAlertQuery.data?.critical_amount || 0,
      icon: <AlertOctagon size={28} color={svgVariables.$red} />,
      color: svgVariables.$red,
    },
  ]
  useEffect(() => {

    const debouncedOnScroll = debounce(() => {
      if (!scrollSection.current) return
      const scrollableHeight = scrollSection.current.scrollHeight - scrollSection.current.clientHeight
      const currentScrollPosition = Math.floor((scrollSection.current.scrollTop * 100) / scrollableHeight)

      if (currentScrollPosition > 80 && isFetch.current) {
        isFetch.current = false
        setOffset((prev) => prev + 10)
      }
      else {
        isFetch.current = true
      }
    }, 100)


    scrollSection.current?.addEventListener('scroll', debouncedOnScroll)

    return () => {
      scrollSection.current?.removeEventListener('scroll', debouncedOnScroll)
    }
  }, [])

  useEffect(() => {
    if (alertQuery.isSuccess) {
      setAlertsData((prev) => [...(prev as IAccessDTO[]), ...alertQuery.data])
    }
  }, [alertQuery.data])

  useEffect(() => {
    let status = (alertQuery.error as any)?.status
    if (status == 'FETCH_ERROR' || status == 401) {
      logOut()
    }
  }, [alertQuery.error])

  return (
    <div className={`fade`}>
      <Row gutter={!xs ? 16 : 0} className={'navigation'} align="middle" justify="space-between" wrap={xs}>
        <Col>
          <Row align="middle" wrap={false}>
            <Col>
              <h2>Alerts</h2>
            </Col>
            <Col>
              <span className={'navigationFoundText'}>{`${dayjs(localData?.range_date && localData?.range_date[0])
                .startOf('day')
                .format('DD.MM HH:mm')} - ${dayjs(localData?.range_date ? localData?.range_date[1] : dayjs().endOf('day')).format('DD:MM HH:mm')}`}</span>
            </Col>
          </Row>
        </Col>
        <Col>
          <Button className={classes.filterBtn} icon={<Filter />} type="link" onClick={() => setFilterModal(true)}>
            {!xs && 'Filter'}
            {Object.keys(localData || {}).length ? <div className={classes.filterBadge}>{Object.keys(localData || {}).length}</div> : null}
          </Button>
        </Col>
      </Row>

      <div ref={scrollSection} className={classes.dataWrapper}>
        <Row justify="space-between" gutter={[16, 16]} className={classes.statusBox}>
          <Col span={xs ? 24 : 11}>
            <div className={classes.card}>
              <Row align="top" justify="space-between" className={classes.cardInside}>
                {infoCard1.map(({ label, value }, i) => (
                  <Col key={label} className={classes.cardInfo} span={8}>
                    <p>{label}</p>
                    <span style={{ fontWeight: 700, fontSize: i !== 0 ? '20px' : '24px' }}>{value}</span>
                  </Col>
                ))}
              </Row>
            </div>
          </Col>

          <Col span={xs ? 24 : 13}>
            <div className={classes.card}>
              <Row align="middle" justify="space-between" className={classes.cardInside}>
                {infoCard2.map(({ label, value, icon, color }) => (
                  <Col key={label} className={classes.cardInfo} span={6}>
                    <p>{label}</p>
                    <Row align="middle" gutter={8}>
                      <Col>
                        <Row>{icon}</Row>
                      </Col>
                      <Col>
                        <h3 style={{ color }}>{value}</h3>
                      </Col>
                    </Row>
                  </Col>
                ))}
              </Row>
            </div>
          </Col>
        </Row>
        <Chart data={accessAlertQuery.data} />
        {alertQuery.isLoading ? (
          <Loader />
        ) : alertsData?.length ? (
          <Row gutter={[12, 12]}>
            {alertsData?.map((alert) => (
              <Col span={24} key={alert.id}>
                <AlertCard data={alert} />
              </Col>
            ))}
            {alertQuery.isFetching ? <Loader className={classes.loader} /> : null}
          </Row>
        ) : (
          null
        )}

      </div>
      {filterModal && <AlertFilterModal visible={filterModal} setVisible={setFilterModal} localData={localData} setLocalData={setLocalData} />}
    </div>
  )
}

export default memo(Alerts)
