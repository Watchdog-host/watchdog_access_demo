import React, { useEffect, useState } from 'react'
import { Col, Form, Grid, InputNumber, Row } from 'antd'
import { groupBy, map } from 'lodash'
import { toast } from 'react-hot-toast'
import _ from 'lodash'
import { Button, FormElements, Tabs } from 'components'
import { useAppSelector } from 'store/hooks'
import { useAddDeviceMutation, useDevicesQuery, useUpdateDeviceMutation } from 'store/endpoints'
import { CAMERA_MODEL_SELECTS, DEVICES_MODEL_SELECTS, ACCESS_TYPE_SELECTS } from 'constants/common'
import { IDeviceDTO, IGroupOptions } from 'types'
import { useGetRole } from 'hooks'
import classes from '../Relay.module.scss'
import { AccessTypeEnum, DeviceModelEnum, DeviceTypeEnum } from 'constants/enums'
import { logOut } from 'utils'

export type Props = {
  data?: IDeviceDTO
  visible?: boolean
  setVisible?: (bool: boolean) => void
}

const useRelayForm = ({ data, visible, setVisible }: Props = {}) => {
  const [form] = Form.useForm()
  const { useBreakpoint } = Grid
  const { xs } = useBreakpoint()
  const { currentEdge } = useAppSelector((state) => state.navigation)
  const { isOwner, isAdmin } = useGetRole()

  const [addDeviceMutation, { isLoading: isAddDeviceLoading }] = useAddDeviceMutation()
  const [updateDeviceMutation, { isLoading: updateLoading }] = useUpdateDeviceMutation()

  const devicesQuery = useDevicesQuery({ filter: { edge_id: currentEdge?.id || 0 } })
  const devicesData = devicesQuery.data
  const groupedOptions = groupBy(devicesData, 'type')
  const deviceOptions = map(groupedOptions, (data, key) => {
    return {
      label: DeviceTypeEnum[key as any],
      options: data?.map((device) => ({
        title: device.title,
        value: device.id,
      })),
    }
  }) as IGroupOptions[]

  useEffect(() => {
    if (data) {
      const extra_field = JSON.parse(data?.extra_field || '{}')

      const resOutput = extra_field?.output_devices?.map((value: number) => value).filter((id: number) => devicesData?.find((item) => item.id === id))

      form.setFieldsValue({
        title: data?.title,
        model: data?.model,
        source: data?.source,
        access_type: data?.access_type,
        longitude: data?.longitude,
        latitude: data?.latitude,
        output_devices: resOutput,
        timeout: extra_field?.timeout,
      })
    }
  }, [data, form, visible, devicesQuery.isSuccess])
  const onFinish = (values: any) => {
    const extra_field = { output_devices: values.output_devices, timeout: values.timeout ?? undefined }
    const formData = {
      id: data?.id,
      type: DeviceTypeEnum.Relay,
      title: values.title,
      source: values.source,
      model: values.model,
      access_type: values.access_type ?? null,
      latitude: values.latitude,
      longitude: values.longitude,
      edge_id: currentEdge?.id,
      extra_field: JSON.stringify(extra_field),
    }

    if (isOwner || isAdmin) {
      if (data) {
        const mutationPromise = updateDeviceMutation({
          ...formData,
          device_id: data?.id,
        }).unwrap()
        toast
          .promise(mutationPromise, {
            loading: `updating device...`,
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
        const mutationPromise = addDeviceMutation(formData).unwrap()
        toast
          .promise(mutationPromise, {
            loading: `adding device...`,
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

  const tabsItems = [
    {
      key: '1',
      label: 'General',
      children: (
        <>
          <Row gutter={xs ? 12 : 8}>
            <Col span={12}>
              <Form.Item name="title" label="Title:" rules={[{ required: true, message: 'title is required' }]}>
                <FormElements.Input size="large" placeholder="e.g., Outdoor device" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="model" label="Model:">
                <FormElements.Select options={DEVICES_MODEL_SELECTS} />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item name="source" label="Source:" rules={[{ required: true, message: 'source is required' }]}>
            <FormElements.Input size="large" placeholder="e.g., <http://>, <rtsp://>, <webcam>, ..." />
          </Form.Item>
          <Row gutter={xs ? 12 : 8}>
            <Col span={24}>
              <Form.Item name="access_type" label="Access type:">
                <FormElements.Select options={ACCESS_TYPE_SELECTS} />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={xs ? 12 : 8}>
            <Col span={12}>
              <Form.Item name="latitude" label="Latitude:" rules={[{ required: true, message: 'Latitude is required' }]}>
                <FormElements.InputNumber size="large" placeholder="e.g., 41.248902" min={0} float />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="longitude" label="Longitude:" rules={[{ required: true, message: 'Longitude is required' }]}>
                <FormElements.InputNumber size="large" placeholder="e.g., 69.166554" min={0} float />
              </Form.Item>
            </Col>
          </Row>
          <Form.Item name="output_devices" label="Output:">
            <FormElements.Select mode="multiple" groupOptions={deviceOptions} size="large" maxTagCount={'responsive'} />
          </Form.Item>
        </>
      ),
    },
    {
      key: '2',
      label: 'Timeout',
      children: (
        <Form.Item name="timeout" label="Timeout seconds:">
          <FormElements.InputNumber size="large" placeholder="e.g., 20" min={0} max={1000} />
        </Form.Item>
      ),
    },
  ]
  return (
    <Form
      onFinish={onFinish}
      form={form}
      layout="vertical"
      initialValues={{
        model: DEVICES_MODEL_SELECTS[DeviceModelEnum.Gateway].value,
        // access_type: ACCESS_TYPE_SELECTS[AccessTypeEnum.Undefined].value
      }}
    >
      <Tabs items={tabsItems.sort((a, b) => Number(a.key) - Number(b.key))} />
      <Button fullWidth type="primary" htmlType="submit" size="large" loading={isAddDeviceLoading || updateLoading}>
        Submit
      </Button>
    </Form>
  )
}

export default useRelayForm
