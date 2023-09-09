import { FC, useEffect, useState } from 'react'
import { Checkbox, Col, Form, Grid, InputNumber, Row } from 'antd'
import toast from 'react-hot-toast'

import { Button, FormElements, Modal, Tabs } from 'components'
import { useAppDispatch, useAppSelector } from 'store/hooks'
import { useAddEdgeMutation, useLazyEdgePathQuery } from 'store/endpoints'
import { logOut, validateIp, validatePaymentExpiryMinutes, validateRegistrationTimeoutDays } from 'utils'
import { EdgeTypeEnum } from 'constants/enums'
import { EDGE_TYPE_SELECTS } from 'constants/common'
import { setAddEdgeModal } from 'store/slices/modals'
import { useLocalStorage } from 'react-use'
import { IEdgeDTO } from 'types'

const AddEdgeModal: FC = () => {
  const [form] = Form.useForm()
  const { useBreakpoint } = Grid
  const { xs } = useBreakpoint()
  const {
    navigation: { currentEdge },
    modals: { addEdgeModal },
  } = useAppSelector((state) => state)
  const dispatch = useAppDispatch()
  const [addMutation, { isLoading }] = useAddEdgeMutation()
  const [bidirectionalMode, setBidirectionalMode] = useState(true)
  const [acquittance, setAcquittance] = useState(true)
  const [getLazyEdge] = useLazyEdgePathQuery()

  useEffect(() => {
    if (!addEdgeModal) {
      form.resetFields()
    }
  }, [addEdgeModal, form])

  const onFinish = (values: any) => {
    const { payment_expiry_minutes, checkin_timeout } = values
    const extra_field = JSON.stringify({
      payment_expiry_minutes: payment_expiry_minutes ?? undefined,
      checkin_timeout: checkin_timeout ?? undefined,
      bidirectional_mode: bidirectionalMode,
      acquittance: acquittance,
    })

    const data = {
      title: values.title,
      type: values.type,
      private_ip: values.private_ip,
      public_ip: values.public_ip,
      latitude: values.latitude,
      longitude: values.longitude,
      edge_id: currentEdge?.id,
      extra_field,
    }

    const mutationPromise = addMutation(data).unwrap()
    toast
      .promise(mutationPromise, {
        loading: `adding edge...`,
        success: `successfully added`,
        error: (error) => {
          if (error?.status == 'FETCH_ERROR') {
            logOut()
            return error?.error
          }
          return error?.data?.error
        },
      })
      .then(() => {
        getLazyEdge()
        dispatch(setAddEdgeModal(false))
        form.resetFields()
      })
  }

  const tabsItems = [
    {
      key: '1',
      label: 'General',
      children: (
        <>
          <Form.Item name="title" label="Title:" rules={[{ required: true, message: 'Title is required' }]}>
            <FormElements.Input size="large" />
          </Form.Item>

          <Form.Item name="type" label="Type:">
            <FormElements.Select options={EDGE_TYPE_SELECTS} />
          </Form.Item>

          <Form.Item name="private_ip" label="Private ip:" rules={[{ validator: validateIp }]}>
            <FormElements.Input size="large" />
          </Form.Item>

          <Form.Item name="public_ip" label="Public ip:" rules={[{ validator: validateIp }]}>
            <FormElements.Input size="large" />
          </Form.Item>

          <Form.Item name="latitude" label="Latitude:" rules={[{ required: true, message: 'Latitude is required' }]}>
            <FormElements.InputNumber size="large" placeholder="e.g., 41.248902" min={0} float />
          </Form.Item>

          <Form.Item name="longitude" label="Longitude:" rules={[{ required: true, message: 'Longitude is required' }]}>
            <FormElements.InputNumber size="large" placeholder="e.g., 69.166551" min={0} float />
          </Form.Item>
        </>
      ),
    },
    {
      key: '2',
      label: 'Access',
      children: (
        <Row gutter={xs ? 8 : 12}>
          <Col span={12}>
            <Form.Item name="payment_expiry_minutes" label="Payment expiry minutes:" rules={[{ validator: validatePaymentExpiryMinutes }]}>
              <FormElements.InputNumber size="large" placeholder="e.g., 15" min={0} max={24 * 60} />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item name="checkin_timeout" label="Checkin timeout days:" rules={[{ validator: validateRegistrationTimeoutDays }]}>
              <FormElements.InputNumber size="large" placeholder="e.g., 1" min={1} max={365} />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item name="bidirectional_mode">
              <Checkbox checked={bidirectionalMode} onChange={(e) => setBidirectionalMode(e.target.checked)}>
                Bidirectional mode
              </Checkbox>
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item name="acquittance">
              <Checkbox checked={acquittance} onChange={(e) => setAcquittance(e.target.checked)}>
                Acquittance
              </Checkbox>
            </Form.Item>
          </Col>
        </Row>
      ),
    },
  ]

  return (
    <Modal title="Add Edge" open={addEdgeModal} onOk={() => dispatch(setAddEdgeModal(false))} onCancel={() => dispatch(setAddEdgeModal(false))}>
      <Form
        onFinish={onFinish}
        form={form}
        layout="vertical"
        initialValues={{
          type: EDGE_TYPE_SELECTS[EdgeTypeEnum.Virtual].value,
        }}
      >
        <Tabs items={tabsItems.sort((a, b) => Number(a.key) - Number(b.key))} />
        <Button fullWidth type="primary" htmlType="submit" size="large" loading={isLoading}>
          Submit
        </Button>
      </Form>
    </Modal>
  )
}

export default AddEdgeModal
