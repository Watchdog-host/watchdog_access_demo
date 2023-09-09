import { FC, useEffect, useMemo, useState } from 'react'
import { Checkbox, Col, Form, InputNumber, Popconfirm, Row } from 'antd'
import toast from 'react-hot-toast'

import { Button, FormElements, Modal, Tabs } from 'components'
import { useAppDispatch, useAppSelector } from 'store/hooks'
import { useUpdateEdgeMutation, useDeleteEdgeMutation, useEdgePathQuery, useLazyEdgePathQuery } from 'store/endpoints'
import { useGetRole } from 'hooks'
import { logOut, validateIp, validatePaymentExpiryMinutes, validateRegistrationTimeoutDays } from 'utils'
import { EDGE_TYPE_SELECTS } from 'constants/common'
import { useLocalStorage } from 'react-use'
import { setSettingsModal } from 'store/slices/modals'
import { IEdgeDTO } from 'types'
import { setCurrentEdge } from 'store/slices/navigation'
import { flattenEdgeObject } from 'utils/data'

const SettingsModal: FC = () => {
  const [form] = Form.useForm()
  const [_, setLocalEdge, removeLocalEdge] = useLocalStorage('edge')

  const {
    navigation: { currentEdge },
    modals: { settingsModal },
  } = useAppSelector((state) => state)
  const { isOwner, isAdmin } = useGetRole()
  const dispatch = useAppDispatch()
  const [bidirectionalMode, setBidirectionalMode] = useState(true)
  const [acquittance, setAcquittance] = useState(true)
  const [getLazyEdge, { data: lazyEdge, isSuccess }] = useLazyEdgePathQuery()

  const edge = flattenEdgeObject(lazyEdge).find(({ id }) => id === currentEdge?.id)
  const isAdminAccess = isAdmin && edge?.id === 1

  const [updateMutation, { isLoading: updateLoading }] = useUpdateEdgeMutation()
  const [deleteMutation, { isLoading: deleteLoading }] = useDeleteEdgeMutation()

  useEffect(() => {
    getLazyEdge()
    const extra_field = JSON.parse(edge?.extra_field || '{}')
    setBidirectionalMode(extra_field?.bidirectional_mode)
    setAcquittance(extra_field?.acquittance)
    form.setFieldsValue({
      title: edge?.title,
      type: edge?.type,
      private_ip: edge?.private_ip,
      public_ip: edge?.public_ip,
      latitude: edge?.latitude,
      longitude: edge?.longitude,
      payment_expiry_minutes: extra_field?.payment_expiry_minutes,
      registration_timeout_days: extra_field?.registration_timeout_days,
      bidirectional_mode: extra_field?.bidirectional_mode ?? true,
      acquittance: extra_field?.acquittance ?? true,
    })
  }, [isSuccess, form, settingsModal])

  const onFinish = (values: any) => {
    const { payment_expiry_minutes, checkin_timeout, bidirectional_mode, acquittance } = values

    const extra_field = JSON.stringify({
      payment_expiry_minutes: payment_expiry_minutes ?? undefined,
      checkin_timeout: checkin_timeout ?? undefined,
      bidirectional_mode: bidirectional_mode,
      acquittance: acquittance,
    })

    const updateValues = {
      ...values,
      title: values.title,
      private_ip: values.private_ip,
      public_ip: values.public_ip,
      latitude: values.latitude,
      longitude: values.longitude,
      extra_field,
    }

    if (isOwner || !isAdminAccess) {
      const mutationPromise = updateMutation({
        id: edge?.id,
        edge_id: edge?.id,
        ...updateValues,
      }).unwrap()

      toast
        .promise(mutationPromise, {
          loading: `updating settings...`,
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
          getLazyEdge().then((data) => {
            const updatedEdge = flattenEdgeObject(data.data).find(({ id }) => id === currentEdge?.id)
            dispatch(setCurrentEdge(updatedEdge))
            setLocalEdge(updatedEdge)
          })
          dispatch(setSettingsModal(false))
          form.resetFields()
        })
    } else {
      // toast.error('Permission denied!')
    }
  }

  const onDelete = () => {
    const mutationPromise = deleteMutation({
      edge_id: edge?.id as number,
    })
      .unwrap()
      .then(() => {
        window.location.reload()
        removeLocalEdge()
      })

    toast.promise(mutationPromise, {
      loading: `deleting...`,
      success: `successfully deleted`,
      error: (error) => {
        if (error?.status == 'FETCH_ERROR') {
          logOut()
          return error?.error
        }
        return error?.data?.error
      },
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
              disabled={isAdminAccess}
              addonAfter={
                isOwner && (
                  <Popconfirm title="Are you sure to delete?" onConfirm={() => onDelete()}>
                    <Button danger size="large" style={{ marginLeft: 5 }} loading={deleteLoading}>
                      Delete
                    </Button>
                  </Popconfirm>
                )
              }
            />
          </Form.Item>
          <Form.Item name="type" label="Type:">
            <FormElements.Select options={EDGE_TYPE_SELECTS} />
          </Form.Item>
          <Form.Item name="private_ip" label="Private ip:" rules={[{ validator: validateIp }]}>
            <FormElements.Input disabled={isAdminAccess} size="large" />
          </Form.Item>

          <Form.Item name="public_ip" label="Public ip:" rules={[{ validator: validateIp }]}>
            <FormElements.Input disabled={isAdminAccess} size="large" />
          </Form.Item>

          <Form.Item name="latitude" label="Latitude:">
            <FormElements.InputNumber disabled={isAdminAccess} size="large" placeholder="e.g., 41.248902" min={0} float />
          </Form.Item>

          <Form.Item name="longitude" label="Longitude:">
            <FormElements.InputNumber disabled={isAdminAccess} size="large" placeholder="e.g., 69.166551" min={0} float />
          </Form.Item>
        </>
      ),
    },
    {
      key: '2',
      label: 'Access',
      children: (
        <Row gutter={12}>
          <Col span={12}>
            <Form.Item name="payment_expiry_minutes" label="Payment expiry minutes:" rules={[{ validator: validatePaymentExpiryMinutes }]}>
              <FormElements.InputNumber disabled={isAdminAccess} size="large" placeholder="e.g., 15" min={0} max={24 * 60} />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item name="checkin_timeout" label="Checkin timeout days:" rules={[{ validator: validateRegistrationTimeoutDays }]}>
              <FormElements.InputNumber disabled={isAdminAccess} size="large" placeholder="e.g., 1" min={1} max={365} />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item name="bidirectional_mode" valuePropName="checked">
              <Checkbox checked={bidirectionalMode} onChange={(e) => setBidirectionalMode(e.target.checked)}>
                Bidirectional mode
              </Checkbox>
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item name="acquittance" valuePropName="checked">
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
    <Modal title="Edit Settings" open={settingsModal} onOk={() => dispatch(setSettingsModal(false))} onCancel={() => dispatch(setSettingsModal(false))}>
      <Form onFinish={onFinish} form={form} layout="vertical">
        <Tabs items={tabsItems.sort((a, b) => Number(a.key) - Number(b.key))} />
        <Button fullWidth type="primary" htmlType="submit" size="large" loading={updateLoading}>
          Submit
        </Button>
      </Form>
    </Modal>
  )
}

export default SettingsModal
