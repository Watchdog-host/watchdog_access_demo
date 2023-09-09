import { FC, ReactNode, memo, useEffect, useMemo, useRef, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { Col, DatePicker, Grid, Row, Tooltip } from 'antd'
import _, { debounce } from 'lodash'
import dayjs, { Dayjs } from 'dayjs'
import utc from 'dayjs/plugin/utc'
import { useAccessCountQuery, useLazyAccessCountQuery, useLazyAccessRevenueQuery, useLazyRevenueQuery } from 'store/endpoints'
import classes from './Revenue.module.scss'
import RevenueCard from './_components/RevenueCard'
import { Loader, NoData, Button } from 'components'
import { ChevronLeft, ChevronRight, Filter, InfoCircle } from 'tabler-icons-react'
import RevenueFilterModal from './_components/RevenueFilterModal'
import { useLocalStorage } from 'react-use'
import { logOut } from 'utils'
import { toast } from 'react-hot-toast'
import { useAppSelector } from 'store/hooks'
import { svgVariables } from 'constants/common'
import { IAccessDTO } from 'types'
import Chart from './_components/Chart'

type Props = {
  children?: ReactNode
}
export interface ILocalData {
  range_date?: Dayjs[]
  payment_period?: Dayjs[]
  descriptor_type?: string
  payment_type?: string
  device_id?: number[]
}
dayjs.extend(utc)

const Revenue: FC<Props> = () => {
  const [filterModal, setFilterModal] = useState(false)
  const [localData, setLocalData] = useLocalStorage<ILocalData>('revenues_filter')
  const [offset, setOffset] = useState(0)
  const [limit, setLimit] = useState(15)
  const { currentEdge } = useAppSelector((state) => state.navigation)
  const [revenueData, setRevenueData] = useState<IAccessDTO[] | undefined>([])
  const scrollSection = useRef<HTMLDivElement>(null)
  const url = useRef('')
  const isFetch = useRef(false)

  const { useBreakpoint } = Grid
  const { xs } = useBreakpoint()

  const [getLazyRevenue, revenueQuery] = useLazyRevenueQuery()
  
  const [getLazyAccessRevenueCount, { data: accessRevenueData }] = useLazyAccessRevenueQuery()
  const params: any = useMemo(() => {
    setRevenueData(revenueQuery.data)
    console.log(revenueQuery.data);
    return {
      ...localData,
      startDate: localData?.range_date ? dayjs(localData.range_date[0]).toDate() : dayjs().startOf('day').toDate(),
      endDate: localData?.range_date ? dayjs(localData.range_date[1]).toDate() : dayjs().endOf('day').toDate(),
      // startPaidDate: localData?.payment_period ? dayjs(localData.payment_period[0]) : undefined,
      // endPaidDate: localData?.payment_period ? dayjs(localData.payment_period[1]) : undefined,
    }
  }, [localData,revenueQuery.isSuccess])

  // const [getLazyInside, { data: insideData }] = useLazyAccessCountQuery()
  // const [getLazyReturned, { data: returnedData }] = useLazyAccessCountQuery()

  // const accessRevenue = {
  //   "inside_count": 50,
  //   "outside_count": 50,
  //   "total_count": 100,

  //   "paid_amount": 70000,
  //   "debt_amount": 1500000,

  //   "groups": [
  //     {
  //       "device_id": 1,
  //       "paid_amount": 70000,
  //       "debt_amount": 1500000
  //     },
  //     {
  //       "device_id": 2,
  //       "paid_amount": 90000,
  //       "debt_amount": 2500000
  //     }
  //   ]
  // }

  useEffect(() => {
    if (currentEdge) {
      getLazyRevenue({ ...params, offset, limit, sort: '-time', url: url.current || currentEdge?.private_ip }).then((res) => {
        if ((res.error as any)?.message === 'Aborted') {
          url.current = currentEdge?.public_ip
          getLazyRevenue({ ...params, offset, limit, sort: '-time', url: currentEdge?.public_ip })
        }
      })
    }
  }, [currentEdge, params, offset, limit])

  useEffect(() => {
    if (currentEdge) {
      getLazyAccessRevenueCount({ ...params, url: url.current || currentEdge?.private_ip }).then((res) => {
        if ((res.error as any)?.message === 'Aborted') {
          url.current = currentEdge?.public_ip
          getLazyAccessRevenueCount({ ...params, url: currentEdge?.public_ip })
        }
      })

      // getLazyInside({ ...params, mode: 'inside', url: url.current || currentEdge?.private_ip }).then((res) => {
      //   if ((res.error as any)?.message === 'Aborted') {
      //     url.current = currentEdge?.public_ip
      //     getLazyInside({ ...params, mode: 'inside', url: currentEdge?.public_ip })
      //   }
      // })
      // getLazyReturned({ ...params, mode: 'returned', url: url.current || currentEdge?.private_ip }).then((res) => {
      //   if ((res.error as any)?.message === 'Aborted') {
      //     url.current = currentEdge?.public_ip
      //     getLazyReturned({ ...params, mode: 'returned', url: currentEdge?.public_ip })
      //   }
      // })
    }
  }, [currentEdge, params])

  useEffect(() => {
    url.current = ''
  }, [currentEdge])

  // const handlePrevClick = () => {
  //   if (offset > 0) {
  //     setOffset(offset - 5)
  //   }
  // }

  // const handleNextClick = () => {
  //   setOffset(offset + 5)
  // }

  const infoCard1 = [
    {
      label: 'All',
      value: accessRevenueData?.total_count || 0,
      isMain: true,
    },
    { label: 'Inside', value: accessRevenueData?.inside_count || 0 },
    { label: 'Returned', value: accessRevenueData?.outside_count || 0 },
  ]

  const infoCard2 = [
    {
      id: 1,
      item: (
        <div className={classes.cardInfo}>
          <p>Paid</p>
          <h3 className={classes.totalRevenue} style={{ color: svgVariables.$green }}>
            {accessRevenueData?.paid_amount?.toLocaleString('ru') || 0} <span style={{ color: svgVariables.$green ,fontSize:12}}>UZS</span> 
          </h3>
          {/* <Tooltip
          placement='bottomLeft'
          title={
            <ul className={classes.tooltipContent}>
            <li>
              <span>Paid:</span> <span>{accessRevenueData?.revenue?.toLocaleString('ru') || 0} UZS</span>
            </li>
          </ul>          }>
          <Row align={'middle'} style={{ cursor: 'pointer' }} gutter={[3, 0]}>
            <Col>
              <h3 className={classes.totalRevenue} style={{ color: svgVariables.$green }}>{accessRevenueData?.revenue?.toLocaleString('ru') || 0} UZS</h3>
            </Col>
            <Col style={{ top: 3 }}>
              <InfoCircle color={svgVariables.$darkGray} size={15} />
            </Col>
          </Row>
        </Tooltip> */}
        </div>
      ),
    },
    {
      id: 2,
      item: (
        <div className={classes.cardInfo} >
          <p>Debt</p>
          <h3 className={classes.totalRevenue} style={{ color: svgVariables.$red }}>
            {accessRevenueData?.debt_amount.toLocaleString('ru') || 0} <span style={{ color: svgVariables.$red ,fontSize:12}}>UZS</span> 
          </h3>
        </div>
      ),
    },
  ]

  useEffect(() => {
    const debouncedOnScroll = debounce(() => {
      if (!scrollSection.current) return
      const scrollableHeight = scrollSection.current.scrollHeight - scrollSection.current.clientHeight
      const currentScrollPosition = Math.floor((scrollSection.current.scrollTop * 100) / scrollableHeight)

      if (currentScrollPosition  > 80 && isFetch.current) {
        isFetch.current = false
        setOffset((prev) => prev + 10)
      }
      else{
        isFetch.current = true
      }
    }, 100)

    scrollSection.current?.addEventListener('scroll', debouncedOnScroll)

    return () => {
      scrollSection.current?.removeEventListener('scroll', debouncedOnScroll)
    }
  }, [])

  useEffect(() => {
    if (revenueQuery.isSuccess) {
      setRevenueData((prev) => [...(prev as IAccessDTO[]), ...revenueQuery.data])
    }
  }, [revenueQuery.data])

  useEffect(() => {
    let status = (revenueQuery.error as any)?.status
    if (status == 'FETCH_ERROR' || status === 401) {
      logOut()
    }
  }, [revenueQuery.error])
  return (
    <div className={`fade`}>
      <Row className={'navigation'} align="middle" justify="space-between" wrap={xs}>
        <Col>
          <Row align="middle" wrap={false}>
            <Col>
              <h2>Revenue</h2>
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
        <Row justify="space-between" gutter={16} className={classes.statusBox}>
          <Col span={xs ? 24 : 11}>
            <div className={classes.card}>
              <Row align="top" justify="space-between" style={{width:'100%'}}>
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
              <div className={classes.cardInside}>
                {infoCard2.map(({ item }) => item)}
              </div>
            </div>
          </Col>
        </Row>
        <Chart data={accessRevenueData} />
        {revenueQuery.isLoading ? (
          <Loader />
        ) : revenueData?.length ? (
          <Row gutter={[12, 12]}>
            {revenueData?.map((revenue) => (
              <Col span={24} key={revenue.id}>
                <RevenueCard data={revenue} />
              </Col>
            ))}
            {revenueQuery.isFetching ? <Loader className={classes.loader} /> : null}
          </Row>
        ) : (
          // <NoData />
          null
        )}

        {/* {revenueQuery.data?.length ?
          <Row gutter={10} className={classes.pagination} justify={'end'}>
            <Col>
              <button disabled={revenueQuery.isFetching || offset === 0} className={classes.paginationBtn} onClick={handlePrevClick}>
                <ChevronLeft size={30} />
              </button>
            </Col>
            <Col>
              <button disabled={revenueQuery.isFetching || (revenueQuery.data ? revenueQuery.data.length < 5 : false)} className={classes.paginationBtn} onClick={handleNextClick}>
                <ChevronRight size={30} />
              </button>
            </Col>
          </Row>
          : null
        } */}
      </div>
      {filterModal && <RevenueFilterModal visible={filterModal} setVisible={setFilterModal} localData={localData} setLocalData={setLocalData} />}
    </div>
  )
}

export default memo(Revenue)
