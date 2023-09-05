import { FC, useEffect } from 'react'
import { Form, Popconfirm, Tabs } from 'antd'
import toast from 'react-hot-toast'

import { Button, FormElements, Modal } from 'components'
import { useAppSelector } from 'store/hooks'
import { useUpdateEdgeMutation, useDeleteEdgeMutation } from 'store/endpoints'
import { useGetRole } from 'hooks'

export type Props = {
  visible: boolean
  setVisible: (bool: boolean) => void
}

const SettingsModal: FC<Props> = ({ visible, setVisible }) => {
  const [form] = Form.useForm()

  const { currentEdge } = useAppSelector((state) => state.navigation)
  const { isOwner } = useGetRole()

  const [updateMutation, { isLoading: updateLoading }] = useUpdateEdgeMutation()
  const [deleteMutation, { isLoading: deleteLoading }] = useDeleteEdgeMutation()

  useEffect(() => {
    const extra_field = JSON.parse(currentEdge?.extra_field)

    form.setFieldsValue({
      title: currentEdge?.title,
      private_ip: currentEdge?.private_ip,
      public_ip: currentEdge?.public_ip,
      latitude: currentEdge?.latitude,
      longitude: currentEdge?.longitude,
      payment_expiry_minutes: extra_field?.payment_expiry_minutes,
      registration_timeout_days: extra_field?.registration_timeout_days,
    })
  }, [currentEdge, form, visible])

  const onFinish = (values: any) => {
    const { payment_expiry_minutes, registration_timeout_days } = values
    const extra_field = JSON.stringify({ payment_expiry_minutes, registration_timeout_days })

    const updateValues = {
      ...values,
      title: values.title,
      private_ip: values.private_ip,
      public_ip: values.public_ip,
      latitude: Number(values.latitude),
      longitude: Number(values.longitude),
      extra_field,
    }

    if (isOwner) {
      const mutationPromise = updateMutation({
        id: currentEdge?.id,
        edge_id: currentEdge?.id,
        ...updateValues,
      }).unwrap()

      toast
        .promise(mutationPromise, {
          loading: `updating settings...`,
          success: `successfully updated`,
          error: ({ data }) => JSON.stringify(data),
        })
        .then(() => {
          setVisible(false)
          form.resetFields()
        })
    } else {
      toast.error('Permission denied!')
    }
  }

  const onDelete = () => {
    const mutationPromise = deleteMutation({
      edge_id: currentEdge?.id as number,
    })
      .unwrap()
      .then(() => window.location.reload())

    toast.promise(mutationPromise, {
      loading: `deleting...`,
      success: `successfully deleted`,
      error: ({ data }) => JSON.stringify(data),
    })
  }

  const tabsItems = [
    {
      key: '1',
      label: 'General',
      children: (
        <>
          <Form.Item name="title" label="Title:" rules={[{ required: true, message: 'title is required' }]}>
            <FormElements.Input
              size="large"
              addonAfter={
                isOwner && (
                  <div style={{ marginTop: -10, marginLeft: 8 }}>
                    <Popconfirm title="Are you sure to delete?" onConfirm={() => onDelete()}>
                      <Button danger size="large" loading={deleteLoading}>
                        Delete
                      </Button>
                    </Popconfirm>
                  </div>
                )
              }
            />
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
    <Modal title="Edit Settings" open={visible} onOk={() => setVisible(false)} onCancel={() => setVisible(false)}>
      <Form onFinish={onFinish} form={form} layout="vertical">
        <Tabs size="large" items={tabsItems.sort((a, b) => Number(a.key) - Number(b.key))} />
        <Button fullWidth type="primary" htmlType="submit" size="large" loading={updateLoading}>
          Submit
        </Button>
      </Form>
    </Modal>
  )
}

export default SettingsModal
