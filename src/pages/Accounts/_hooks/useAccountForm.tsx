import { useEffect } from 'react'
import { Form } from 'antd'
import { toast } from 'react-hot-toast'

import { Button, FormElements } from 'components'
import { ROLE_SELECTS } from 'constants/common'
import { useAddAccountMutation, useProfileQuery, useUpdateAccountMutation } from 'store/endpoints'
import { useGetRole } from 'hooks'
import { useAppSelector } from 'store/hooks'

export type Props = {
  data?: any
  visible?: boolean
  setVisible?: (bool: boolean) => void
}

const useAccountForm = ({ data, visible, setVisible }: Props = {}) => {
  const [form] = Form.useForm()

  const { currentEdge } = useAppSelector((state) => state.navigation)
  const { isOwner, isAdmin } = useGetRole()

  const { data: profileData } = useProfileQuery()
  const [addMutation, { isLoading }] = useAddAccountMutation()
  const [updateMutation, { isLoading: updateLoading }] = useUpdateAccountMutation()

  const filteredRoles: any = ROLE_SELECTS.filter((type) => Number(profileData?.type) < type.value)

  useEffect(() => {
    form.setFieldsValue({
      title: data?.title,
      email: data?.email,
      type: data?.type,
    })
  }, [data, form, visible])

  const onFinish = (values: any) => {
    const formData = {
      ...values,
      type: values.type || filteredRoles[0].value,
      edge_id: currentEdge?.id,
      id: data?.id,
    }

    if (isOwner || isAdmin) {
      if (data) {
        const mutationPromise = updateMutation({
          account_id: data?.id,
          ...formData,
        }).unwrap()
        toast
          .promise(mutationPromise, {
            loading: `updating account...`,
            success: `successfully updated`,
            error: ({ data }) => data?.error,
          })
          .then(() => {
            setVisible?.(false)
          })
      } else {
        const mutationPromise = addMutation(formData).unwrap()
        toast
          .promise(mutationPromise, {
            loading: `adding account...`,
            success: `successfully added`,
            error: ({ data }) => data?.error,
          })
          .then((res) => {
            setVisible?.(false)
            form.resetFields()
          })
      }
    } else {
      toast.error('Permission denied!')
    }
  }

  const accountForm = (
    <Form onFinish={onFinish} form={form} layout="vertical">
      <Form.Item name="title" label="Full name:" rules={[{ required: true, message: 'full name is required' }]}>
        <FormElements.Input size="large" />
      </Form.Item>

      <Form.Item name="email" label="Email:" rules={[{ required: true, message: 'email is required' }]}>
        <FormElements.Input size="large" inputMode="email" />
      </Form.Item>

      {!data && (
        <Form.Item name="password" label="Password:" rules={[{ required: true, message: 'password is required' }]}>
          <FormElements.Input size="large" isPassword />
        </Form.Item>
      )}

      {profileData && (
        <Form.Item name="type" label="Choose a type:">
          <FormElements.Select options={filteredRoles} />
        </Form.Item>
      )}

      <Button fullWidth type="primary" htmlType="submit" size="large" loading={isLoading || updateLoading}>
        Submit
      </Button>
    </Form>
  )

  return accountForm
}

export default useAccountForm
