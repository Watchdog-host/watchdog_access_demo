import { FC, ReactNode, memo, useEffect } from 'react'
import classes from './Payments.module.scss'
import { Col, Grid, Row } from 'antd'
import { List, Loader, NoData, PaymentCard } from 'components'
import { IPaymentDTO } from 'types'
import { usePaymentsQuery } from 'store/endpoints/payment'
import { IListDataSource } from 'components/List/List'
import { logOut } from 'utils'
import { toast } from 'react-hot-toast'

type Props = {
  children?: ReactNode
}

const Payments: FC<Props> = () => {
  const { data: PaymentsData, isFetching, isSuccess, error } = usePaymentsQuery()
  const { useBreakpoint } = Grid
  const { xs } = useBreakpoint()

  useEffect(() => {
    let status = (error as any)?.status
    if (status == 'FETCH_ERROR' || status === 401) {
      logOut()
    }
  }, [error])

  return (
    <div className={`fade`}>
      <Row className={'navigation'} align="middle" justify="space-between">
        <Col>
          <Row align="middle" wrap={false}>
            <Col>
              <h2>Payments</h2>
            </Col>

            {!xs && (
              <Col>
                <span className={'navigationFoundText'}>{[]?.length ? `Found ${[]?.length} Payments` : 'No found Payments'}</span>
              </Col>
            )}
          </Row>
        </Col>
      </Row>
      <div className="dataWrapper">
        {!isSuccess ? (
          <Loader />
        ) : PaymentsData?.length ? (
          <Row gutter={[0, 12]}>
            {PaymentsData?.map((payment) => (
              <Col span={24} key={payment.id}>
                <PaymentCard data={payment} />
              </Col>
            ))}
          </Row>
        ) : (
          <NoData />
        )}
      </div>
    </div>
  )
}

export default memo(Payments)
