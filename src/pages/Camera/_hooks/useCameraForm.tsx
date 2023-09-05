import React, { useEffect, useState } from 'react'
import { Checkbox, Col, Form, Row, InputNumber, Tabs, Divider } from 'antd'
import { groupBy, map, upperFirst } from 'lodash'
import { toast } from 'react-hot-toast'
import _ from 'lodash'
import { Button, FormElements, List } from 'components'
import { useAppSelector } from 'store/hooks'
import {
  useAddDeviceMutation,
  useAddDevicedeviceMutation,
  useAddWatchlistdeviceMutation,
  useDeleteDevicedeviceMutation,
  useDeleteWatchlistdeviceMutation,
  useDevicedeviceQuery,
  useDevicesQuery,
  useUpdateDeviceMutation,
  useUpdateWatchlistdeviceMutation,
  useWatchlistdeviceQuery,
  useWatchlistsQuery,
} from 'store/endpoints'
import {
  ACCESS_SELECTS,
  ALERT_SELECTS,
  ENHANCEMENT_SELECTS,
  DEVICE_SELECTS,
  CAMERA_MODEL_SELECTS,
  DIRECTION_SELECTS,
  DESCRIPTOR_TYPE_SELECT,
} from 'constants/common'
import { IDeviceDTO, IGroupOptions, IWatchlistdevice } from 'types'
import { useGetRole } from 'hooks'
import classes from '../Camera.module.scss'
import { DescriptorTypeEnum, DeviceTypeEnum } from 'constants/enums'

export type Props = {
  data?: IDeviceDTO
  visible?: boolean
  setVisible?: (bool: boolean) => void
}

const useCameraForm = ({ data, visible, setVisible }: Props = {}) => {
  const [form] = Form.useForm()
  const [watchlists, setWatchlists] = useState<any[]>()

  const [deletedOutputs, setDeletedOutputs] = useState<any[]>([])
  const [newOutputs, setNewOutputs] = useState<any[]>([])

  const [newWatchlistdevice, setNewWatchlistdevice] = useState<IWatchlistdevice[]>([])
  const [deletedWatchlistdevice, setDeletedWatchlistdevice] = useState<IWatchlistdevice[]>([])
  const [updatedWatchlistdevice, setUpdatedWatchlistdevice] = useState<IWatchlistdevice[]>([])

  const [descriptorType, setDescriptorType] = useState<number>(DescriptorTypeEnum.Barcode)
  const { currentEdge } = useAppSelector((state) => state.navigation)
  const { isOwner, isAdmin } = useGetRole()

  const [addDeviceMutation, { isLoading: isAddDeviceLoading }] = useAddDeviceMutation()
  const [updateDeviceMutation, { isLoading: updateLoading }] = useUpdateDeviceMutation()

  const [addDevicedeviceMutation] = useAddDevicedeviceMutation()
  const [deleteDevicedeviceMutation] = useDeleteDevicedeviceMutation()

  const [addWatchlistdeviceMutation] = useAddWatchlistdeviceMutation()

  const [deleteWatchlistdeviceMutation] = useDeleteWatchlistdeviceMutation()
  const [updateWatchlistdeviceMutation] = useUpdateWatchlistdeviceMutation()

  const devicedeviceQuery = useDevicedeviceQuery({ input_device_id: data?.id || 0 })
  const watchlistdeviceQuery = useWatchlistdeviceQuery({ device_id: data?.id || 0 })

  const watchlistsQuery = useWatchlistsQuery()
  const devicesQuery = useDevicesQuery({ filter: { edge_id: currentEdge?.id } })

  const watchlistsData = watchlistsQuery.data
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
    setWatchlists(
      watchlistsData?.map((watchlist) => ({
        label: watchlist.title,
        data: watchlist.watchlists?.map((item) => {
          const data = watchlistdeviceQuery.data?.find(({ watchlist_id }) => watchlist_id === item.id)
          return {
            title: item.title,
            watchlist_id: item.id,
            active: Boolean(data) || item.title === 'Unknown',
            alert_type: data?.alert_type || 0,
            grant_type: data?.grant_type || 0,
          }
        }),
      })),
    )
  }, [watchlistsQuery.isFetching, watchlistdeviceQuery.isFetching])

  useEffect(() => {
    if (data) {
      const parsed = JSON.parse(data?.extra_field || '{}')

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

        descriptor_type: parsed?.descriptor_type,
        enhancement: parsed?.enhancement,
        fps: parsed?.fps,
        buffer_size: parsed?.buffer_size,
        frame_width: parsed?.frame_width,
        frame_height: parsed?.frame_height,

        detection_iteration_increase: parsed?.detection_iteration_increase,
        verification_threshold: parsed?.verification_threshold,
        ocr_min_font_point: parsed?.ocr_min_font_point,
        postprocess_min_confidence: parsed?.postprocess_min_confidence,
        postprocess_confidence_skip_level: parsed?.postprocess_confidence_skip_level,
      })
    }
  }, [data, form, visible, devicedeviceQuery.isFetching])

  const onFinish = (values: any) => {
    const camera_extra_field = {
      descriptor_type: values.descriptor_type || DescriptorTypeEnum.Barcode,
      enhancement: values.enhancement,
      fps: values.fps,
      buffer_size: values.buffer_size,
      frame_width: values.frame_width,
      frame_height: values.frame_height,

      detection_iteration_increase: values.detection_iteration_increase,
      verification_threshold: values.verification_threshold,
      ocr_min_font_point: values.ocr_min_font_point,
      postprocess_min_confidence: values.postprocess_min_confidence,
      postprocess_confidence_skip_level: values.postprocess_confidence_skip_level,
    }
    const formData = {
      id: data?.id,
      type: DeviceTypeEnum.Camera,
      title: values.title,
      model: values.model || 0,
      source: values.source,
      access_type: values.access_type || 0,
      latitude: Number(values.latitude),
      longitude: Number(values.longitude),
      edge_id: currentEdge?.id,
      extra_field: JSON.stringify(camera_extra_field),
    }

    const watchlistdeviceData = (
      watchlists
        ?.map((item) => Object.values(item))
        .flat()
        .filter((item) => Array.isArray(item))
        .flat() as IWatchlistdevice[]
    )
      ?.filter((item) => item.active)
      .map(({ watchlist_id, alert_type, grant_type }) => ({ watchlist_id, alert_type, grant_type }))

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
            if (newWatchlistdevice.length) {
              for (let i = 0; i < newWatchlistdevice.length; i++) {
                const { alert_type, grant_type, watchlist_id } = newWatchlistdevice[i]
                addWatchlistdeviceMutation({
                  alert_type,
                  grant_type,
                  watchlist_id,
                  device_id: data?.id,
                })
              }
            }
            if (watchlistdeviceQuery.isSuccess) {
              if (deletedWatchlistdevice.length) {
                for (let i = 0; i < deletedWatchlistdevice.length; i++) {
                  const watchlistId = watchlistdeviceQuery.data?.find(
                    ({ watchlist_id }) => watchlist_id === deletedWatchlistdevice[i]?.watchlist_id,
                  )?.id
                  deleteWatchlistdeviceMutation({ id: watchlistId })
                }
              }
              if (updatedWatchlistdevice.length) {
                for (let i = 0; i < updatedWatchlistdevice.length; i++) {
                  const watchlistdevice_id = watchlistdeviceQuery.data.find(
                    ({ watchlist_id }) => watchlist_id === updatedWatchlistdevice[i]?.watchlist_id,
                  )?.id
                  const { alert_type, grant_type } = updatedWatchlistdevice[i]
                  updateWatchlistdeviceMutation({
                    ...{ id: watchlistdevice_id, alert_type, grant_type },
                    watchlistdevice_id,
                  })
                }
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
            if (watchlistdeviceData?.length) {
              for (let i = 0; i < watchlistdeviceData?.length; i++) {
                addWatchlistdeviceMutation({ ...watchlistdeviceData[i], device_id: res.id })
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

  const handleWatchlistdeviceState = (value: IWatchlistdevice) => {
    if (watchlistdeviceQuery.isSuccess) {
      const isExisting = watchlistdeviceQuery.data.some((item) => item.watchlist_id === value.watchlist_id)
      const updatedItem = watchlistdeviceQuery.data.find(
        ({ alert_type, grant_type, watchlist_id }) =>
          watchlist_id === value.watchlist_id && (alert_type !== value.alert_type || grant_type !== value.grant_type),
      )
      if (!isExisting) {
        if (value.active) {
          setNewWatchlistdevice((prev) => [...prev.filter((item) => item.watchlist_id !== value.watchlist_id), value])
        } else {
          setNewWatchlistdevice((prev) => prev?.filter((item) => item.watchlist_id !== value.watchlist_id))
        }
      } else {
        if (value.active) {
          setDeletedWatchlistdevice((prev) => prev?.filter((item) => item.watchlist_id !== value.watchlist_id))
        } else {
          setDeletedWatchlistdevice((prev) => [
            ...prev.filter((item) => item.watchlist_id !== value.watchlist_id),
            value,
          ])
        }
      }
      if (updatedItem) {
        setUpdatedWatchlistdevice((prev) => [
          ...prev.filter((item) => item?.watchlist_id !== value?.watchlist_id),
          value,
        ])
      } else {
        setUpdatedWatchlistdevice((prev) => prev?.filter((item) => item.watchlist_id !== value.watchlist_id))
      }
    }
  }

  const onChanges = (id: any, type: 'check' | 'alert_type' | 'grant_type', value: any) => {
    const newWatchlists = watchlists?.map((watchlist) => {
      const newArr = watchlist.data?.map((item: IWatchlistdevice) => item)
      newArr?.forEach((item: IWatchlistdevice) => {
        if (item.watchlist_id === id) {
          if (type === 'check') {
            item.active = item.title === 'Unknown' ? true : value
          } else if (type === 'alert_type') {
            item.alert_type = value
          } else if (type === 'grant_type') {
            item.grant_type = value
          }
          handleWatchlistdeviceState(item)
        }
      })
      return { ...watchlist, data: newArr }
    })
    setWatchlists(newWatchlists)
  }

  const tabPlate = {
    key: '3',
    label: 'Plate',
    children: (
      <section className={classes.formWrapper}>
        <Row gutter={12}>
          <Col span={12}>
            <Form.Item name="detection_iteration_increase" label="Detection iteration:">
              <InputNumber size="large" placeholder="e.g., 1.10" min={0.01} max={1} step={0.05} />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item name="verification_threshold" label="Verification threshold:">
              <InputNumber size="large" placeholder="e.g., 75" min={1} />
            </Form.Item>
          </Col>
        </Row>

        <Form.Item name="ocr_min_font_point" label="Minimum font size:">
          <InputNumber size="large" placeholder="e.g., 6" min={1} max={100} />
        </Form.Item>

        <Row gutter={12}>
          <Col span={12}>
            <Form.Item name="postprocess_min_confidence" label="Char OCR confidence (%):">
              <InputNumber size="large" placeholder="e.g., 75" min={0} max={100} />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item name="postprocess_confidence_skip_level" label="Total OCR confidence (%):">
              <InputNumber size="large" placeholder="e.g., 75" min={0} max={100} />
            </Form.Item>
          </Col>
        </Row>
      </section>
    ),
  }

  const tabBarcode = {
    key: '3',
    label: 'Barcode',
    children: (
      <section className={classes.formWrapper}>
        <Row gutter={12}>
          <Col span={12}>I'm Barcode form</Col>
        </Row>
      </section>
    ),
  }
  const tabFace = {
    key: '3',
    label: 'Face',
    children: (
      <section className={classes.formWrapper}>
        <Row gutter={12}>
          <Col span={12}>I'm Face form</Col>
        </Row>
      </section>
    ),
  }

  const tabsItems = [
    {
      key: '1',
      label: 'General',
      children: (
        <section className={classes.formWrapper}>
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
        </section>
      ),
    },
    {
      key: '2',
      label: 'Frame',
      children: (
        <section className={classes.formWrapper}>
          <Row gutter={12} align="middle">
            <Col span={24}>
              <Row gutter={12}>
                <Col span={12}>
                  <Form.Item name="descriptor_type" label="Descriptor type:">
                    <FormElements.Select onSelect={(e) => setDescriptorType(e)} options={DESCRIPTOR_TYPE_SELECT} />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item name="enhancement" label="Enhancement:">
                    <FormElements.Select options={ENHANCEMENT_SELECTS} />
                  </Form.Item>
                </Col>
              </Row>
            </Col>
            <Col span={12}>
              <Form.Item name="fps" label="Fps:">
                <InputNumber size="large" placeholder="e.g., 25" min={0} max={1000} />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="buffer_size" label="Buffer size:">
                <InputNumber size="large" placeholder="e.g., 5" min={0} max={1000} />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="frame_width" label="Frame width:">
                <InputNumber size="large" placeholder="e.g., 0" min={0} />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="frame_height" label="Frame height:">
                <InputNumber size="large" placeholder="e.g., 0" min={0} />
              </Form.Item>
            </Col>
          </Row>
        </section>
      ),
    },
    {
      key: '4',
      label: 'Watchlists',
      children: (
        <div className={classes.hookList}>
          {watchlists?.map(({ label, data }) => (
            <div key={label}>
              <Divider className={classes.devider} orientation="center">
                {_.upperFirst(label)}
              </Divider>
              {data?.map((item: IWatchlistdevice) => (
                <Row
                  key={item.title}
                  align="middle"
                  justify="space-between"
                  gutter={12}
                  className={classes.hookList__item}
                  wrap={false}
                >
                  <Col span={6}>
                    <Row gutter={12} wrap={false}>
                      <Col>
                        <Checkbox
                          checked={item.active}
                          onChange={(e) => {
                            const { checked } = e.target
                            onChanges(item.watchlist_id, 'check', checked)
                          }}
                        />
                      </Col>
                      <Col>
                        <b>{_.upperFirst(item.title)}</b>
                      </Col>
                    </Row>
                  </Col>
                  <Col span={18}>
                    <Row gutter={12} justify={'end'}>
                      <Col span={8}>
                        <FormElements.Select
                          fullWidth
                          placeholder="Select alert"
                          options={ALERT_SELECTS}
                          disabled={!item.active}
                          value={item.alert_type}
                          onChange={(e) => onChanges(item.watchlist_id, 'alert_type', e)}
                        />
                      </Col>
                      <Col span={8}>
                        <FormElements.Select
                          fullWidth
                          placeholder="Select access"
                          options={ACCESS_SELECTS}
                          disabled={!item.active}
                          value={item.grant_type}
                          onChange={(e) => onChanges(item.watchlist_id, 'grant_type', e)}
                        />
                      </Col>
                    </Row>
                  </Col>
                </Row>
              ))}
            </div>
          ))}
          {/* {watchlistsData?.map((watchlist, index) => (
            <div key={watchlist.title}>
              <Divider orientation="center">{_.upperFirst(watchlist.title)}</Divider>
              <List
                dataSource={
                  watchlist.watchlists?.map((item, i) => ({
                    key: item?.id || i,
                    title: item?.title,
                    data: item,
                    hasAccess:
                      watchlistsData[index].title === currentEdge?.title,
                      
                  })) as IListDataSource[]
                }
              />
            </div>
          ))} */}
        </div>
      ),
    },
  ]

  if (descriptorType !== null) {
    switch (DescriptorTypeEnum[descriptorType]) {
      case DescriptorTypeEnum[0]:
        tabsItems.push(tabBarcode)
        break
      case DescriptorTypeEnum[1]:
        tabsItems.push(tabFace)
        break
      case DescriptorTypeEnum[2]:
        tabsItems.push(tabPlate)
        break
    }
  }
  return (
    <Form onFinish={onFinish} form={form} layout="vertical">
      <Tabs size="large" items={tabsItems.sort((a, b) => Number(a.key) - Number(b.key))} />
      <Button fullWidth type="primary" htmlType="submit" size="large" loading={isAddDeviceLoading || updateLoading}>
        Submit
      </Button>
    </Form>
  )
}

export default useCameraForm
