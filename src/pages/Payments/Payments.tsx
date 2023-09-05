import { FC, ReactNode, memo } from 'react'
import classes from './Payments.module.scss'
import { Col, Row } from 'antd'
import { List, Loader, NoData, PaymentCard } from 'components'
import { IPaymentDTO } from 'types'
import { usePaymentsQuery } from 'store/endpoints/payment'
import { IListDataSource } from 'components/List/List'

type Props = {
  children?: ReactNode
}

const Payments: FC<Props> = () => {
  const { data: PaymentsData, isFetching, isSuccess } = usePaymentsQuery()

  return (
    <div className={`fade`}>
      <Row className={'navigation'} align="middle" justify="space-between">
        <Col>
          <Row align="middle" wrap={false}>
            <Col>
              <h2>Payments</h2>
            </Col>

            <Col>
              <span className={'navigationFoundText'}>
                {[]?.length ? `Found ${[]?.length} Payments` : 'No found Payments'}
              </span>
            </Col>
          </Row>
        </Col>
      </Row>
      <div className="dataWrapper">
        {!isSuccess ? (
          <Loader />
        ) : PaymentsData?.length ? (
          <Row gutter={[0, 12]}>
            {PaymentsData?.map((payment) => (
              <Col span={24}>
                <PaymentCard key={payment.id} data={payment} />
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
