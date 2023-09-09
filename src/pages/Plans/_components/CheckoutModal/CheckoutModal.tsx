import React, { FC, memo, useState } from 'react'
import _ from 'lodash'

import { Button, FormElements, Modal } from 'components'
import { Form, Grid, Row, Col, InputNumber, Select, Typography } from 'antd'
import { IPlanDTO, durationType } from 'types'
import classes from './CheckoutModal.module.scss'
import { Option } from 'antd/es/mentions'
import { calculateTotalAmount, onKeyDownValidation } from 'utils'
import { useAddPaymentMutation } from 'store/endpoints/payment'
import { PaymentTypeEnum } from 'constants/enums'
import { toast } from 'react-hot-toast'
import { monthsOrYearsToDays } from 'utils/date'
type Props = {
  visible: boolean
  setVisible: (bool: boolean) => void
  data: IPlanDTO
}
const CheckoutModal: FC<Props> = ({ data, visible, setVisible }) => {
  const [count, setCount] = useState<any>(1)
  const [selectValue, setSelectValue] = useState<durationType>('12')
  const [form] = Form.useForm()
  const [AddPaymentMutation, { isLoading }] = useAddPaymentMutation()
  const onFinish = () => {
    const formData = {
      plan_id: data.id,
      type: PaymentTypeEnum.Cash,
      edge_id: data.edge_id,
      days: monthsOrYearsToDays(selectValue, count),
      plan_type: data.type,
      plan_title: data.title,
      amount: calculateTotalAmount(data.price * (count * Number(selectValue)), data.discount),
      discount: data.discount,
      agent_share: data.agent_share,
    }
    const mutationPromise = AddPaymentMutation(formData).unwrap()
    toast
      .promise(mutationPromise, {
        loading: `submiting...`,
        success: `successfully submited`,
        error: ({ data }) => data?.error,
      })
      .then(() => {
        setVisible?.(false)
        form.resetFields()
      })
  }
  const selectBefore = (
    <Form.Item name={'date_select'}>
      <Select value={selectValue} onChange={(type) => setSelectValue(type as durationType)} style={{ width: '100px' }}>
        <Option value="1">Month</Option>
        <Option value="12">Year</Option>
      </Select>
    </Form.Item>
  )
  return (
    <Modal open={visible} onOk={() => setVisible(false)} onCancel={() => setVisible(false)}>
      <header className={classes.titleWrapper}>
        <h4>{data.title}</h4>
        <p>Choose a billing period and finish the upgrade process</p>
      </header>

      <Form onFinish={onFinish} form={form} layout="vertical" initialValues={{ date_select: '12', count: 1 }}>
        <Form.Item name={'count'}>
          <FormElements.InputNumber className="checkoutNumInput" onKeyDown={onKeyDownValidation} value={count} addonBefore={selectBefore} min={1} onChange={(i) => setCount(i)} />
        </Form.Item>
        <div className={classes.totalBox}>
          <Row justify={'space-between'}>
            <Col className={classes.title}>Total:</Col>
            <Col className={classes.price}>
              <Row align={'bottom'} gutter={6}>
                <Col className={classes.price__current}>${(data.price * (count * Number(selectValue))).toLocaleString('ru')}</Col>
                <Col>/</Col>
                <Col>${calculateTotalAmount(data.price * (count * Number(selectValue)), data.discount).toLocaleString('ru')}</Col>
              </Row>
            </Col>
          </Row>
        </div>
        <Row justify={'end'} className={classes.btnBox}>
          <Col span={6}>
            <Button fullWidth type="link" size="large" loading={isLoading} className={classes.cancelBtn} onClick={() => setVisible(false)}>
              Cancel
            </Button>
          </Col>
          <Col span={6}>
            <Button fullWidth type="primary" htmlType="submit" size="large" loading={isLoading}>
              Confirm
            </Button>
          </Col>
        </Row>
      </Form>
    </Modal>
  )
}

export default memo(CheckoutModal)
