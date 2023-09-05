import React, { FC } from 'react'
import { toast } from 'react-hot-toast'
import { Form } from 'antd'

import { useGetRole } from 'hooks'
import { Button, FormElements, Modal } from 'components'
import { useAddDescriptorMutation } from 'store/endpoints'

export type Props = {
  visible: boolean
  setVisible: (bool: boolean) => void
  id?: number
}

const AddDescriptorModal: FC<Props> = ({ visible, setVisible, id }) => {
  const [form] = Form.useForm()
  const { isOwner, isAdmin } = useGetRole()

  const [addMutation, { isLoading }] = useAddDescriptorMutation()

  const onFinish = (values: any) => {
    const formData = {
      id,
      ...values,
    }

    if (isOwner || isAdmin) {
      const mutationPromise = addMutation(formData).unwrap()
      toast
        .promise(mutationPromise, {
          loading: `adding descriptor...`,
          success: `successfully added`,
          error: ({ data }) => data?.error,
        })
        .then((res) => {
          setVisible?.(false)
          form.resetFields()
        })
    } else {
      toast.error('Permission denied!')
    }
  }

  return (
    <Modal
      title="Add Descriptor"
      open={visible}
      onOk={() => setVisible(false)}
      onCancel={() => setVisible(false)}
      centered
    >
      <Form onFinish={onFinish} form={form} layout="vertical">
        <Form.Item
          name="descriptor"
          label="Descriptor:"
          rules={[{ required: true, message: 'this field is required' }]}
        >
          <FormElements.Input size="large" placeholder="e.g., 01A123BC" />
        </Form.Item>

        <Button fullWidth type="primary" htmlType="submit" size="large" loading={isLoading}>
          Submit
        </Button>
      </Form>
    </Modal>
  )
}

export default AddDescriptorModal
