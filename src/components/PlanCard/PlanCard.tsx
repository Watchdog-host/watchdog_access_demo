import { FC, ReactNode, useState } from 'react'

import classes from './PlanCard.module.scss'
import { IPlanDTO } from 'types'
import { Col, Menu, Popconfirm, Popover, Row, Typography } from 'antd'
import Button from 'components/Button'
import { Check, Dots } from 'tabler-icons-react'
import { useGetRole } from 'hooks'
import { toast } from 'react-hot-toast'
import { PLAN_BTN_COLOR, PLAN_LIST } from 'constants/common'
import cn from 'classnames'
import CheckoutModal from 'pages/Plans/_components/CheckoutModal'
import { calculateTotalAmount } from 'utils'

type Props = {
  data: IPlanDTO
  visible?: boolean
  setSelected: (item?: IPlanDTO) => void
  setVisibleModal: (e: boolean) => void
  onDelete: Function,
  role_policy?: boolean
}

const PlanCard: FC<Props> = ({ data, visible, setSelected, setVisibleModal, onDelete, role_policy }) => {
  const [checkoutModal, setCheckoutModal] = useState<boolean>(false)
  const planList = PLAN_LIST[data.type]
  const btnColor = PLAN_BTN_COLOR[data.type]

  const handleDelete = () => {
    onDelete()
  }
  const handleClickToSubscribe = () => {
    setCheckoutModal(true)
  }
  return (
    <div className={classes.card}>
      {role_policy ? (
        <Popover
          trigger="click"
          placement="rightTop"
          zIndex={visible ? -1 : 1}
          content={
            <Menu
              style={{
                width: 150,
              }}
              items={[
                {
                  label: 'Edit',
                  key: 1,
                  onClick: () => {
                    setSelected(data)
                    setVisibleModal(true)
                  },
                },
                {
                  label: (
                    <Popconfirm title="Are you sure to delete?" onConfirm={handleDelete}>
                      Delete
                    </Popconfirm>
                  ),
                  key: 2,
                  onClick: () => {
                    setSelected(data)
                  },
                  style: {
                    color: 'red',
                  },
                },
              ]}
            />
          }
        >
          <Button className={classes.settings} icon={<Dots />} onlyIcon />
        </Popover>
      ) : null}
      <div>
        <h4 className={classes.title}>{data.title}</h4>
        <Typography.Text className={classes.subtitle} type="secondary">
          subtitle
        </Typography.Text>
        <div>
          <Row align={'middle'} gutter={10}>
            <Col>
              <Typography.Text delete type="secondary" className={classes.currentPrice}>
                ${data.price}
              </Typography.Text>
            </Col>
            <Col className={classes.discount}>{data.discount}%</Col>
          </Row>
          <Row className={classes.price} gutter={5} align={'bottom'}>
            <Col className={classes.amount}>${calculateTotalAmount(data.price, data.discount)} </Col>{' '}
            <Col className={classes.type}>/month</Col>
          </Row>
        </div>
        <ul>
          {planList.map((text) => (
            <li>
              <Check size={15} color="white" className={classes.checkIcon} /> <span>{text}</span>
            </li>
          ))}
        </ul>
        <Button
          onClick={handleClickToSubscribe}
          type="dashed"
          size="large"
          fullWidth
          className={cn(classes.subscribeBtn, { [classes.white]: btnColor === 'white' })}
          style={{
            background: btnColor,
            color: btnColor !== 'white' ? 'white' : '#141414',
            border: btnColor === 'white' ? '1px solid white' : 'none',
          }}
        >
          Subscribe
        </Button>
      </div>
      {checkoutModal && <CheckoutModal data={data} visible={checkoutModal} setVisible={setCheckoutModal} />}
    </div>
  )
}

export default PlanCard
