import { FC, useEffect } from 'react'
import { Form } from 'antd'

import { Button, FormElements, Modal, Tabs } from 'components'
import { useAppSelector } from 'store/hooks'
import { useDevicesQuery } from 'store/endpoints'
import { DeviceTypeEnum } from 'constants/enums'
import { groupBy, map } from 'lodash'
import { IGroupOptions } from 'types'

export type Props = {
  visible: boolean
  setVisible: (bool: boolean) => void
  setStorageData: Function
  storageData: any
}

const SettingsModal: FC<Props> = ({ visible, setVisible, setStorageData, storageData }) => {
  const [form] = Form.useForm()
  const { currentEdge } = useAppSelector((state) => state.navigation)
  const allDevicesQuery = useDevicesQuery({ filter: { edge_id: currentEdge?.id || 0 } })
  const devicesData = allDevicesQuery.data
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

  const onFinish = (values: any) => {
    if (currentEdge) {
      setStorageData((prevData: any) => ({
        ...prevData,
        [currentEdge.id]: values.devices,
      }))
    }
    setVisible(false)
  }

  useEffect(() => {
    if (currentEdge) {
      const edgeId = currentEdge.id
      const storedData = storageData && (storageData as any)[edgeId]?.filter((id: number) => devicesData?.find((item) => item.id === id))

      form.setFieldsValue({
        devices: storedData,
      })
    }
  }, [storageData, currentEdge, form, allDevicesQuery.isSuccess])

  const tabsItems = [
    {
      key: '1',
      label: 'General',
      children: (
        <>
          <Form.Item name="devices">
            <FormElements.Select placeholder={'Select devices'} mode="multiple" groupOptions={deviceOptions} size="small" />
          </Form.Item>
        </>
      ),
    },
  ]

  return (
    <Modal title="Settings" open={visible} onOk={() => setVisible(false)} onCancel={() => setVisible(false)}>
      <Form onFinish={onFinish} form={form} layout="vertical">
        <Tabs items={tabsItems.sort((a, b) => Number(a.key) - Number(b.key))} />
        <Button fullWidth type="primary" htmlType="submit" size="large" loading={false}>
          Confirm
        </Button>
      </Form>
    </Modal>
  )
}

export default SettingsModal
