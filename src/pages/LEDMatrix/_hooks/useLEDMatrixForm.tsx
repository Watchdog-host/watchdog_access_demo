import React, { useEffect, useState } from 'react'
import { Col, Form, Row, Tabs } from 'antd'
import { groupBy, map } from 'lodash'
import { toast } from 'react-hot-toast'
import _ from 'lodash'
import { Button, FormElements } from 'components'
import { useAppSelector } from 'store/hooks'
import {
  useAddDeviceMutation,
  useAddDevicedeviceMutation,
  useDeleteDevicedeviceMutation,
  useDevicedeviceQuery,
  useDevicesQuery,
  useUpdateDeviceMutation,
} from 'store/endpoints'
import { CAMERA_MODEL_SELECTS, DIRECTION_SELECTS } from 'constants/common'
import { IDeviceDTO, IGroupOptions } from 'types'
import { useGetRole } from 'hooks'
import classes from '../LEDMatrix.module.scss'
import { DeviceTypeEnum } from 'constants/enums'

export type Props = {
  data?: IDeviceDTO
  visible?: boolean
  setVisible?: (bool: boolean) => void
}

const useLEDMatrixForm = ({ data, visible, setVisible }: Props = {}) => {
  const [form] = Form.useForm()

  const [deletedOutputs, setDeletedOutputs] = useState<any[]>([])
  const [newOutputs, setNewOutputs] = useState<any[]>([])

  const { currentEdge } = useAppSelector((state) => state.navigation)
  const { isOwner, isAdmin } = useGetRole()

  const [addDeviceMutation, { isLoading: isAddDeviceLoading }] = useAddDeviceMutation()
  const [updateDeviceMutation, { isLoading: updateLoading }] = useUpdateDeviceMutation()

  const [addDevicedeviceMutation] = useAddDevicedeviceMutation()
  const [deleteDevicedeviceMutation] = useDeleteDevicedeviceMutation()

  const devicedeviceQuery = useDevicedeviceQuery({ input_device_id: data?.id })
  const devicesQuery = useDevicesQuery({ filter: { edge_id: currentEdge?.id } })

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

  function handleSetUpdatedOutputs(action: 'delete' | 'select', value: number) {
    if (action === 'delete') {
      if (
        deletedOutputs.indexOf(value) === -1 &&
        devicedeviceQuery.data?.some((item) => item.output_device_id === value)
      ) {
        setDeletedOutputs((prev) => [...prev, value])
      } else {
        setNewOutputs((prev) => prev.filter((item) => item !== value))
      }
    } else {
      if (!devicedeviceQuery.data?.some((item) => item.output_device_id === value)) {
        setNewOutputs((prev) => [...prev, value])
      } else {
        setDeletedOutputs((prev) => prev.filter((item) => item !== value))
      }
    }
  }

  useEffect(() => {
    if (data) {
      const resOutput = devicedeviceQuery.data?.map((device) => ({
        title: devicesQuery.data?.find(({ id }) => id === device.output_device_id)?.title,
        value: device.output_device_id,
      }))

      form.setFieldsValue({
        title: data?.title,
        model: data?.model,
        source: data?.source,
        access_type: data?.access_type,
        longitude: data?.longitude,
        latitude: data?.latitude,
        output: resOutput,
      })
    }
  }, [data, form, visible, devicedeviceQuery.isFetching])

  const onFinish = (values: any) => {
    const formData = {
      id: data?.id,
      type: DeviceTypeEnum.LEDMatrix,
      title: values.title,
      model: values.model || 0,
      source: values.source,
      access_type: values.access_type || 0,
      latitude: Number(values.latitude),
      longitude: Number(values.longitude),
      edge_id: currentEdge?.id,
    }

    if (isOwner || isAdmin) {
      if (data) {
        const mutationPromise = updateDeviceMutation({
          ...formData,
          device_id: data?.id,
        })
          .unwrap()
          .then(() => {
            if (deletedOutputs?.length) {
              for (let i = 0; i < deletedOutputs?.length; i++) {
                const id = devicedeviceQuery.data?.find((item) => item.output_device_id === deletedOutputs[i])?.id
                deleteDevicedeviceMutation({ id }).unwrap()
              }
            }
            if (newOutputs?.length) {
              for (let i = 0; i < newOutputs?.length; i++) {
                const output_device_id = newOutputs[i]
                addDevicedeviceMutation({ input_device_id: data?.id, output_device_id }).unwrap()
              }
            }
          })
        toast
          .promise(mutationPromise, {
            loading: `updating device...`,
            success: `successfully updated`,
            error: ({ data }) => data?.error,
          })
          .then(() => {
            setVisible?.(false)
          })
      } else {
        const mutationPromise = addDeviceMutation(formData)
          .unwrap()
          .then((res) => {
            if (values.output?.length) {
              for (let i = 0; i < values.output?.length; i++) {
                const output_device_id = values.output[i]
                addDevicedeviceMutation({ input_device_id: res.id, output_device_id }).unwrap()
              }
            }
          })
        toast
          .promise(mutationPromise, {
            loading: `adding device...`,
            success: `successfully added`,
            error: ({ data }) => data?.error,
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
          <Row gutter={12}>
            <Col span={12}>
              <Form.Item name="title" label="Title:" rules={[{ required: true, message: 'title is required' }]}>
                <FormElements.Input size="large" placeholder="e.g., Outdoor device" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="model" label="Model:">
                <FormElements.Select options={CAMERA_MODEL_SELECTS} />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item name="source" label="Source:" rules={[{ required: true, message: 'source is required' }]}>
            <FormElements.Input size="large" placeholder="e.g., <http://>, <rtsp://>, <webcam>, ..." />
          </Form.Item>
          <Row gutter={12}>
            <Col span={24}>
              <Form.Item name="access_type" label="Access type:">
                <FormElements.Select options={DIRECTION_SELECTS} />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={12}>
            <Col span={12}>
              <Form.Item
                name="latitude"
                label="Latitude:"
                rules={[{ required: true, message: 'latitude type is required' }]}
              >
                <FormElements.Input size="large" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="longitude"
                label="Longitude:"
                rules={[{ required: true, message: 'longitude type is required' }]}
              >
                <FormElements.Input size="large" />
              </Form.Item>
            </Col>
          </Row>
          <Form.Item name="output" label="Output:">
            <FormElements.Select
              mode="multiple"
              onSelect={(value) => handleSetUpdatedOutputs('select', value)}
              onDeselect={(value) => handleSetUpdatedOutputs('delete', value)}
              groupOptions={deviceOptions}
              size="large"
            />
          </Form.Item>
        </>
      ),
    },
  ]
  return (
    <Form onFinish={onFinish} form={form} layout="vertical">
      <Tabs size="large" items={tabsItems.sort((a, b) => Number(a.key) - Number(b.key))} />
      <Button fullWidth type="primary" htmlType="submit" size="large" loading={isAddDeviceLoading || updateLoading}>
        Submit
      </Button>
    </Form>
  )
}

export default useLEDMatrixForm
