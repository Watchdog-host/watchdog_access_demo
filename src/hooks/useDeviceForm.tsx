import React, { useEffect, useState } from 'react'
import { Checkbox, Col, Form, Row, InputNumber, Tabs } from 'antd'
import { find, groupBy, map, upperFirst } from 'lodash'
import { toast } from 'react-hot-toast'

import { Button, FormElements } from 'components'
import { useAppSelector } from 'store/hooks'
import { useAddDeviceMutation, useDevicesQuery, useUpdateDeviceMutation, useWatchlistsQuery } from 'store/endpoints'
import {
  ACCESS_SELECTS,
  ALERT_SELECTS,
  ENHANCEMENT_SELECTS,
  CAMERA_TYPE_SELECTS,
  DEVICE_SELECTS,
  BARCODE_SCANNER_TYPE_SELECTS,
  LED_MATRIX_TYPE_SELECTS,
  TRIGGER_TYPE_SELECTS,
  RELAY_TYPE_SELECTS,
  PRINTER_TYPE_SELECTS,
  CAMERA_MODEL_SELECTS,
  DEVICE_MODEL_SELECTS,
  DIRECTION_SELECTS,
} from 'constants/common'
import { DEVICE_TYPE, IDeviceDTO, IGroupOptions, IWatchlistdevice } from 'types'
import { useGetRole } from 'hooks'
import { clearObject } from 'utils'
import { useLocation } from 'react-router-dom'
import { DeviceTypeEnum } from 'constants/enums'

export type Props = {
  data?: IDeviceDTO
  visible?: boolean
  setVisible?: (bool: boolean) => void
}

const useDeviceForm = ({ data, visible, setVisible }: Props = {}) => {
  const [form] = Form.useForm()
  const [skipFramesCheck, setSkipFramesCheck] = useState<boolean>(false)
  const [watchlists, setWatchlists] = useState<any[]>()
  const { currentEdge } = useAppSelector((state) => state.navigation)
  const { isOwner, isAdmin } = useGetRole()
  const { pathname } = useLocation()
  const isCameraPage = pathname.slice(1) === ('Camera' as DEVICE_TYPE)
  const isScannerPage = pathname.slice(1) === ('BarcodeScanner' as DEVICE_TYPE)

  const [addMutation, { isLoading: addLoading }] = useAddDeviceMutation()
  const [updateMutation, { isLoading: updateLoading }] = useUpdateDeviceMutation()
  const watchlistsQuery = useWatchlistsQuery()
  const devicesQuery = useDevicesQuery({ filter: { edge_id: currentEdge?.id } })
  const devicesData = devicesQuery.data
  const watchlistsData = watchlistsQuery.data

  const groupedOptions = groupBy(devicesData, 'type')
  const deviceOptions = map(groupedOptions, (data, key) => ({
    label: DeviceTypeEnum[key as any],
    options: data?.map((device) => ({
      title: device.title,
      value: JSON.stringify({
        deviceId: String(device.id),
        typeId: String(key),
      }).replace(/"\s+|\s+"/g, '"'),
    })),
  })) as IGroupOptions[]

  useEffect(() => {
    setWatchlists(
      watchlistsData?.map((watchlist) => ({
        label: watchlist.title,
        data: watchlist.watchlists?.map((item) => ({
          title: item.title,
          id: item.id,
          active: item.title === 'Unknown' ? true : false,
          alert: 0,
          access: 0,
        })),
      })),
    )
  }, [watchlistsQuery.isFetching])

  useEffect(() => {
    if (data) {
      const parsed = JSON.parse(data?.extra_field || '{}')

      const output = parsed?.output && JSON.parse(parsed?.output || '{}')
      const resOutput = Object.entries(output || []).map(([deviceId, typeId]) => ({
        deviceId,
        typeId,
      }))

      const watchlist = parsed?.watchlists
      if (!!Object.keys(watchlist || []).length) {
        const newWatchlist = Object.entries(watchlist || []).map(([id, item]: any) => ({
          title: item.title,
          id: id,
          active: item.active,
          alert: item.alert,
          access: item.access,
        }))

        setWatchlists(
          watchlistsData?.map((watchlist) => ({
            label: watchlist.title,
            data: newWatchlist,
          })),
        )
      }

      form.setFieldsValue({
        title: data?.title,
        source: data?.source,
        model: data.model,
        longitude: data?.longitude,
        latitude: data?.latitude,
        skip_frames: skipFramesCheck,
        output: resOutput.map((item) => JSON.stringify(item)),
        access_type: data?.access_type,
        direction: data?.direction,

        output_address: parsed?.output_address,
        fps: parsed?.fps,
        buffer_size: parsed?.buffer_size,
        frame_width: parsed?.frame_width,
        frame_height: parsed?.frame_height,
        enhancement: parsed?.enhancement,
        detection_iteration_increase: parsed?.detection_iteration_increase,
        detection_strictness: parsed?.detection_strictness,
        ocr_min_font_point: parsed?.ocr_min_font_point,
        postprocess_min_confidence: parsed?.postprocess_min_confidence,
        postprocess_confidence_skip_level: parsed?.postprocess_confidence_skip_level,
      })
      setSkipFramesCheck(parsed?.skip_frames)
    }
  }, [data, form, visible, watchlistsQuery.isFetching])

  const onFinish = (values: any) => {
    // outputs
    const output = values.output?.map((item: any) => JSON.parse(item || '{}'))
    const mappedOutput =
      output?.map((item: any) => ({
        [item.deviceId]: item.typeId,
      })) || []
    const resOutput = Object.assign({}, ...mappedOutput)

    // watchlists
    const newWatchlists: any =
      watchlists?.map((watchlist) => {
        let res = watchlist.data?.map((item: IWatchlistdevice) => ({
          [item.watchlist_id as number]: {
            title: item.title,
            id: item.watchlist_id,
            active: item.active,
            alert: item.alert_type,
            access: item.grant_type,
          },
        }))

        return res
      }) || []
    const resWatchlists = Object.assign({}, ...newWatchlists.flat())

    // extra_field
    const general_extra_field = {
      output: JSON.stringify(resOutput),
    }

    const scanner_extra_field = {
      output: JSON.stringify(resOutput),
      watchlists: resWatchlists,
    }

    const camera_extra_field = {
      fps: values.fps,
      buffer_size: values.buffer_size,
      skip_frames: skipFramesCheck,
      frame_width: values.frame_width,
      frame_height: values.frame_height,
      enhancement: values.enhancement || 0,
      detection_iteration_increase: values.detection_iteration_increase,
      detection_strictness: values.detection_strictness,
      ocr_min_font_point: values.ocr_min_font_point,
      postprocess_min_confidence: values.postprocess_min_confidence,
      postprocess_confidence_skip_level: values.postprocess_confidence_skip_level,
      output: JSON.stringify(resOutput),
      watchlists: resWatchlists,
    }
    let extra_field = {}

    if (isScannerPage) {
      extra_field = scanner_extra_field
    } else if (isCameraPage) {
      extra_field = camera_extra_field
    } else {
      extra_field = general_extra_field
    }

    const formData = {
      id: data?.id,
      title: values.title,
      model: values.model || 0,
      type: find(DEVICE_SELECTS, {
        label: upperFirst(pathname.slice(1)) as DEVICE_TYPE,
      })?.value,
      source: values.source,
      latitude: Number(values.latitude),
      longitude: Number(values.longitude),
      edge_id: currentEdge?.id,
      // extra_field: JSON.stringify(extra_field),
    }
    const clearFormData = clearObject(formData)

    if (isOwner || isAdmin) {
      if (data) {
        const mutationPromise = updateMutation({
          device_id: data?.id,
          ...clearFormData,
        }).unwrap()
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
        const mutationPromise = addMutation(clearFormData).unwrap()
        toast
          .promise(mutationPromise, {
            loading: `adding device...`,
            success: `successfully added`,
            error: ({ data }) => data?.error,
          })
          .then(() => {
            setVisible?.(false)
            form.resetFields()
            setWatchlists(watchlists?.map((item) => ({ ...item, active: false })))
          })
      }
    } else {
      toast.error('Permission denied!')
    }
  }

  const onChanges = (id: any, type: 'check' | 'alert' | 'access', value: any) => {
    const newWatchlists = watchlists?.map((watchlist) => {
      const newArr = watchlist.data?.map((item: IWatchlistdevice) => item)

      newArr?.forEach((item: IWatchlistdevice) => {
        if (item.watchlist_id === id) {
          if (type === 'check') {
            item.active = item.title === 'Unknown' ? true : value
          } else if (type === 'alert') {
            item.alert_type = value
          } else if (type === 'access') {
            item.grant_type = value
          }
        }
      })

      return { ...watchlist, data: newArr }
    })

    setWatchlists(newWatchlists)
  }

  const tabFrame = {
    key: '2',
    label: 'Frame',
    children: (
      <>
        <Row gutter={12} align="middle">
          <Col span={9}>
            <Form.Item name="fps" label="Fps:">
              <InputNumber size="large" placeholder="e.g., 25" min={0} max={1000} />
            </Form.Item>
          </Col>
          <Col span={9}>
            <Form.Item name="buffer_size" label="Buffer size:">
              <InputNumber size="large" placeholder="e.g., 5" min={0} max={1000} />
            </Form.Item>
          </Col>
          <Col style={{ marginTop: 30 }}>
            <Form.Item name="skip_frames">
              <Checkbox
                checked={skipFramesCheck}
                onChange={(e) => {
                  const { checked } = e.target
                  setSkipFramesCheck(checked)
                }}
              >
                Skip frames
              </Checkbox>
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={12}>
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

        <Form.Item name="enhancement" label="Enhancement:">
          <FormElements.Select options={ENHANCEMENT_SELECTS} />
        </Form.Item>
      </>
    ),
  }
  const tabPlate = {
    key: '3',
    label: 'Plate',
    children: (
      <>
        <Row gutter={12}>
          <Col span={12}>
            <Form.Item name="detection_iteration_increase" label="Detection iteration:">
              <InputNumber size="large" placeholder="e.g., 1.10" min={0.01} max={1} step={0.05} />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item name="detection_strictness" label="Strictness:">
              <InputNumber size="large" placeholder="e.g., 3" min={1} max={9} />
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
      </>
    ),
  }
  const tabWatchlist = {
    key: '4',
    label: 'Watchlists',
    children: (
      <>
        {watchlists?.map(({ label, data }) => (
          <div key={label}>
            <h2>{label}</h2>
            {data?.map((item: IWatchlistdevice) => (
              <Row
                key={item.title}
                align="middle"
                justify="space-between"
                gutter={12}
                style={{ marginBottom: 10 }}
                wrap={false}
              >
                <Col span={6}>
                  <Row gutter={8} wrap={false}>
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
                      <h3>{item.title}</h3>
                    </Col>
                  </Row>
                </Col>
                <Col span={18}>
                  <Row gutter={12}>
                    <Col span={12}>
                      <FormElements.Select
                        fullWidth
                        placeholder="Select alert"
                        options={ALERT_SELECTS}
                        disabled={!item.active}
                        value={item.alert_type}
                        onChange={(e) => onChanges(item.watchlist_id, 'alert', e)}
                      />
                    </Col>
                    <Col span={12}>
                      <FormElements.Select
                        fullWidth
                        placeholder="Select access"
                        options={ACCESS_SELECTS}
                        disabled={!item.active}
                        value={item.grant_type}
                        onChange={(e) => onChanges(item.watchlist_id, 'access', e)}
                      />
                    </Col>
                  </Row>
                </Col>
              </Row>
            ))}
          </div>
        ))}
      </>
    ),
  }

  let typeOptions
  switch (pathname.slice(1) as DEVICE_TYPE) {
    case 'Camera':
      typeOptions = CAMERA_TYPE_SELECTS
      break
    case 'Printer':
      typeOptions = PRINTER_TYPE_SELECTS
      break
    case 'BarcodeScanner':
      typeOptions = BARCODE_SCANNER_TYPE_SELECTS
      break
    case 'LEDMatrix':
      typeOptions = LED_MATRIX_TYPE_SELECTS
      break
    case 'Trigger':
      typeOptions = TRIGGER_TYPE_SELECTS
      break
    case 'Relay':
      typeOptions = RELAY_TYPE_SELECTS
      break
  }

  const tabsItems = [
    {
      key: '1',
      label: 'General',
      children: (
        <>
          <Form.Item name="title" label="Title:" rules={[{ required: true, message: 'title is required' }]}>
            <FormElements.Input size="large" placeholder="e.g., Outdoor device" />
          </Form.Item>

          <Row gutter={12}>
            <Col span={24}>
              <Form.Item name="model" label="Model:">
                <FormElements.Select options={isCameraPage ? CAMERA_MODEL_SELECTS : DEVICE_MODEL_SELECTS} />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item name="source" label="Source:" rules={[{ required: true, message: 'source is required' }]}>
            <FormElements.Input size="large" placeholder="e.g., <http://>, <rtsp://>, <webcam>, ..." />
          </Form.Item>

          <Row gutter={12}>
            <Col span={12}>
              <Form.Item name="latitude" label="Latitude:">
                <FormElements.Input size="large" />
              </Form.Item>
            </Col>

            <Col span={12}>
              <Form.Item name="longitude" label="Longitude:">
                <FormElements.Input size="large" />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={12}>
            <Col span={isCameraPage || isScannerPage ? 12 : 24}>
              <Form.Item name="subtype" label="Type:">
                <FormElements.Select options={typeOptions} />
              </Form.Item>
            </Col>
            {(isCameraPage || isScannerPage) && (
              <Col span={12}>
                <Form.Item name="direction" label="Direction:">
                  <FormElements.Select options={DIRECTION_SELECTS} />
                </Form.Item>
              </Col>
            )}
          </Row>

          <Form.Item name="output" label="Output:">
            <FormElements.Select mode="multiple" groupOptions={deviceOptions} size="large" />
          </Form.Item>
        </>
      ),
    },
  ]

  switch (pathname.slice(1)) {
    case 'Camera':
      tabsItems.push(tabFrame, tabPlate, tabWatchlist)
      break
    case 'Scanner':
      tabsItems.push(tabWatchlist)
      break
  }

  const cameraForm = (
    <Form onFinish={onFinish} form={form} layout="vertical">
      <Tabs size="large" items={tabsItems} />

      <Button fullWidth type="primary" htmlType="submit" size="large" loading={addLoading || updateLoading}>
        Submit
      </Button>
    </Form>
  )

  return cameraForm
}

export default useDeviceForm
