import { FC, useEffect, useState } from 'react'

import { Col, DatePicker, Form, Row, TimeRangePickerProps } from 'antd'
import Modal from 'components/Modal'
import Button from 'components/Button'
import dayjs, { Dayjs } from 'dayjs'
import { IGroupOptions } from 'types'
import { FormElements } from 'components'
import { ACCESS_TYPE_SELECTS, DESCRIPTOR_TYPE_SELECT, GRANT_SELECTS, PAYMENT_TYPE_SELECT } from 'constants/common'
import { useDevicesQuery } from 'store/endpoints'
import { groupBy, map } from 'lodash'
import { DeviceTypeEnum } from 'constants/enums'
import { useAppSelector } from 'store/hooks'
import { useLocalStorage } from 'react-use'
import './RevenueFilterModal.scss'
import { ILocalData } from 'pages/Revenue/Revenue'

const { RangePicker } = DatePicker
type Props = {
  visible: boolean
  setVisible: (bool: boolean) => void
  localData: ILocalData | undefined
  setLocalData: (data: ILocalData) => void
}

const RevenueFilterModal: FC<Props> = ({ visible, setVisible, localData, setLocalData }) => {
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

    // const data = {
    //   title: values.title,
    //   type: values.type || EdgeTypeEnum.Virtual,
    //   private_ip: values.private_ip,
    //   public_ip: values.public_ip,
    //   latitude: values.latitude,
    //   longitude: values.longitude,
    //   edge_id: currentEdge?.id,
    //   extra_field,
    // }

    // const mutationPromise = addMutation(data).unwrap()
    // toast
    //   .promise(mutationPromise, {
    //     loading: `adding edge...`,
    //     success: `successfully added`,
    //     error: ({ data }) => data?.error,
    //   })
    //   .then((res) => {
    //     setVisible(false)
    //     form.resetFields()
    //   })

    setVisible(false)
  }

  useEffect(() => {
    const resOutput = (localData as any)?.device_id?.map((value: number) => value).filter((id: number) => devicesData?.find((item) => item.id === id))

    form.setFieldsValue({
      range_date: localData?.range_date && [dayjs(localData?.range_date[0]), dayjs(localData?.range_date[1])],
      // payment_period: localData?.range_date && [dayjs(localData?.range_date[0]), dayjs(localData?.range_date[1])],
      descriptor_type: localData?.descriptor_type,
      payment_type: localData?.payment_type,
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
        {/* <Form.Item name="payment_period" label="Payment period:">
          <RangePicker size="large" className={'filter__rangePicker'} presets={rangePresets} showTime format="YYYY/MM/DD HH:mm" />
        </Form.Item> */}
        <Row gutter={12}>
          <Col span={12}>
            <Form.Item name="payment_type" label="Payment type:">
              <FormElements.Select allowClear options={PAYMENT_TYPE_SELECT} />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item name="descriptor_type" label="Descriptor type:">
              <FormElements.Select allowClear options={DESCRIPTOR_TYPE_SELECT} />
            </Form.Item>
          </Col>
        </Row>
        <Form.Item name="device_id" label="Devices:">
          <FormElements.Select placeholder={'Select devices'} mode="multiple" groupOptions={deviceOptions} size="small" />
        </Form.Item>
        <Row justify={'space-between'}>
          <Col span={6}>
            <Button onClick={onReset} fullWidth type="dashed" size="large" loading={false}>
              Reset
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

export default RevenueFilterModal
