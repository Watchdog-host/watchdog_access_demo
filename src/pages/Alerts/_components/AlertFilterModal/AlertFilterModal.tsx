import { FC, useEffect, useState } from 'react'

import { Col, DatePicker, Form, Row, TimeRangePickerProps } from 'antd'
import Modal from 'components/Modal'
import Button from 'components/Button'
import dayjs, { Dayjs } from 'dayjs'
import { IGroupOptions } from 'types'
import { FormElements } from 'components'
import { ACCESS_TYPE_SELECTS, ALERT_SELECTS, DESCRIPTOR_TYPE_SELECT, GRANT_SELECTS } from 'constants/common'
import { useDevicesQuery } from 'store/endpoints'
import { groupBy, map } from 'lodash'
import { DeviceTypeEnum } from 'constants/enums'
import { useAppSelector } from 'store/hooks'
import { useLocalStorage } from 'react-use'
import './AlertFilterModal.scss'
import { ILocalData } from 'pages/Alerts/Alerts'

const { RangePicker } = DatePicker

type Props = {
  visible: boolean
  setVisible: (bool: boolean) => void
  localData: ILocalData | undefined
  setLocalData: (data: ILocalData) => void
}

const AlertFilterModal: FC<Props> = ({ visible, setVisible, localData, setLocalData }) => {
  const [form] = Form.useForm<ILocalData>()
  const { currentEdge } = useAppSelector((state) => state.navigation)
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

  const onFinish = (values: ILocalData) => {
    setLocalData(values)
    setVisible(false)
  }

  useEffect(() => {
    const resOutput = (localData as any)?.device_id?.map((value: number) => value).filter((id: number) => devicesData?.find((item) => item.id === id))

    form.setFieldsValue({
      range_date: localData?.range_date && [dayjs(localData?.range_date[0]), dayjs(localData?.range_date[1])],
      access_type: localData?.access_type,
      descriptor_type: localData?.descriptor_type,
      grant_type: localData?.grant_type,
      alert_type: localData?.alert_type,
      device_id: resOutput,
    })
  }, [localData, visible, devicesQuery.isSuccess])

  function onReset() {
    form.resetFields()
  }
  const rangePresets: TimeRangePickerProps['presets'] = [
    { label: 'Last 7 Days', value: [dayjs().add(-7, 'd'), dayjs()] },
    { label: 'Last 14 Days', value: [dayjs().add(-14, 'd'), dayjs()] },
    { label: 'Last 30 Days', value: [dayjs().add(-30, 'd'), dayjs()] },
    { label: 'Last 90 Days', value: [dayjs().add(-90, 'd'), dayjs()] },
  ]

  return (
    <Modal className="filter" title={'Filter'} open={visible} onOk={() => setVisible(false)} onCancel={() => setVisible(false)}>
      <Form onFinish={onFinish} form={form} layout="vertical">
        <Form.Item name="range_date" label="Date:">
          <RangePicker size="large" className={'filter__rangePicker'} presets={rangePresets} showTime allowClear={false} format="YYYY/MM/DD HH:mm" />
        </Form.Item>
        <Row gutter={12}>
          <Col span={12}>
            <Form.Item name="access_type" label="Access type:">
              <FormElements.Select allowClear options={ACCESS_TYPE_SELECTS} />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item name="alert_type" label="Alert type:">
              <FormElements.Select allowClear options={ALERT_SELECTS} />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item name="descriptor_type" label="Descriptor type:">
              <FormElements.Select allowClear options={DESCRIPTOR_TYPE_SELECT} />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item name="grant_type" label="Grant type:">
              <FormElements.Select allowClear options={GRANT_SELECTS} />
            </Form.Item>
          </Col>
        </Row>
        <Form.Item name="device_id" label="Devices:">
          <FormElements.Select placeholder={'Select devices'} mode="multiple" groupOptions={deviceOptions} size="small" />
        </Form.Item>
        <Row justify={'space-between'}>
          <Col span={6}>
            <Button onClick={onReset} fullWidth type="dashed" size="large" loading={false}>
              Clear
            </Button>
          </Col>
          <Col span={6}>
            <Button fullWidth type="primary" htmlType="submit" size="large" loading={false}>
              Submit
            </Button>
          </Col>
        </Row>
      </Form>
    </Modal>
  )
}

export default AlertFilterModal
