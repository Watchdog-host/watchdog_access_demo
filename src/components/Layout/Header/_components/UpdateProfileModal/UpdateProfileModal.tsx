import { FC, useEffect, useState } from 'react'
import { Alert, Form, Tabs } from 'antd'
import toast from 'react-hot-toast'
import { useNavigate } from 'react-router-dom'

import { useAppSelector } from 'store/hooks'
import { Button, FormElements, Modal } from 'components'
import { useProfileQuery, useUpdateProfileMutation } from 'store/endpoints'
import { ROLE_STEPS } from 'constants/common'
import { clearObject } from 'utils'

export type Props = {
  visible: boolean
  setVisible: (bool: boolean) => void
}

const UpdateProfileModal: FC<Props> = ({ visible, setVisible }) => {
  const [form] = Form.useForm()
  const [password, setPassword] = useState<string>()
  const navigate = useNavigate()

  const { currentEdge } = useAppSelector((state) => state.navigation)
  const { data: profileData } = useProfileQuery()
  const [updateProfileMutation, { isLoading }] = useUpdateProfileMutation()

  useEffect(() => {
    form.setFieldsValue({
      title: profileData?.title,
      email: profileData?.email,
      type: profileData?.type,
    })
  }, [profileData, form, visible])

  const onFinish = (values: any) => {
    const formData = {
      ...values,
      edge_id: currentEdge?.id,
      id: profileData?.id,
    }
    const clearedFormData = clearObject(formData)

    const mutationPromise = updateProfileMutation({
      profile_id: profileData?.id,
      ...clearedFormData,
    }).unwrap()
    toast
      .promise(mutationPromise, {
        loading: `updating profile...`,
        success: `successfully updated`,
        error: ({ data }) => data.error,
      })
      .then(() => {
        setVisible?.(false)
        localStorage.clear()
        navigate('/login')
      })
  }

  useEffect(() => {
    if (!visible) {
      form.resetFields()
    }
  })

  return (
    <Modal title="Update Profile" open={visible} onOk={() => setVisible(false)} onCancel={() => setVisible(false)}>
      <Form onFinish={onFinish} form={form} layout="vertical">
        <Alert message="After your profile is updated, you will be logged out" type="warning" showIcon closable />
        <Tabs
          items={[
            {
              key: '1',
              label: 'General',
              children: (
                <>
                  <Form.Item
                    name="title"
                    label="Full name:"
                    rules={[{ required: true, message: 'full name is required' }]}
                  >
                    <FormElements.Input size="large" />
                  </Form.Item>
                  <Form.Item name="email" label="Email:" rules={[{ required: true, message: 'email is required' }]}>
                    <FormElements.Input size="large" />
                  </Form.Item>
                  <Form.Item name="" label="Role:">
                    <FormElements.Input size="large" defaultValue={ROLE_STEPS[profileData?.type as number]} disabled />
                  </Form.Item>
                </>
              ),
            },
            {
              key: '2',
              label: 'Change password',
              children: (
                <>
                  <Form.Item
                    name="old_password"
                    label="Old password:"
                    rules={[
                      {
                        required: !!password?.length,
                        message: 'old password is required',
                      },
                    ]}
                  >
                    <FormElements.Input size="large" isPassword />
                  </Form.Item>

                  <Form.Item name="password" label="New password:">
                    <FormElements.Input size="large" isPassword onChange={(e) => setPassword(e.target.value)} />
                  </Form.Item>
                </>
              ),
            },
          ]}
        />

        <Button fullWidth type="primary" htmlType="submit" size="large" loading={isLoading}>
          Submit
        </Button>
      </Form>
    </Modal>
  )
}

export default UpdateProfileModal
