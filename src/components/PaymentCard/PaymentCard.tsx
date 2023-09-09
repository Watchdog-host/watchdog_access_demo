import { FC } from 'react'

import classes from './PaymentCard.module.scss'
import { IPaymentDTO } from 'types'
import { Col, Popconfirm, Row } from 'antd'
import { Trash } from 'tabler-icons-react'
import { useDeletePaymentMutation } from 'store/endpoints'
import { toast } from 'react-hot-toast'
import { svgVariables } from 'constants/common'
import Button from 'components/Button'
import cn from 'classnames'

type Props = {
  data: IPaymentDTO
}

const PaymentCard: FC<Props> = ({ data: { id, plan_title, amount, discount, days, paid_at, canceled_at } }) => {
  const [deletePaymentMutation] = useDeletePaymentMutation()

  const handleDelete = () => {
    const mutationPromise = deletePaymentMutation({
      id: id,
    }).unwrap()

    toast.promise(mutationPromise, {
      loading: `deleting...`,
      success: `successfully deleted`,
      error: ({ data }) => data?.error,
    })
  }

  return (
    <Row className={classes.card} justify={'space-between'} align={'middle'}>
      <Col>{plan_title}</Col>
      <Col>${amount.toLocaleString('ru')}</Col>
      <Col>{days}</Col>
      <Col>{discount}</Col>
      <Col
        className={cn(classes.badge, {
          [classes.canceled]: canceled_at,
          [classes.paid]: paid_at,
          [classes.panding]: !paid_at || !canceled_at,
        })}
      >
        {paid_at || canceled_at || 'Panding'}
      </Col>
      <Col>
        <Popconfirm title="Are you sure to delete?" onConfirm={handleDelete}>
          <Button onlyIcon icon={<Trash color={svgVariables.$red} />} />
        </Popconfirm>
      </Col>
    </Row>
  )
}

export default PaymentCard
