import React, { useEffect, useState } from 'react'
import { Checkbox, Col, Form, Row, Divider, InputNumber, Grid, Select } from 'antd'
import { groupBy, map, upperFirst } from 'lodash'
import { toast } from 'react-hot-toast'
import _ from 'lodash'
import { Button, FormElements, List, Tabs } from 'components'
import { useAppSelector } from 'store/hooks'
import { useAddDeviceMutation, useDevicesQuery, useUpdateDeviceMutation, useWatchlistsQuery } from 'store/endpoints'
import {
  GRANT_SELECTS,
  ALERT_SELECTS,
  ENHANCEMENT_SELECTS,
  DEVICE_SELECTS,
  CAMERA_MODEL_SELECTS,
  ACCESS_TYPE_SELECTS,
  DESCRIPTOR_TYPE_SELECT,
  BARCODE_FORMATS_SELECTS,
  BARCODE_BINARIZER,
} from 'constants/common'
import { IDeviceDTO, IGroupOptions, IWatchlistdevice } from 'types'
import { useGetRole } from 'hooks'
import classes from '../Camera.module.scss'
import { AccessTypeEnum, AlertTypeEnum, BarcodeBinarizerEnum, DescriptorTypeEnum, DeviceModelEnum, DeviceTypeEnum, GrantTypeEnum } from 'constants/enums'
import { floatPercentage, logOut, validateBufferSize, validateDetectionIterationIncrease, validateFps, validateFrameHW, validateMinFontSize } from 'utils'
import { createWatchlistObject, fromWatchlistObject } from 'utils/data'

export type Props = {
  data?: IDeviceDTO
  visible?: boolean
  setVisible?: (bool: boolean) => void
}

const useCameraForm = ({ data, visible, setVisible }: Props = {}) => {
  const [form] = Form.useForm()
  const [watchlists, setWatchlists] = useState<any[]>()
  const { useBreakpoint } = Grid
  const { xs } = useBreakpoint()
  const [descriptorType, setDescriptorType] = useState<number>(DescriptorTypeEnum.Barcode)
  const { currentEdge } = useAppSelector((state) => state.navigation)
  const { isOwner, isAdmin, isAgent, isCustomer } = useGetRole()

  const [addDeviceMutation, { isLoading: isAddDeviceLoading }] = useAddDeviceMutation()
  const [updateDeviceMutation, { isLoading: updateLoading }] = useUpdateDeviceMutation()

  const watchlistsQuery = useWatchlistsQuery({
    filter: {
      id: currentEdge?.id || 0,
    },
  })
  const watchlistsData = watchlistsQuery.data
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
    const extra_field = JSON.parse(data?.extra_field || '{}')
    setWatchlists(
      watchlistsData?.map((watchlist) => ({
        label: watchlist.title,
        data: watchlist.watchlists?.map((item) => {
          const data = fromWatchlistObject(extra_field?.watchlists)?.find(({ watchlist_id }) => watchlist_id === item.id)
          return {
            title: item.title,
            watchlist_id: item.id,
            active: Boolean(data) || item.title === 'Unknown',
            //xaxa
            alert_type: data?.alert_type ?? null,
            grant_type: data?.grant_type ?? null,
          }
        }),
      })),
    )
  }, [data, watchlistsQuery.isFetching, visible])

  useEffect(() => {
    if (data) {
      const extra_field = JSON.parse(data?.extra_field || '{}')
      const resOutput = extra_field?.output_devices?.map((value: number) => value).filter((id: number) => devicesData?.find((item) => item.id === id))
      setDescriptorType(extra_field?.descriptor_type)
      form.setFieldsValue({
        title: data?.title,
        model: data?.model,
        source: data?.source,
        access_type: data?.access_type,
        longitude: data?.longitude,
        latitude: data?.latitude,
        output_devices: resOutput,

        descriptor_type: extra_field?.descriptor_type,
        enhancement: extra_field?.enhancement,
        fps: extra_field?.fps,
        buffer_size: extra_field?.buffer_size,
        frame_width: extra_field?.frame_width,
        frame_height: extra_field?.frame_height,

        barcode_formats: extra_field?.barcode_formats?.split(','),
        barcode_is_pure: extra_field?.barcode_is_pure,
        barcode_try_harder: extra_field?.barcode_try_harder,
        barcode_try_rotate: extra_field?.barcode_try_rotate,
        barcode_try_invert: extra_field?.barcode_try_invert,
        barcode_try_downscale: extra_field?.barcode_try_downscale,
        barcode_binarizer: extra_field?.barcode_binarizer,

        detection_iteration_increase: extra_field?.detection_iteration_increase,
        verification_threshold: extra_field?.verification_threshold,
        ocr_min_font_point: extra_field?.ocr_min_font_point,
        postprocess_min_confidence: extra_field?.postprocess_min_confidence,
        postprocess_confidence_skip_level: extra_field?.postprocess_confidence_skip_level,
      })
    }
  }, [data, form, visible, devicesQuery.isSuccess])

  const onFinish = (values: any) => {
    const extra_field = {
      output_devices: values.output_devices,
      watchlists: createWatchlistObject(watchlists?.map((item) => item.data && item.data).flat() as IWatchlistdevice[]),

      descriptor_type: values.descriptor_type ?? null,
      enhancement: values.enhancement ?? null,
      fps: values.fps,
      buffer_size: values.buffer_size,
      frame_width: values.frame_width,
      frame_height: values.frame_height,

      barcode_formats: values.barcode_formats?.join(','),
      barcode_is_pure: values.barcode_is_pure,
      barcode_try_harder: values.barcode_try_harder,
      barcode_try_rotate: values.barcode_try_rotate,
      barcode_try_invert: values.barcode_try_invert,
      barcode_try_downscale: values.barcode_try_downscale,
      barcode_binarizer: values.barcode_binarizer,

      detection_iteration_increase: values.detection_iteration_increase ?? undefined,
      verification_threshold: values.verification_threshold ?? undefined,
      ocr_min_font_point: values.ocr_min_font_point ?? undefined,
      postprocess_min_confidence: values.postprocess_min_confidence ?? undefined,
      postprocess_confidence_skip_level: values.postprocess_confidence_skip_level ?? undefined,
    }

    const formData = {
      id: data?.id,
      type: DeviceTypeEnum.Camera,
      title: values.title,
      model: values.model,
      source: values.source,
      access_type: values.access_type ?? null,
      latitude: values.latitude,
      longitude: values.longitude,
      edge_id: currentEdge?.id,
      extra_field: JSON.stringify(extra_field),
    }

    if (isOwner || isAdmin || isAgent || isCustomer) {
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
        <Row gutter={xs ? 8 : 12}>
          <Col span={12}>
            <Form.Item name="detection_iteration_increase" label="Detection iteration:">
              <FormElements.InputNumber size="large" placeholder="e.g., 1.10" min={1} max={2} precision={2} step={0.05} float />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item name="verification_threshold" label="Verification threshold:">
              <FormElements.InputNumber size="large" placeholder="e.g., 75" min={0} max={100} precision={2} float />
            </Form.Item>
          </Col>
        </Row>
        <Form.Item name="ocr_min_font_point" label="Minimum font size:">
          <FormElements.InputNumber size="large" placeholder="e.g., 6" min={0} max={100} />
        </Form.Item>

        <Row gutter={xs ? 8 : 12}>
          <Col span={12}>
            <Form.Item name="postprocess_min_confidence" label="Char OCR confidence (%):">
              <FormElements.InputNumber size="large" placeholder="e.g., 75" min={0} max={100} precision={2} float />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item name="postprocess_confidence_skip_level" label="Total OCR confidence (%):">
              <FormElements.InputNumber size="large" placeholder="e.g., 75" min={0} max={100} precision={2} float />
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
        <Row gutter={xs ? 8 : 12}>
          <Col span={12}>
            <Form.Item name="barcode_formats" label="Formats:">
              <FormElements.Select mode="multiple" options={BARCODE_FORMATS_SELECTS} size="large" maxTagCount={'responsive'} placeholder="All formats are selected if empty" />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item name="barcode_binarizer" label="Binarizer:">
              <FormElements.Select options={BARCODE_BINARIZER} />
            </Form.Item>
          </Col>
        </Row>
        <Row>
          <Col span={8}>
            <Form.Item name="barcode_is_pure" valuePropName="checked" wrapperCol={{ offset: 1, span: 2 }}>
              <Checkbox>Is pure</Checkbox>
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item name="barcode_try_harder" valuePropName="checked" wrapperCol={{ offset: 1, span: 2 }}>
              <Checkbox>Try harder</Checkbox>
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item name="barcode_try_rotate" valuePropName="checked" wrapperCol={{ offset: 0, span: 2 }}>
              <Checkbox>Try rotate</Checkbox>
            </Form.Item>
          </Col>
        </Row>
        <Row>
          <Col span={8}>
            <Form.Item name="barcode_try_invert" valuePropName="checked" wrapperCol={{ offset: 1, span: 2 }}>
              <Checkbox>Try invert</Checkbox>
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item name="barcode_try_downscale" valuePropName="checked" wrapperCol={{ offset: 1, span: 2 }}>
              <Checkbox>Try downscale</Checkbox>
            </Form.Item>
          </Col>
        </Row>
      </section>
    ),
  }
  const tabFace = {
    key: '3',
    label: 'Face',
    children: (
      <section className={classes.formWrapper}>
        <Row gutter={xs ? 8 : 12}>
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
          <Row gutter={xs ? 8 : 12}>
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
          <Row gutter={xs ? 8 : 12}>
            <Col span={24}>
              <Form.Item name="access_type" label="Access type:">
                <FormElements.Select allowClear options={ACCESS_TYPE_SELECTS} />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={xs ? 8 : 12}>
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
        </section>
      ),
    },
    {
      key: '2',
      label: 'Frame',
      children: (
        <section className={classes.formWrapper}>
          <Row gutter={xs ? 8 : 12}>
            <Col span={24}>
              <Row gutter={xs ? 8 : 12}>
                <Col span={12}>
                  <Form.Item name="descriptor_type" label="Descriptor type:">
                    <FormElements.Select allowClear onSelect={(e) => setDescriptorType(e)} options={DESCRIPTOR_TYPE_SELECT} />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item name="enhancement" label="Enhancement:">
                    <FormElements.Select allowClear options={ENHANCEMENT_SELECTS} />
                  </Form.Item>
                </Col>
              </Row>
            </Col>
            <Col span={12}>
              <Form.Item name="fps" label="FPS:" rules={[{ validator: validateFps }]}>
                <FormElements.InputNumber min={0} max={1000} size="large" placeholder="e.g., 25" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="buffer_size" label="Buffer size:" rules={[{ validator: validateBufferSize }]}>
                <FormElements.InputNumber min={0} max={100} size="large" placeholder="e.g., 5" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="frame_width" label="Frame width:" rules={[{ validator: validateFrameHW }]}>
                <FormElements.InputNumber min={0} max={10000} size="large" placeholder="e.g., 1280" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="frame_height" label="Frame height:" rules={[{ validator: validateFrameHW }]}>
                <FormElements.InputNumber min={0} max={10000} size="large" placeholder="e.g., 720" />
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
          {watchlists?.map(({ label, data }) => {
            if (!data?.length) return
            return (
              <div key={label}>
                <Divider className={classes.devider} orientation="center">
                  {_.upperFirst(label)}
                </Divider>
                {data?.map(({ title, active, alert_type, grant_type, watchlist_id }: IWatchlistdevice) => (
                  <Row key={title} align="middle" justify="space-between" gutter={xs ? 8 : 12} className={classes.hookList__item} wrap={false}>
                    <Col span={6}>
                      <Row gutter={xs ? 8 : 12} wrap={false}>
                        <Col>
                          <Checkbox
                            checked={active}
                            onChange={(e) => {
                              const { checked } = e.target
                              onChanges(watchlist_id, 'check', checked)
                            }}
                          />
                        </Col>
                        <Col style={{ whiteSpace: 'nowrap' }}>
                          <b>{_.upperFirst(title)}</b>
                        </Col>
                      </Row>
                    </Col>
                    <Col span={18}>
                      <Row gutter={xs ? 8 : 12} justify={'end'}>
                        <Col span={xs ? 10 : 8}>
                          {/* <Form.Item name={'a'}> */}
                          <FormElements.Select
                            allowClear
                            fullWidth
                            placeholder="Select alert"
                            options={ALERT_SELECTS}
                            // defaultValue={ALERT_SELECTS[AlertTypeEnum.None].value}
                            disabled={!active}
                            value={alert_type}
                            onChange={(e) => onChanges(watchlist_id, 'alert_type', e)}
                          />
                          {/* </Form.Item> */}
                        </Col>
                        <Col span={xs ? 10 : 8}>
                          {/* <Form.Item name={'b'}> */}
                          <FormElements.Select
                            allowClear
                            fullWidth
                            placeholder="Select access"
                            options={GRANT_SELECTS}
                            // defaultValue={GRANT_SELECTS[GrantTypeEnum.Undefined].value}
                            disabled={!active}
                            value={grant_type}
                            onChange={(e) => onChanges(watchlist_id, 'grant_type', e)}
                          />
                          {/* </Form.Item> */}
                        </Col>
                      </Row>
                    </Col>
                  </Row>
                ))}
              </div>
            )
          })}
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
    <Form
      onFinish={onFinish}
      form={form}
      layout="vertical"
      initialValues={{
        barcode_binarizer: BARCODE_BINARIZER[BarcodeBinarizerEnum.LocalAvarage].value,
        model: CAMERA_MODEL_SELECTS[DeviceModelEnum.Gateway].value,
        // enhancement: ENHANCEMENT_SELECTS[0].value,
        // access_type: ACCESS_TYPE_SELECTS[AccessTypeEnum.Undefined].value,
        // descriptor_type: DESCRIPTOR_TYPE_SELECT[DescriptorTypeEnum.Barcode].value,
        // alert_type: ALERT_SELECTS[AlertTypeEnum.None].value,
        // grant_type: GRANT_SELECTS[GrantTypeEnum.Undefined].value,
      }}
    >
      <Tabs items={tabsItems.sort((a, b) => Number(a.key) - Number(b.key))} />
      <Button fullWidth type="primary" htmlType="submit" size="large" loading={isAddDeviceLoading || updateLoading}>
        Submit
      </Button>
    </Form>
  )
}

export default useCameraForm
