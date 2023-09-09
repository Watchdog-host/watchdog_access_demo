import { useEffect } from 'react'
import { Form } from 'antd'
import { toast } from 'react-hot-toast'

import { Button, FormElements } from 'components'
import { ROLE_SELECTS } from 'constants/common'
import { useAddAccountMutation, useUpdateAccountMutation } from 'store/endpoints'
import { useGetRole } from 'hooks'
import { useAppSelector } from 'store/hooks'
import { logOut, validateEmail } from 'utils'
import { IProfileDTO } from 'types'
import { useLocalStorage } from 'react-use'

export type Props = {
  data?: any
  visible?: boolean
  setVisible?: (bool: boolean) => void
}

const useAccountForm = ({ data, visible, setVisible }: Props = {}) => {
  const [form] = Form.useForm()

  const { currentEdge } = useAppSelector((state) => state.navigation)
  const { isOwner, isAdmin, isAgent, isCustomer } = useGetRole()

  const [localProfile] = useLocalStorage<IProfileDTO>('profile')

  const [addMutation, { isLoading }] = useAddAccountMutation()
  const [updateMutation, { isLoading: updateLoading }] = useUpdateAccountMutation()

  const filteredRoles: any = ROLE_SELECTS.filter((type) => Number(localProfile?.type) < type.value)

  useEffect(() => {
    if (data) {
      form.setFieldsValue({
        title: data?.title,
        email: data?.email,
        type: data?.type,
      })
    }
  }, [data, form, visible])

  const onFinish = (values: any) => {
    const formData = {
      ...values,
      type: values.type || filteredRoles[0].value,
      edge_id: currentEdge?.id,
      id: data?.id,
    }

    if (isOwner || isAdmin || isAgent || isCustomer) {
      if (data) {
        const mutationPromise = updateMutation({
          account_id: data?.id,
          ...formData,
        }).unwrap()
        toast
          .promise(mutationPromise, {
            loading: `updating account...`,
            success: `successfully updated`,
            error: (error) => {
              if (error?.status == 'FETCH_ERROR') {
                logOut()
                return error?.error
              }
              return error?.data?.error
            },
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
            error: (error) => {
              if (error?.status == 'FETCH_ERROR') {
                logOut()
                return error?.error
              }
              return error?.data?.error
            },
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
    <Form
      onFinish={onFinish}
      form={form}
      layout="vertical"
      initialValues={{
        type: filteredRoles[0].value,
      }}
    >
      <Form.Item name="title" label="Full name:" rules={[{ required: true, message: 'full name is required' }]}>
        <FormElements.Input size="large" />
      </Form.Item>

      <Form.Item name="email" label="Email:" rules={[{ validator: validateEmail }]}>
        <FormElements.Input size="large" inputMode="email" />
      </Form.Item>

      {!data && (
        <Form.Item name="password" label="Password:" rules={[{ required: true, message: 'password is required' }]}>
          <FormElements.Input size="large" isPassword />
        </Form.Item>
      )}

      {localProfile && (
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
