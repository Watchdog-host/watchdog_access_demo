import React, { useEffect, useState } from 'react'
import { Checkbox, Col, Divider, Form, Grid, InputNumber, Row } from 'antd'
import { groupBy, map } from 'lodash'
import { toast } from 'react-hot-toast'
import _ from 'lodash'
import { Button, FormElements, Tabs } from 'components'
import { useAppSelector } from 'store/hooks'
import { useAddDeviceMutation, useDevicesQuery, useUpdateDeviceMutation, useWatchlistsQuery } from 'store/endpoints'
import { CAMERA_MODEL_SELECTS, DEVICES_MODEL_SELECTS, ACCESS_TYPE_SELECTS, ALERT_SELECTS, GRANT_SELECTS } from 'constants/common'
import { IDeviceDTO, IGroupOptions, IWatchlistdevice } from 'types'
import { useGetRole } from 'hooks'
import classes from '../Trigger.module.scss'
import { AccessTypeEnum, AlertTypeEnum, DeviceModelEnum, DeviceTypeEnum, GrantTypeEnum } from 'constants/enums'
import { createWatchlistObject, fromWatchlistObject } from 'utils/data'
import { logOut } from 'utils'

export type Props = {
  data?: IDeviceDTO
  visible?: boolean
  setVisible?: (bool: boolean) => void
}

const useTriggerForm = ({ data, visible, setVisible }: Props = {}) => {
  const [form] = Form.useForm()
  const { useBreakpoint } = Grid
  const { xs } = useBreakpoint()
  const { currentEdge } = useAppSelector((state) => state.navigation)
  const { isOwner, isAdmin } = useGetRole()
  const [watchlists, setWatchlists] = useState<any[]>()

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
            alert_type: data?.alert_type ?? null,
            grant_type: data?.grant_type ?? null,
          }
        }),
      })),
    )
  }, [watchlistsQuery.isSuccess, data, visible])

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
      })
    }
  }, [data, form, visible, devicesQuery.isSuccess])

  const onFinish = (values: any) => {
    const extra_field = {
      output_devices: values.output_devices,
      watchlists: createWatchlistObject(watchlists?.map((item) => item.data && item.data).flat() as IWatchlistdevice[]),
    }

    const formData = {
      id: data?.id,
      type: DeviceTypeEnum.Trigger,
      title: values.title,
      model: values.model,
      source: values.source,
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
                          {/* <Form.Item name={'alert_type'}> */}
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
                          {/* <Form.Item name={'grant_type'}> */}
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
  return (
    <Form
      onFinish={onFinish}
      form={form}
      layout="vertical"
      initialValues={{
        model: DEVICES_MODEL_SELECTS[DeviceModelEnum.Gateway].value,
        // access_type: ACCESS_TYPE_SELECTS[AccessTypeEnum.Undefined].value,
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

export default useTriggerForm
