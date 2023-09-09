import React, { useEffect } from 'react'
import { Col, Form, Grid, Row } from 'antd'
import { toast } from 'react-hot-toast'
import _ from 'lodash'
import { Button, FormElements } from 'components'
import { useAppSelector } from 'store/hooks'
import { useAddPlanMutation, useUpdatePlanMutation } from 'store/endpoints'
import { PLAN_TYPE_SELECT } from 'constants/common'
import { IPlanDTO } from 'types'
import { useGetRole } from 'hooks'
import classes from '../Plans.module.scss'
import { PlanTypeEnum } from 'constants/enums'
import { logOut } from 'utils'

export type Props = {
  data?: IPlanDTO
  visible?: boolean
  setVisible?: (bool: boolean) => void
}

const usePlansForm = ({ data, visible, setVisible }: Props = {}) => {
  const [form] = Form.useForm()
  const { useBreakpoint } = Grid
  const { xs } = useBreakpoint()
  const { currentEdge } = useAppSelector((state) => state.navigation)
  const [addPlanMutation, { isLoading: isAddPlanLoading }] = useAddPlanMutation()
  const [updatePlanMutation, { isLoading: isupdatePlanLoading }] = useUpdatePlanMutation()
  const { isOwner, isAdmin } = useGetRole()

  useEffect(() => {
    if (data) {
      form.setFieldsValue({
        title: data?.title,
        type: data?.type,
        price: data?.price,
        discount: data?.discount,
        agent_share: data?.agent_share,
      })
    }
  }, [data, form, visible])

  const onFinish = (values: any) => {
    const formData = {
      id: data?.id,
      title: values.title,
      type: values.type,
      price: values.price ?? undefined,
      discount: values.discount ?? undefined,
      agent_share: values.agent_share ?? undefined,
      edge_id: currentEdge?.id,
    }

    if (isOwner || isAdmin) {
      if (data) {
        const mutationPromise = updatePlanMutation({
          ...formData,
          plan_id: data?.id,
        }).unwrap()
        toast
          .promise(mutationPromise, {
            loading: `updating plan...`,
            success: `successfully updated`,
            error: (error) => {
              if (error?.status == 'FETCH_ERROR' || error?.status === 401) {
                logOut()
                return error?.error || error?.data?.error
              }
              return error?.data?.error
            },
          })
          .then(() => {
            setVisible?.(false)
          })
      } else {
        const mutationPromise = addPlanMutation(formData).unwrap()
        toast
          .promise(mutationPromise, {
            loading: `adding plan...`,
            success: `successfully added`,
            error: (error) => {
              if (error?.status == 'FETCH_ERROR' || error?.status === 401) {
                logOut()
                return error?.error || error?.data?.error
              }
              return error?.data?.error
            },
          })
          .then(() => {
            setVisible?.(false)
            form.resetFields()
          })
      }
    } else {
      toast.error('Permission denied!')
    }
  }
  return (
    <Form onFinish={onFinish} form={form} layout="vertical" initialValues={{ type: PLAN_TYPE_SELECT[PlanTypeEnum.Basic].value }}>
      <section className={classes.formWrapper}>
        <Row gutter={12}>
          <Col span={xs ? 24 : 12}>
            <Form.Item name="title" label="Title:" rules={[{ required: true, message: 'title is required' }]}>
              <FormElements.Input size="large" placeholder="e.g., Outdoor device" />
            </Form.Item>
          </Col>
          <Col span={xs ? 24 : 12}>
            <Form.Item name="type" label="Type:">
              <FormElements.Select options={PLAN_TYPE_SELECT} />
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={12}>
          <Col span={xs ? 24 : 12}>
            <Form.Item name="price" label="Price:" rules={[{ required: true, message: 'price is required' }]}>
              <FormElements.InputNumber size="large" placeholder="0" min={0} />
            </Form.Item>
          </Col>
          <Col span={xs ? 12 : 6}>
            <Form.Item name="discount" label="Discount:" rules={[{ required: true, message: 'discount is required' }]}>
              <FormElements.InputNumber size="large" placeholder="0" precision={2} min={0} max={100} float />
            </Form.Item>
          </Col>
          <Col span={xs ? 12 : 6}>
            <Form.Item name="agent_share" label="Agent share:" rules={[{ required: true, message: 'agent share is required' }]}>
              <FormElements.InputNumber size="large" placeholder="0" precision={2} min={0} max={100} float />
            </Form.Item>
          </Col>
        </Row>
      </section>
      <Button fullWidth type="primary" htmlType="submit" size="large" loading={isAddPlanLoading || isupdatePlanLoading}>
        Submit
      </Button>
    </Form>
  )
}

export default usePlansForm
