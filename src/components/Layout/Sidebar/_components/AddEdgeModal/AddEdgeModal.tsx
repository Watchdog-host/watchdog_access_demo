import { FC, useEffect } from 'react'
import { Form, Tabs } from 'antd'
import toast from 'react-hot-toast'

import { Button, FormElements, Modal } from 'components'
import { useAppSelector } from 'store/hooks'
import { useAddEdgeMutation } from 'store/endpoints'

export type Props = {
  visible: boolean
  setVisible: (bool: boolean) => void
}

const AddEdgeModal: FC<Props> = ({ visible, setVisible }) => {
  const [form] = Form.useForm()

  const { currentEdge } = useAppSelector((state) => state.navigation)

  const [addMutation, { isLoading }] = useAddEdgeMutation()

  useEffect(() => {
    if (!visible) {
      form.resetFields()
    }
  })

  const onFinish = (values: any) => {
    const { payment_expiry_minutes, registration_timeout_days } = values
    const extra_field = JSON.stringify({ payment_expiry_minutes, registration_timeout_days })

    const data = {
      title: values.title,
      private_ip: values.private_ip,
      public_ip: values.public_ip,
      latitude: Number(values.latitude),
      longitude: Number(values.longitude),
      edge_id: currentEdge?.id,
      extra_field,
    }

    const mutationPromise = addMutation(data).unwrap()
    toast
      .promise(mutationPromise, {
        loading: `adding edge...`,
        success: `successfully added`,
        error: ({ data }) => data?.error,
      })
      .then((res) => {
        setVisible(false)
        form.resetFields()
      })
  }

  const tabsItems = [
    {
      key: '1',
      label: 'General',
      children: (
        <>
          <Form.Item name="title" label="Title:" rules={[{ required: true, message: 'title is required' }]}>
            <FormElements.Input size="large" />
          </Form.Item>

          <Form.Item
            name="private_ip"
            label="Private ip:"
            rules={[{ required: true, message: 'Private ip is required' }]}
          >
            <FormElements.Input size="large" />
          </Form.Item>

          <Form.Item name="public_ip" label="Public ip:" rules={[{ required: true, message: 'Public ip is required' }]}>
            <FormElements.Input size="large" />
          </Form.Item>

          <Form.Item name="latitude" label="Latitude:">
            <FormElements.Input size="large" />
          </Form.Item>

          <Form.Item name="longitude" label="Longitude:">
            <FormElements.Input size="large" />
          </Form.Item>
        </>
      ),
    },
    {
      key: '2',
      label: 'Access',
      children: (
        <>
          <Form.Item name="payment_expiry_minutes" label="Payment expiry minutes:">
            <FormElements.Input size="large" placeholder="e.g., 15" />
          </Form.Item>

          <Form.Item name="registration_timeout_days" label="Registration timeout days:">
            <FormElements.Input size="large" placeholder="e.g., 1" />
          </Form.Item>
        </>
      ),
    },
  ]

  return (
    <Modal title="Add Edge" open={visible} onOk={() => setVisible(false)} onCancel={() => setVisible(false)}>
      <Form onFinish={onFinish} form={form} layout="vertical">
        <Tabs size="large" items={tabsItems.sort((a, b) => Number(a.key) - Number(b.key))} />
        <Button fullWidth type="primary" htmlType="submit" size="large" loading={isLoading}>
          Submit
        </Button>
      </Form>
    </Modal>
  )
}

export default AddEdgeModal
